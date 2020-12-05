#!/usr/bin/env node

const packageJson = require('./package.json');
const arg = require('arg');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { buildExtension } = require('./build');
const { createProject } = require('./create');

const parseArgumentIntoOptions = rawArgs => {
	const args = arg(
		{
			'--version': Boolean,
			'--create': Boolean,
			'--build': Boolean,
			'--install': Boolean,
			'-v': '--version',
			'-c': '--create',
			'-b': '--build',
			'-i': '--install'
		},
		{
			argv: rawArgs.slice(2)
		}
	);
	return {
		version: args['--version'],
		create: args['--create'],
		build: args['--build'],
		install: args['--install'],
		packageName: args._[0]
	};
};

const promptForCreate = async options => {
	const questions = [];
	questions.push({
		type: 'input',
		name: 'extName',
		message: 'Extension Name	:'
	});
	questions.push({
		type: 'input',
		name: 'description',
		message: 'Description		:'
	});
	questions.push({
		type: 'input',
		name: 'author',
		message: 'Author		:'
	});

	const answers = await inquirer.prompt(questions);
	return {
		...options,
		...answers
	};
};

const cli = async args => {
	let options = parseArgumentIntoOptions(args);
	if (options.version) {
		console.log(chalk.bold.green(packageJson.version))
		process.exit();
	}
	if (options.create) {
		options = await promptForCreate(options);
		createProject(options);
	} else if (options.build) await buildExtension(false);
	else if (options.install) await buildExtension(true);
	else {
		console.log('sdadadad')
		console.log(
			chalk.bold.green('Usage: deckboard-kit <command>')
			+ '\n\nOptions:\n'
			+ '  --create, -c	\t\tCreate new Deckboard extension project\n'
			+ '  --build, -b	\t\tPackage the extension into an asar file\n'
			+ '  --install, -i	\t\tExecute --build then copy the asar file into extension folder\n'
			+ '  --version, -v	\t\tShow version number\n'

		)
		process.exit();
	}
};

module.exports = {
	cli
};
