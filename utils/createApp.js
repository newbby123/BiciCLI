/**
 * @FILTER
 */
'use strict';

const validateProjectName = require('validate-npm-package-name')
const path = require('path')
const chalk = require('chalk')
const fs = require('fs-extra')
const pathExists = require('path-exists')
const download = require('download-git-repo')
const ora = require('ora')

module.exports = (name) => {
  const root = path.resolve(name);
  const appName = path.basename(root);

  checkAppName(appName)
  if (!pathExists(appName)) {
    fs.mkdir(root)
  } else if (!isSafeToCreateProjectIn(root, appName)) {
    process.exit(1)
  }
  init(root)
}

function checkAppName(appName) {
  // 使用 validateProjectName 检查包名是否合法返回结果，validateProjectName是npm提供的一个包名检测工具，使用如下
  const validationResult = validateProjectName(appName);
  // 如果对象中有错继续，这里就是外部依赖的具体用法
  if (!validationResult.validForNewPackages) {
    console.error(
      `Could not create a project called ${chalk.red(
        `"${appName}"`
      )} because of npm naming restrictions:`
    );
    printValidationResults(validationResult.errors);
    printValidationResults(validationResult.warnings);
    process.exit(1);
  }

  // 定义了三个开发依赖的名称
  const dependencies = [
    'react-native-scripts',
    'exponent',
    'expo',
    'vector-icons',
    'react',
    'react-native'
  ].sort();

  // 如果项目使用了这几个名称都会报错，而且退出进程
  if (dependencies.indexOf(appName) >= 0) {
    console.error(
      chalk.red(
        `We cannot create a project called ${chalk.green(
          appName
        )} because a dependency with the same name exists.\n` +
        `Due to the way npm works, the following names are not allowed:\n\n`
      ) +
      chalk.cyan(dependencies.map(depName => `  ${depName}`).join('\n')) +
    chalk.red('\n\nPlease choose a different project name.')
  );
    process.exit(1);
  }
}

// 除了包含以下文件外，在此目录中创建项目是不安全的
function isSafeToCreateProjectIn(root, appName) {
  const validFiles = ['.DS_Store', 'Thumbs.db', '.git', '.gitignore', 'README.md', 'LICENSE'];
  const conflicts = fs.readdirSync(root).filter(file => !validFiles.includes(file))

  if (conflicts.length < 1) {
    return true;
  }
  // 否则这个文件夹就是不安全的，并且挨着打印存在哪些不安全的文件
  console.log(
    `The directory ${chalk.green(appName)} contains files that could conflict:`
  );
  console.log();
  for (const file of conflicts) {
    console.log(`  ${file}`);
  }
  console.log();
  console.log(
    'Either try using a new directory name, or remove the files listed above.'
  );
  // 并且返回false
  return false;
}


function init(root) {
  const template = 'jaggerwang/zqc-app-demo#master'
  const spinner = ora('Downloading template...')
  spinner.start()

  download(`${template}`, `${root}`, (err) => {
    if (err) {
      console.log(chalk.red(err))
      process.exit()
    }
    spinner.stop()
  console.log(chalk.green('New project has been initialized successfully!'))
})
}

function printValidationResults(results) {
  if (typeof results !== 'undefined') {
      results.forEach(error => {
        console.error(chalk.red(`  *  ${error}`))
      })
  }
}

// todo 是否在本地执行依赖包安装
// function userHasYarn() {
//   try {
//     const result = spawn.sync('yarnpkg', ['--version'], { stdio: 'ignore' });
//     if (result.error || result.status !== 0) {
//       return false;
//     }
//     return true;
//   } catch (e) {
//     return false;
//   }
// }
//
// function packageManagerType() {
//   const defaultType = 'npm';
//   const supportedTypes = ['yarn', 'npm', 'pnpm'];
//
//   if (packageManager) {
//     let index = supportedTypes.indexOf(packageManager);
//     return index === -1 ? defaultType : supportedTypes[index];
//   }
//
//   return userHasYarn() ? 'yarn' : defaultType;
// }

// function packageManagerCmd() {
//   if (packageManager) {
//     return packageManager;
//   } else {
//     return packageManagerType() === 'yarn' ? 'yarnpkg' : 'npm';
//   }
// }