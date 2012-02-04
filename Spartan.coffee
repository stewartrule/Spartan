((window,document) ->

    striptags = (str) ->
        str.replace /<\/?[^>]+>/gi, ''

    trim = (str) ->
        str.replace /\s+/g, ' '

    createElement = (tag) ->
        tag or= 'div'
        document.createElement(tag)

    createTextNode = (txt) ->
        document.createTextNode txt

    FN =
        remove : () ->
            p = @parentNode
            if p
                p.removeChild this

        text : (str) ->
            @innerHTML = ""
            @appendChild createTextNode striptags str

        empty : () ->
            while @firstChild
                @removeChild this.firstChild
            @innerHTML = ""

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

        addClass : (name) ->
            if name and name.length
                unless @className
                    @className = name
                else
                    @className = @className + " " + name

        removeClass : (name) ->
            curVal = @className or ""
            classes = curVal.split(/\s+/)
            n = []
            i = 0
            while i < classes.length
                unless classes[i] is name
                    n.push classes[i]
                i++
            @className = n.join(" ")

        hasClass : (name) ->
            curVal = @className or ""
            classes = curVal.split(/\s+/)
            i = 0
            while i < classes.length
                return true if classes[i] is name
                i++
            false

        hide : () ->
            curDisplay = $.getStyle @, "display"
            @$oldDisplay = curDisplay unless curDisplay is "none"
            @style.display = "none"

        show : () ->
            @style.display = @$oldDisplay or ""

        style : (prop, val) ->
            @style[prop] = val

        css : (styles) ->
            for prop of styles
                if styles.hasOwnProperty(prop)
                    @style[prop] = styles[prop]
            return
        bind : (type, callback, capture) ->
            capture = Boolean capture
            @addEventListener type, callback, capture

        unbind : (type, callback) ->
            @removeEventListener type, callback, false

        click: (callback) ->
            if $.support.touch
                FN.bind.call @, 'click', (e) ->
                    e.preventDefault()
                FN.bind.call @, 'touchstart', callback
            else
                FN.bind.call @, 'click', callback

        attr : (key,val) ->
            @setAttribute key, val

        attributes: (propList) ->
            for prop of propList
                if propList.hasOwnProperty(prop)
                    FN.attr.call @, prop, propList[prop]
            return

        data: (name,val) ->
            FN.attr.call @, "data-#{name}", val

        isChecked:() ->
            this.checked

    # Nodelist wrapper
    class Spartan
        constructor:(selector,@context = document) ->
            nodes = []
            if selector.nodeType
                nodes = [selector]
            else if selector.unshift and selector.join
                nodes = selector
            else if selector.constructor is String
                if @context.nodeType
                    query = @context.querySelectorAll selector
                    nodes = [query...]
                else if @context.constructor is Spartan
                    @context.each (i,node) =>
                        query = node.querySelectorAll selector
                        nodes = nodes.concat [query...]
            @_nodes = nodes

        _execute: (callback,args) ->
            for node, index in @_nodes
                callback.apply node, args
            @

        _collect: (callback,combine,args) ->
            ret = []
            for node, index in @_nodes
                ret.push callback.apply node, args
            if combine
                ret.join ''
            else
                ret

        _checkAny: (callback,args) ->
            for node, index in @_nodes
                pass = callback.apply node, args
                if pass
                    return true
            false

        _checkAll: (callback,args) ->
            for node, index in @_nodes
                pass = callback.apply node, args
                unless pass
                    return false
            true

        @method = (fn) ->
            cb = FN[fn]
            proto = @prototype
            if fn.indexOf('get') is 0
                proto[fn] = (combine=false, args...) ->
                    @_collect cb, combine, args
            else if fn.indexOf('is') is 0
                proto[fn] = (args...) ->
                    @_checkAll cb, args
                anyFn = fn.replace /^(is)/, '$1Any'
                proto[anyFn] = (args...) ->
                    @_checkAny cb, args
            else
                proto[fn] = (args...) ->
                    @_execute cb, args

        for method of FN
            if FN.hasOwnProperty method
                @method method

        lenght: ->
            @_nodes.length

        get: (index) ->
            if @_nodes[index] then @_nodes[index] else null

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

        delegate: (type,callback) ->
            document.addEventListener type, (e) =>
                for node in @_nodes
                    if e.target and node is e.target
                        callback.call node
                        return

        prepend: (nodes...) ->
            for pNode in @_nodes
                for cNode in nodes
                    pNode.insertBefore ensureDomNode(cNode), pNode.firstChild
            @

        append: (nodes...) ->
            for pNode in @_nodes
                for cNode in nodes
                    pNode.appendChild ensureDomNode(cNode)
            @

    ensureDomNode = (elm) ->
        if elm.nodeType
            elm
        else if elm.constructor is String
            createTextNode(elm)
        else if elm.constructor is Spartan
            elm.get(0)

    $ = (selector,context) ->
        context or= document
        new Spartan selector, context

    $.fn = (name,fn) ->
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
        el.attributes props

    $.extend = (origin,mixedIn) ->
        for prop of mixedIn
            origin[prop] = mixedIn[prop]
        return

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
            has3d: (window.WebKitCSSMatrix and 'm11' in new WebKitCSSMatrix())
            isIOS: isIOS
            isIOS5: isIOS and (/CPU OS 5_\d/i).test userAgent

    DOMReadyCallbacks = []

    DOMReady = ->
        for callback in DOMReadyCallbacks
            callback()
        DOMReadyCallbacks = null
        document.removeEventListener 'DOMContentLoaded', DOMReady, false
        return

    $.ready = (fn) ->
        unless DOMReadyCallbacks.length
            document.addEventListener 'DOMContentLoaded', DOMReady, false
        DOMReadyCallbacks.push fn
        return

    window.$ = $

)(window,document)