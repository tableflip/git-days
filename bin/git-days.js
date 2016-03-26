#!/usr/bin/env node
var argv = require('minimist')(process.argv.slice(2))
var days = require('../')

var repos = argv._
if (!repos.length) repos = process.cwd()

days(repos, argv)
