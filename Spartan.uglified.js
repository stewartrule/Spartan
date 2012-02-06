((function(){var a=Array.prototype.slice,b=Array.prototype.indexOf||function(a){for(var b=0,c=this.length;b<c;b++)if(b in this&&this[b]===a)return b;return-1};(function(c,d){var e,f,g,h,i,j,k,l,m,n,o;return n=function(a){return a.replace(/<\/?[^>]+>/gi,"")},o=function(a){return a.replace(/\s+/g," ")},k=function(a){return a||(a="div"),d.createElement(a)},l=function(a){return d.createTextNode(a)},h={remove:function(){var a;a=this.parentNode;if(a)return a.removeChild(this)},text:function(a){return this.innerHTML="",this.appendChild(l(n(""+a)))},empty:function(){while(this.firstChild)this.removeChild(this.firstChild);this.innerHTML=""},value:function(a){return this.value=a},html:function(a){return this.innerHTML=a},getHtml:function(){return this.innerHTML},getValue:function(){return this.value},getText:function(){return n(this.innerHTML)},addClass:function(a){a&&a.length&&(this.className?this.className=this.className+" "+a:this.className=a)},removeClass:function(a){var b,c,d,e;c=this.className||"",b=c.split(/\s+/),e=[],d=0;while(d<b.length)b[d]!==a&&e.push(b[d]),d++;return this.className=e.join(" ")},hasClass:function(a){var b,c,d;c=this.className||"",b=c.split(/\s+/),d=0;while(d<b.length){if(b[d]===a)return!0;d++}return!1},hide:function(){var a;return a=e.getStyle(this,"display"),a!=="none"&&(this.$oldDisplay=a),this.style.display="none"},show:function(){return this.style.display=this.$oldDisplay||""},css:function(a){var b;for(b in a)a.hasOwnProperty(b)&&(this.style[b]=a[b])},bind:function(a,b,c){this.addEventListener(a,b,!!c)},unbind:function(a,b){this.removeEventListener(a,b,!1)},click:function(a){e.support.touch?(h.bind.call(this,"click",function(a){return a.preventDefault()}),h.bind.call(this,"touchstart",a)):h.bind.call(this,"click",a)},attr:function(a,b){this.setAttribute(a,b)},attributes:function(a){var b;for(b in a)a.hasOwnProperty(b)&&h.attr.call(this,b,a[b])},data:function(a,b){h.attr.call(this,"data-"+a,b)},isChecked:function(){return this.checked}},i=function(){function c(b,e){var f,g,h=this;this.context=e||d,f=[],b.nodeType?f=[b]:b.unshift&&b.join?f=b:b.constructor===String&&(this.context.nodeType?(g=this.context.querySelectorAll(b),f=a.call(g)):this.context.constructor===c&&this.context.each(function(c,d){return g=d.querySelectorAll(b),f=f.concat(a.call(g))})),this._nodes=f}var b;c.prototype._execute=function(a,b){var c,d,e,f;f=this._nodes;for(c=0,e=f.length;c<e;c++)d=f[c],a.apply(d,b);return this},c.prototype._collect=function(a,b,c){var d,e,f,g,h;f=[],h=this._nodes;for(d=0,g=h.length;d<g;d++)e=h[d],f.push(a.apply(e,c));return b?f.join(""):f},c.prototype._check=function(a,b){var c,d,e,f,g;g=this._nodes;for(c=0,f=g.length;c<f;c++){d=g[c],e=a.apply(d,b);if(!e)return!1}return!0},c.prototype.length=function(){return this._nodes.length},c.prototype.get=function(a){return this._nodes[a]?this._nodes[a]:null},c.prototype.find=function(b){var c,d,f,g,h,i;d=[],i=this._nodes;for(g=0,h=i.length;g<h;g++)c=i[g],f=c.querySelectorAll(b),d=d.concat(a.call(f));return e(d)},c.prototype.each=function(a){var b,c,d,e;e=this._nodes;for(b=0,d=e.length;b<d;b++)c=e[b],a.call(c,b,c);return this},c.prototype.delegate=function(a,b){var c=this;return d.addEventListener(a,function(a){var d,e,f,g;g=c._nodes;for(e=0,f=g.length;e<f;e++){d=g[e];if(a.target&&d===a.target){b.call(d,a);return}}})},c.prototype._add=function(a,b){var c,d,e,f,g,h,i,k;d=this._nodes,f=d.length>1;for(g=0,i=d.length;g<i;g++){e=d[g];for(h=0,k=a.length;h<k;h++)c=a[h],f&&(c=j(c)),b(e,m(c))}return this},c.prototype.replaceWith=function(){var a;return a=[],this._add(arguments,function(b,c){var d;d=b.parentNode;if(d)return d.insertBefore(c,b),d.removeChild(b),a.push(c)}),e(a)},c.prototype.prepend=function(){return this._add(arguments,function(a,b){return a.insertBefore(b,a.firstChild)})},c.prototype.append=function(){return this._add(arguments,function(a,b){return a.appendChild(b)})},c.method=function(b){var c,d;c=h[b],d=this.prototype,b.indexOf("get")===0?d[b]=function(){var b,d;return d=arguments[0],b=2<=arguments.length?a.call(arguments,1):[],d==null&&(d=!1),this._collect(c,d,b)}:b.indexOf("is")===0||b.indexOf("has")===0?d[b]=function(){var b;return b=1<=arguments.length?a.call(arguments,0):[],this._check(c,b)}:d[b]=function(){var b;return b=1<=arguments.length?a.call(arguments,0):[],this._execute(c,b)}};for(b in h)h.hasOwnProperty(b)&&c.method(b);return c}(),j=function(a){return a.nodeType?a.cloneNode(!0):a.constructor===i?a.get(0).cloneNode(!0):a},m=function(a){if(a.nodeType)return a;if(a.constructor===String)return l(a);if(a.constructor===i)return a.get(0)},e=function(a,b){return b||(b=d),new i(a,b)},e.fn=function(a,b){return h[a]=b,i.assign(a)},e.getStyle=function(a,b){var c,e;return a.style[b]?a.style[b]:a.currentStyle?a.currentStyle[b]:(c=d.defaultView,c&&c.getComputedStyle?(b=b.replace(/([A-Z])/g,"-$1"),b=b.toLowerCase(),e=c.getComputedStyle(a,""),e.getPropertyValue(b)):null)},e.el=function(a,b,c){var d;return b==null&&(b=!1),c==null&&(c={}),d=e(k(a)),d.addClass(b),d.attributes(c)},e.extend=function(a,b){var c;for(c in b)a[c]=b[c]},function(){var a,d,f,g;return e.support={},f=c.navigator,a=f.appVersion,g=f.userAgent,d=/like Mac OS X/.test(g),e.extend(e.support,{isIpad:/ipad/gi.test(a),isIphone:/iphone/gi.test(a),isAndroid:/android/gi.test(a),isOrientationAware:c.onorientationchange,isHashChangeAware:c.onhashchange,isStandalone:!!f.standalone,touch:c.ontouchstart,has3d:c.WebKitCSSMatrix&&b.call(new WebKitCSSMatrix,"m11")>=0,isIOS:d,isIOS5:d&&/CPU OS 5_\d/i.test(g)})}(),g=[],f=function(){var a,b,c;for(b=0,c=g.length;b<c;b++)a=g[b],a();g=null,d.removeEventListener("DOMContentLoaded",f,!1)},e.ready=function(a){g.length||d.addEventListener("DOMContentLoaded",f,!1),g.push(a)},c.$=c.Spartan=e})(window,document)})).call(this)