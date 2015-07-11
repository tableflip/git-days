# git-days [![Build Status](https://travis-ci.org/tableflip/git-days.svg)](https://travis-ci.org/tableflip/git-days) [![Dependency Status](https://david-dm.org/tableflip/git-days.svg)](https://david-dm.org/tableflip/git-days)
How many days did you work on that project?

CLI tool to get a print out of how many days each committer committed to a project and how many total commits they've made.

## Getting started

```sh
npm install -g git-days
git-days /path/to/project/.git /path/to/related/project/repo/.git
```

Output:

```sh
┌──────────────────────┬──────┬─────────┐
│ Author               │ Days │ Commits │
├──────────────────────┼──────┼─────────┤
│ Jane                 │ 46   │ 443     │
├──────────────────────┼──────┼─────────┤
│ Bob                  │ 16   │ 96      │
├──────────────────────┼──────┼─────────┤
│ Dave                 │ 70   │ 454     │
├──────────────────────┼──────┼─────────┤
│ Joe                  │ 1    │ 1       │
├──────────────────────┼──────┼─────────┤
│ Laura                │ 6    │ 12      │
├──────────────────────┼──────┼─────────┤
│ Sue                  │ 13   │ 50      │
├──────────────────────┼──────┼─────────┤
│ Richard              │ 4    │ 23      │
├──────────────────────┼──────┼─────────┤
│ Christopher          │ 1    │ 1       │
└──────────────────────┴──────┴─────────┘
Total: 157 days (1080 commits)
```

## Options

### `from`
Only consider commits after this date. An ISO formatted date passed to moment. 
e.g.

```sh
git-days /path/to/repo/.git --from 2015-07-10
```

### `to`
Only consider commits before this date. An ISO formatted date passed to moment. 
e.g.

```sh
git-days /path/to/repo/.git --to 2015-01-01
```

### `sort`
Sort the table by the specified column. Prefix with "-" to change sort direction to descending. Default is sort by author name, ascending.
e.g.

```sh
# Sort by commits ascending
git-days /path/to/repo/.git --sort commits

# Sort by days descending
git-days /path/to/repo/.git --sort=-days
```

---
[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
