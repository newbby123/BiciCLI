/**
 * @FILTER react-native app
 */
const download = require('download-git-repo')
const chalk = require('chalk')
const ora = require('ora')

module.exports = (project) => {
  const spinner = ora('Downloading template...')

  spinner.start()

  download(`jaggerwang/zqc-app-demo#master`, `.//${project}`, (err) => {
    if (err) {
      console.log(chalk.red(err))
      process.exit()
    }
    spinner.stop()
  console.log(chalk.green('New project has been initialized successfully!'))
})}