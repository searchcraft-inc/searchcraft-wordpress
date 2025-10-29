export { g as getAssetPath, s as setAssetPath, a as setNonce, b as setPlatformOptions } from './p-5365011f.js';
import { n as nanoid } from './p-87435aac.js';
import { D as DEFAULT_CORE_INSTANCE_ID, r as registry } from './p-e30203b1.js';
export { SearchcraftAd, defineCustomElement as defineCustomElementSearchcraftAd } from './searchcraft-ad.js';
export { SearchcraftButton, defineCustomElement as defineCustomElementSearchcraftButton } from './searchcraft-button.js';
export { SearchcraftErrorMessage, defineCustomElement as defineCustomElementSearchcraftErrorMessage } from './searchcraft-error-message.js';
export { SearchcraftFacetList, defineCustomElement as defineCustomElementSearchcraftFacetList } from './searchcraft-facet-list.js';
export { SearchcraftFilterPanel, defineCustomElement as defineCustomElementSearchcraftFilterPanel } from './searchcraft-filter-panel.js';
export { SearchcraftInputForm, defineCustomElement as defineCustomElementSearchcraftInputForm } from './searchcraft-input-form.js';
export { SearchcraftInputLabel, defineCustomElement as defineCustomElementSearchcraftInputLabel } from './searchcraft-input-label.js';
export { SearchcraftLoading, defineCustomElement as defineCustomElementSearchcraftLoading } from './searchcraft-loading.js';
export { SearchcraftPagination, defineCustomElement as defineCustomElementSearchcraftPagination } from './searchcraft-pagination.js';
export { SearchcraftPopoverButton, defineCustomElement as defineCustomElementSearchcraftPopoverButton } from './searchcraft-popover-button.js';
export { SearchcraftPopoverFooter, defineCustomElement as defineCustomElementSearchcraftPopoverFooter } from './searchcraft-popover-footer.js';
export { SearchcraftPopoverForm, defineCustomElement as defineCustomElementSearchcraftPopoverForm } from './searchcraft-popover-form.js';
export { SearchcraftPopoverListItem, defineCustomElement as defineCustomElementSearchcraftPopoverListItem } from './searchcraft-popover-list-item.js';
export { SearchcraftPopoverListView, defineCustomElement as defineCustomElementSearchcraftPopoverListView } from './searchcraft-popover-list-view.js';
export { SearchcraftResultsInfo, defineCustomElement as defineCustomElementSearchcraftResultsInfo } from './searchcraft-results-info.js';
export { SearchcraftSearchResult, defineCustomElement as defineCustomElementSearchcraftSearchResult } from './searchcraft-search-result.js';
export { SearchcraftSearchResults, defineCustomElement as defineCustomElementSearchcraftSearchResults } from './searchcraft-search-results.js';
export { SearchcraftSearchResultsPerPage, defineCustomElement as defineCustomElementSearchcraftSearchResultsPerPage } from './searchcraft-search-results-per-page.js';
export { SearchcraftSelect, defineCustomElement as defineCustomElementSearchcraftSelect } from './searchcraft-select.js';
export { SearchcraftSlider, defineCustomElement as defineCustomElementSearchcraftSlider } from './searchcraft-slider.js';
export { SearchcraftSummaryBox, defineCustomElement as defineCustomElementSearchcraftSummaryBox } from './searchcraft-summary-box.js';
export { SearchcraftTheme, defineCustomElement as defineCustomElementSearchcraftTheme } from './searchcraft-theme.js';
export { SearchcraftToggleButton, defineCustomElement as defineCustomElementSearchcraftToggleButton } from './searchcraft-toggle-button.js';

var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
    LogLevel[LogLevel["NONE"] = 4] = "NONE";
})(LogLevel || (LogLevel = {}));
class SearchcraftLogger {
    logLevel;
    logFormatter;
    constructor(options) {
        this.logLevel = options.logLevel || LogLevel.INFO;
        this.logFormatter = options.logFormatter || this.defaultFormatter;
    }
    defaultFormatter(level, message) {
        const levelStr = LogLevel[level];
        return `[${levelStr}] ${new Date().toISOString()}: ${message}`;
    }
    debug(message) {
        if (this.logLevel <= LogLevel.DEBUG) {
            console.log(this.logFormatter(LogLevel.DEBUG, message));
        }
    }
    info(message) {
        if (this.logLevel <= LogLevel.INFO) {
            console.info(this.logFormatter(LogLevel.INFO, message));
        }
    }
    warn(message) {
        if (this.logLevel <= LogLevel.WARN) {
            console.warn(this.logFormatter(LogLevel.WARN, message));
        }
    }
    error(message) {
        if (this.logLevel <= LogLevel.ERROR) {
            console.error(this.logFormatter(LogLevel.ERROR, message));
        }
    }
    log(level, message) {
        switch (level) {
            case LogLevel.DEBUG:
                this.debug(message);
                break;
            case LogLevel.INFO:
                this.info(message);
                break;
            case LogLevel.WARN:
                this.warn(message);
                break;
            case LogLevel.ERROR:
                this.error(message);
                break;
        }
    }
}
const Logger = new SearchcraftLogger({ logLevel: LogLevel.NONE });

function e(e,r,n,t){return new(n||(n=Promise))((function(o,a){function i(e){try{c(t.next(e));}catch(e){a(e);}}function u(e){try{c(t.throw(e));}catch(e){a(e);}}function c(e){var r;e.done?o(e.value):(r=e.value,r instanceof n?r:new n((function(e){e(r);}))).then(i,u);}c((t=t.apply(e,r||[])).next());}))}function r(e,r){var n,t,o,a,i={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function u(u){return function(c){return function(u){if(n)throw new TypeError("Generator is already executing.");for(;a&&(a=0,u[0]&&(i=0)),i;)try{if(n=1,t&&(o=2&u[0]?t.return:u[0]?t.throw||((o=t.return)&&o.call(t),0):t.next)&&!(o=o.call(t,u[1])).done)return o;switch(t=0,o&&(u=[2&u[0],o.value]),u[0]){case 0:case 1:o=u;break;case 4:return i.label++,{value:u[1],done:!1};case 5:i.label++,t=u[1],u=[0];continue;case 7:u=i.ops.pop(),i.trys.pop();continue;default:if(!(o=i.trys,(o=o.length>0&&o[o.length-1])||6!==u[0]&&2!==u[0])){i=0;continue}if(3===u[0]&&(!o||u[1]>o[0]&&u[1]<o[3])){i.label=u[1];break}if(6===u[0]&&i.label<o[1]){i.label=o[1],o=u;break}if(o&&i.label<o[2]){i.label=o[2],i.ops.push(u);break}o[2]&&i.ops.pop(),i.trys.pop();continue}u=r.call(e,i);}catch(e){u=[6,e],t=0;}finally{n=o=0;}if(5&u[0])throw u[1];return {value:u[0]?u[1]:void 0,done:!0}}([u,c])}}}"function"==typeof SuppressedError&&SuppressedError;var n={exclude:[]};var o={},a={timeout:"true"},i=function(e,r){"undefined"!=typeof window&&(o[e]=r);},u=function(){return Object.fromEntries(Object.entries(o).filter((function(e){var r,t=e[0];return !(null===(r=null==n?void 0:n.exclude)||void 0===r?void 0:r.includes(t))})).map((function(e){return [e[0],(0, e[1])()]})))};function c(e){return e^=e>>>16,e=Math.imul(e,2246822507),e^=e>>>13,e=Math.imul(e,3266489909),(e^=e>>>16)>>>0}var s=new Uint32Array([597399067,2869860233,951274213,2716044179]);function l(e,r){return e<<r|e>>>32-r}function f(e,r){var n;if(void 0===r&&(r=0),r=r?0|r:0,"string"==typeof e&&(n=e,e=(new TextEncoder).encode(n).buffer),!(e instanceof ArrayBuffer))throw new TypeError("Expected key to be ArrayBuffer or string");var t=new Uint32Array([r,r,r,r]);!function(e,r){for(var n=e.byteLength/16|0,t=new Uint32Array(e,0,4*n),o=0;o<n;o++){var a=t.subarray(4*o,4*(o+1));a[0]=Math.imul(a[0],s[0]),a[0]=l(a[0],15),a[0]=Math.imul(a[0],s[1]),r[0]=r[0]^a[0],r[0]=l(r[0],19),r[0]=r[0]+r[1],r[0]=Math.imul(r[0],5)+1444728091,a[1]=Math.imul(a[1],s[1]),a[1]=l(a[1],16),a[1]=Math.imul(a[1],s[2]),r[1]=r[1]^a[1],r[1]=l(r[1],17),r[1]=r[1]+r[2],r[1]=Math.imul(r[1],5)+197830471,a[2]=Math.imul(a[2],s[2]),a[2]=l(a[2],17),a[2]=Math.imul(a[2],s[3]),r[2]=r[2]^a[2],r[2]=l(r[2],15),r[2]=r[2]+r[3],r[2]=Math.imul(r[2],5)+2530024501,a[3]=Math.imul(a[3],s[3]),a[3]=l(a[3],18),a[3]=Math.imul(a[3],s[0]),r[3]=r[3]^a[3],r[3]=l(r[3],13),r[3]=r[3]+r[0],r[3]=Math.imul(r[3],5)+850148119;}}(e,t),function(e,r){var n=e.byteLength/16|0,t=e.byteLength%16,o=new Uint32Array(4),a=new Uint8Array(e,16*n,t);switch(t){case 15:o[3]=o[3]^a[14]<<16;case 14:o[3]=o[3]^a[13]<<8;case 13:o[3]=o[3]^a[12]<<0,o[3]=Math.imul(o[3],s[3]),o[3]=l(o[3],18),o[3]=Math.imul(o[3],s[0]),r[3]=r[3]^o[3];case 12:o[2]=o[2]^a[11]<<24;case 11:o[2]=o[2]^a[10]<<16;case 10:o[2]=o[2]^a[9]<<8;case 9:o[2]=o[2]^a[8]<<0,o[2]=Math.imul(o[2],s[2]),o[2]=l(o[2],17),o[2]=Math.imul(o[2],s[3]),r[2]=r[2]^o[2];case 8:o[1]=o[1]^a[7]<<24;case 7:o[1]=o[1]^a[6]<<16;case 6:o[1]=o[1]^a[5]<<8;case 5:o[1]=o[1]^a[4]<<0,o[1]=Math.imul(o[1],s[1]),o[1]=l(o[1],16),o[1]=Math.imul(o[1],s[2]),r[1]=r[1]^o[1];case 4:o[0]=o[0]^a[3]<<24;case 3:o[0]=o[0]^a[2]<<16;case 2:o[0]=o[0]^a[1]<<8;case 1:o[0]=o[0]^a[0]<<0,o[0]=Math.imul(o[0],s[0]),o[0]=l(o[0],15),o[0]=Math.imul(o[0],s[1]),r[0]=r[0]^o[0];}}(e,t),function(e,r){r[0]=r[0]^e.byteLength,r[1]=r[1]^e.byteLength,r[2]=r[2]^e.byteLength,r[3]=r[3]^e.byteLength,r[0]=r[0]+r[1]|0,r[0]=r[0]+r[2]|0,r[0]=r[0]+r[3]|0,r[1]=r[1]+r[0]|0,r[2]=r[2]+r[0]|0,r[3]=r[3]+r[0]|0,r[0]=c(r[0]),r[1]=c(r[1]),r[2]=c(r[2]),r[3]=c(r[3]),r[0]=r[0]+r[1]|0,r[0]=r[0]+r[2]|0,r[0]=r[0]+r[3]|0,r[1]=r[1]+r[0]|0,r[2]=r[2]+r[0]|0,r[3]=r[3]+r[0]|0;}(e,t);var o=new Uint8Array(t.buffer);return Array.from(o).map((function(e){return e.toString(16).padStart(2,"0")})).join("")}function d(e,r){return new Promise((function(n){setTimeout((function(){return n(r)}),e);}))}function m(e,r,n){return Promise.all(e.map((function(e){return Promise.race([e,d(r,n)])})))}function v(){return e(this,void 0,void 0,(function(){var e,t,o,i,c;return r(this,(function(r){switch(r.label){case 0:return r.trys.push([0,2,,3]),e=u(),t=Object.keys(e),[4,m(Object.values(e),(null==n?void 0:n.timeout)||1e3,a)];case 1:return o=r.sent(),i=o.filter((function(e){return void 0!==e})),c={},i.forEach((function(e,r){c[t[r]]=e;})),[2,p(c,n.exclude||[])];case 2:throw r.sent();case 3:return [2]}}))}))}function p(e,r){var n={},t=function(t){if(e.hasOwnProperty(t)){var o=e[t];if("object"!=typeof o||Array.isArray(o))r.includes(t)||(n[t]=o);else {var a=p(o,r.map((function(e){return e.startsWith(t+".")?e.slice(t.length+1):e})));Object.keys(a).length>0&&(n[t]=a);}}};for(var o in e)t(o);return n}function g(n){return e(this,void 0,void 0,(function(){var e,t;return r(this,(function(r){switch(r.label){case 0:return r.trys.push([0,2,,3]),[4,v()];case 1:return e=r.sent(),t=f(JSON.stringify(e)),n?[2,{hash:t.toString(),data:e}]:[2,t.toString()];case 2:throw r.sent();case 3:return [2]}}))}))}function y(e){for(var r=0,n=0;n<e.length;++n)r+=Math.abs(e[n]);return r}function b(e,r,n){for(var t=[],o=0;o<e[0].data.length;o++){for(var a=[],i=0;i<e.length;i++)a.push(e[i].data[o]);t.push(S(a));}var u=new Uint8ClampedArray(t);return new ImageData(u,r,n)}function S(e){if(0===e.length)return 0;for(var r={},n=0,t=e;n<t.length;n++){r[a=t[n]]=(r[a]||0)+1;}var o=e[0];for(var a in r)r[a]>r[o]&&(o=parseInt(a,10));return o}function M(){if("undefined"==typeof navigator)return {name:"unknown",version:"unknown"};for(var e=navigator.userAgent,r={Edg:"Edge",OPR:"Opera"},n=0,t=[/(?<name>Edge|Edg)\/(?<version>\d+(?:\.\d+)?)/,/(?<name>(?:Chrome|Chromium|OPR|Opera|Vivaldi|Brave))\/(?<version>\d+(?:\.\d+)?)/,/(?<name>(?:Firefox|Waterfox|Iceweasel|IceCat))\/(?<version>\d+(?:\.\d+)?)/,/(?<name>Safari)\/(?<version>\d+(?:\.\d+)?)/,/(?<name>MSIE|Trident|IEMobile).+?(?<version>\d+(?:\.\d+)?)/,/(?<name>[A-Za-z]+)\/(?<version>\d+(?:\.\d+)?)/,/(?<name>SamsungBrowser)\/(?<version>\d+(?:\.\d+)?)/];n<t.length;n++){var o=t[n],a=e.match(o);if(a&&a.groups)return {name:r[a.groups.name]||a.groups.name,version:a.groups.version}}return {name:"unknown",version:"unknown"}}i("audio",(function(){return e(this,void 0,void 0,(function(){return r(this,(function(e){return [2,new Promise((function(e,r){try{var n=new(window.OfflineAudioContext||window.webkitOfflineAudioContext)(1,5e3,44100),t=n.createBufferSource(),o=n.createOscillator();o.frequency.value=1e3;var a,i=n.createDynamicsCompressor();i.threshold.value=-50,i.knee.value=40,i.ratio.value=12,i.attack.value=0,i.release.value=.2,o.connect(i),i.connect(n.destination),o.start(),n.oncomplete=function(r){a=r.renderedBuffer.getChannelData(0),e({sampleHash:y(a),oscillator:o.type,maxChannels:n.destination.maxChannelCount,channelCountMode:t.channelCountMode});},n.startRendering();}catch(e){console.error("Error creating audio fingerprint:",e),r(e);}}))]}))}))}));var E="SamsungBrowser"!==M().name?1:3,P=280,A=20;"Firefox"!=M().name&&i("canvas",(function(){return document.createElement("canvas").getContext("2d"),new Promise((function(e){var r=Array.from({length:E},(function(){return function(){var e=document.createElement("canvas"),r=e.getContext("2d");if(!r)return new ImageData(1,1);e.width=P,e.height=A;var n=r.createLinearGradient(0,0,e.width,e.height);n.addColorStop(0,"red"),n.addColorStop(1/6,"orange"),n.addColorStop(2/6,"yellow"),n.addColorStop(.5,"green"),n.addColorStop(4/6,"blue"),n.addColorStop(5/6,"indigo"),n.addColorStop(1,"violet"),r.fillStyle=n,r.fillRect(0,0,e.width,e.height);var t="Random Text WMwmil10Oo";r.font="23.123px Arial",r.fillStyle="black",r.fillText(t,-5,15),r.fillStyle="rgba(0, 0, 255, 0.5)",r.fillText(t,-3.3,17.7),r.beginPath(),r.moveTo(0,0),r.lineTo(2*e.width/7,e.height),r.strokeStyle="white",r.lineWidth=2,r.stroke();var o=r.getImageData(0,0,e.width,e.height);return o}()}));e({commonImageDataHash:f(b(r,P,A).data.toString()).toString()});}))}));var C,x=["Arial","Arial Black","Arial Narrow","Arial Rounded MT","Arimo","Archivo","Barlow","Bebas Neue","Bitter","Bookman","Calibri","Cabin","Candara","Century","Century Gothic","Comic Sans MS","Constantia","Courier","Courier New","Crimson Text","DM Mono","DM Sans","DM Serif Display","DM Serif Text","Dosis","Droid Sans","Exo","Fira Code","Fira Sans","Franklin Gothic Medium","Garamond","Geneva","Georgia","Gill Sans","Helvetica","Impact","Inconsolata","Indie Flower","Inter","Josefin Sans","Karla","Lato","Lexend","Lucida Bright","Lucida Console","Lucida Sans Unicode","Manrope","Merriweather","Merriweather Sans","Montserrat","Myriad","Noto Sans","Nunito","Nunito Sans","Open Sans","Optima","Orbitron","Oswald","Pacifico","Palatino","Perpetua","PT Sans","PT Serif","Poppins","Prompt","Public Sans","Quicksand","Rajdhani","Recursive","Roboto","Roboto Condensed","Rockwell","Rubik","Segoe Print","Segoe Script","Segoe UI","Sora","Source Sans Pro","Space Mono","Tahoma","Taviraj","Times","Times New Roman","Titillium Web","Trebuchet MS","Ubuntu","Varela Round","Verdana","Work Sans"],T=["monospace","sans-serif","serif"];function k(e,r){if(!e)throw new Error("Canvas context not supported");return e.font="72px ".concat(r),e.measureText("WwMmLli0Oo").width}function R(){var e,r=document.createElement("canvas"),n=null!==(e=r.getContext("webgl"))&&void 0!==e?e:r.getContext("experimental-webgl");if(n&&"getParameter"in n)try{var t=(n.getParameter(n.VENDOR)||"").toString(),o=(n.getParameter(n.RENDERER)||"").toString(),a={vendor:t,renderer:o,version:(n.getParameter(n.VERSION)||"").toString(),shadingLanguageVersion:(n.getParameter(n.SHADING_LANGUAGE_VERSION)||"").toString()};if(!o.length||!t.length){var i=n.getExtension("WEBGL_debug_renderer_info");if(i){var u=(n.getParameter(i.UNMASKED_VENDOR_WEBGL)||"").toString(),c=(n.getParameter(i.UNMASKED_RENDERER_WEBGL)||"").toString();u&&(a.vendorUnmasked=u),c&&(a.rendererUnmasked=c);}}return a}catch(e){}return "undefined"}function I(){var e=new Float32Array(1),r=new Uint8Array(e.buffer);return e[0]=1/0,e[0]=e[0]-e[0],r[3]}function O(e,r){var n={};return r.forEach((function(r){var t=function(e){if(0===e.length)return null;var r={};e.forEach((function(e){var n=String(e);r[n]=(r[n]||0)+1;}));var n=e[0],t=1;return Object.keys(r).forEach((function(e){r[e]>t&&(n=e,t=r[e]);})),n}(e.map((function(e){return r in e?e[r]:void 0})).filter((function(e){return void 0!==e})));t&&(n[r]=t);})),n}function L(){var e=[],r={"prefers-contrast":["high","more","low","less","forced","no-preference"],"any-hover":["hover","none"],"any-pointer":["none","coarse","fine"],pointer:["none","coarse","fine"],hover:["hover","none"],update:["fast","slow"],"inverted-colors":["inverted","none"],"prefers-reduced-motion":["reduce","no-preference"],"prefers-reduced-transparency":["reduce","no-preference"],scripting:["none","initial-only","enabled"],"forced-colors":["active","none"]};return Object.keys(r).forEach((function(n){r[n].forEach((function(r){matchMedia("(".concat(n,": ").concat(r,")")).matches&&e.push("".concat(n,": ").concat(r));}));})),e}function _(){if("https:"===window.location.protocol&&"function"==typeof window.ApplePaySession)try{for(var e=window.ApplePaySession.supportsVersion,r=15;r>0;r--)if(e(r))return r}catch(e){return 0}return 0}"Firefox"!=M().name&&i("fonts",(function(){var n=this;return new Promise((function(t,o){try{!function(n){var t;e(this,void 0,void 0,(function(){var e,o,a;return r(this,(function(r){switch(r.label){case 0:return document.body?[3,2]:[4,(i=50,new Promise((function(e){return setTimeout(e,i,u)})))];case 1:return r.sent(),[3,0];case 2:if((e=document.createElement("iframe")).setAttribute("frameBorder","0"),(o=e.style).setProperty("position","fixed"),o.setProperty("display","block","important"),o.setProperty("visibility","visible"),o.setProperty("border","0"),o.setProperty("opacity","0"),e.src="about:blank",document.body.appendChild(e),!(a=e.contentDocument||(null===(t=e.contentWindow)||void 0===t?void 0:t.document)))throw new Error("Iframe document is not accessible");return n({iframe:a}),setTimeout((function(){document.body.removeChild(e);}),0),[2]}var i,u;}))}));}((function(o){var a=o.iframe;return e(n,void 0,void 0,(function(){var e,n,o,i;return r(this,(function(r){return e=a.createElement("canvas"),n=e.getContext("2d"),o=T.map((function(e){return k(n,e)})),i={},x.forEach((function(e){var r=k(n,e);o.includes(r)||(i[e]=r);})),t(i),[2]}))}))}));}catch(e){o({error:"unsupported"});}}))})),i("hardware",(function(){return new Promise((function(e,r){var n=void 0!==navigator.deviceMemory?navigator.deviceMemory:0,t=window.performance&&window.performance.memory?window.performance.memory:0;e({videocard:R(),architecture:I(),deviceMemory:n.toString()||"undefined",jsHeapSizeLimit:t.jsHeapSizeLimit||0});}))})),i("locales",(function(){return new Promise((function(e){e({languages:navigator.language,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone});}))})),i("permissions",(function(){return e(this,void 0,void 0,(function(){var t;return r(this,(function(o){return C=(null==n?void 0:n.permissions_to_check)||["accelerometer","accessibility","accessibility-events","ambient-light-sensor","background-fetch","background-sync","bluetooth","camera","clipboard-read","clipboard-write","device-info","display-capture","gyroscope","geolocation","local-fonts","magnetometer","microphone","midi","nfc","notifications","payment-handler","persistent-storage","push","speaker","storage-access","top-level-storage-access","window-management","query"],t=Array.from({length:(null==n?void 0:n.retries)||3},(function(){return function(){return e(this,void 0,void 0,(function(){var e,n,t,o,a;return r(this,(function(r){switch(r.label){case 0:e={},n=0,t=C,r.label=1;case 1:if(!(n<t.length))return [3,6];o=t[n],r.label=2;case 2:return r.trys.push([2,4,,5]),[4,navigator.permissions.query({name:o})];case 3:return a=r.sent(),e[o]=a.state.toString(),[3,5];case 4:return r.sent(),[3,5];case 5:return n++,[3,1];case 6:return [2,e]}}))}))}()})),[2,Promise.all(t).then((function(e){return O(e,C)}))]}))}))})),i("plugins",(function(){var e=[];if(navigator.plugins)for(var r=0;r<navigator.plugins.length;r++){var n=navigator.plugins[r];e.push([n.name,n.filename,n.description].join("|"));}return new Promise((function(r){r({plugins:e});}))})),i("screen",(function(){return new Promise((function(e){e({is_touchscreen:navigator.maxTouchPoints>0,maxTouchPoints:navigator.maxTouchPoints,colorDepth:screen.colorDepth,mediaMatches:L()});}))})),i("system",(function(){return new Promise((function(e){var r=M();e({platform:window.navigator.platform,cookieEnabled:window.navigator.cookieEnabled,productSub:navigator.productSub,product:navigator.product,useragent:navigator.userAgent,hardwareConcurrency:navigator.hardwareConcurrency,browser:{name:r.name,version:r.version},applePayVersion:_()});}))}));var D,B="SamsungBrowser"!==M().name?1:3,U=null;i("webgl",(function(){return e(this,void 0,void 0,(function(){var e;return r(this,(function(r){"undefined"!=typeof document&&((D=document.createElement("canvas")).width=200,D.height=100,U=D.getContext("webgl"));try{if(!U)throw new Error("WebGL not supported");return e=Array.from({length:B},(function(){return function(){try{if(!U)throw new Error("WebGL not supported");var e="\n          attribute vec2 position;\n          void main() {\n              gl_Position = vec4(position, 0.0, 1.0);\n          }\n      ",r="\n          precision mediump float;\n          void main() {\n              gl_FragColor = vec4(0.812, 0.195, 0.553, 0.921); // Set line color\n          }\n      ",n=U.createShader(U.VERTEX_SHADER),t=U.createShader(U.FRAGMENT_SHADER);if(!n||!t)throw new Error("Failed to create shaders");if(U.shaderSource(n,e),U.shaderSource(t,r),U.compileShader(n),!U.getShaderParameter(n,U.COMPILE_STATUS))throw new Error("Vertex shader compilation failed: "+U.getShaderInfoLog(n));if(U.compileShader(t),!U.getShaderParameter(t,U.COMPILE_STATUS))throw new Error("Fragment shader compilation failed: "+U.getShaderInfoLog(t));var o=U.createProgram();if(!o)throw new Error("Failed to create shader program");if(U.attachShader(o,n),U.attachShader(o,t),U.linkProgram(o),!U.getProgramParameter(o,U.LINK_STATUS))throw new Error("Shader program linking failed: "+U.getProgramInfoLog(o));U.useProgram(o);for(var a=137,i=new Float32Array(4*a),u=2*Math.PI/a,c=0;c<a;c++){var s=c*u;i[4*c]=0,i[4*c+1]=0,i[4*c+2]=Math.cos(s)*(D.width/2),i[4*c+3]=Math.sin(s)*(D.height/2);}var l=U.createBuffer();U.bindBuffer(U.ARRAY_BUFFER,l),U.bufferData(U.ARRAY_BUFFER,i,U.STATIC_DRAW);var f=U.getAttribLocation(o,"position");U.enableVertexAttribArray(f),U.vertexAttribPointer(f,2,U.FLOAT,!1,0,0),U.viewport(0,0,D.width,D.height),U.clearColor(0,0,0,1),U.clear(U.COLOR_BUFFER_BIT),U.drawArrays(U.LINES,0,2*a);var d=new Uint8ClampedArray(D.width*D.height*4);return U.readPixels(0,0,D.width,D.height,U.RGBA,U.UNSIGNED_BYTE,d),new ImageData(d,D.width,D.height)}catch(e){return new ImageData(1,1)}finally{U&&(U.bindBuffer(U.ARRAY_BUFFER,null),U.useProgram(null),U.viewport(0,0,U.drawingBufferWidth,U.drawingBufferHeight),U.clearColor(0,0,0,0));}}()})),[2,{commonImageHash:f(b(e,D.width,D.height).data.toString()).toString()}]}catch(e){return [2,{webgl:"unsupported"}]}return [2]}))}))}));var F=function(e,r,n,t){for(var o=(n-r)/t,a=0,i=0;i<t;i++){a+=e(r+(i+.5)*o);}return a*o};i("math",(function(){return e(void 0,void 0,void 0,(function(){return r(this,(function(e){return [2,{acos:Math.acos(.5),asin:F(Math.asin,-1,1,97),atan:F(Math.atan,-1,1,97),cos:F(Math.cos,0,Math.PI,97),cosh:Math.cosh(9/7),e:Math.E,largeCos:Math.cos(1e20),largeSin:Math.sin(1e20),largeTan:Math.tan(1e20),log:Math.log(1e3),pi:Math.PI,sin:F(Math.sin,-Math.PI,Math.PI,97),sinh:F(Math.sinh,-9/7,7/9,97),sqrt:Math.sqrt(2),tan:F(Math.tan,0,2*Math.PI,97),tanh:F(Math.tanh,-9/7,7/9,97)}]}))}))}));

class AdClient {
    config;
    constructor(config) {
        this.config = config;
    }
    async getAds(_properties) {
        return [];
    }
    async onQuerySubmitted(_properties) { }
    async onQueryFetched(_properties, _response) { }
    async onInputCleared() { }
    async onAdContainerRendered(_data) { }
    async onAdContainerViewed(_data) { }
}

class CustomAdClient extends AdClient {
    async getAds(_properties) {
        return [];
    }
}

const MEASURE_REQUEST_DEBOUNCE = 600;
class MeasureClient {
    measureRequestTimeout;
    measureRequestsBatched = [];
    config;
    sdkInfo;
    userId;
    sessionId;
    constructor(config, sdkInfo, userId) {
        this.config = config;
        this.sdkInfo = sdkInfo;
        this.userId = userId;
        this.sessionId = nanoid();
        this.sendMeasureEvent('sdk_initialized');
    }
    /**
     * Getter for the base url used by the /measure endpoints.
     */
    get baseMeasureUrl() {
        return `${this.config.endpointURL}/measure`;
    }
    /**
     * Getter for the measure request user. Uses config values + navigator values.
     */
    get measureRequestUser() {
        return {
            user_id: this.userId,
            locale: navigator.language || 'en-US',
            os: navigator.userAgent.includes('Windows')
                ? 'Windows'
                : navigator.userAgent.includes('Mac')
                    ? 'Mac'
                    : navigator.userAgent.includes('Linux')
                        ? 'Linux'
                        : 'Unknown',
            platform: navigator.platform || 'Unknown',
            sdk_name: this.sdkInfo.sdkName,
            sdk_version: this.sdkInfo.sdkVersion,
            user_agent: navigator.userAgent || 'Unknown',
        };
    }
    /**
     * Sends a measure event to the `/measure/event` endpoint for analytics purposes.
     *
     * @param {MeasureEventName} eventName - Name of the event.
     * @param {Partial<MeasureRequestProperties>} properties - Additional properties to send with the event.
     * @param {Partial<MeasureRequestUser>} user - Additional user properites to send with the event.
     */
    sendMeasureEvent = async (eventName, properties = {}, user = {}) => {
        /**
         * Builds the request object based on config values + provided arguments.
         */
        const request = {
            event_name: eventName,
            properties: {
                searchcraft_index_names: this.config.indexName ? [this.config.indexName] : [],
                searchcraft_federation_name: this.config.federationName,
                session_id: this.sessionId,
                ...properties,
            },
            user: {
                ...this.measureRequestUser,
                ...user,
            },
        };
        // Send document_clicked events immediately
        if (eventName === 'document_clicked') {
            const body = JSON.stringify(request);
            const url = `${this.baseMeasureUrl}/event`;
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: this.config.readKey,
                        'X-Sc-User-Id': this.userId,
                        'X-Sc-Session-Id': this.sessionId,
                    },
                    body,
                    keepalive: true,
                });
                if (!response.ok) {
                    throw new Error(`Failed to send request: ${response.status} ${response.statusText}`);
                }
            }
            catch (error) {
                console.error('Error sending MeasureRequest:', error);
                throw error;
            }
        }
        else {
            // Otherwise send in batches
            this.measureRequestsBatched.push(request);
            clearTimeout(this.measureRequestTimeout);
            this.measureRequestTimeout = setTimeout(async () => {
                const payload = JSON.stringify({ items: this.measureRequestsBatched });
                const url = `${this.baseMeasureUrl}/batch`;
                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: this.config.readKey,
                            'X-Sc-User-Id': this.userId,
                            'X-Sc-Session-Id': this.sessionId,
                        },
                        body: payload,
                        keepalive: true,
                    });
                    this.measureRequestsBatched = [];
                    if (!response.ok) {
                        throw new Error(`Failed to send request: ${response.status} ${response.statusText}`);
                    }
                    return;
                }
                catch (error) {
                    this.measureRequestsBatched = [];
                    console.error('Error sending MeasureRequest:', error);
                    throw error;
                }
            }, MEASURE_REQUEST_DEBOUNCE);
        }
    };
}

const removeTrailingSlashFromURL = (endpointURL) => endpointURL.endsWith('/') ? endpointURL.slice(0, -1) : endpointURL;

const sanitize = (str) => {
    let sanitizedStr = '';
    // Trim whitespace
    sanitizedStr = str.trim();
    // Replace fancy quotes
    sanitizedStr = sanitizedStr.replace(/[‘’“”]/g, (match) => {
        const map = {
            '‘': "'",
            '’': "'",
            '“': '"',
            '”': '"',
        };
        return map[match] || match;
    });
    // Whether there are an equal number of quotes
    const quoteCount = (sanitizedStr.match(/"/g) || []).length;
    if (quoteCount % 2 !== 0) {
        throw new Error('The search term contains an uneven number of quote characters.');
    }
    return sanitizedStr;
};

const SEARCH_COMPLETED_EVENT_DEBOUNCE = 500;
class SearchClient {
    config;
    userId;
    parent;
    searchCompletedEventTimeout;
    abortController;
    supplementalAbortController;
    constructor(parent, config, userId) {
        this.parent = parent;
        this.config = config;
        this.userId = userId;
    }
    /**
     * Getter for the base url used by the /search endpoint.
     * Supports both index and federation search endpoints.
     */
    get baseSearchUrl() {
        return this.config.federationName
            ? `${this.config.endpointURL}/federation/${this.config.federationName}/search`
            : `${this.config.endpointURL}/index/${this.config.indexName}/search`;
    }
    /**
     * Immediately cancels all pending search requests.
     */
    abortRequests = () => {
        this.abortController?.abort('The pending search request has been cancelled.');
        this.supplementalAbortController?.abort('The pending search request has been cancelled.');
    };
    /**
     * Make the request to get the search results.
     * @param {properties} properties - The properties for the search.
     * @param isSupplemental - Whether or not this is a supplemental search request (for the purpose of getting top-level facet counts)
     * @returns
     */
    getSearchResponseItems = async (properties, isSupplemental = false) => {
        let response;
        let searchTerm = '';
        let abortController;
        if (isSupplemental) {
            this.supplementalAbortController?.abort('A newer search request has replaced this one.');
            abortController = new AbortController();
            this.supplementalAbortController = abortController;
        }
        else {
            this.abortController?.abort('A newer search request has replaced this one.');
            abortController = new AbortController();
            this.abortController = abortController;
        }
        // Sanitize the search term prior to any request
        // The function will throw if it is not valid
        if (typeof properties === 'string') {
            searchTerm = sanitize(properties);
        }
        else {
            properties.searchTerm = sanitize(properties.searchTerm);
            searchTerm = properties.searchTerm;
        }
        this.parent.measureClient?.sendMeasureEvent('search_requested', {
            search_term: searchTerm,
        });
        this.parent.emitEvent('query_submitted', {
            name: 'query_submitted',
            data: {
                searchTerm,
            },
        });
        this.parent.adClient?.onQuerySubmitted(typeof properties === 'string'
            ? { searchTerm, mode: 'exact' }
            : properties);
        if (typeof properties === 'string') {
            response = await this.handleGetSearchResponseItemsWithString(searchTerm, abortController);
        }
        else {
            response = await this.handleGetSearchResponseItemsWithObject(properties, abortController);
        }
        if (!isSupplemental) {
            this.parent.measureClient?.sendMeasureEvent('search_response_received', {
                search_term: searchTerm,
                number_of_documents: response.data.count,
            });
            clearTimeout(this.searchCompletedEventTimeout);
            this.searchCompletedEventTimeout = setTimeout(() => {
                this.parent.measureClient?.sendMeasureEvent('search_completed', {
                    search_term: searchTerm,
                    number_of_documents: response.data.count,
                });
            }, SEARCH_COMPLETED_EVENT_DEBOUNCE);
            this.parent.emitEvent('query_fetched', {
                name: 'query_fetched',
                data: {
                    searchTerm,
                },
            });
            if ((response.data.hits?.length || 0) === 0) {
                this.parent.emitEvent('no_results_returned', {
                    name: 'no_results_returned',
                });
            }
            this.parent.adClient?.onQueryFetched(typeof properties === 'string'
                ? { searchTerm, mode: 'exact' }
                : properties, response);
        }
        return response;
    };
    handleGetSearchResponseItemsWithString = async (str, abortController) => {
        let searchClientRequest;
        try {
            searchClientRequest = JSON.parse(str);
            searchClientRequest = {
                limit: this.config.searchResultsPerPage,
                ...searchClientRequest,
            };
        }
        catch {
            throw new Error('Error: Query string is not valid json.');
        }
        this.parent.store.setState({ searchClientRequest });
        const response = await fetch(this.baseSearchUrl, {
            method: 'POST',
            headers: {
                Authorization: this.config.readKey,
                'Content-Type': 'application/json',
                'X-Sc-User-Id': this.userId,
                'X-Sc-Session-Id': this.parent.measureClient?.sessionId || nanoid(),
            },
            body: JSON.stringify(searchClientRequest),
            signal: abortController.signal,
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText} (Status: ${response.status})`);
        }
        return (await response.json());
    };
    handleGetSearchResponseItemsWithObject = async (properties, abortController) => {
        const searchClientRequest = {
            query: this.formatParamsForRequest(properties),
            offset: properties.offset || 0,
            limit: properties.limit || this.config.searchResultsPerPage || 20,
            ...(properties.order_by && {
                order_by: properties.order_by,
            }),
            ...(properties.sort && {
                sort: properties.sort,
            }),
        };
        this.parent.store.setState({ searchClientRequest });
        const response = await fetch(this.baseSearchUrl, {
            method: 'POST',
            headers: {
                Authorization: this.config.readKey,
                'Content-Type': 'application/json',
                'X-Sc-User-Id': this.userId,
                'X-Sc-Session-Id': this.parent.measureClient?.sessionId || nanoid(),
            },
            body: JSON.stringify(searchClientRequest),
            signal: abortController.signal,
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText} (Status: ${response.status})`);
        }
        return (await response.json());
    };
    /**
     * Builds a query object for the SearchClient request.
     * @param {properties} properties - The properties for the search.
     * @returns {SearchClientQuery} - A properly formatted SearchClient query object.
     */
    formatParamsForRequest(properties) {
        const queries = [];
        let occur = 'should';
        if (properties.facetPathsForIndexFields) {
            Object.keys(properties.facetPathsForIndexFields).forEach((fieldName) => {
                const item = properties.facetPathsForIndexFields?.[fieldName];
                if (item) {
                    occur = 'must';
                    queries.push({
                        occur: 'must',
                        exact: {
                            ctx: sanitize(item.value),
                        },
                    });
                }
            });
        }
        if (properties.rangeValueForIndexFields) {
            Object.keys(properties.rangeValueForIndexFields).forEach((fieldName) => {
                const item = properties.rangeValueForIndexFields?.[fieldName];
                if (item) {
                    occur = 'must';
                    queries.push({
                        occur: 'must',
                        exact: {
                            ctx: sanitize(item.value),
                        },
                    });
                }
            });
        }
        const searchTerm = properties.searchTerm;
        const query = properties.mode === 'fuzzy'
            ? { fuzzy: { ctx: searchTerm } }
            : {
                exact: {
                    ctx: `${searchTerm.startsWith('"') ? searchTerm : `"${searchTerm}"`}`,
                },
            };
        queries.push({
            occur: properties.mode === 'exact' ? 'must' : occur, // Valid, as 'occur' is a required property in SearchClientQuery
            ...query,
        });
        return queries;
    }
}

var zustand = {};

var vanilla$1 = {};

const createStoreImpl = (createState) => {
  let state;
  const listeners = /* @__PURE__ */ new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const getInitialState = () => initialState;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const api = { setState, getState, getInitialState, subscribe };
  const initialState = state = createState(setState, getState, api);
  return api;
};
const createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;

vanilla$1.createStore = createStore;

var react$1 = {};

var react = {exports: {}};

var react_production = {};

/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"),
  REACT_PORTAL_TYPE = Symbol.for("react.portal"),
  REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"),
  REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"),
  REACT_PROFILER_TYPE = Symbol.for("react.profiler"),
  REACT_CONSUMER_TYPE = Symbol.for("react.consumer"),
  REACT_CONTEXT_TYPE = Symbol.for("react.context"),
  REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"),
  REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"),
  REACT_MEMO_TYPE = Symbol.for("react.memo"),
  REACT_LAZY_TYPE = Symbol.for("react.lazy"),
  MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
function getIteratorFn(maybeIterable) {
  if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
  maybeIterable =
    (MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL]) ||
    maybeIterable["@@iterator"];
  return "function" === typeof maybeIterable ? maybeIterable : null;
}
var ReactNoopUpdateQueue = {
    isMounted: function () {
      return !1;
    },
    enqueueForceUpdate: function () {},
    enqueueReplaceState: function () {},
    enqueueSetState: function () {}
  },
  assign = Object.assign,
  emptyObject = {};
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}
Component.prototype.isReactComponent = {};
Component.prototype.setState = function (partialState, callback) {
  if (
    "object" !== typeof partialState &&
    "function" !== typeof partialState &&
    null != partialState
  )
    throw Error(
      "takes an object of state variables to update or a function which returns an object of state variables."
    );
  this.updater.enqueueSetState(this, partialState, callback, "setState");
};
Component.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
};
function ComponentDummy() {}
ComponentDummy.prototype = Component.prototype;
function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}
var pureComponentPrototype = (PureComponent.prototype = new ComponentDummy());
pureComponentPrototype.constructor = PureComponent;
assign(pureComponentPrototype, Component.prototype);
pureComponentPrototype.isPureReactComponent = !0;
var isArrayImpl = Array.isArray,
  ReactSharedInternals = { H: null, A: null, T: null, S: null },
  hasOwnProperty = Object.prototype.hasOwnProperty;
function ReactElement(type, key, self, source, owner, props) {
  self = props.ref;
  return {
    $$typeof: REACT_ELEMENT_TYPE,
    type: type,
    key: key,
    ref: void 0 !== self ? self : null,
    props: props
  };
}
function cloneAndReplaceKey(oldElement, newKey) {
  return ReactElement(
    oldElement.type,
    newKey,
    void 0,
    void 0,
    void 0,
    oldElement.props
  );
}
function isValidElement(object) {
  return (
    "object" === typeof object &&
    null !== object &&
    object.$$typeof === REACT_ELEMENT_TYPE
  );
}
function escape(key) {
  var escaperLookup = { "=": "=0", ":": "=2" };
  return (
    "$" +
    key.replace(/[=:]/g, function (match) {
      return escaperLookup[match];
    })
  );
}
var userProvidedKeyEscapeRegex = /\/+/g;
function getElementKey(element, index) {
  return "object" === typeof element && null !== element && null != element.key
    ? escape("" + element.key)
    : index.toString(36);
}
function noop$1() {}
function resolveThenable(thenable) {
  switch (thenable.status) {
    case "fulfilled":
      return thenable.value;
    case "rejected":
      throw thenable.reason;
    default:
      switch (
        ("string" === typeof thenable.status
          ? thenable.then(noop$1, noop$1)
          : ((thenable.status = "pending"),
            thenable.then(
              function (fulfilledValue) {
                "pending" === thenable.status &&
                  ((thenable.status = "fulfilled"),
                  (thenable.value = fulfilledValue));
              },
              function (error) {
                "pending" === thenable.status &&
                  ((thenable.status = "rejected"), (thenable.reason = error));
              }
            )),
        thenable.status)
      ) {
        case "fulfilled":
          return thenable.value;
        case "rejected":
          throw thenable.reason;
      }
  }
  throw thenable;
}
function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
  var type = typeof children;
  if ("undefined" === type || "boolean" === type) children = null;
  var invokeCallback = !1;
  if (null === children) invokeCallback = !0;
  else
    switch (type) {
      case "bigint":
      case "string":
      case "number":
        invokeCallback = !0;
        break;
      case "object":
        switch (children.$$typeof) {
          case REACT_ELEMENT_TYPE:
          case REACT_PORTAL_TYPE:
            invokeCallback = !0;
            break;
          case REACT_LAZY_TYPE:
            return (
              (invokeCallback = children._init),
              mapIntoArray(
                invokeCallback(children._payload),
                array,
                escapedPrefix,
                nameSoFar,
                callback
              )
            );
        }
    }
  if (invokeCallback)
    return (
      (callback = callback(children)),
      (invokeCallback =
        "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar),
      isArrayImpl(callback)
        ? ((escapedPrefix = ""),
          null != invokeCallback &&
            (escapedPrefix =
              invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"),
          mapIntoArray(callback, array, escapedPrefix, "", function (c) {
            return c;
          }))
        : null != callback &&
          (isValidElement(callback) &&
            (callback = cloneAndReplaceKey(
              callback,
              escapedPrefix +
                (null == callback.key ||
                (children && children.key === callback.key)
                  ? ""
                  : ("" + callback.key).replace(
                      userProvidedKeyEscapeRegex,
                      "$&/"
                    ) + "/") +
                invokeCallback
            )),
          array.push(callback)),
      1
    );
  invokeCallback = 0;
  var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
  if (isArrayImpl(children))
    for (var i = 0; i < children.length; i++)
      (nameSoFar = children[i]),
        (type = nextNamePrefix + getElementKey(nameSoFar, i)),
        (invokeCallback += mapIntoArray(
          nameSoFar,
          array,
          escapedPrefix,
          type,
          callback
        ));
  else if (((i = getIteratorFn(children)), "function" === typeof i))
    for (
      children = i.call(children), i = 0;
      !(nameSoFar = children.next()).done;

    )
      (nameSoFar = nameSoFar.value),
        (type = nextNamePrefix + getElementKey(nameSoFar, i++)),
        (invokeCallback += mapIntoArray(
          nameSoFar,
          array,
          escapedPrefix,
          type,
          callback
        ));
  else if ("object" === type) {
    if ("function" === typeof children.then)
      return mapIntoArray(
        resolveThenable(children),
        array,
        escapedPrefix,
        nameSoFar,
        callback
      );
    array = String(children);
    throw Error(
      "Objects are not valid as a React child (found: " +
        ("[object Object]" === array
          ? "object with keys {" + Object.keys(children).join(", ") + "}"
          : array) +
        "). If you meant to render a collection of children, use an array instead."
    );
  }
  return invokeCallback;
}
function mapChildren(children, func, context) {
  if (null == children) return children;
  var result = [],
    count = 0;
  mapIntoArray(children, result, "", "", function (child) {
    return func.call(context, child, count++);
  });
  return result;
}
function lazyInitializer(payload) {
  if (-1 === payload._status) {
    var ctor = payload._result;
    ctor = ctor();
    ctor.then(
      function (moduleObject) {
        if (0 === payload._status || -1 === payload._status)
          (payload._status = 1), (payload._result = moduleObject);
      },
      function (error) {
        if (0 === payload._status || -1 === payload._status)
          (payload._status = 2), (payload._result = error);
      }
    );
    -1 === payload._status && ((payload._status = 0), (payload._result = ctor));
  }
  if (1 === payload._status) return payload._result.default;
  throw payload._result;
}
var reportGlobalError =
  "function" === typeof reportError
    ? reportError
    : function (error) {
        if (
          "object" === typeof window &&
          "function" === typeof window.ErrorEvent
        ) {
          var event = new window.ErrorEvent("error", {
            bubbles: !0,
            cancelable: !0,
            message:
              "object" === typeof error &&
              null !== error &&
              "string" === typeof error.message
                ? String(error.message)
                : String(error),
            error: error
          });
          if (!window.dispatchEvent(event)) return;
        } else if (
          "object" === typeof process &&
          "function" === typeof process.emit
        ) {
          process.emit("uncaughtException", error);
          return;
        }
        console.error(error);
      };
function noop() {}
react_production.Children = {
  map: mapChildren,
  forEach: function (children, forEachFunc, forEachContext) {
    mapChildren(
      children,
      function () {
        forEachFunc.apply(this, arguments);
      },
      forEachContext
    );
  },
  count: function (children) {
    var n = 0;
    mapChildren(children, function () {
      n++;
    });
    return n;
  },
  toArray: function (children) {
    return (
      mapChildren(children, function (child) {
        return child;
      }) || []
    );
  },
  only: function (children) {
    if (!isValidElement(children))
      throw Error(
        "React.Children.only expected to receive a single React element child."
      );
    return children;
  }
};
react_production.Component = Component;
react_production.Fragment = REACT_FRAGMENT_TYPE;
react_production.Profiler = REACT_PROFILER_TYPE;
react_production.PureComponent = PureComponent;
react_production.StrictMode = REACT_STRICT_MODE_TYPE;
react_production.Suspense = REACT_SUSPENSE_TYPE;
react_production.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE =
  ReactSharedInternals;
react_production.act = function () {
  throw Error("act(...) is not supported in production builds of React.");
};
react_production.cache = function (fn) {
  return function () {
    return fn.apply(null, arguments);
  };
};
react_production.cloneElement = function (element, config, children) {
  if (null === element || void 0 === element)
    throw Error(
      "The argument must be a React element, but you passed " + element + "."
    );
  var props = assign({}, element.props),
    key = element.key,
    owner = void 0;
  if (null != config)
    for (propName in (void 0 !== config.ref && (owner = void 0),
    void 0 !== config.key && (key = "" + config.key),
    config))
      !hasOwnProperty.call(config, propName) ||
        "key" === propName ||
        "__self" === propName ||
        "__source" === propName ||
        ("ref" === propName && void 0 === config.ref) ||
        (props[propName] = config[propName]);
  var propName = arguments.length - 2;
  if (1 === propName) props.children = children;
  else if (1 < propName) {
    for (var childArray = Array(propName), i = 0; i < propName; i++)
      childArray[i] = arguments[i + 2];
    props.children = childArray;
  }
  return ReactElement(element.type, key, void 0, void 0, owner, props);
};
react_production.createContext = function (defaultValue) {
  defaultValue = {
    $$typeof: REACT_CONTEXT_TYPE,
    _currentValue: defaultValue,
    _currentValue2: defaultValue,
    _threadCount: 0,
    Provider: null,
    Consumer: null
  };
  defaultValue.Provider = defaultValue;
  defaultValue.Consumer = {
    $$typeof: REACT_CONSUMER_TYPE,
    _context: defaultValue
  };
  return defaultValue;
};
react_production.createElement = function (type, config, children) {
  var propName,
    props = {},
    key = null;
  if (null != config)
    for (propName in (void 0 !== config.key && (key = "" + config.key), config))
      hasOwnProperty.call(config, propName) &&
        "key" !== propName &&
        "__self" !== propName &&
        "__source" !== propName &&
        (props[propName] = config[propName]);
  var childrenLength = arguments.length - 2;
  if (1 === childrenLength) props.children = children;
  else if (1 < childrenLength) {
    for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)
      childArray[i] = arguments[i + 2];
    props.children = childArray;
  }
  if (type && type.defaultProps)
    for (propName in ((childrenLength = type.defaultProps), childrenLength))
      void 0 === props[propName] &&
        (props[propName] = childrenLength[propName]);
  return ReactElement(type, key, void 0, void 0, null, props);
};
react_production.createRef = function () {
  return { current: null };
};
react_production.forwardRef = function (render) {
  return { $$typeof: REACT_FORWARD_REF_TYPE, render: render };
};
react_production.isValidElement = isValidElement;
react_production.lazy = function (ctor) {
  return {
    $$typeof: REACT_LAZY_TYPE,
    _payload: { _status: -1, _result: ctor },
    _init: lazyInitializer
  };
};
react_production.memo = function (type, compare) {
  return {
    $$typeof: REACT_MEMO_TYPE,
    type: type,
    compare: void 0 === compare ? null : compare
  };
};
react_production.startTransition = function (scope) {
  var prevTransition = ReactSharedInternals.T,
    currentTransition = {};
  ReactSharedInternals.T = currentTransition;
  try {
    var returnValue = scope(),
      onStartTransitionFinish = ReactSharedInternals.S;
    null !== onStartTransitionFinish &&
      onStartTransitionFinish(currentTransition, returnValue);
    "object" === typeof returnValue &&
      null !== returnValue &&
      "function" === typeof returnValue.then &&
      returnValue.then(noop, reportGlobalError);
  } catch (error) {
    reportGlobalError(error);
  } finally {
    ReactSharedInternals.T = prevTransition;
  }
};
react_production.unstable_useCacheRefresh = function () {
  return ReactSharedInternals.H.useCacheRefresh();
};
react_production.use = function (usable) {
  return ReactSharedInternals.H.use(usable);
};
react_production.useActionState = function (action, initialState, permalink) {
  return ReactSharedInternals.H.useActionState(action, initialState, permalink);
};
react_production.useCallback = function (callback, deps) {
  return ReactSharedInternals.H.useCallback(callback, deps);
};
react_production.useContext = function (Context) {
  return ReactSharedInternals.H.useContext(Context);
};
react_production.useDebugValue = function () {};
react_production.useDeferredValue = function (value, initialValue) {
  return ReactSharedInternals.H.useDeferredValue(value, initialValue);
};
react_production.useEffect = function (create, deps) {
  return ReactSharedInternals.H.useEffect(create, deps);
};
react_production.useId = function () {
  return ReactSharedInternals.H.useId();
};
react_production.useImperativeHandle = function (ref, create, deps) {
  return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
};
react_production.useInsertionEffect = function (create, deps) {
  return ReactSharedInternals.H.useInsertionEffect(create, deps);
};
react_production.useLayoutEffect = function (create, deps) {
  return ReactSharedInternals.H.useLayoutEffect(create, deps);
};
react_production.useMemo = function (create, deps) {
  return ReactSharedInternals.H.useMemo(create, deps);
};
react_production.useOptimistic = function (passthrough, reducer) {
  return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
};
react_production.useReducer = function (reducer, initialArg, init) {
  return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
};
react_production.useRef = function (initialValue) {
  return ReactSharedInternals.H.useRef(initialValue);
};
react_production.useState = function (initialState) {
  return ReactSharedInternals.H.useState(initialState);
};
react_production.useSyncExternalStore = function (
  subscribe,
  getSnapshot,
  getServerSnapshot
) {
  return ReactSharedInternals.H.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
};
react_production.useTransition = function () {
  return ReactSharedInternals.H.useTransition();
};
react_production.version = "19.0.0";

{
  react.exports = react_production;
}

var React = react.exports;
var vanilla = vanilla$1;

const identity = (arg) => arg;
function useStore(api, selector = identity) {
  const slice = React.useSyncExternalStore(
    api.subscribe,
    () => selector(api.getState()),
    () => selector(api.getInitialState())
  );
  React.useDebugValue(slice);
  return slice;
}
const createImpl = (createState) => {
  const api = vanilla.createStore(createState);
  const useBoundStore = (selector) => useStore(api, selector);
  Object.assign(useBoundStore, api);
  return useBoundStore;
};
const create = (createState) => createState ? createImpl(createState) : createImpl;

react$1.create = create;
react$1.useStore = useStore;

(function (exports) {

var vanilla = vanilla$1;
var react = react$1;



Object.keys(vanilla).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return vanilla[k]; }
	});
});
Object.keys(react).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return react[k]; }
	});
});
}(zustand));

const DEBOUNCE_DELAY = 1000;
class SummaryClient {
    set;
    get;
    abortController;
    timeout;
    constructor(get, set) {
        this.get = get;
        this.set = set;
    }
    streamSummaryData() {
        const begin = async () => {
            const state = this.get();
            const config = state.core?.config;
            if (!config) {
                console.error('Could not stream summary data, no config found.');
                return;
            }
            if (!config.cortexURL) {
                console.error('Could not stream summary data, cortexURL was not specified in the config.');
                return;
            }
            const indexName = state.core?.config.indexName;
            if (!state.hasSummaryBox || !indexName) {
                return;
            }
            this.abortController?.abort('A newer request has replaced this one.');
            this.abortController = new AbortController();
            this.set({
                isSummaryLoading: true,
                summary: '',
            });
            const endpointUrl = `${config.cortexURL.replace(/\/$/, '')}/api/search/summary`;
            try {
                const fetchResponse = await fetch(endpointUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: state.core?.config.readKey || '',
                    },
                    body: JSON.stringify({
                        searchQuery: state.searchClientRequest,
                        summaryInstructionsPrompt: state.core?.config.summaryInstructionsPrompt,
                        indexName: indexName,
                        endpointUrl: state.core?.config.endpointURL,
                    }),
                    signal: this.abortController.signal,
                });
                if (!fetchResponse) {
                    throw new Error('Invalid fetch response');
                }
                if (!fetchResponse.body) {
                    throw new Error('Invalid fetch response');
                }
                if (!fetchResponse.ok) {
                    if (fetchResponse.status === 403) {
                        console.warn('Please contact Searchcraft to enable AI summaries with your account');
                        this.set({
                            isSummaryLoading: false,
                            isSummaryNotEnabled: true,
                        });
                        return;
                    }
                    throw new Error(`HTTP ${fetchResponse.status}`);
                }
                const reader = fetchResponse.body.getReader();
                const decoder = new TextDecoder();
                let finishedReading = false;
                do {
                    const { done, value } = await reader.read();
                    finishedReading = done;
                    const chunk = decoder.decode(value, { stream: true });
                    this.set((state) => ({
                        isSummaryLoading: false,
                        summary: `${state.summary}${chunk}`,
                    }));
                } while (!finishedReading);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(error.message);
                }
                this.set({
                    isSummaryLoading: false,
                });
            }
        };
        const delay = this.get().core?.config.summaryDebounceDelay || DEBOUNCE_DELAY;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => begin(), delay);
    }
}

const initialSearchcraftStateValues = {
    adClientResponseItems: [],
    cachedAdClientResponseItems: [],
    core: undefined,
    hotkey: 'k',
    hotkeyModifier: 'meta',
    facetPathsForIndexFields: {},
    isPopoverVisible: false,
    isSearchInProgress: false,
    rangeValueForIndexFields: {},
    searchTerm: '',
    searchMode: 'fuzzy',
    searchClientRequest: undefined,
    searchClientRequestProperties: undefined,
    searchClientResponseItems: [],
    cachedSearchClientResponseItems: [],
    searchResponseTimeTaken: undefined,
    searchResponseFacetPrime: undefined,
    supplementalFacetPrime: undefined,
    searchResultsCount: 0,
    searchResultsPerPage: 20,
    searchResultsPage: 1,
    sortType: undefined,
    orderByField: undefined,
    summary: '',
    hasSummaryBox: false,
    summaryClient: undefined,
    isSummaryLoading: false,
    isSummaryNotEnabled: false,
};
// const logger = new Logger({ logLevel: LogLevel.NONE });
const existingStores = {};
/**
 * This is a factory function for creating new searchcraft stores.
 *
 * Searchcraft Stores contain the state information used by a SearchcraftCore instance.
 *
 * This factory function only needs to be called when a new SearchcraftCore is instantiated.
 * @returns
 */
const createSearchcraftStore = (searchcraftId, initialState = {}) => {
    const id = searchcraftId || DEFAULT_CORE_INSTANCE_ID;
    if (existingStores[id]) {
        existingStores[id].setState(initialState);
        return existingStores[id];
    }
    const newStore = zustand.createStore((set, get) => {
        const functions = {
            addFacetPathsForIndexField: (facetPaths) => set((state) => ({
                facetPathsForIndexFields: {
                    ...state.facetPathsForIndexFields,
                    [facetPaths.fieldName]: facetPaths,
                },
            })),
            addRangeValueForIndexField: (rangeValue) => set((state) => ({
                rangeValueForIndexFields: {
                    ...state.rangeValueForIndexFields,
                    [rangeValue.fieldName]: rangeValue,
                },
            })),
            removeFacetPathsForIndexField: (fieldName) => set((state) => {
                const currentPaths = state.facetPathsForIndexFields;
                delete currentPaths[fieldName];
                return {
                    facetPathsForIndexFields: {
                        ...currentPaths,
                    },
                };
            }),
            removeRangeValueForIndexField: (fieldName) => set((state) => {
                const currentValues = state.rangeValueForIndexFields;
                delete currentValues[fieldName];
                return {
                    rangeValueForIndexFields: {
                        ...currentValues,
                    },
                };
            }),
            resetSearchValues: () => {
                const state = get();
                state.core?.searchClient?.abortRequests();
                set({
                    searchTerm: '',
                    searchResultsPage: 1,
                    searchClientResponseItems: [...state.cachedSearchClientResponseItems],
                    adClientResponseItems: [...state.cachedAdClientResponseItems],
                });
            },
            search: async (options) => {
                const state = get();
                if (!state.core) {
                    throw new Error('Searchcraft instance is not initialized.');
                }
                if (state.core.config.cortexURL && !options?.skipSummary) {
                    state.summaryClient?.streamSummaryData();
                }
                if (!state.searchTerm.trim()) {
                    state.core?.searchClient?.abortRequests();
                    set({
                        searchClientResponseItems: [
                            ...state.cachedSearchClientResponseItems,
                        ],
                        adClientResponseItems: [...state.cachedAdClientResponseItems],
                        searchResultsCount: 0,
                        searchResultsPage: 1,
                        searchTerm: '',
                    });
                    return;
                }
                set({ isSearchInProgress: true });
                const searchClientRequestProperites = {
                    searchTerm: state.searchTerm,
                    mode: state.searchMode,
                    sort: state.sortType,
                    order_by: state.orderByField,
                    facetPathsForIndexFields: state.facetPathsForIndexFields,
                    rangeValueForIndexFields: state.rangeValueForIndexFields,
                    offset: state.searchResultsPerPage
                        ? state.searchResultsPerPage * (state.searchResultsPage - 1)
                        : 0,
                    limit: state.searchResultsPerPage,
                };
                state.core.getResponseItems({
                    requestProperties: searchClientRequestProperites,
                    shouldCacheResultsForEmptyState: false,
                });
            },
            setPopoverVisibility: (isVisible) => set({
                isPopoverVisible: isVisible,
            }),
            setSearchMode: (mode) => set({ searchMode: mode }),
            setSortOrder: ({ orderByField, sortType }) => set({ sortType, orderByField }),
            setSearchTerm: (searchTerm) => {
                const state = get();
                if (searchTerm.length === 0) {
                    state.core?.handleInputCleared();
                }
                /**
                 * When a new searchTerm is set, also reset the sort type, search mode
                 */
                set({
                    searchTerm,
                    searchResultsPage: 1,
                    ...(searchTerm.trim().length === 0 && {
                        searchMode: 'fuzzy',
                        sortType: null,
                        orderByField: null,
                        searchClientResponseItems: [
                            ...state.cachedSearchClientResponseItems,
                        ],
                        adClientResponseItems: [...state.cachedAdClientResponseItems],
                    }),
                });
            },
            setSearchResultsCount: (count) => set({ searchResultsCount: count }),
            setSearchResultsPage: async (page) => {
                set({ searchResultsPage: page });
                await functions.search({ skipSummary: true });
            },
            setSearchResultsPerPage: async (perPage) => {
                set({ searchResultsPerPage: perPage });
                await functions.search({ skipSummary: true });
            },
            setHotKeyAndHotKeyModifier: (hotkey, hotkeyModifier) => {
                const { hotkey: initialHotkey, hotkeyModifier: initialHotkeyModifier } = initialSearchcraftStateValues;
                set({
                    hotkey: hotkey || initialHotkey,
                    hotkeyModifier: hotkeyModifier || initialHotkeyModifier,
                });
            },
        };
        const stateObject = {
            ...initialSearchcraftStateValues,
            ...initialState,
            ...functions,
            ...{
                summaryClient: new SummaryClient(get, set),
            },
        };
        return stateObject;
    });
    existingStores[id] = newStore;
    return newStore;
};

/**
 * Javascript Class providing the functionality to interact with the Searchcraft BE
 */
class SearchcraftCore {
    store;
    config;
    measureClient;
    searchClient;
    adClient;
    userId;
    requestTimeout;
    subscriptionEvents = {};
    /**
     * @param config The SearchcraftConfig object for this Searchcraft instance.
     * @param sdkInfo The SDK info object for this searchcraft instance
     * @param searchcraftId The identifier to use to reference this instance of SearchcraftCore.
     */
    constructor(config, sdkInfo, searchcraftId) {
        if (!config.endpointURL) {
            throw new Error('SDK Configuration Error: endpointURL not specified.');
        }
        if (!config.readKey) {
            throw new Error('SDK Configuration Error: readKey not specified.');
        }
        if (!config.indexName && !config.federationName) {
            throw new Error('SDK Configuration Error: Either indexName or federationName must be specified.');
        }
        if (config.indexName && config.federationName) {
            throw new Error('SDK Configuration Error: Cannot specify both indexName and federationName. Please specify only one.');
        }
        this.config = {
            ...config,
            // Strips off the trailing '/' from an endpointURL if one is accidentally added
            endpointURL: removeTrailingSlashFromURL(config.endpointURL),
        };
        this.userId = '';
        if (typeof window !== 'undefined' &&
            typeof customElements !== 'undefined' &&
            sdkInfo.sdkName === '@searchcraft/javascript-sdk' &&
            globalThis.__scDefineCustomElements__) {
            globalThis.__scDefineCustomElements__();
        }
        this.store = createSearchcraftStore(searchcraftId, {
            core: this,
            searchResultsPerPage: config.searchResultsPerPage || 20,
        });
        registry.addCoreInstance(this, searchcraftId);
        (async (config) => {
            if (typeof window !== 'undefined') {
                await this.initClients(config, sdkInfo);
            }
            if (config.initialQuery) {
                this.getResponseItems({
                    requestProperties: config.initialQuery,
                    shouldCacheResultsForEmptyState: true,
                });
            }
        })(this.config);
    }
    async initClients(config, sdkInfo) {
        let userId = this.config.measureUserIdentifier;
        if (!userId) {
            const fingerprint = await g();
            userId = fingerprint;
        }
        this.measureClient = new MeasureClient(config, sdkInfo, userId);
        this.searchClient = new SearchClient(this, config, userId);
        if (config.customAdConfig) {
            this.adClient = new CustomAdClient(config);
        }
        this.emitEvent('initialized', {
            name: 'initialized',
        });
    }
    emitEvent(eventName, event) {
        this.subscriptionEvents[eventName]?.forEach((callback) => {
            callback(event);
        });
    }
    subscribe(eventName, callback) {
        if (!this.subscriptionEvents[eventName]) {
            this.subscriptionEvents[eventName] = [];
        }
        this.subscriptionEvents[eventName].push(callback);
        return () => {
            this.subscriptionEvents[eventName] = this.subscriptionEvents[eventName].filter((cb) => cb !== callback);
        };
    }
    /**
     * Called when a `<searchcraft-ad>` component is rendered
     */
    handleAdContainerRendered(data) {
        this.adClient?.onAdContainerRendered(data);
        // Emits ad_container_rendered event.
        this.emitEvent('ad_container_rendered', {
            name: 'ad_container_rendered',
            data: {
                adContainerId: data.adContainerId,
                searchTerm: data.searchTerm,
            },
        });
    }
    /**
     * Called when a `<searchcraft-ad>` is viewed
     */
    handleAdContainerViewed(data) {
        this.adClient?.onAdContainerViewed(data);
        // Emits ad_container_rendered event.
        this.emitEvent('ad_container_viewed', {
            name: 'ad_container_viewed',
            data: {
                adContainerId: data.adContainerId,
                searchTerm: data.searchTerm,
            },
        });
    }
    /**
     * Perform various actions when the input is cleared
     */
    handleInputCleared() {
        this.emitEvent('input_cleared', {
            name: 'input_cleared',
        });
        this.adClient?.onInputCleared();
    }
    getResponseItems = (props) => {
        const getResponseItemsDebounced = async () => {
            /**
             * Handles search response from the search client.
             */
            (async () => {
                if (!this.searchClient) {
                    console.error('Search client was not initialized.');
                    return;
                }
                let response;
                try {
                    response = await this.searchClient.getSearchResponseItems(props.requestProperties, false);
                }
                catch (error) {
                    Logger.info(`Search request error: ${error}`);
                    return;
                }
                if (!response) {
                    Logger.info('Search request error: Search response was undefined');
                    return;
                }
                const items = (response.data.hits || [])
                    .filter((hit) => !!hit.doc)
                    .map((hit) => ({
                    id: nanoid(),
                    document: hit.doc || { id: -1 },
                    source_index: hit.source_index,
                    type: 'SearchDocument',
                }));
                /**
                 * Handles sending a supplemental search request (For getting top-level facet counts)
                 */
                let supplementalResponse;
                if (typeof props.requestProperties === 'object') {
                    if (props.requestProperties.facetPathsForIndexFields &&
                        Object.keys(props.requestProperties.facetPathsForIndexFields)
                            .length > 0) {
                        const { facetPathsForIndexFields: _, ...supplementalRequestProperties } = props.requestProperties;
                        try {
                            supplementalResponse =
                                await this?.searchClient?.getSearchResponseItems(supplementalRequestProperties, true);
                        }
                        catch (error) {
                            Logger.info(`Search request error: ${error}`);
                            return;
                        }
                    }
                }
                this.store.setState({
                    isSearchInProgress: false,
                    searchClientResponseItems: items,
                    searchResponseTimeTaken: response.data.time_taken,
                    searchResultsCount: response.data.count,
                    searchResponseFacetPrime: response.data.facets,
                    supplementalFacetPrime: supplementalResponse?.data.facets,
                    searchClientRequestProperties: props.requestProperties,
                    ...(props.shouldCacheResultsForEmptyState && {
                        cachedSearchClientResponseItems: items,
                    }),
                });
            })();
            /**
             * Handles ad response from the ad client.
             */
            (async () => {
                if (this.adClient && typeof props.requestProperties !== 'string') {
                    const items = await this.adClient.getAds(props.requestProperties);
                    this.store.setState({
                        adClientResponseItems: items,
                        ...(props.shouldCacheResultsForEmptyState && {
                            cachedAdClientResponseItems: items,
                        }),
                    });
                }
            })();
        };
        clearTimeout(this.requestTimeout);
        if (this.config.searchDebounceDelay) {
            this.requestTimeout = setTimeout(getResponseItemsDebounced, this.config.searchDebounceDelay);
        }
        else {
            getResponseItemsDebounced();
        }
    };
}

const name = "@searchcraft/javascript-sdk";
const version = "0.12.0";

/**
 * @fileoverview entry point for your component library
 *
 * This is the entry point for your component library. Use this file to export utilities,
 * constants or data structure that accompany your components.
 *
 * DO NOT use this file to export your components. Instead, use the recommended approaches
 * to consume components of this package as outlined in the `README.md`.
 */
/**
 * The consumer-facing `Searchcraft` class.
 */
class Searchcraft extends SearchcraftCore {
    constructor(config, searchcraftId = undefined) {
        super(config, {
            sdkName: name,
            sdkVersion: version,
        }, searchcraftId);
    }
}

export { Searchcraft, SearchcraftCore };

//# sourceMappingURL=index.js.map
export { defineCustomElements } from './defineCustomElements.js';
