const child = require('child_process');
const chalk = require('chalk');
const co = require('co');
const prompt = require('co-prompt');
const fs = require('fs-extra');
const path = require('path');
const ora = require('ora');

const config = require('../package.json');
const utils = require('../libs/utils');
const cwd = process.cwd();

const errorTip = chalk.red, blueTip = chalk.blue;

const exit = process.exit;

module.exports = (name) => {
    let { templates } = config;
    let template = templates[name];

    // 判断传入的模板是否已经在 package.json 中配置对应的 git 仓库地址
    if (!template) {
        // throw new Error(`没有找到对应${template}的模板，请确认当前模板是否存在`);
        console.log(errorTip(`x 没有找到对应${name}的模板，请确认当前模板是否存在`));
        exit(0);
    }

    // 获取模板参考名称
    let repo = utils.getRepo(template);

    co(function*() {
        let dirname = yield prompt('App name: ');
        let order = `git clone ${template}`;
        let files = fs.readdirSync(cwd);

        // 遍历当前根目录 判断是否已经存在同名文件夹
        files.forEach((file) => {
            let stats = fs.statSync(file);
            let absolute = path.join(cwd, file);
            let filename = path.posix.basename(absolute);
            if (stats.isDirectory() && filename === dirname) {
                console.error(errorTip("x 已经存在同名文件夹: " + dirname));
                exit(0);
            }
        })

        console.info(`正在克隆模板 ${dirname}...`);

        child.exec(order, (error, stdout, stderr) => {
        	var absolute = path.join(cwd, dirname);
            if (error) {
                console.error(errorTip(error));
                spinner.fail();
                exit(0);
            }
            // 目录重命名
            fs.renameSync(repo, dirname);
            console.info(chalk.green(`√ 目录重命名完成`));
            console.info(chalk.green(`√ 目录生成完毕`));
        	exit(0);
        });
    })
    .catch((ex)=>{
        console.error('生成失败, 失败原因：' + ex.message);
        exit(1);
    })
};
