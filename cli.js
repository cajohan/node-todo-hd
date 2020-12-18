#!/usr/bin/env node
const {Command} = require('commander')
const program = new Command()
program.version('0.0.1')
const api = require('./index')
const pkg = require('./package.json')

program
  .version(pkg.version)
  .option('-d, --debug', 'output extra debugging')
  .option('-s, --small', 'small pizza size')
  .option('-p, --pizza-type <type>', 'flavour of pizza')

program
  .command('add')
  .description('add a task')
  .action((...args) => {
    if (args.length !== 1) {
      const words = args.slice(-1).join(' ').replace(/,/g, ' ')
      api.add(words).then(() => {
        console.log('添加成功')
      }, () => {
        console.log('添加失败')
      })
    } else {
      console.log('传个任务名参数会死吗？不会吧不会吧')
    }
  })

program
  .command('clear')
  .description('clear task')
  .action(() => {
    api.clear().then(() => {
      console.log('清除成功')
    }, () => {
      console.log('清除失败')
    })
  })

program
  .command('showAll')
  .description('showAll task')
  .action(() => {
    void api.showAll()
  })

program.parse(process.argv)
