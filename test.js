var test = require('tape')
var days = require('./')
var print = days.createPrinter()

test('Should retrive commits and render table without error', function (t) {
  t.plan(1)

  days('./', function (err, data) {
    t.ifError(err, 'No error retrieving commit data')
    print(data)
    t.end()
  })
})

test('Should respect to option', function (t) {
  t.plan(2)

  days('./', {to: '2015-07-10T10:38:00+0100'}, function (err, data) {
    t.ifError(err, 'No error retrieving commit data')
    print(data)
    t.equal(data['Alan Shaw']['2015-07-10'].commits.length, 2, 'Correct number of commits')
    t.end()
  })
})

test('Should respect from option', function (t) {
  t.plan(2)

  days('./', {from: '2015-07-10T10:36:55+0100', to: '2015-07-10T10:38:00+0100'}, function (err, data) {
    t.ifError(err, 'No error retrieving commit data')
    print(data)
    t.equal(data['Alan Shaw']['2015-07-10'].commits.length, 1, 'Correct number of commits')
    t.end()
  })
})
