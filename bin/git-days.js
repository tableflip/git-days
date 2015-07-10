#!/usr/bin/env node
var argv = require('minimist')(process.argv.slice(2))
var days = require('../')

days(argv._, argv)
