!function(o,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.ajaxManager=t():o.ajaxManager=t()}(this,function(){return function(o){function t(n){if(e[n])return e[n].exports;var r=e[n]={i:n,l:!1,exports:{}};return o[n].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var e={};return t.m=o,t.c=e,t.d=function(o,e,n){t.o(o,e)||Object.defineProperty(o,e,{configurable:!1,enumerable:!0,get:n})},t.n=function(o){var e=o&&o.__esModule?function(){return o.default}:function(){return o};return t.d(e,"a",e),e},t.o=function(o,t){return Object.prototype.hasOwnProperty.call(o,t)},t.p="",t(t.s=0)}([function(o,t,e){"use strict";function n(o){return o&&o.__esModule?o:{default:o}}Object.defineProperty(t,"__esModule",{value:!0});var r=e(1);Object.defineProperty(t,"default",{enumerable:!0,get:function(){return n(r).default}})},function(o,t,e){"use strict";(function(o){function e(o){if(Array.isArray(o)){for(var t=0,e=Array(o.length);t<o.length;t++)e[t]=o[t];return e}return Array.from(o)}function n(o){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},a=r.__apiConfig__[o];a||(a={});var i=a.url||n.url||t.url||e.url||"",u=r.__apiRoot__||n.__apiRoot||t.__apiRoot||e.__apiRoot||"";return a.ignoreGlobalApiRoot||n.__ignoreGlobalApiRoot||t.__ignoreGlobalApiRoot||e.__ignoreGlobalApiRoot?i:u+i}Object.defineProperty(t,"__esModule",{value:!0});var r=function(){return window||o}();r.__apiCount__=0,r.__apiCounter={add:function(){r.__apiCount__++},remove:function(){r.__apiCount__--},get:function(){return r.__apiCount__}},r.__apiConfig__||(r.__apiConfig__={}),r.__apiRoot__||(r.__apiRoot__=null);var a=function(){function o(o,t){for(var n=0;n<o.length;n++)"function"==typeof o[n]&&o[n].apply(o,e(t))}function t(o,t){"function"==typeof o&&o.apply(void 0,e(t))}function a(o,t){for(var n=0;n<p[o].length;n++){var r;"function"==typeof p[o][n]&&(r=p[o])[n].apply(r,e(t))}}var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],u=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},_=arguments[2],l=_,f={};i.forEach(function(o,t){for(var e in o){var n=o[e];e in f&&console.warn('ajaxManager: api in models should not have same name "'+e+'".'),f[e]=n}f.__global||(f.__global={}),f.__default||(f.__default={})});var c={beforeSend:[],success:[],error:[],complete:[]},p={ajaxStart:[],ajaxStop:[]},s={};for(var d in f)!function(e){/^__/g.test(e)||(s[e]=function(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},_=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],s=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];Object.keys(c).map(function(o){u[o]&&c[o].push(u[o]),f.__global[o]&&c[o].push(f.__global[o])}),Object.keys(p).map(function(o){u[o]&&p[o].push(u[o]),f.__global[o]&&p[o].push(f.__global[o])});var d={beforeSend:null,success:null,error:null,complete:null};Object.keys(d).map(function(o){d[o]=i[o]||f[e][o]});var g=Object.assign({},u.data||{},f.__global.data||{},f[e].data||{},i.data||{}),b=Object.assign({},f.__default||{},u||{},f[e]||{},i,f.__global,{url:n(e,f[e],u,i),data:g,beforeSend:function(e){_&&(r.__apiCounter.add(),a("ajaxStart",[e])),s&&o(c.beforeSend,[e]),t(d.beforeSend,[e])},success:function(e,n,r){s&&o(c.success,[e,n,r]),t(d.success,[e,n,r])},error:function(e,n,r){s&&o(c.error,[e,n,r]),t(d.error,[e,n,r])},complete:function(e,n){_&&(r.__apiCounter.remove(),a("ajaxStop",[e,n])),s&&o(c.complete,[e,n]),t(d.complete,[e,n])}});return r.__apiConfig__&&r.__apiConfig__[e]&&r.__apiConfig__[e].type&&(b=Object.assign({},b,r.__apiConfig__[e])),b.method&&"post"===b.method.toLowerCase().trim()&&b.contentType&&"application/json"===b.contentType.toLowerCase().trim()&&(b.data=JSON.stringify(g)),l.ajax(b)})}(d);return s};t.default=a}).call(t,e(2))},function(o,t,e){"use strict";var n,r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o};n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(o){"object"===("undefined"==typeof window?"undefined":r(window))&&(n=window)}o.exports=n}])});