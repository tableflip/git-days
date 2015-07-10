var log = require('git-log')
var Multi = require('multi-stream')
var moment = require('moment')
var Table = require('cli-table')
var clcTTY = require('cli-color-tty')
var once = require('once')

module.exports = function (repos, opts, cb) {
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
    return multi.pull(log(repo))
  }, multi)

  multi
    .on('data', function (commit) {
      data[commit.author.name] = data[commit.author.name] || {}

      var commitDate = moment(commit.date)

      if (opts.from && commitDate.isBefore(opts.from)) return
      if (opts.to && commitDate.isAfter(opts.to)) return

      var dateKey = commitDate.format('YYYY-MM-DD')

      data[commit.author.name][dateKey] = data[commit.author.name][dateKey] || {}
      data[commit.author.name][dateKey].commits = data[commit.author.name][dateKey].commits || []

      data[commit.author.name][dateKey].commits.push(commit)
    })
    .on('error', cb)
    .on('end', function () {
      cb(null, data)
    })
}

// TODO: opts should include table sort field
function createPrinter (opts) {
  var clc = clcTTY(opts.isTTY)

  return function (data) {
    var authors = Object.keys(data)

    authors.sort(function (a, b) {
      a = a.toLowerCase()
      b = b.toLowerCase()
      if (a < b) return -1; else if (a > b) return 1; else return 0
    })

    var table = new Table({head: ['Author', 'Days', 'Commits']})
    var totals = {days: 0, commits: 0}

    authors.forEach(function (author) {
      var dates = Object.keys(data[author])
      var commits = dates.reduce(function (total, date) {
        return total + data[author][date].commits.length
      }, 0)

      totals.days += dates.length
      totals.commits += commits

      table.push([author, dates.length, commits])
    })

    console.log(table.toString())
    console.log('Total:', clc.bold(totals.days), 'days', clc.white('(' + totals.commits + ' commits)'))
    console.log()
  }
}

module.exports.createPrinter = createPrinter
