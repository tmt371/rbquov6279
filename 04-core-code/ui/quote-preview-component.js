// File: 04-core-code/ui/quote-preview-component.js

import { EVENTS } from '../config/constants.js';

/**
 * @fileoverview A component to manage the full-screen quote preview overlay.
 */
export class QuotePreviewComponent {
    constructor({ containerElement, eventAggregator }) {
        if (!containerElement || !eventAggregator) {
            throw new Error("Container element and event aggregator are required for QuotePreviewComponent.");
        }
        this.container = containerElement;
        this.eventAggregator = eventAggregator;
        this.originalTitle = document.title; // [NEW] Store the original document title

        this.contentElement = this.container.querySelector('.quote-preview-content');
        this.iframe = this.container.querySelector('.quote-preview-iframe');
        this.closeButton = this.container.querySelector('.preview-btn-secondary');
        this.printButton = this.container.querySelector('.preview-btn-primary');

        this.initialize();
        console.log("QuotePreviewComponent Initialized.");
    }

    initialize() {
        this.eventAggregator.subscribe(EVENTS.SHOW_QUOTE_PREVIEW, (htmlContent) => this.show(htmlContent));

        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => this.hide());
        }

        if (this.printButton) {
            this.printButton.addEventListener('click', () => this.print());
        }

        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.hide();
            }
        });
    }

    /**
     * Displays the preview overlay and injects the final HTML content.
     * @param {string} htmlContent - The fully rendered HTML string to display.
     */
    show(htmlContent) {
        if (!this.iframe) return;

        // [NEW] Parse the title from the HTML content and set the main document's title.
        const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/);
        if (titleMatch && titleMatch[1]) {
            document.title = titleMatch[1];
        }

        // Use srcdoc to inject the HTML content. This provides a clean sandbox.
        this.iframe.srcdoc = htmlContent;

        // Use a slight delay to allow the content to be parsed before showing the overlay
        setTimeout(() => {
            this.container.classList.add('is-visible');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }, 50);
    }

    /**
     * Hides the preview overlay.
     */
    hide() {
        this.container.classList.remove('is-visible');
        document.body.style.overflow = ''; // Restore background scrolling
        if (this.iframe) {
            this.iframe.srcdoc = ''; // Clear content
        }
        // [NEW] Restore the original document title when the preview is hidden.
        document.title = this.originalTitle;
    }

    /**
     * Triggers the print dialog for the iframe's content.
     */
    print() {
        if (this.iframe && this.iframe.contentWindow) {
            this.iframe.contentWindow.print();
        } else {
            console.error("Could not access iframe content to print.");
            this.eventAggregator.publish(EVENTS.SHOW_NOTIFICATION, {
                message: "Error: Could not trigger print.",
                type: 'error'
            });
        }
    }
}