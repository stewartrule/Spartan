(function() {
  var __slice = Array.prototype.slice,
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  (function(window, document) {
    var $, DOMReady, DOMReadyCallbacks, FN, Spartan, createElement, createTextNode, ensureDomNode, striptags, trim;
    striptags = function(str) {
      return str.replace(/<\/?[^>]+>/gi, '');
    };
    trim = function(str) {
      return str.replace(/\s+/g, ' ');
    };
    createElement = function(tag) {
      tag || (tag = 'div');
      return document.createElement(tag);
    };
    createTextNode = function(txt) {
      return document.createTextNode(txt);
    };
    FN = {
      remove: function() {
        var p;
        p = this.parentNode;
        if (p) return p.removeChild(this);
      },
      text: function(t) {
        FN.empty.call(this);
        return this.appendChild(createTextNode(t));
      },
      empty: function() {
        while (this.firstChild) {
          this.removeChild(this.firstChild);
        }
        return this.innerHTML = "";
      },
      value: function(v) {
        return this.value = v;
      },
      html: function(html) {
        return this.innerHTML = html;
      },
      getHtml: function() {
        return this.innerHTML;
      },
      getValue: function() {
        return this.value;
      },
      getText: function() {
        return striptags(this.innerHTML);
      },
      addClass: function(name) {
        if (name && name.length) {
          if (!this.className) {
            return this.className = name;
          } else {
            return this.className = this.className + " " + name;
          }
        }
      },
      removeClass: function(name) {
        var classes, curVal, i, n;
        curVal = this.className || "";
        classes = curVal.split(/\s+/);
        n = [];
        i = 0;
        while (i < classes.length) {
          if (classes[i] !== name) n.push(classes[i]);
          i++;
        }
        return this.className = n.join(" ");
      },
      hasClass: function(name) {
        var classes, curVal, i;
        curVal = this.className || "";
        classes = curVal.split(/\s+/);
        i = 0;
        while (i < classes.length) {
          if (classes[i] === name) return true;
          i++;
        }
        return false;
      },
      hide: function() {
        var curDisplay;
        curDisplay = $.getStyle(this, "display");
        if (curDisplay !== "none") this.$oldDisplay = curDisplay;
        return this.style.display = "none";
      },
      show: function() {
        return this.style.display = this.$oldDisplay || "";
      },
      style: function(prop, val) {
        return this.style[prop] = val;
      },
      css: function(styles) {
        var prop, _results;
        _results = [];
        for (prop in styles) {
          if (styles.hasOwnProperty(prop)) {
            _results.push(this.style[prop] = styles[prop]);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      },
      bind: function(type, callback, capture) {
        capture = Boolean(capture);
        return this.addEventListener(type, callback, capture);
      },
      unbind: function(type, callback) {
        return this.removeEventListener(type, callback, false);
      },
      click: function(callback) {
        if ($.support.touch) {
          FN.bind.call(this, 'click', function(e) {
            return e.preventDefault();
          });
          return FN.bind.call(this, 'touchstart', callback);
        } else {
          return FN.bind.call(this, 'click', callback);
        }
      },
      attr: function(key, val) {
        return this.setAttribute(key, val);
      },
      attributes: function(propList) {
        var prop;
        for (prop in propList) {
          if (propList.hasOwnProperty(prop)) {
            FN.attr.call(this, prop, propList[prop]);
          }
        }
      },
      data: function(name, val) {
        return FN.attr.call(this, "data-" + name, val);
      },
      isChecked: function() {
        return this.checked;
      }
    };
    Spartan = (function() {
      var method;

      function Spartan(selector, context) {
        var query,
          _this = this;
        this.context = context != null ? context : document;
        this._nodes = [];
        if (selector.nodeType) {
          this._nodes = [selector];
        } else if (selector.unshift && selector.join) {
          this._nodes = selector;
        } else if (selector.constructor === String) {
          if (this.context.nodeType) {
            query = this.context.querySelectorAll(selector);
            this._nodes = __slice.call(query);
          } else if (this.context.constructor === Spartan) {
            this.context.each(function(i, node) {
              query = node.querySelectorAll(selector);
              return _this._nodes = _this._nodes.concat(__slice.call(query));
            });
          }
        }
      }

      Spartan.prototype._execute = function(callback, args) {
        var index, node, _len, _ref;
        _ref = this._nodes;
        for (index = 0, _len = _ref.length; index < _len; index++) {
          node = _ref[index];
          callback.apply(node, args);
        }
        return this;
      };

      Spartan.prototype._collect = function(callback, combine, args) {
        var index, node, ret, _len, _ref;
        ret = [];
        _ref = this._nodes;
        for (index = 0, _len = _ref.length; index < _len; index++) {
          node = _ref[index];
          ret.push(callback.apply(node, args));
        }
        if (combine) {
          return ret.join('');
        } else {
          return ret;
        }
      };

      Spartan.prototype._checkAny = function(callback, args) {
        var index, node, pass, _len, _ref;
        _ref = this._nodes;
        for (index = 0, _len = _ref.length; index < _len; index++) {
          node = _ref[index];
          pass = callback.apply(node, args);
          if (pass) return true;
        }
        return false;
      };

      Spartan.prototype._checkAll = function(callback, args) {
        var index, node, pass, _len, _ref;
        _ref = this._nodes;
        for (index = 0, _len = _ref.length; index < _len; index++) {
          node = _ref[index];
          pass = callback.apply(node, args);
          if (!pass) return false;
        }
        return true;
      };

      Spartan.method = function(fn) {
        var anyFn;
        if (fn.indexOf('get') === 0) {
          return this.prototype[fn] = function() {
            var args, combine;
            combine = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            if (combine == null) combine = false;
            return this._collect(FN[fn], combine, args);
          };
        } else if (fn.indexOf('is') === 0) {
          this.prototype[fn] = function() {
            var args;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return this._checkAll(FN[fn], args);
          };
          anyFn = fn.replace(/^(is)/, '$1Any');
          return this.prototype[anyFn] = function() {
            var args;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return this._checkAny(FN[anyFn], args);
          };
        } else {
          return this.prototype[fn] = function() {
            var args;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return this._execute(FN[fn], args);
          };
        }
      };

      for (method in FN) {
        if (FN.hasOwnProperty(method)) Spartan.method(method);
      }

      Spartan.prototype.lenght = function() {
        return this._nodes.length;
      };

      Spartan.prototype.get = function(index) {
        if (this._nodes[index]) {
          return this._nodes[index];
        } else {
          return null;
        }
      };

      Spartan.prototype.find = function(selector) {
        var node, nodes, sub, _i, _len, _ref;
        nodes = [];
        _ref = this._nodes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          node = _ref[_i];
          sub = node.querySelectorAll(selector);
          nodes = nodes.concat(__slice.call(sub));
        }
        return $(nodes);
      };

      Spartan.prototype.each = function(callback) {
        var index, node, _len, _ref;
        _ref = this._nodes;
        for (index = 0, _len = _ref.length; index < _len; index++) {
          node = _ref[index];
          callback.call(node, index, node);
        }
        return this;
      };

      Spartan.prototype.delegate = function(type, callback) {
        var _this = this;
        return document.addEventListener(type, function(e) {
          var node, _i, _len, _ref;
          _ref = _this._nodes;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            if (e.target && node === e.target) {
              callback.call(node);
              return;
            }
          }
        });
      };

      Spartan.prototype.prepend = function() {
        var cNode, nodes, pNode, _i, _j, _len, _len2, _ref;
        nodes = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        _ref = this._nodes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          pNode = _ref[_i];
          for (_j = 0, _len2 = nodes.length; _j < _len2; _j++) {
            cNode = nodes[_j];
            pNode.insertBefore(ensureDomNode(cNode), pNode.firstChild);
          }
        }
        return this;
      };

      Spartan.prototype.append = function() {
        var cNode, nodes, pNode, _i, _j, _len, _len2, _ref;
        nodes = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        _ref = this._nodes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          pNode = _ref[_i];
          for (_j = 0, _len2 = nodes.length; _j < _len2; _j++) {
            cNode = nodes[_j];
            pNode.appendChild(ensureDomNode(cNode));
          }
        }
        return this;
      };

      return Spartan;

    })();
    ensureDomNode = function(elm) {
      if (elm.nodeType) {
        return elm;
      } else if (elm.constructor === String) {
        return createTextNode(elm);
      } else if (elm.constructor === Spartan) {
        return elm.get(0);
      }
    };
    $ = function(selector, context) {
      context || (context = document);
      return new Spartan(selector, context);
    };
    $.fn = function(name, fn) {
      FN[name] = fn;
      return Spartan.assign(name);
    };
    $.getStyle = function(elem, name) {
      var defaultView, s;
      if (elem.style[name]) return elem.style[name];
      if (elem.currentStyle) return elem.currentStyle[name];
      defaultView = document.defaultView;
      if (defaultView && defaultView.getComputedStyle) {
        name = name.replace(/([A-Z])/g, "-$1");
        name = name.toLowerCase();
        s = defaultView.getComputedStyle(elem, "");
        return s.getPropertyValue(name);
      }
      return null;
    };
    $.el = function(tagName, className, props) {
      var el;
      if (className == null) className = false;
      if (props == null) props = {};
      el = $(createElement(tagName));
      el.addClass(className);
      return el.attributes(props);
    };
    $.extend = function(origin, mixedIn) {
      var prop;
      for (prop in mixedIn) {
        origin[prop] = mixedIn[prop];
      }
    };
    (function() {
      var appVersion, isIOS, nav, userAgent;
      $.support = {};
      nav = window.navigator;
      appVersion = nav.appVersion;
      userAgent = nav.userAgent;
      isIOS = /like Mac OS X/.test(userAgent);
      return $.extend($.support, {
        isIpad: /ipad/gi.test(appVersion),
        isIphone: /iphone/gi.test(appVersion),
        isAndroid: /android/gi.test(appVersion),
        isOrientationAware: window.onorientationchange,
        isHashChangeAware: window.onhashchange,
        isStandalone: !!nav.standalone,
        touch: window.ontouchstart,
        has3d: window.WebKitCSSMatrix && __indexOf.call(new WebKitCSSMatrix(), 'm11') >= 0,
        isIOS: isIOS,
        isIOS5: isIOS && /CPU OS 5_\d/i.test(userAgent)
      });
    })();
    DOMReadyCallbacks = [];
    DOMReady = function() {
      var callback, _i, _len;
      for (_i = 0, _len = DOMReadyCallbacks.length; _i < _len; _i++) {
        callback = DOMReadyCallbacks[_i];
        callback();
      }
      DOMReadyCallbacks = null;
      document.removeEventListener('DOMContentLoaded', DOMReady, false);
    };
    $.ready = function(fn) {
      if (!DOMReadyCallbacks.length) {
        document.addEventListener('DOMContentLoaded', DOMReady, false);
      }
      DOMReadyCallbacks.push(fn);
    };
    return window.$ = $;
  })(window, document);

}).call(this);
