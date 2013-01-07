do (window, document) ->

    striptags = (str) ->
        str.replace /<\/?[^>]+>/gi, ''

    trim = (str) ->
        str.replace /\s+/g, ' '

    createElement = (tag) ->
        tag or= 'div'
        document.createElement(tag)

    createTextNode = (txt) ->
        document.createTextNode txt

    extend = (origin, mixedIn) ->
        for prop of mixedIn
            origin[prop] = mixedIn[prop]
        origin

    addEventListener = (node, type, listener, useCapture) ->
        node.addEventListener(type, listener, useCapture)

    removeEventListener = (node, type, listener, useCapture) ->
        node.addEventListener(type, listener, useCapture)

    FN =
        remove: () ->
            p = @parentNode
            if p
                p.removeChild this

        text: (str) ->
            @textContent = striptags "#{str}"

        empty: () ->
            while @firstChild
                @removeChild this.firstChild
            @innerHTML = ""
            return

        value: (val) ->
            @value = val

        html: (html) ->
            @innerHTML = html

        getHtml: () ->
            @innerHTML

        getValue: () ->
            @value

        getText: () ->
            striptags @innerHTML

        addClass: (name) ->
            if name and name.length
                unless @className
                    @className = name
                else
                    @className = @className + " " + name
            return

        removeClass: (name) ->
            curVal = @className or ""
            classes = curVal.split(/\s+/)
            n = []
            i = 0
            while i < classes.length
                unless classes[i] is name
                    n.push classes[i]
                i++
            @className = n.join(" ")

        hasClass: (name) ->
            curVal = @className or ""
            classes = curVal.split(/\s+/)
            i = 0
            while i < classes.length
                return true if classes[i] is name
                i++
            false

        hide: () ->
            curDisplay = $.getStyle @, "display"
            @$oldDisplay = curDisplay unless curDisplay is "none"
            @style.display = "none"

        show: () ->
            @style.display = @$oldDisplay or ""

        css: (styles) ->
            for own prop of styles
                @style[prop] = styles[prop]
            return

        on: (type, callback, capture) ->
            addEventListener @, type, callback, !!capture
            return

        off: (type, callback) ->
            removeEventListener @, type, callback, false
            return

        click: (callback) ->
            if $.support.touch
                FN.on.call @, 'click', (e) ->
                    e && e.preventDefault()
                FN.on.call @, 'touchend', callback
            else
                FN.on.call @, 'click', callback
            return

        attr: (attr) ->
            for own key, val of attr
                @setAttribute key, val
            return

        data: (name, val) ->
            @setAttribute "data-#{name}", val
            return

        isChecked:() ->
            this.checked

    # Nodelist wrapper
    class Spartan
        constructor:(selector, context) ->
            self = @
            self.context = context or document
            nodes = []
            if selector.nodeType
                nodes = [selector]
            else if selector.unshift and selector.join
                nodes = selector
            else if selector.constructor is String
                if self.context.nodeType
                    query = self.context.querySelectorAll selector
                    nodes = [query...]
                else if self.context.constructor is Spartan
                    self.context.each (i, node) ->
                        query = node.querySelectorAll selector
                        nodes = nodes.concat [query...]
            self._nodes = nodes

        extend @prototype,
            _execute: (callback, args) ->
                for node, index in @_nodes
                    callback.apply node, args
                @

            _collect: (callback, combine, args) ->
                ret = []
                for node, index in @_nodes
                    ret.push callback.apply node, args
                if combine
                    ret.join ''
                else
                    ret

            _check: (callback, args) ->
                for node, index in @_nodes
                    pass = callback.apply node, args
                    unless pass
                        return false
                true

            length: ->
                @_nodes.length

            get: (index) ->
                @_nodes[index]

            find: (selector) ->
                nodes = []
                for node in @_nodes
                    sub = node.querySelectorAll selector
                    nodes = nodes.concat [sub...]
                $ nodes

            each: (callback) ->
                for node, index in @_nodes
                    callback.call node, index, node
                @

            delegate: (type, callback) ->
                addEventListener document, type, (e) =>
                    for node in @_nodes
                        if e.target and node is e.target
                            callback.call node, e
                            return

            _add: (newNodes, cb) ->
                nodes = @_nodes
                shouldClone = nodes.length > 1
                for pNode in nodes
                    for cNode in newNodes
                        cNode = clone(cNode) if shouldClone
                        cb pNode, ensureDomNode(cNode)
                @

            replaceWith: () ->
                replacements = []
                @_add arguments, (oldNode, newNode) ->
                    parent = oldNode.parentNode
                    if parent
                        parent.insertBefore newNode, oldNode
                        parent.removeChild oldNode
                        replacements.push newNode
                $ replacements

            prepend: () ->
                @_add arguments, (pNode, cNode) ->
                    pNode.insertBefore cNode, pNode.firstChild

            append: () ->
                @_add arguments, (pNode, cNode) ->
                    pNode.appendChild cNode

        # Copy methods from FN to the Spartan prototype so they can be called on collections
        @method = (name) ->
            cb = FN[name]
            proto = @prototype
            if name.indexOf('get') is 0
                proto[name] = (combine = false, args...) ->
                    @_collect cb, combine, args
            else if name.indexOf('is') is 0 or name.indexOf('has') is 0
                proto[name] = (args...) ->
                    @_check cb, args
            else
                proto[name] = (args...) ->
                    @_execute cb, args
            return

        for own methodName of FN
            @method methodName

    clone = (elm) ->
        if elm.nodeType
            elm.cloneNode(true)
        else if elm.constructor is Spartan
            elm.get(0).cloneNode(true)
        else
            elm

    ensureDomNode = (elm) ->
        if elm.nodeType
            elm
        else if elm.constructor is String
            createTextNode(elm)
        else if elm.constructor is Spartan
            elm.get(0)

    $ = (selector, context) ->
        context or= document
        new Spartan selector, context

    $.fn = (name, fn) ->
        FN[name] = fn
        Spartan.assign name

    $.getStyle = (elem, name) ->
        return elem.style[name] if elem.style[name]
        return elem.currentStyle[name] if elem.currentStyle
        defaultView = document.defaultView
        if defaultView and defaultView.getComputedStyle
            name = name.replace(/([A-Z])/g, "-$1")
            name = name.toLowerCase()
            s = defaultView.getComputedStyle(elem, "")
            return s.getPropertyValue(name)
        null

    $.el = (tagName, className = false, props = {}) ->
        el = $ createElement tagName
        el.addClass className
        el.attr props

    $.extend = extend

    do ->
        $.support = {}
        nav = window.navigator
        appVersion = nav.appVersion
        userAgent = nav.userAgent
        isIOS = /like Mac OS X/.test userAgent
        $.extend $.support,
            isIpad: (/ipad/gi).test appVersion
            isIphone: (/iphone/gi).test appVersion
            isAndroid: (/android/gi).test appVersion
            isOrientationAware: window.onorientationchange
            isHashChangeAware: window.onhashchange
            isStandalone: !!nav.standalone
            touch: window.ontouchstart
            has3d: (window.WebKitCSSMatrix and 'm11' of new WebKitCSSMatrix())
            isIOS: isIOS
            isIOS5: isIOS and (/CPU OS 5_\d/i).test userAgent

    DOMReadyCallbacks = []

    DOMReady = ->
        for callback in DOMReadyCallbacks
            callback()
            DOMReadyCallbacks = null
            removeEventListener document, 'DOMContentLoaded', DOMReady, false
        return

    $.ready = (fn) ->
        unless DOMReadyCallbacks.length
            addEventListener document, 'DOMContentLoaded', DOMReady, false
        DOMReadyCallbacks.push fn
        return

    window.$ = window.Spartan = $


