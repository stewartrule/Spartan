fs     = require 'fs'
util   = require 'util'
uglify = require 'uglify-js'
{exec} = require 'child_process'

build = (callback) ->
    name = "Spartan"
    coffeeSrc = "#{name}.coffee"
    jsSrc = "#{name}.js"
    exec "coffee -c #{coffeeSrc}", (err, stdout, stderr) ->
        util.log "compiled #{coffeeSrc}"
        js = fs.readFileSync jsSrc, 'utf8'
        output = uglify js
        fs.writeFileSync "#{name}.uglified.js", output, 'utf-8'
        util.log "uglified #{jsSrc}"

task 'build', 'Build from src', ->
    build()
    setInterval build, 5000