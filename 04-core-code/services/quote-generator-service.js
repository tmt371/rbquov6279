// File: 04-core-code/services/quote-generator-service.js

import { paths } from '../config/paths.js';

/**
 * @fileoverview A new, single-responsibility service for generating the final quote HTML.
 * It pre-fetches and caches templates for better performance.
 */
export class QuoteGeneratorService {
    constructor({ calculationService }) {
        this.calculationService = calculationService;
        this.quoteTemplate = '';
        this.detailsTemplate = '';

        this._initialize();
        console.log("QuoteGeneratorService Initialized.");
    }

    async _initialize() {
        try {
            [this.quoteTemplate, this.detailsTemplate] = await Promise.all([
                fetch(paths.partials.quoteTemplate).then(res => res.text()),
                fetch(paths.partials.detailedItemList).then(res => res.text()),
            ]);
            console.log("QuoteGeneratorService: HTML templates pre-fetched and cached.");
        } catch (error) {
            console.error("QuoteGeneratorService: Failed to pre-fetch HTML templates:", error);
            // In a real-world scenario, you might want to publish an error event here.
        }
    }

    generateQuoteHtml(quoteData, ui, f3Data) {
        if (!this.quoteTemplate || !this.detailsTemplate) {
            console.error("QuoteGeneratorService: Templates are not loaded yet.");
            return null;
        }

        const templateData = this._prepareTemplateData(quoteData, ui, f3Data);
        const populatedDetailsPageHtml = this._populateTemplate(this.detailsTemplate, templateData);

        const styleMatch = populatedDetailsPageHtml.match(/<style>([\s\S]*)<\/style>/i);
        const detailsBodyMatch = populatedDetailsPageHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i);

        if (!detailsBodyMatch) {
            throw new Error("Could not find body content in the details template.");
        }

        const detailsStyleContent = styleMatch ? styleMatch[0] : '';
        const detailsBodyContent = detailsBodyMatch[1];

        let finalHtml = this.quoteTemplate.replace('</head>', `${detailsStyleContent}</head>`);
        finalHtml = finalHtml.replace('</body>', `${detailsBodyContent}</body>`);
        finalHtml = this._populateTemplate(finalHtml, templateData);

        return finalHtml;
    }

    _prepareTemplateData(quoteData, ui, f3Data) {
        const summaryData = this.calculationService.calculateF2Summary(quoteData, ui);
        const grandTotal = parseFloat(f3Data.finalOfferPrice) || summaryData.gst || 0;
        const items = quoteData.products.rollerBlind.items;
        const formatPrice = (price) => (typeof price === 'number' && price > 0) ? `$${price.toFixed(2)}` : '';

        const configManager = this.calculationService.configManager;

        const motorQty = items.filter(item => !!item.motor).length;
        const motorPrice = (configManager.getAccessoryPrice('motorStandard') || 0) * motorQty;

        const totalRemoteQty = ui.driveRemoteCount || 0;
        const remote1chQty = ui.f1.remote_1ch_qty;
        const remote16chQty = (ui.f1.remote_1ch_qty === null) ? totalRemoteQty : (totalRemoteQty - remote1chQty);
        const remotePricePerUnit = configManager.getAccessoryPrice('remoteStandard') || 0;
        const remote1chPrice = remotePricePerUnit * remote1chQty;
        const remote16chPrice = remotePricePerUnit * remote16chQty;

        const chargerQty = ui.driveChargerCount || 0;
        const chargerPrice = (configManager.getAccessoryPrice('chargerStandard') || 0) * chargerQty;

        const cord3mQty = ui.driveCordCount || 0;
        const cord3mPrice = (configManager.getAccessoryPrice('cord3m') || 0) * cord3mQty;

        let documentTitleParts = [];
        if (f3Data.quoteId) documentTitleParts.push(f3Data.quoteId);
        if (f3Data.customerName) documentTitleParts.push(f3Data.customerName);
        if (f3Data.customerPhone) documentTitleParts.push(f3Data.customerPhone);
        const documentTitle = documentTitleParts.join(' ');

        return {
            documentTitle: documentTitle,
            quoteId: f3Data.quoteId,
            issueDate: f3Data.issueDate,
            dueDate: f3Data.dueDate,
            customerInfoHtml: this._formatCustomerInfo(f3Data),
            itemsTableBody: this._generatePageOneItemsTableHtml(summaryData, quoteData, ui),
            subtotal: `$${(summaryData.sumPrice || 0).toFixed(2)}`,
            gst: `$${(grandTotal / 1.1 * 0.1).toFixed(2)}`,
            grandTotal: `$${grandTotal.toFixed(2)}`,
            deposit: `$${(grandTotal * 0.5).toFixed(2)}`,
            balance: `$${(grandTotal * 0.5).toFixed(2)}`,
            savings: `$${((summaryData.firstRbPrice || 0) - (summaryData.disRbPrice || 0)).toFixed(2)}`,
            termsAndConditions: (f3Data.termsConditions || 'Standard terms and conditions apply.').replace(/\n/g, '<br>'),
            rollerBlindsTable: this._generateItemsTableHtml(items, summaryData),
            motorQty: motorQty || '',
            motorPrice: formatPrice(motorPrice),
            remote1chQty: remote1chQty || '',
            remote1chPrice: formatPrice(remote1chPrice),
            remote16chQty: remote16chQty || '',
            remote16chPrice: formatPrice(remote16chPrice),
            chargerQty: chargerQty || '',
            chargerPrice: formatPrice(chargerPrice),
            cord3mQty: cord3mQty || '',
            cord3mPrice: formatPrice(cord3mPrice),
            eAcceSum: formatPrice(summaryData.eAcceSum),
        };
    }

    _populateTemplate(template, data) {
        return template.replace(/\{\{\{?([\w\-]+)\}\}\}?/g, (match, key) => {
            return data.hasOwnProperty(key) ? data[key] : match;
        });
    }

    _formatCustomerInfo(f3Data) {
        let html = `<strong>${f3Data.customerName || ''}</strong><br>`;
        if (f3Data.customerAddress) html += `${f3Data.customerAddress.replace(/\n/g, '<br>')}<br>`;
        if (f3Data.customerPhone) html += `Phone: ${f3Data.customerPhone}<br>`;
        if (f3Data.customerEmail) html += `Email: ${f3Data.customerEmail}`;
        return html;
    }

    _generateItemsTableHtml(items, summaryData) {
        const headers = ['#', 'F-NAME', 'F-COLOR', 'Location', 'HD', 'DUAL', 'MOTOR', 'PRICE'];
        const mulTimes = summaryData.mulTimes || 1;

        const rows = items
            .filter(item => item.width && item.height)
            .map((item, index) => {
                const finalPrice = (item.linePrice || 0) * mulTimes;

                let fabricClass = '';
                if (item.fabric && item.fabric.toLowerCase().includes('light-filter')) {
                    fabricClass = 'bg-light-filter';
                } else if (item.fabricType === 'SN') {
                    fabricClass = 'bg-screen';
                } else if (['B1', 'B2', 'B3', 'B4', 'B5'].includes(item.fabricType)) {
                    fabricClass = 'bg-blockout';
                }

                return `
                    <tr>
                        <td class="text-center">${index + 1}</td>
                        <td class="${fabricClass}">${item.fabric || ''}</td>
                        <td class="${fabricClass}">${item.color || ''}</td>
                        <td>${item.location || ''}</td>
                        <td class="text-center">${item.winder === 'HD' ? '✔' : ''}</td>
                        <td class="text-center">${item.dual === 'D' ? '✔' : ''}</td>
                        <td class="text-center">${item.motor ? '✔' : ''}</td>
                        <td class="text-right">$${finalPrice.toFixed(2)}</td>
                    </tr>
                `;
            })
            .join('');

        return `
            <table class="items-table">
                <thead>
                    <tr class="table-title">
                        <th colspan="${headers.length}">Roller Blinds - Detailed List</th>
                    </tr>
                    <tr>
                        ${headers.map(h => `<th>${h}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        `;
    }

    _generatePageOneItemsTableHtml(summaryData, quoteData, ui) {
        const rows = [];
        const items = quoteData.products.rollerBlind.items;
        const validItemCount = items.filter(i => i.width && i.height).length;

        rows.push(`
            <tr>
                <td data-label="#">1</td>
                <td data-label="Description">
                    <div class="description"><strong>Roller Blinds Package</strong></div>
                    <div class="details">See appendix for detailed specifications.</div>
                </td>
                <td data-label="QTY" class="align-right">${validItemCount}</td>
                <td data-label="Price" class="align-right">
                    <span class="original-price">$${(summaryData.firstRbPrice || 0).toFixed(2)}</span>
                </td>
                <td data-label="Discounted Price" class="align-right">
                    <span class="discounted-price">$${(summaryData.disRbPrice || 0).toFixed(2)}</span>
                </td>
            </tr>
        `);

        let itemNumber = 2;

        if (summaryData.acceSum > 0) {
            rows.push(`
                <tr>
                    <td data-label="#">${itemNumber++}</td>
                    <td data-label="Description">
                        <div class="description"><strong>Installation Accessories</strong></div>
                        <div class="details">See appendix for detailed specifications.</div>
                    </td>
                    <td data-label="QTY" class="align-right">NA</td>
                    <td data-label="Price" class="align-right">$${(summaryData.acceSum || 0).toFixed(2)}</td>
                    <td data-label="Discounted Price" class="align-right">$${(summaryData.acceSum || 0).toFixed(2)}</td>
                </tr>
            `);
        }

        if (summaryData.eAcceSum > 0) {
            rows.push(`
                <tr>
                    <td data-label="#">${itemNumber++}</td>
                    <td data-label="Description">
                        <div class="description"><strong>Motorised Accessories</strong></div>
                        <div class="details">See appendix for detailed specifications.</div>
                    </td>
                    <td data-label="QTY" class="align-right">NA</td>
                    <td data-label="Price" class="align-right">$${(summaryData.eAcceSum || 0).toFixed(2)}</td>
                    <td data-label="Discounted Price" class="align-right">$${(summaryData.eAcceSum || 0).toFixed(2)}</td>
                </tr>
            `);
        }

        const deliveryExcluded = ui.f2.deliveryFeeExcluded;
        const deliveryPriceClass = deliveryExcluded ? 'class="align-right is-excluded"' : 'class="align-right"';
        const deliveryDiscountedPrice = deliveryExcluded ? 0 : (summaryData.deliveryFee || 0);
        rows.push(`
            <tr>
                <td data-label="#">${itemNumber++}</td>
                <td data-label="Description">
                    <div class="description">Delivery</div>
                </td>
                <td data-label="QTY" class="align-right">${ui.f2.deliveryQty || 1}</td>
                <td data-label="Price" ${deliveryPriceClass}>$${(summaryData.deliveryFee || 0).toFixed(2)}</td>
                <td data-label="Discounted Price" class="align-right">$${deliveryDiscountedPrice.toFixed(2)}</td>
            </tr>
        `);

        const installExcluded = ui.f2.installFeeExcluded;
        const installPriceClass = installExcluded ? 'class="align-right is-excluded"' : 'class="align-right"';
        const installDiscountedPrice = installExcluded ? 0 : (summaryData.installFee || 0);
        rows.push(`
            <tr>
                <td data-label="#">${itemNumber++}</td>
                <td data-label="Description">
                    <div class="description">Installation</div>
                </td>
                <td data-label="QTY" class="align-right">${validItemCount}</td>
                <td data-label="Price" ${installPriceClass}>$${(summaryData.installFee || 0).toFixed(2)}</td>
                <td data-label="Discounted Price" class="align-right">$${installDiscountedPrice.toFixed(2)}</td>
            </tr>
        `);

        const removalExcluded = ui.f2.removalFeeExcluded;
        const removalPriceClass = removalExcluded ? 'class="align-right is-excluded"' : 'class="align-right"';
        const removalDiscountedPrice = removalExcluded ? 0 : (summaryData.removalFee || 0);
        rows.push(`
            <tr>
                <td data-label="#">${itemNumber++}</td>
                <td data-label="Description">
                    <div class="description">Removal</div>
                </td>
                <td data-label="QTY" class="align-right">${ui.f2.removalQty || 0}</td>
                <td data-label="Price" ${removalPriceClass}>$${(summaryData.removalFee || 0).toFixed(2)}</td>
                <td data-label="Discounted Price" class="align-right">$${removalDiscountedPrice.toFixed(2)}</td>
            </tr>
        `);

        return rows.join('');
    }
}