const chalk = require('chalk');
const fs = require('fs-extra');
const Listr = require('listr');
const path = require('path');
const YAML = require('yaml');
const { promisify } = require('util');
const { Observable } = require('rxjs');

const access = promisify(fs.access);
const copyFile = promisify(fs.copyFile);
const writeFile = promisify(fs.writeFile);
const writeJson = promisify(fs.writeJSON);

const createProject = async options => {
	const tasks = new Listr([
		{
			title: 'Creating project folder',
			task: ctx => createProjectFolder(ctx)
		},
		{
			title: 'Generating files',
			task: ctx => generateProjectFiles(ctx)
		}
	]);

	if (!options.packageName) {
		options.packageName = options.extName.replace(' ', '-').toLowerCase();
	}

	await tasks.run({
		options,
		dir: path.join(process.cwd(), options.packageName)
	});

	console.log(chalk.bold.green('DONE'), `Run ${chalk.bold(`cd ${options.packageName} && npm install`)}`);
};

const generateProjectFiles = async ctx =>
	new Observable(async observer => {
		observer.next('Generate package.json');
		await createPackageJson(ctx);

		observer.next('Generate extension.yml');
		await createExtensionYml(ctx);

		observer.next('Generate index.js');
		await createInitialScript(ctx);

		observer.next('Generate configuration files');
		await copyConfigFiles(ctx);

		observer.next('Generate documentation');
		await copyDocumentation(ctx);

		observer.complete();
	});

const createProjectFolder = async ctx => {
	const { options, dir } = ctx;

	try {
		await access(dir, fs.constants.F_OK);
		throw new Error(
			chalk.bold.red(
				`Directory ${options.packageName
				} already exists in ${process.cwd()}. Extension initiation has been cancelled.`
			)
		);
	} catch (err) {
		try {
			await fs.mkdir(dir);
		} catch (err) {
			throw new Error(chalk.bold.red(err));
		}
	}
};

const createPackageJson = async ctx => {
	const { options, dir } = ctx;
	try {
		const jsonContent = {
			name: options.extName.replace(' ', '-').toLowerCase(),
			version: '1.0.0',
			description: options.description,
			main: 'index.js',
			scripts: {
				build: 'deckboard-kit --build',
				install: 'deckboard-kit --install'
			},
			author: options.author,
			license: 'MIT',
			dependencies: {
				'deckboard-kit':
					'https://github.com/rivafarabi/deckboard-kit.git'
			},
			devDependencies: {
				'eslint': '^8.0.0',
				'prettier': '^2.8.0'
			}
		};
		jsonContent.scripts.lint = 'eslint . --fix';
		jsonContent.scripts.format = 'prettier --write "**/*.{js,json,yml,yaml}"';
		await writeJson(path.resolve(dir, 'package.json'), jsonContent, 'utf8');
	} catch (err) {
		throw new Error(chalk.bold.red(err));
	}
};

const createExtensionYml = async ctx => {
	const { options, dir } = ctx;
	try {
		const yamlContent = {
			name: options.extName,
			package: options.packageName,
			version: '1.0.0',
			description: options.description,
			author: options.author,
			license: 'MIT',
			repository: ''
		};
		await writeFile(
			path.resolve(dir, 'extension.yml'),
			YAML.stringify(yamlContent),
			'utf8'
		);
	} catch (err) {
		throw new Error(chalk.bold.red(err));
	}
};

const createInitialScript = async ctx => {
	const { options, dir } = ctx;
	try {
		await copyFile(
			path.resolve(__dirname, 'template', 'index.js'),
			path.resolve(dir, 'index.js')
		);
		const file = fs.readFileSync(path.resolve(dir, 'index.js'), 'utf8');
		const generatedFile = file.replace('Sample Extension', options.extName);
		const copyConfigFiles = async ctx => {
			const { dir } = ctx;
			try {
				const configFiles = [
					'.eslintrc.js',
					'.prettierrc.json',
					'.editorconfig',
					'.gitignore'
				];

				for (const file of configFiles) {
					await copyFile(
						path.resolve(__dirname, 'template', file),
						path.resolve(dir, file)
					);
				}
			} catch (err) {
				throw new Error(chalk.bold.red(err));
			}
		};

		const copyDocumentation = async ctx => {
			const { dir } = ctx;
			try {
				await copyFile(
					path.resolve(__dirname, 'template', 'EXTENSION_GUIDE.md'),
					path.resolve(dir, 'EXTENSION_GUIDE.md')
				);

				// Create a basic README
				const readmeContent = `# ${ctx.options.extName}

${ctx.options.description}

## Installation

1. Clone or download this extension
2. Run \`npm install\`

## Development

- \`npm run lint\` - Run ESLint
- \`npm run format\` - Format code with Prettier
- \`npm run build\` - Build the extension to \`.asar\` file

## Usage

After building, copy the \`.asar\` file from the \`dist/\` folder to your Deckboard extensions directory:
- Windows: \`%USERPROFILE%\\deckboard\\extensions\\\`
- macOS: \`~/deckboard/extensions/\`
- Linux: \`~/deckboard/extensions/\`

Then restart Deckboard.

## Documentation

See [EXTENSION_GUIDE.md](EXTENSION_GUIDE.md) for detailed development documentation.

## Author

${ctx.options.author}

## License

MIT
`;

				await writeFile(path.resolve(dir, 'README.md'), readmeContent, 'utf8');
			} catch (err) {
				throw new Error(chalk.bold.red(err));
			}
		};

		await writeFile(path.resolve(dir, 'index.js'), generatedFile, 'utf8');
	} catch (err) {
		throw new Error(chalk.bold.red(err));
	}
};

module.exports = {
	createProject
};
