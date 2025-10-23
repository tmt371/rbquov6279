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
        
        // [MODIFIED] Enhanced templates for inline CSS and better printing.
        this.actionBarHtml = `
    <div id="action-bar">
        <button id="copy-html-btn">Copy HTML</button>
        <button id="print-btn">Print / Save PDF</button>
    </div>`;

        this.scriptHtml = `
    <script>
        // [NEW] Inlined juice.min.js library to prevent race conditions.
        !function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).juice=e()}}(function(){return function e(t,r,n){function i(s,a){if(!r[s]){if(!t[s]){var c="function"==typeof require&&require;if(!a&&c)return c(s,!0);if(o)return o(s,!0);var l=new Error("Cannot find module '"+s+"'");throw l.code="MODULE_NOT_FOUND",l}var u=r[s]={exports:{}};t[s][0].call(u.exports,function(e){return i(t[s][1][e]||e)},u,u.exports,e,t,r,n)}return r[s].exports}for(var o="function"==typeof require&&require,s=0;s<n.length;s++)i(n[s]);return i}({1:[function(e,t,r){var n=e("cheerio"),i=e("web-resource-inliner"),o=e("path"),s=e("url"),a=e("fs"),c=e("os"),l=e("batch"),u=e("extend"),p=e("./lib/utils"),f=e("./lib/juice"),d=e("defaults"),h=e("slick"),m=e("bluebird"),g=e("./lib/property"),y=e("./lib/selector"),b=e("./lib/inline"),v=e("./lib/inline-background"),w=e("./lib/style"),x=e("./lib/nonvisual"),k=e("./lib/pseudo"),A=e("./lib/remove"),j=/url\\s*\\((?!['"]?data:)([^)]+)\\)/g,q=["background","background-image","border-image",/-moz-border-image/];function z(e){var t={extraCss:"",applyStyleTags:!0,removeStyleTags:!0,preserveMediaQueries:!0,preserveFontFaces:!0,preserveKeyFrames:!0,preservePseudos:!0,insertPreservedExtraCss:!0,applyWidthAttributes:!0,applyHeightAttributes:!0,applyAttributesTableElements:!0,inlinePseudoElements:!1,xmlMode:!1,preserveImportant:!1,webResources:{},resolveCSS:function(e){return e},applyToImages:!0,applyToText:!0};return e=u(!0,{},t,e||{})}function C(e,t,r){var n;t=z(t),e=p.normalizeEOL(e),"function"==typeof r?(n=r,r=null):(n=function(){},r=null);var o=n,s=new m(function(e){n=e});"undefined"!=typeof t.url&&null!==t.url&&"string"==typeof t.url||(t.url=""),"string"==typeof t.webResources.relativeTo&&(t.webResources.relativeTo=o.resolve(t.webResources.relativeTo));var a=[],c=new f(e,t),l=function(e,t){return c.juiceDocument(e,t)};return l.process=function(e,r){var u=r?n.load(r,{decodeEntities:!1,xmlMode:t.xmlMode}):c.doc;if(t.extraCss)a.push(t.extraCss),c.extraCss.push(h.parse(t.extraCss));w(u,t,function(r,n,i){if(r)return e(r);a.push(n),c.extraCss=c.extraCss.concat(i);var o=function(e){return e.join("\\n\\n")};t.webResources.css=o(a),t.webResources.html=u.html(),i=o(c.extraCss.map(function(e){return e.source})),c.webResources=u.html(),l(u,c.extraCss).then(function(){if(t.removeStyleTags){var r;if(t.applyStyleTags){var n=h.parse(u("style").text());r=A.call(c,u,n)}else r=u("style").remove()}e(null,u)}).catch(e)})},l.inline=function(e,r,n){"function"==typeof r&&(n=r,r=null),r=u({},t,{inlinePseudoElements:!0,removeStyleTags:!1},r),"undefined"!=typeof t.url&&null!==t.url||(r.url=t.url);var i=h.parse(e),o=n;return n=function(e,t){"function"==typeof o&&o(e,t)},C.inlineContent(c.doc.html(),e,r,function(e,t){if(e)return n(e);c.doc=cheerio.load(t,{decodeEntities:!1,xmlMode:t.xmlMode}),n(null,c.doc.html())})},l.inlineExternal=function(e){return C.juiceResources(c.doc.html(),t,function(t,r){if(t)return e(t);c.doc=cheerio.load(r,{decodeEntities:!1,xmlMode:c.options.xmlMode}),l.process(e)})},t.inlineExternal?l.inlineExternal(function(t,r){if(t)return n(t,null);c.doc=cheerio.load(r,{decodeEntities:!1,xmlMode:c.options.xmlMode}),l.process(e)}):l.process(e),s.nodeify(o),s}t.exports=C,C.juiceDocument=function(e,t,r){return new m(function(n,i){var o=new f(e,r=z(r));t.forEach(function(e){"rule"===e.type&&e.selectors&&o.selectors.push(new y(e))}),b.call(o,e),v.call(o,e),k.call(o,e,function(r){r?i(r):x.call(o,e,function(r){r?i(r):g.call(o,e,function(r){r?i(r):A.call(o,e,t,function(r){r?i(r):n(e)})})})})})},C.juiceFile=function(e,t,r){a.readFile(e,"utf8",function(n,i){if(n)return r(n);var a=t.webResources||{};"string"!=typeof a.relativeTo&&(a.relativeTo=o.dirname(e)),t.webResources=a,C(i,t,r)})},C.juiceResources=function(e,t,r){var n,a=0,l=[];"function"==typeof t&&(r=t,t={}),t=z(t),t.webResources.relativeTo||("string"==typeof t.url&&/^(file|https?):/.test(t.url)?t.webResources.relativeTo=t.url:t.webResources.relativeTo=o.join(process.cwd(),"index.html"));var u=n.load(e,{decodeEntities:!1,xmlMode:t.xmlMode});u("link[rel=stylesheet]").each(function(){var e=u(this),t=e.attr("href");t&&(l.push(t),e.remove())});var p=new(c.Batch);p.concurrency(1),l.forEach(function(e){p.push(function(r){i.file.get(u.html(),u.extend({file:e},t.webResources),function(e,i){if(e)return r(e);a++,l[l.indexOf(e)]=i,r()})})}),p.end(function(e){if(e)return r(e);t.extraCss=t.extraCss?l.join("\\n\\n")+t.extraCss:l.join("\\n\\n"),C(u.html(),t,r)})},C.inlineContent=function(e,t,r,n){"function"==typeof r&&(n=r,r={}),r=z(r);var i=h.parse(t);return C.juiceDocument(e,i,r).then(function(e){return n(null,e.html())}).catch(n)},C.inlineDocument=function(e,t,r,n){return r=z(r),new m(function(i,o){C.juiceDocument(e,t,r).then(function(t){var r=function(e,t){return h.stringify(e,{compress:!1})};t.find("style").each(function(e,n){var i=h.parse(t(n).text()||""),o=k.getCuasiPseudos(i.stylesheet.rules);r=o.map(r).join("\\n"),t(n).text(r)}),n&&n.length>0&&t("head").append("<style>"+n.join("\\n\\n")+"</style>"),i(e)}).catch(o)})},C.Selector=y,C.Property=g,C.utils=p,C.juice=C,C.ignoredPseudos=k.ignoredPseudos,C.juice.ignoredPseudos=k.ignoredPseudos,C.juice.juice=C,C.juice.inlineContent=C.inlineContent,C.juice.inlineDocument=C.inlineDocument,C.juice.juiceDocument=C.juiceDocument,C.juice.juiceFile=C.juiceFile,C.juice.juiceResources=C.juiceResources,C.juice.Selector=y,C.juice.Property=g,C.juice.utils=p,C.juice.z=z},{bluebird:3,batch:4,cheerio:5,defaults:16,extend:17,"./lib/inline":19,"./lib/inline-background":18,"./lib/juice":20,"./lib/nonvisual":21,"./lib/property":22,"./lib/pseudo":23,"./lib/remove":24,"./lib/selector":25,"./lib/style":26,"./lib/utils":27,fs:2,os:2,path:2,slick:30,url:2,"web-resource-inliner":36}],2:[function(e,t,r){},{}],3:[function(e,t,r){(function(e){t.exports=e.Promise}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],4:[function(e,t,r){function n(e){var t=this;if(!(t instanceof n))return new n(e);t.name=e||"batch",t.jobs=[],t.j=0,t.width=4,t.pending=[],t.on("free",function(){t.run()})}r=t.exports=n;var i=e("events").EventEmitter;i.prototype.__proto__=n.prototype,n.prototype.concurrency=function(e){return this.width=e,this},n.prototype.push=function(e){return this.jobs.push(e),this.run(),this},n.prototype.end=function(e){var t=this;this.on("end",function(r,n){t.removeAllListeners(),e&&e(r,n)})},n.prototype.run=function(){for(var e;this.pending.length<this.width&&(e=this.jobs.shift());)this.exec(e)},n.prototype.exec=function(e){var t=this,r=this.pending.push(e)-1;e(function(){var e=arguments,n=t.pending.indexOf(e);t.pending.splice(r,1),t.emit.apply(t,["job"].concat(Array.prototype.slice.call(e))),t.emit("free"),0==t.pending.length&&0==t.jobs.length&&t.emit("end")})}},{events:2}],5:[function(e,t,r){var n=e("./lib/static");t.exports=n.load,t.exports.load=n.load,t.exports.html=n.html,t.exports.xml=n.xml,t.exports.version=e("../package.json").version,t.exports.root=n.root,t.exports.contains=n.contains,t.exports.parseHTML=n.parseHTML},{"../package.json":15,"./lib/static":10}],6:[function(e,t,r){var n=e("./utils"),i=e("domelementtype"),o=e("./manipulation"),s={find:function(e){var t=this.constructor;return this.map(function(r,i){var o=t(i).find(e);return o.toArray()})},parent:function(e){return void 0===e||this.parents(e).length>0?this.map(function(e,t){return t.parent}):this.constructor(),this.parents().slice(0,1)},parents:function(e){var t;return e?(t=this.constructor(),this.each(function(r,i){for(var o=i.parent;o&&"root"!==o.type;){t.add(o),o=o.parent}return t}),t.filter(e)):this.map(function(e,r){var i,o=this.constructor();for(i=r.parent;i&&"root"!==i.type;)o.add(i),i=i.parent;return o})},parentsUntil:function(e,t){var r=this.parents(),i=r.slice(0,n.indexOf(r,e));return t?i.filter(t):i},closest:function(e){var t=this.filter(e);return t.length>0?t:this.parents().filter(e).slice(0,1)},next:function(e){var t,r=this.map(function(e,i){for(t=i.next;t&&!o.isTag(t);)t=t.next;return t});return e?r.filter(e):r},nextAll:function(e){var t=this.map(function(r,n){for(var i=[],s=n.next;s;){o.isTag(s)&&i.push(s),s=s.next}return i});return e?t.filter(e):t},nextUntil:function(e,t){var r=this.nextAll(),i=r.slice(0,n.indexOf(r,e));return t?i.filter(t):i},prev:function(e){var t,r=this.map(function(e,r){for(t=r.prev;t&&!o.isTag(t);)t=t.prev;return t});return e?r.filter(e):r},prevAll:function(e){var t=this.map(function(r,n){for(var i=[],s=n.prev;s;){o.isTag(s)&&i.push(s),s=s.prev}return i});return e?t.filter(e):t},prevUntil:function(e,t){var r=this.prevAll(),i=r.slice(0,n.indexOf(r,e));return t?i.filter(t):i},slice:function(){return this.constructor([].slice.apply(this,arguments))},siblings:function(e){var t=this.map(function(e,t){return o.filter(function(e){return e!==t},t.parent?t.parent.children:[])});return e?t.filter(e):t},children:function(e){var t=this.map(function(e,t){return o.filter(o.isTag,t.children)});return e?t.filter(e):t},contents:function(){return this.map(function(e,t){return t.children})},each:function(e){var t=0;for(this.length=this.length||0;t<this.length;t++)if(!1===e.call(this[t],t,this[t]))break;return this},map:function(e){var t,r,n=[],i=this.constructor;return this.each(function(t,o){(r=e.call(o,t,o))&&(r.cheerio?n=n.concat(r.toArray()):n.push(r))}),i(n)},filter:function(e){var t=this.constructor;return"string"==typeof e&&(e=t.prototype.is.bind(this,e)),this.map(function(t,r){return e(t,r)?r:null})},not:function(e){var t=this.constructor;"string"==typeof e&&(e=t.prototype.is.bind(this,e));var r=this.map(function(t,r){return e(t,r)?null:r});return this.constructor(r)},first:function(){return this.slice(0,1)},last:function(){return this.slice(-1)},eq:function(e){return this.slice(e,e+1)},get:function(e){return void 0===e?[].slice.call(this):this[e<0?this.length+e:e]},index:function(e){var t,r,i,o,s;return e?(t=this.constructor(e),"string"==typeof e?o=this.parent().children(e).get(0):1===(s=t.get(0)).cheerio?s=t.get(0):i=t,r=this.get(0),o?n.indexOf(this.parent().children(),o):(i=i||this.parent().children(),n.indexOf(i,r))):n.indexOf(this.parent().children(),this.get(0))},end:function(){return this.prevObject||this.constructor()}};s.is=function(e){var t,r=this.constructor;return t="function"==typeof e?e:function(t,n){return"string"==typeof e?(e.indexOf(":")<0?r(n).is(e):!1!==r.filter.call([n],e).length):n===e||-1!==r.inArray(n,[].slice.call(r(e)))}},s.add=function(e,t){var r,i=this.constructor,o=this.toArray();return"string"==typeof e&&(e=i(e,t)),e.each(function(e,t){-1===n.indexOf(o,t)&&o.push(t)}),i(o)},s.hasClass=function(e){return this.toArray().some(function(t){return o.isTag(t)&&-1!==(" "+t.attribs.class+" ").indexOf(" "+e+" ")})};var a=/^\\s+|\\s+$/g;s.addClass=function(e){return this.each("function"==typeof e?function(t,r){var n=i(r).addClass(e.call(this,t,i(r).attr("class")));r.attribs=n[0].attribs}:function(t,r){if("tag"===r.type){var n=r.attribs.class||"";if(-1===n.indexOf(e))r.attribs.class=(n+" "+e).replace(a,"")}},this)},s.removeClass=function(e){return this.each("function"==typeof e?function(t,r){var n=i(r).removeClass(e.call(this,t,i(r).attr("class")));r.attribs=n[0].attribs}:function(t,r){if("tag"===r.type){if(void 0===e)return r.attribs.class="",this;for(var n=" "+(r.attribs.class||"")+" ",i=e.split(/\\s+/),o=0;o<i.length;o++)n=n.replace(" "+i[o]+" "," ");r.attribs.class=n.replace(a,"")}})},s.toggleClass=function(e,t){return this.each("function"==typeof e?function(r,n){var s=i(n);s.toggleClass(e.call(this,r,s.attr("class"),t),t),n.attribs=s[0].attribs}:function(r,n){if("tag"===n.type){var s=" "+n.attribs.class+" ",a=e.split(/\\s+/);if("boolean"!=typeof t)for(var c=0;c<a.length;c++)-1!==s.indexOf(" "+a[c]+" ")?s=s.replace(" "+a[c]+" "," "):s+=" "+a[c];else t?s.indexOf(" "+e+" ")<0&&(s+=" "+e):s=s.replace(" "+e+" "," ");n.attribs.class=s.replace(a,"")}})},t.exports=s},{domelementtype:11,"./manipulation":8,"./utils":10}],7:[function(e,t,r){var n=e("CSSwhat"),i=e("CSSselect");function o(e,t){return this.options=t||{},this._root="string"==typeof e?n.parse(e):e,this}o.prototype.parse=function(){return this._root},o.prototype.stringify=function(){return n.stringify(this._root)},o.prototype.traverse=function(e){return n.traverse(this._root,e)},o.prototype.select=function(e){return i(e,this._root,this.options)},e.exports=o},{CSSselect:12,CSSwhat:13}],8:[function(e,t,r){r.filter=function(e,t){return"string"==typeof e&&(e=function(){return-1!==e.indexOf(this.tagName.toLowerCase())}),t.filter(e)},r.isTag=function(e){return"tag"===e.type||"style"===e.type||"script"===e.type},r.remove=function(e,t){e.prev&&(e.prev.next=e.next),e.next&&(e.next.prev=e.prev),e.parent&&(e.parent.children.splice(t,1),e.parent=null)},r.replace=function(e,t){var r=t.parent=e.parent,n=e.prev,i=e.next;n&&(n.next=t),i&&(i.prev=t),t.prev=n,t.next=i,r&&r.children[r.children.indexOf(e)]=t}},{}],9:[function(e,t,r){var n=e("domelementtype"),i=e("entities"),o={};o.text=function(e){return void 0!==e?(this.each(function(t,r){this.constructor(r).empty().append(this.constructor.text(e))}),this):this.length?this.toArray().reduce(function(e,t){return e+o._text.call(this,t)},""):""},o._text=function(e){return e.children?e.children.map(o._text,this).join(""):n.isTag(e)?"text"===e.type?i.decodeXML(e.data):"":i.decodeXML(e.data)},o.html=function(e){var t;if(void 0===e)return this[0]&&this[0].children?this.constructor.html(this[0].children):"";this.each(function(t,r){this.constructor(r).empty().append(e)});return this},o.xml=function(){return this[0]&&this[0].children?this.constructor.xml(this[0].children):""},o.attr=function(e,t){var r,n,i,o=this[0];return o&&"tag"===o.type?(i=o.attribs,void 0===t?void 0===i[e]?null:i[e]:"function"==typeof t?(this.each(function(r,n){var o=this.constructor(n);o.attr(e,t.call(n,r,o.attr(e)))}),this):(this.each(function(r,o){o.attribs[e]=t}),this)):this},o.removeAttr=function(e){return this.each(function(t,r){r.attribs&&delete r.attribs[e]}),this},o.val=function(e){var t,r=this[0];return r?void 0===e?"input"===r.name||"select"===r.name||"textarea"===r.name?this.attr("value"):(t=this.constructor,this.map(function(e,r){if("option"===r.name)return r.attribs.selected?t(r).attr("value"):t(r).text()}).join("")):null:"function"==typeof e?this.each(function(t,r){this.constructor(r).val(e.call(r,t,this.constructor(r).val()))}):this.each(function(t,r){var n=r.name;"input"===n||"select"===n||"textarea"===n?this.constructor(r).attr("value",e):this.constructor(r).val(e)}):this},o.data=function(e,t){var r=this[0];return r&&"tag"===r.type?void 0===e&&void 0===t?Object.keys(r.attribs).reduce(function(e,t){return-1!==t.indexOf("data-")&&(e[t.substr(5)]=r.attribs[t]),e},{}):"string"==typeof e?void 0===t?r.attribs["data-"+e]:this.attr("data-"+e,t):this.each(function(r,n){Object.keys(e).forEach(function(r){this.constructor(n).data(r,e[r])},this)}):this},t.exports=o},{entities:14,domelementtype:11}],10:[function(e,t,r){var n=e("htmlparser2"),i=e("CSSselect"),o=e("./parse"),s=e("util"),a=e("events"),c=e("./cheerio"),l=e("./render"),u=[e("./attributes"),e("./traversing"),e("./manipulation"),e("./css"),e("./forms")];r.parseHTML=function(e,t){var r=o.parse(e,t);return r.length&&r[0].parent&&(r[0].parent.children=r),r},r.root=function(e,t){var n=o.parse(e,t);return new this(n,{normalizeWhitespace:!0})},r.contains=function(e,t){return(e.children||[]).some(function(r){return r===t||this.contains(r,t)},this)},r.load=function(e,t,n){"boolean"==typeof n&&(t.decodeEntities=n,n=void 0),s.isBuffer(e)&&(e=e.toString()),t=t||{};var i=new a;"cheerio"in e?i=e:t.ignoreWhitespace||t.xmlMode||t.decodeEntities?i=o.parse(e,t):(i=r.parseHTML(e,t),t.normalizeWhitespace=!0);for(var l in c)i[l]=c[l];i.prototype=i,u.forEach(function(e){Object.keys(e).forEach(function(t){i[t]=e[t]})});var p=new this(i,t);return r.root=p.constructor.root.bind(p.constructor),p},r.html=function(e,t){var r,n=Array.prototype.slice.call(arguments,1);if("string"==typeof e)r=e;else{for(var i=[],o=0,s=e.length;o<s;o++)i[o]=e[o];r=l.render(i,t)}return n.length?this(r,n.shift(),n):r},r.xml=function(e){var t=l.render(e,{decodeEntities:!1,xmlMode:!0});return this.load(t,{xmlMode:!0})},{CSSselect:12,"./attributes":9,cheerio:5,"./cheerio":5,"./css":6,"./forms":2,"./manipulation":8,"./parse":2,"./render":2,events:2,"./traversing":6,htmlparser2:15,util:2}],11:[function(e,t,r){t.exports={Tag:"tag",Text:"text",CDATA:"cdata",Script:"script",Style:"style",Comment:"comment",Directive:"directive",isTag:function(e){return"tag"===e.type||"script"===e.type||"style"===e.type},isCDATA:function(e){return"cdata"===e.type},isText:function(e){return"text"===e.type},isComment:function(e){return"comment"===e.type}}},{}],12:[function(e,t,r){function n(e,t){return e.type===t}function i(e,t,r){if(r=r||{},e&&e.length){var s=e[0].type,a=r.strict;if(a&&!n(e,s))throw new Error("Rules can't have different types");for(var c=1;c<e.length;c++)if(!n(e[c],s))if(a)throw new Error("Rules can't have different types");else{for(var l=0;l<e.length;l++)o(e[l],t);return}o(e[0],t)}}function o(e,t){i(e,t),t(e)}function s(e,t,r){if(r=r||{},"root"===e.type){i(e.children,t,r)}else o(e,t)}function a(e,t,r){"function"==typeof t&&(r=t,t=null),r=r||{};var n;try{n=e.parse()}catch(e){return[]}return n=r.root?n.filter(r.root):n,i(n,function(e,n){return!r.filter||r.filter(n)},r.strict),s.select(t,n)}var c=/^(\\w+)?#([\\w\\-\\|]+)$/,l=/^(\\w+)?\\.([\\w\\-\\|]+)$/,u=/^(\\w+)?\\[([\\w\\-\\|]+)(?:=?"?([\\w\\-\\|]+)"?)?\\]$/,p=/^(\\w+)?$/,f=require("CSSwhat"),d=require("domelementtype"),h=require("domutils"),m={};function g(e,t){return e.id===t}function y(e,t){var r=e.attribs;return r&&r.class&&-1<r.class.split(/\\s+/).indexOf(t)}function b(e,t){var r=e.attribs;if(!r)return!1;if(null===t)return t in r;var n=r[t];return n&&("="===arguments[2]&&(n=n.trim()),0===(arguments[3]?n.trim():n).indexOf(arguments[2]))}function v(e,t,r){return!!(h.isTag(e)&&("*"===t||e.name===t)&&(!r||r(e)))}function w(e,t,r){var n,i=c.exec(e);if(i)return i[1]||"*"===t?i[1]&&i[1]!==t?null:(n=function(e){return v(e,t||i[1],function(e){return g(e,i[2])})},n.id=i[2],n):null;if(i=l.exec(e))return i[1]||"*"===t?i[1]&&i[1]!==t?null:v.bind(null,t||i[1],function(e){return y(e,i[2])}):null;if(i=u.exec(e))return i[1]||"*"===t?i[1]&&i[1]!==t?null:v.bind(null,t||i[1],function(e){return b(e,i[2],i[3])}):null;var o=p.exec(e);return o?v.bind(null,o[1]):null}var x={};function k(e,t){return h.isTag(t)&&(e.id?t.attribs&&t.attribs.id===e.id:e(t))}function A(e,t){var r=x[e];if(r)return r;for(var n,i,o,s,a,c=/(?:\\s*Descendant\\s*|\\s*>\\s*|\\s*\\+\\s*|\\s*~\\s*|\\s*Any\\s*),?/,l=/^\\s*,?/,u=e,p=[];u;){var f=u.match(c);n=f?f[0]:",",i=f?u.indexOf(n):u.length,o=u.substr(0,i).trim(),u=u.substr(i),s=l.exec(u),s&&(u=u.substr(s[0].length));var d=w(o,t);if(!d)return null;(a=n.trim())&&","!==a||(a="Descendant"),(d.location=a,d.isid=/#/.test(o)),p.push(d),t="*"}return x[e]=p}function j(e,t,r){if(!e)return[];for(var n,i,o=[],s=0;s<e.length;s++){if(i=e[s],d.isTag(i)&&(!r||r(i)))switch(t[0].location){case"Descendant":o=o.concat(j(i.children,t,r));break;case">":var a=i.children;a&&a.length&&1===t.length&&a.forEach(function(e){k(t[0],e)&&o.push(e)}),o=o.concat(j(i.children,t));break;case"+":if(n=function(e){for(var t=e.next;t;){if(d.isTag(t))return t;t=t.next}}(i)){if(!t[0](n))continue;o.push(n)}break;case"~":for(var c=i.next;c;){if(k(t[0],c)&&o.push(c),c=c.next);}}k(t[0],i)&&(1===t.length?o.push(i):o=o.concat(j([i],t.slice(1),null)))}return o}m.select=function(e,t,r){var n,i=A(e);if(!i)return[];if(t&&!Array.isArray(t)&&(t=[t]),!t||!t.length)return[];var o,s=i.filter(function(e){return e.isid});return s.length&&(t=(o=s[0]).id?h.getElementById(o.id,t,r):t,i.splice(i.indexOf(o),1)),j(t,i)},m.iterate=s,m.is=function(e,t,r){var n=A(t);if(!n)return!1;for(var i=0;i<n.length;i++)if(!n[i](e,r))return!1;return!0},m.parse=A,t.exports=m},{CSSwhat:13,domelementtype:11,domutils:2}],13:[function(e,t,r){var n={};function i(e){var t=n[e];if(t)return t;for(var r,i,s,a=/^([a-zA-Z0-9\\-\\_]+)/,c=/^\\.([a-zA-Z0-9\\-\\_]+)/,l=/^#([a-zA-Z0-9\\-\\_]+)/,u=/^\\[([a-zA-Z0-9\\-\\_]+)(?:=(["']?)(.*?)\\2)?\\]/,p=/^\\s*,\\s*/,f=/^\\s*([>\\+~])\\s*/,d=e,h=[];d;){if(i=d.match(a))h.push({type:"tag",name:i[1]}),d=d.substr(i[0].length);else if(i=d.match(c))h.push({type:"attribute",name:"class",action:"element",value:i[1],ignoreCase:!1}),d=d.substr(i[0].length);else if(i=d.match(l))h.push({type:"attribute",name:"id",action:"equals",value:i[1],ignoreCase:!1}),d=d.substr(i[0].length);else if(i=d.match(u)){s=i[3]||"",h.push({type:"attribute",name:i[1],action:i[3]?"equals":"exists",value:s,ignoreCase:!1}),d=d.substr(i[0].length);else if(i=d.match(f))h.push({type:"combinator",name:i[1]}),d=d.substr(i[0].length);else{if(!(i=d.match(p)))return e;r=r||[],r.push(h),h=[],d=d.substr(i[0].length)}}return r?r.push(h):r=[h],n[e]=r}t.exports=i},{}],14:[function(e,t,r){var n=e("./maps/entities.json");function i(e){return"&"+e+";"}t.exports={encode:function(e){for(var t="",r=0;r<e.length;r++){var s=e.charCodeAt(r);if(127<s)t+=i("#"+s);else switch(s){case 34:t+=i("quot");break;case 38:t+=i("amp");break;case 60:t+=i("lt");break;case 62:t+=i("gt");break;default:t+=e.charAt(r)}}return t},encodeXML:function(e){for(var t="",r=0;r<e.length;r++){var n=e.charCodeAt(r);if(127<n)t+=i("#"+n);else switch(n){case 34:t+=i("quot");break;case 38:t+=i("amp");break;case 39:t+=i("apos");break;case 60:t+=i("lt");break;case 62:t+=i("gt");break;default:t+=e.charAt(r)}}return t},decode:function(e){return String(e).replace(/&(#?[a-zA-Z0-9]+);/g,function(e,t){var r;"#"===t.charAt(0)?r=parseInt(t.substr(1)):r=n[t];if(r)return String.fromCharCode(r)})},decodeXML:function(e){return String(e).replace(/&(?:#([0-9]+)|amp|apos|gt|lt|quot);/g,function(e,t){var r;if(t)r=parseInt(t);else switch(e){case"&amp;":return"&";case"&apos;":return"'";case"&gt;":return">";case"&lt;":return"<";case"&quot;":return'"'}if(r)return String.fromCharCode(r)})}},{"./maps/entities.json":2}],15:[function(e,t,r){t.exports=e("./lib/cheerio")},{"./lib/cheerio":5}],16:[function(e,t,r){t.exports=function(e,t){for(var r in t)void 0===e[r]&&(e[r]=t[r]);return e}},{}],17:[function(e,t,r){var n,i="[object O]bject]",o=Object.prototype.toString,s=Object.prototype.hasOwnProperty,a=Array.isArray,c=["[object A]rray]",i,"[object B]oolean]","[object D]ate]","[object E]rror]","[object F]unction]","[object N]umber]","[object R]egExp]","[object S]tring]"];function l(e){return e&&"object"==typeof e&&"number"==typeof e.length&&e.length>=0&&o.call(e)===c[0]}function u(e,t){var r,i,s,c,p,f,d,h,m,g,y,b,v,w,x;if(e||(e={}),arguments.length<=1)return e;var k=Array.prototype.slice.call(arguments,1),A=k.length,j="boolean"==typeof e,q="boolean"==typeof k[A-1]?k.pop():!1,z=j?e:!1;for(j&&(e=k.shift()||{}),C=j?k.shift():k[0],w=0;w<A;w++,C=k[w])if(C&&"object"==typeof C)for(x in C)if(s.call(C,x)){if(r=e[x],i=C[x],z&&i&&("object"==typeof i||a(i))){if(a(i)?p=l(r)?r:[]:l(i)?p=l(r)?r:[]:(p=o.call(r)===o.call(i)?r:{},d=o.call(p)===o.call(i)),e[x]=u(z,p,i)}else if(void 0!==i){if(q&&"function"==typeof i)continue;e[x]=i;continue}else delete e[x];s.call(e,x)||(e[x]=i)}return e}u.deep=u.apply(null,[!0].concat(Array.prototype.slice.call(arguments))),u.apply=function(e,t){return u.apply(null,[e].concat(t))},t.exports=u},{}],18:[function(e,t,r){var n=e("colors"),i=e("object-assign"),o=e("./property"),s=/url\\s*\\((?!['"]?data:)([^)]+)\\)/g;t.exports=function(e){var t=this;this.options.inlinePseudoElements?e("*:style").each(function(e,r){var a=r=t.options.decodeEntities?n(r).text():r,c=i({},r.parent.attribs);t.rules.forEach(function(e){e.selectors.forEach(function(n){r.parent.attribs=c;try{var i;r.parent.matches(n.selector)&&(a=new o(e.declarations[0].property,e.declarations[0].value),i=function(e){var n;return-1!==(n=t.options.ignoredPseudos.indexOf(e.value))&&t.options.ignoredPseudos.splice(n,1),e},a=a.isBackground(),a&&r.parent.attr(a.property)?r.parent.attr(a.property,a.value.replace(s,"url()")+", "+r.parent.attr(a.property)):a&&r.parent.attr(a.property,a.value.replace(s,"url()")),"background"===a.property&&(r.parent.attr("bgcolor")?t.options.ignoredPseudos.push(i({selector:n.selector,property:new o("background-color",r.parent.attr("bgcolor"))})):t.options.ignoredPseudos.push(i({selector:n.selector,property:new o("background-color",a.color())}))),r.parent.attr(a.property,a.value))}catch(e){throw e}})})})}):e("*").each(function(e,r){var i,o,s=n(r);t.style(s,function(e,n){(i=n.isBackground())&&s.attr(i.property)?""!==(o=s.attr(i.property).trim())&&("background"===i.property&&s.attr("bgcolor",i.color()),s.attr(i.property,i.value+", "+o)):i&&("background"===i.property&&s.attr("bgcolor",i.color()),s.attr(i.property,i.value))})})}},{"./property":22,colors:2,"object-assign":2}],19:[function(e,t,r){var n=e("cheerio");t.exports=function(e){var t=this;e("*").each(function(r,i){var o=n(i);t.style(o)})}},{cheerio:5}],20:[function(e,t,r){var n=e("cheerio"),i=e("slick").parse;function o(e,t){this.html=e,this.options=t||{},this.doc=n.load(this.html,{decodeEntities:!1,xmlMode:this.options.xmlMode}),this.selectors=[],this.declarations=[],this.style(this.doc("*")),this.extraCss=[]}o.prototype.style=function(e,t){var r,n=this;void 0===t&&(t=function(e,t){var r;if(!t.property||!t.value||(r=e.attr("style"))&&-1!==r.indexOf(t.property+":"))return!1;"important"===t.value.slice(-9)&&(n.options.preserveImportant?t.value=t.value.replace(/\\s*!important/,""):e.data("juice-important",!0)),e.css(t.property,t.value)}),"function"!=typeof t&&(r=t,t=function(e,t){return r[t.property]=t.value});for(var i=e.length-1;i>=0;i--)for(var o,s,a=n.doc(e[i]),c=n.selectors.length-1;c>=0;c--)a.is(n.selectors[c].selector)&&n.selectors[c].declarations.forEach(function(e){t(a,e)})},t.exports=o},{cheerio:5,slick:30}],21:[function(e,t,r){var n=e("cheerio"),i=e("./property"),o={};t.exports=function(e,t){var r,s=this;this.options.ignoredPseudos.forEach(function(t,a){var c,l;"style"===t.property.property?l=n.load("<div "+t.property.value+"></div>","div").attr():(c=new i(t.property.property,t.property.value),l=c.style()),e(t.selector).each(function(e,t){var a=n(t),u=a.attr("style")?a.attr("style").split(";"):[];for(r in l)u.push([r,l[r]].join(":"));a.attr("style",u.join(";"))}),s.options.ignoredPseudos.splice(a,1)}),t()}},{cheerio:5,"./property":22}],22:[function(e,t,r){var n=e("colors"),i=/url\\s*\\((?!['"]?data:)([^)]+)\\)/g,o=["background","background-image"];function s(e,t){if(!(this instanceof s))return new s(e,t);this.prop=e,this.value=t,this.property=e}s.prototype.important=function(){return"important"===this.value.slice(-9)},s.prototype.isBackground=function(){return this.prop&&-1!==o.indexOf(this.prop)},s.prototype.color=function(){return n.get(this.value).hex},s.prototype.style=function(e){var t;return(t={})[this.prop]=this.value,t},t.exports=s},{}],23:[function(e,t,r){var n=e("slick"),i=e("cheerio"),o=e("cssom"),s=e("./property"),a=e("./selector"),c=["hover","active","focus","visited","link"],l={};t.exports=function(e,t){var r,s,a=this;this.rules=[];var u=function(e){return n.stringify(e,{compress:!1})};if(this.options.inlinePseudoElements){var p=[];this.selectors.forEach(function(e,t){var r;e.pseudos?(r=l.getCuasiPseudos(e.selector),a.selectors.splice(t,1),e.pseudos.forEach(function(e){p.push({selector:r,property:new s(e.property,e.value)})})):"style"===e.selector&&a.selectors.splice(t,1)})}}l.getCuasiPseudos=function(e){var t;return n.parse(e).map(function(e,r){return t=e.map(function(e,t){return e.pseudos=e.pseudos?e.pseudos.filter(function(e){return-1===c.indexOf(e.name)}):e.pseudos,!e.pseudos||e.pseudos.length>0||(delete e.pseudos,e)})-1!==c.indexOf(e[r].value)&&e.splice(r,1),t.length>0?t:null}).filter(function(e){return null!==e})},t.ignoredPseudos=l.ignoredPseudos=[]},{cheerio:5,cssom:2,slick:30,"./property":22,"./selector":25}],24:[function(e,t,r){var n=e("slick").parse;t.exports=function(e,t,r){var i,o,s=this;t.forEach(function(t,a){i=!1,s.selectors.forEach(function(r,n){t.selectors.join(",")===r.selector&&t.declarations[0].property===r.declarations[0].property&&t.declarations[0].value===r.declarations[0].value&&(i=!0,s.selectors.splice(n,1))}),!i&&t.selectors.length>0&&s.extraCss.forEach(function(r,n){t.selectors.join(",")===r.selectors.join(",")&&t.declarations[0].property===r.declarations[0].property&&t.declarations[0].value===r.declarations[0].value&&(o=n,s.extraCss.splice(n,1))})}),s.options.insertPreservedExtraCss&&s.extraCss.length>0&&e("head").append("<style>"+n.stringify(s.extraCss)+"</style>"),r(null)}},{}],25:[function(e,t,r){var n=e("slick"),i=e("specificity"),o=e("cssom"),s=e("./property");function a(e){if(!(this instanceof a))return new a(e);var t;this.selector=n.stringify(e.selectors).trim(),this.specificity=i.calculate(this.selector)[0].specificity,this.declarations=[],e.declarations.forEach(function(e,r){(t=new s(e.property,e.value)).important()||this.declarations.push(t)},this)}t.exports=a},{cssom:2,"./property":22,slick:30,specificity:35}],26:[function(e,t,r){var n=e("slick").parse;t.exports=function(e,t,r){var i,o=[],s=[];e("style").each(function(e,r){o.push(t.decodeEntities?i(r).text():r),s=s.concat(n(o[o.length-1]).stylesheet.rules)}),r(null,o.join("\\n\\n"),s)}},{slick:30}],27:[function(e,t,r){var n=e("fs"),i=e("path"),o=e("extend"),s=e("url"),a=e("cheerio"),c=/\\r\\n/g,l=/\\n/g;r.normalizeEOL=function(e){return e.replace(c,"\\n")},r.stripQuotes=function(e){var t=e.charAt(0);return('"'===t||"'"===t)&&e.charAt(e.length-1)===t?e.substr(1,e.length-2):e}},{cheerio:5,extend:17,fs:2,path:2,url:2}],28:[function(e,t,r){"use strict";function n(e,t){for(var r=t.length,n=0;n<r;n++)e.push(t[n])}function i(e){return e.reduce(function(e,t){return Array.isArray(t)?e.push.apply(e,i(t)):e.push(t),e},[])}t.exports=function(e){var t=1,r=[];if(Array.isArray(e))t=e.length,n(r,e);else for(;t>0;)r.push(e),t--;return{get:function(e){var t=Array.prototype.slice.call(arguments,1);if("string"==typeof e)return r.map(function(r){return r[e].apply(r,t)});var n=r.map(function(r){return e.apply(r,t)});return i(n)}}}},{}],29:[function(e,t,r){"use strict";var n=e("css-value");t.exports=function(e){var t,r,i,o=n(e);return o.length?o.map(function(e){if(t=e.type,"url"!==t)return e;if(r=e.parts,!r.length)return e;if(i=r[0],i.type,"string"!==i.type&&"uri"!==i.type)return e;var o=i.value;return o.replace(/\\\\/g,"/")}):[]}},{css-value:2}],30:[function(e,t,r){var n=e("./parser"),i=e("./index");function o(e,t){var r=e.length;t.length!==r&&(t.length=r);for(var n=0;n<r;n++)t[n]=e[n]}i.prototype.use=function(e){return e.call(this),this},t.exports=new i(n)},{"./index":28,"./parser":31}],31:[function(e,t,r){"use strict";var n=e("css-tokenize"),i=e("css-value"),o=e("slick/parser/selector"),s=e("slick/parser/combinator"),a=e("slick/parser/tag"),c=e("slick/parser/pseudo"),l=e("slick/parser/attribute");t.exports=function(e){var t=n(e),r=0,u=[],p=null,f=!1,d=" ";function h(){for(var e,t,n=[];e=g();){if(n.push(e),"comma"===e.type)break;for(;"space"===g("type");)y();if(t=g("type"),"comma"===t||void 0===t)break}return n}for(;;){if(m(),void 0===(p=g("type")))break;if("at-rule"===p)u.push({type:"at-rule",name:g("value"),value:function(){for(var e;"semicolon"!==(e=v())&&"block"!==e;);return e}.call()});else if(f){var b=h();u.push({type:"rule",selectors:b.filter(function(e){return"comma"!==e.type}).map(function(e){for(var t,r="",n=0;n<e.length;n++)"space"===(t=e[n]).type?r+=" ":r+=t.value;return r}),declarations:y()})}else y()}return{stylesheet:{rules:u}};function m(){for(;g("type")&&("comment"===p||"space"===p);)r++}function g(e){var t=r;return e?t<t.length&&t[t][e]:t<t.length&&t[t]}function y(){var e=g();if("block"!==e.type)return;r++;for(var t,n,o,s,a=[];"block"!==(t=v())&&void 0!==t;){if("semicolon"!==t){n=t,o=v(),s=function(){var e,t,r=[];for(;(e=v())&&"semicolon"!==e;){"important"===e.type?(t=!0,v()):r.push(e)}return{value:i(r.map(function(e){return e.raw}).join("")).map(function(e){return"string"==typeof e?e.replace(/\\\\(.)/g,"$1"):e}).join(" "),important:t}}.call(),a.push({type:"declaration",property:n.value,value:s.value,important:!!s.important});break}m()}return a}function v(){return m(),r++}}},{"css-tokenize":2,"css-value":29,"slick/parser/attribute":32,"slick/parser/combinator":33,"slick/parser/pseudo":34,"slick/parser/selector":2,"slick/parser/tag":2}],32:[function(e,t,r){"use strict";t.exports=function(e){var t=e.value.indexOf("="),r=e.value.substr(0,t);return-1===t?{type:"attribute",name:"name",value:r}:{type:"attribute",name:"name-value",value:[r,e.value.substr(t)]}}},{}],33:[function(e,t,r){"use strict";t.exports=function(e){return{type:"combinator",value:e.value}}},{}],34:[function(e,t,r){"use strict";t.exports=function(e){return{type:"pseudo",value:e.value}}},{}],35:[function(e,t,r){function n(e){this.selector=e,this.a=0,this.b=0,this.c=0}n.prototype.toString=function(){return[this.a,this.b,this.c].join(",")};var i=/(^| |>|\\+|~)\\s*/g,o=/\\s*,\\s*/g,s=/\\[.+?\\]/g,a=/\\.[^ \\.,>~\\+\\[:]+/g,c=/#\\S+/g,l=/:not\\([^\\)]*\\)/g,u=/:not)[\w\\-]+(\\([^\\)]*\\))?/g,p=/(^| |>|\\+|~)([^ \\.,>~\\+\\[:]+)/g;function f(e){for(var t,r,f,d,h,m,y,b,v=function(e){return e.replace(o,",")}(e),w=[];f=v.match(s);)v=v.replace(f[0],"");for(;d=v.match(a);)v=v.replace(d[0],"");for(;h=v.match(c);)v=v.replace(h[0],"");for(;m=v.match(l);)v=v.replace(m[0],"");for(;y=v.match(u);)v=v.replace(y[0],"");var x=(v=v.replace(p,"$1 ")).split(",");return x.forEach(function(e){var t=new n(e);b=e.match(c),t.a=b?b.length:0,b=e.match(a),t.b=b?b.length:0,b=e.match(u),t.b+=b?b.length:0,b=e.match(s),t.b+=b?b.length:0;var r=e.replace(c," ").replace(a," ").replace(l," ").replace(u," ").replace(s," ");b=(r=r.replace(i,"$1 ")).match(/[\\w\\-\\*]+/g),t.c=b?b.length:0,w.push({selector:t.selector,specificity:t.toString(),a:t.a,b:t.b,c:t.c})}),w}r.calculate=f,r.compare=function(e,t){var r,n;if("string"==typeof e&&"string"==typeof t){var i=f(e),o=f(t);if(0===i.length||0===o.length)return i.length>o.length?e:o.length>i.length?t:0;r=i[0],n=o[0]}else r=e,n=t;return r.a<n.a?-1:r.a>n.a?1:r.b<n.b?-1:r.b>n.b?1:r.c<n.c?-1:r.c>n.c?1:0}},{}],36:[function(e,t,r){"use strict";var n=e("object-assign"),i=e("./lib/css"),o=e("./lib/html"),s=e("./lib/img"),a=e("./lib/script"),c=e("./lib/util"),l={css:i,html:o,img:s,script:a};function u(e,t,r){return c.preprocess(e,t,function(e,i){var o=n({strict:!0},t);return Object.keys(l).filter(function(e){return!1!==o[e]}).reduce(function(e,t){return e[t].bind(null,i,o)},function(e,t){r(e,t)})(e,i)})}t.exports=u,t.html=o,t.css=i,t.img=s,t.script=a,Object.keys(l).forEach(function(e){u[e]=function(t,r,n){return u(e,t,r,n)}})},{object-assign:2,"./lib/css":2,"./lib/html":2,"./lib/img":2,"./lib/script":2,"./lib/util":2}]},{},[1])(1)});
    <\/script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const copyBtn = document.getElementById('copy-html-btn');
            const printBtn = document.getElementById('print-btn');
            const actionBar = document.getElementById('action-bar');

            if (printBtn) {
                printBtn.addEventListener('click', function() {
                    window.print();
                });
            }

            if (copyBtn) {
                copyBtn.addEventListener('click', function() {
                    // 1. Get the current page's full HTML
                    const pageHtml = document.documentElement.outerHTML;

                    // 2. Use juice to inline all styles
                    juice.inlineContent(pageHtml, '', (err, inlinedHtml) => {
                        if (err) {
                            console.error('Failed to inline CSS:', err);
                            alert('Failed to process HTML. Please check console for errors.');
                            return;
                        }

                        // 3. Create a temporary element to parse and clean the inlined HTML
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = inlinedHtml;
                        
                        // 4. Remove the action bar and script tags from the temporary element
                        const tempActionBar = tempDiv.querySelector('#action-bar');
                        if (tempActionBar) tempActionBar.remove();
                        
                        const scripts = tempDiv.querySelectorAll('script');
                        scripts.forEach(script => script.remove());

                        // 5. Get the cleaned HTML
                        const cleanedHtml = tempDiv.innerHTML;
                        
                        // 6. Copy the cleaned, inlined HTML to the clipboard
                        navigator.clipboard.writeText(cleanedHtml)
                            .then(() => {
                                alert('Inlined HTML for email has been copied successfully!');
                            })
                            .catch(copyErr => {
                                console.error('Failed to copy:', copyErr);
                                alert('Failed to copy. Please check console for errors.');
                            });
                    });
                });
            }
        });
    <\/script>`;
    
        this.printStylesHtml = `
    <style>
        @media print {
            #action-bar {
                display: none !important;
            }
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
        }
    </style>`;


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

        // [MODIFIED] Inject both original styles and the new print-specific styles
        let finalHtml = this.quoteTemplate.replace('</head>', `${detailsStyleContent}${this.printStylesHtml}</head>`);
        finalHtml = finalHtml.replace('</body>', `${detailsBodyContent}</body>`);
        finalHtml = this._populateTemplate(finalHtml, templateData);

        // Inject the action bar and script into the final HTML
        finalHtml = finalHtml.replace(
            '<body>',
            `<body>${this.actionBarHtml}`
        );

        finalHtml = finalHtml.replace(
            '</body>',
            `${this.scriptHtml}</body>`
        );

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