#! /usr/bin/env node --harmony

const program = require('commander');
const pkg = require('../package.json');

// 定义使用方法
program.usage('<command> <option>');

//定义版本
program.version(pkg.version);

//注册初始化指令
program
	.command('init')
	.description('使用模板初始化项目')
	.action((arg) => {
		// 若 cli 显式传入参数(如 init directory1) 则 arg 返回当前参数(directory1) 
		// 否则 arg 返回 command 对象
		var dir = typeof arg === 'object' ? '' : arg;
		require("../command/init")(dir);
	})

program
	.command('list')
	.description('列出当前可用的模板')
	.alias('info')
	.action(() => {
		require("../command/list")();
	})


// 解析命令行参数
program.parse(process.argv);

// 显示帮助
if (!program.args.length) {
	program.help();
}

