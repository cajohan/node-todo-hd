const db = require("./db")
const {read, write} = require('./db.js')
const inquirer = require('inquirer')

module.exports.add = async (title) => {
  //读
  const list = await read()
  //存储任务
  list.push({title, done: false})
  //写
  await write(list)
}
module.exports.clear = async () => {
  await write([])
}

function markAsDone(list,index){
  list[index].done = true
  db.write(list)
}

function markAsUnDone(list,index){
  list[index].done = false
  db.write(list)
}

function updateTitle(list,index){
  inquirer.prompt(
    {
      type: 'input',
      name: 'title',
      message: "请输入标题名",
      default: list[index].title
    },
  ).then((answer3) => {
    list[index].title = answer3.title
    db.write(list)
  });
}

function remove(list,index){
  list.splice(index,1)
  db.write(list)
}

function askForAction(list,index){
  const actions = {markAsDone,markAsUnDone,remove,updateTitle}
  inquirer
    .prompt([{
      type: 'list',
      name: 'action',
      message: '选择操作',
      choices: [
        {name:'退出',value:'quit'},
        {name:'已完成',value:'markAsDone'},
        {name:'未完成',value:'markAsUnDone'},
        {name:'改标题',value:'updateTitle'},
        {name:'删除',value:'remove'},
      ]
    }]).then((answer2) => {
      const action = actions[answer2.action]
    action && action(list,index)
    // switch(answer2.action){
    //   case 'markAsDone':
    //     markAsDone(list,index)
    //     break;
    //   case 'markAsUndone':
    //     markaAsUndone(list,index)
    //     break;
    //   case 'updateTitle':
    //     updateTitle(list,index)
    //     break;
    //   case 'remove':
    //     remove(list,index)
    //     break;
    // }
  })
}

function askForCreateTask(list){
  inquirer.prompt(
    {
      type: 'input',
      name: 'title',
      message: "请输入标题名",
    },
  ).then((answer4) => {
    list.push({
      title:answer4.title,
      done: false
    })
    db.write(list)
  });
}

function printTasks(list){
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'index',
        message: '选择你要操作的任务',
        choices: [
          {name: '退出', value: '-1'}, ...list.map((task, index) => {
            return {
              name: `${task.done ? '[x]' : '[_]'} ${index + 1}-${task.title}`,
              value: index.toString()
            }
          }),{name: '+创建任务',value: '-2'}
        ],
      },
    ])
    .then((answer) => {
      const index = parseInt(answer.index)
      if(answer.index>=0){
        //选中任务
        askForAction(list,index)
      }else if (index===-2){
        //创建任务
        askForCreateTask(list)
      }
    })
}

module.exports.showAll = async () => {
  //读取任务
  const list = await db.read()
  list.forEach((task, index) => {
    console.log(`${task.done ? '[x]' : '[_]'} ${index + 1}-${task.title}`)
  })
  //打印之前的任务
  printTasks(list)
}