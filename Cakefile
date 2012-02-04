fs     = require 'fs'
util   = require 'util'
uglify = require 'uglify-js'
coffee = require 'coffee-script'

build = (callback) ->
    console.log 'build spartan', coffee.compile
    name = "Spartan"
    coffeeSrc = "#{name}.coffee"
    csource = fs.readFileSync coffeeSrc, 'utf-8'
    coffee.compile csource, { coffeeSrc }

    input = fs.readFileSync "#{name}.js", 'utf-8'
    output = uglify input
    fs.writeFileSync "#{name}.uglified.js", output, 'utf-8'

task 'build', 'Build from src', ->
    build()
    setInterval build, 5000