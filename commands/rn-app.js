/**
 * @FILTER react-native app
 */
'use strict'

const chalk = require('chalk')
const createApp = require('../utils/createApp')

module.exports = (projectName) => {
  // 检查用户输入项目名称是否为空，为空则输出提示信息，并退出进程
  if (typeof projectName === 'undefined') {
    console.error('Please specify the project directory:')
    console.log(
      `  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`
    )
    console.log()
    console.log('For example:')
    console.log(`  ${chalk.cyan(program.name())} ${chalk.green('my-react-app')}`)
    console.log()
    console.log(
      `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
    )

    process.exit(1)
  }

  createApp(projectName)
}