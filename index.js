var path = require('path')
var log = require('git-log')
var Multi = require('multi-stream')
var moment = require('moment')
var Table = require('cli-table')
var clcTTY = require('cli-color-tty')
var once = require('once')

module.exports = function (repos, opts, cb) {
  repos = Array.isArray(repos) ? repos : [repos]

  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }

  opts = opts || {}

  cb = once(cb || function (err, data) {
    if (err) throw err
    createPrinter(opts)(data)
  })

  opts.from = opts.from ? moment(opts.from) : null
  opts.to = opts.to ? moment(opts.to) : null

  var data = {}
  var multi = Multi()

  multi = repos.reduce(function (multi, repo) {
    if (repo.slice(repo.length - 5) !== '/.git') {
      if (repo[repo.length - 1] === '/') {
        repo += '.git'
      } else {
        repo += '/.git'
      }
    }
    repo = path.resolve(repo)
    return multi.pull(log(repo))
  }, multi)

  multi
    .on('data', function (commit) {
      data[commit.author.name] = data[commit.author.name] || {}

      var commitDate = moment(commit.date)
      var dateKey = commitDate.format('YYYY-MM-DD')

      data[commit.author.name][dateKey] = data[commit.author.name][dateKey] || {}
      data[commit.author.name][dateKey].commits = data[commit.author.name][dateKey].commits || []

      if (opts.from && commitDate.isBefore(opts.from)) return
      if (opts.to && commitDate.isAfter(opts.to)) return

      data[commit.author.name][dateKey].commits.push(commit)
    })
    .on('error', cb)
    .on('end', function () {
      cb(null, data)
    })
}

function createPrinter (opts) {
  opts = opts || {}
  opts.sort = opts.sort || 'author'

  var clc = clcTTY(opts.isTTY)

  return function (data) {
    var info = []
    var authors = Object.keys(data)

    var table = new Table({head: ['Author', 'Days', 'Commits']})
    var totals = {days: 0, commits: 0}

    info = authors.map(function (author) {
      var dates = Object.keys(data[author])
      var commits = dates.reduce(function (total, date) {
        return total + data[author][date].commits.length
      }, 0)

      totals.days += dates.length
      totals.commits += commits

      return {author: author, days: dates.length, commits: commits}
    })

    info.sort(createPrintSorter(opts.sort))
    info.forEach(function (i) { table.push([i.author, i.days, i.commits]) })

    console.log(table.toString())
    console.log('Total:', clc.bold(totals.days), 'days', clc.white('(' + totals.commits + ' commits)'))
    console.log()
  }
}

function createPrintSorter (key) {
  var dir = key[0] == '-' ? '-' : '+'

  key = key[0] == '-' || key[0] == '+' ? key.slice(1) : key
  key = key.toLowerCase()

  return function (a, b) {
    a = a[key]
    b = b[key]

    if (Object.prototype.toString.call(a) == '[object String]') {
      a = a.toLowerCase()
      b = b.toLowerCase()
    }

    if (dir == '+') {
      if (a < b) return -1; else if (a > b) return 1
    } else {
      if (a < b) return 1; else if (a > b) return -1
    }
  }
}

module.exports.createPrinter = createPrinter
