// Generated by CoffeeScript 1.4.0
(function() {
  var __hasProp = {}.hasOwnProperty,
    __slice = [].slice;

  (function(window, document) {
    var $, DOMReady, DOMReadyCallbacks, FN, Spartan, addEventListener, clone, createElement, createTextNode, ensureDomNode, extend, removeEventListener, striptags, trim;
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
    extend = function(origin, mixedIn) {
      var prop;
      for (prop in mixedIn) {
        origin[prop] = mixedIn[prop];
      }
      return origin;
    };
    addEventListener = function(node, type, listener, useCapture) {
      return node.addEventListener(type, listener, useCapture);
    };
    removeEventListener = function(node, type, listener, useCapture) {
      return node.addEventListener(type, listener, useCapture);
    };
    FN = {
      remove: function() {
        var p;
        p = this.parentNode;
        if (p) {
          return p.removeChild(this);
        }
      },
      text: function(str) {
        return this.textContent = striptags("" + str);
      },
      empty: function() {
        while (this.firstChild) {
          this.removeChild(this.firstChild);
        }
        this.innerHTML = "";
      },
      value: function(val) {
        return this.value = val;
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
            this.className = name;
          } else {
            this.className = this.className + " " + name;
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
          if (classes[i] !== name) {
            n.push(classes[i]);
          }
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
          if (classes[i] === name) {
            return true;
          }
          i++;
        }
        return false;
      },
      hide: function() {
        var curDisplay;
        curDisplay = $.getStyle(this, "display");
        if (curDisplay !== "none") {
          this.$oldDisplay = curDisplay;
        }
        return this.style.display = "none";
      },
      show: function() {
        return this.style.display = this.$oldDisplay || "";
      },
      css: function(styles) {
        var prop;
        for (prop in styles) {
          if (!__hasProp.call(styles, prop)) continue;
          this.style[prop] = styles[prop];
        }
      },
      on: function(type, callback, capture) {
        addEventListener(this, type, callback, !!capture);
      },
      off: function(type, callback) {
        removeEventListener(this, type, callback, false);
      },
      click: function(callback) {
        if ($.support.touch) {
          FN.on.call(this, 'click', function(e) {
            return e && e.preventDefault();
          });
          FN.on.call(this, 'touchend', callback);
        } else {
          FN.on.call(this, 'click', callback);
        }
      },
      attr: function(attr) {
        var key, val;
        for (key in attr) {
          if (!__hasProp.call(attr, key)) continue;
          val = attr[key];
          this.setAttribute(key, val);
        }
      },
      data: function(name, val) {
        this.setAttribute("data-" + name, val);
      },
      isChecked: function() {
        return this.checked;
      }
    };
    Spartan = (function() {
      var methodName;

      function Spartan(selector, context) {
        var nodes, query, self;
        self = this;
        self.context = context || document;
        nodes = [];
        if (selector.nodeType) {
          nodes = [selector];
        } else if (selector.unshift && selector.join) {
          nodes = selector;
        } else if (selector.constructor === String) {
          if (self.context.nodeType) {
            query = self.context.querySelectorAll(selector);
            nodes = __slice.call(query);
          } else if (self.context.constructor === Spartan) {
            self.context.each(function(i, node) {
              query = node.querySelectorAll(selector);
              return nodes = nodes.concat(__slice.call(query));
            });
          }
        }
        self._nodes = nodes;
      }

      extend(Spartan.prototype, {
        _execute: function(callback, args) {
          var index, node, _i, _len, _ref;
          _ref = this._nodes;
          for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
            node = _ref[index];
            callback.apply(node, args);
          }
          return this;
        },
        _collect: function(callback, combine, args) {
          var index, node, ret, _i, _len, _ref;
          ret = [];
          _ref = this._nodes;
          for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
            node = _ref[index];
            ret.push(callback.apply(node, args));
          }
          if (combine) {
            return ret.join('');
          } else {
            return ret;
          }
        },
        _check: function(callback, args) {
          var index, node, pass, _i, _len, _ref;
          _ref = this._nodes;
          for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
            node = _ref[index];
            pass = callback.apply(node, args);
            if (!pass) {
              return false;
            }
          }
          return true;
        },
        length: function() {
          return this._nodes.length;
        },
        get: function(index) {
          return this._nodes[index];
        },
        find: function(selector) {
          var node, nodes, sub, _i, _len, _ref;
          nodes = [];
          _ref = this._nodes;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            sub = node.querySelectorAll(selector);
            nodes = nodes.concat(__slice.call(sub));
          }
          return $(nodes);
        },
        each: function(callback) {
          var index, node, _i, _len, _ref;
          _ref = this._nodes;
          for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
            node = _ref[index];
            callback.call(node, index, node);
          }
          return this;
        },
        delegate: function(type, callback) {
          var _this = this;
          return addEventListener(document, type, function(e) {
            var node, _i, _len, _ref;
            _ref = _this._nodes;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              node = _ref[_i];
              if (e.target && node === e.target) {
                callback.call(node, e);
                return;
              }
            }
          });
        },
        _add: function(newNodes, cb) {
          var cNode, nodes, pNode, shouldClone, _i, _j, _len, _len1;
          nodes = this._nodes;
          shouldClone = nodes.length > 1;
          for (_i = 0, _len = nodes.length; _i < _len; _i++) {
            pNode = nodes[_i];
            for (_j = 0, _len1 = newNodes.length; _j < _len1; _j++) {
              cNode = newNodes[_j];
              if (shouldClone) {
                cNode = clone(cNode);
              }
              cb(pNode, ensureDomNode(cNode));
            }
          }
          return this;
        },
        replaceWith: function() {
          var replacements;
          replacements = [];
          this._add(arguments, function(oldNode, newNode) {
            var parent;
            parent = oldNode.parentNode;
            if (parent) {
              parent.insertBefore(newNode, oldNode);
              parent.removeChild(oldNode);
              return replacements.push(newNode);
            }
          });
          return $(replacements);
        },
        prepend: function() {
          return this._add(arguments, function(pNode, cNode) {
            return pNode.insertBefore(cNode, pNode.firstChild);
          });
        },
        append: function() {
          return this._add(arguments, function(pNode, cNode) {
            return pNode.appendChild(cNode);
          });
        }
      });

      Spartan.method = function(name) {
        var cb, proto;
        cb = FN[name];
        proto = this.prototype;
        if (name.indexOf('get') === 0) {
          proto[name] = function() {
            var args, combine;
            combine = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            if (combine == null) {
              combine = false;
            }
            return this._collect(cb, combine, args);
          };
        } else if (name.indexOf('is') === 0 || name.indexOf('has') === 0) {
          proto[name] = function() {
            var args;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return this._check(cb, args);
          };
        } else {
          proto[name] = function() {
            var args;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return this._execute(cb, args);
          };
        }
      };

      for (methodName in FN) {
        if (!__hasProp.call(FN, methodName)) continue;
        Spartan.method(methodName);
      }

      return Spartan;

    })();
    clone = function(elm) {
      if (elm.nodeType) {
        return elm.cloneNode(true);
      } else if (elm.constructor === Spartan) {
        return elm.get(0).cloneNode(true);
      } else {
        return elm;
      }
    };
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
      if (elem.style[name]) {
        return elem.style[name];
      }
      if (elem.currentStyle) {
        return elem.currentStyle[name];
      }
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
      if (className == null) {
        className = false;
      }
      if (props == null) {
        props = {};
      }
      el = $(createElement(tagName));
      el.addClass(className);
      return el.attr(props);
    };
    $.extend = extend;
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
        has3d: window.WebKitCSSMatrix && 'm11' in new WebKitCSSMatrix(),
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
        DOMReadyCallbacks = null;
        removeEventListener(document, 'DOMContentLoaded', DOMReady, false);
      }
    };
    $.ready = function(fn) {
      if (!DOMReadyCallbacks.length) {
        addEventListener(document, 'DOMContentLoaded', DOMReady, false);
      }
      DOMReadyCallbacks.push(fn);
    };
    return window.$ = window.Spartan = $;
  })(window, document);

}).call(this);
