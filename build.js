const asar = require('asar');
const chalk = require('chalk');
const fs = require('fs-extra');
const Listr = require('listr');
const path = require('path');
const yaml = require('yaml');
const os = require('os');
const { DestroyerOfModules } = require('galactus');
const { Observable } = require('rxjs');
const { promisify } = require('util');

const extDir = path.join(os.homedir(), '/deckboard/extensions');
const access = promisify(fs.access);
const projectDir = process.cwd();
const ymlDir = path.resolve(process.cwd(), 'extension.yml');
const tempDir = path.join(os.tmpdir(), '.temp');
const outputDir = path.join(process.cwd(), 'dist');
const gitDir = path.join(tempDir, '.git');

const destroyer = new DestroyerOfModules({
	rootDirectory: tempDir
});

const buildExtension = async (install = false) => {
	const tasks = new Listr([
		{
			title: 'Checking package info',
			task: ctx => checkYamlPackageFile(ctx)
		},
		{
			title: 'Preparing files',
			task: () => createTemporaryFolder()
		},
		{
			title: 'Packaging extension files',
			task: ctx => createExtensionPackage(ctx)
		},
		...(install
			? [
				{
					title: 'Copy package to extensions folder',
					task: ctx => copyPackageToExtension(ctx)
				}
			]
			: [])
	]);

	await tasks.run();

	console.log(chalk.bold.green('DONE'), 'Packaging finished!');
};

const checkYamlPackageFile = async ctx => {
	try {
		await fs.remove(outputDir);

		await access(ymlDir, fs.constants.R_OK);
		const file = fs.readFileSync(ymlDir, 'utf8');
		ctx.packageInfo = yaml.parse(file);
	} catch (err) {
		throw new Error(
			chalk.bold.red(
				`${projectDir} is not Deckboard extension project. extension.yml file not found!`
			)
		);
	}
};

const createTemporaryFolder = async () =>
	new Observable(async observer => {
		try {
			observer.next('Copy files to temp folder');
			await fs.copy(projectDir, tempDir, {
				filter: (src) => {
					// Exclude development and build-time files
					const excludePatterns = [
						/node_modules[\\\/]\.cache/,
						/node_modules[\\\/]\.bin/,
						/\.git/,
						/\.vscode/,
						/\.idea/,
						/dist[\\\/]/,
						/coverage[\\\/]/,
						/\.eslintrc\./,
						/\.prettierrc\./,
						/\.editorconfig/,
						/\.DS_Store/,
						/Thumbs\.db/,
						/\.log$/,
						/\.md$/i,
						/\.test\.js$/,
						/\.spec\.js$/,
						/test[\\\/]/,
						/tests[\\\/]/,
						/__tests__[\\\/]/,
						/\.github[\\\/]/,
						/\.travis\.yml/,
						/\.npmignore/,
						/tsconfig\.json/,
						/jest\.config\.js/,
						/EXTENSION_GUIDE\.md/
					];

					return !excludePatterns.some(pattern => pattern.test(src));
				}
			});

			try {
				observer.next('Delete devDependencies modules');
				await destroyer.destroy();

				// Additional cleanup to minimize size
				observer.next('Cleaning unnecessary files');
				const cleanupPaths = [
					path.join(tempDir, 'node_modules', '.cache'),
					path.join(tempDir, 'node_modules', '.bin'),
					path.join(tempDir, '.git'),
					path.join(tempDir, '.vscode'),
					path.join(tempDir, '.idea')
				];

				for (const cleanPath of cleanupPaths) {
					try {
						await fs.remove(cleanPath);
					} catch (err) {
						// Ignore if path doesn't exist
					}
				}

				// Remove all markdown files except README if present
				const files = await fs.readdir(tempDir);
				for (const file of files) {
					if (file.match(/\.md$/i) && file !== 'README.md') {
						await fs.remove(path.join(tempDir, file));
					}
				}
			} catch (err) {
				observer.error();
				throw new Error(chalk.bold.red(err));
			}
			observer.complete();
		} catch (err) {
			observer.error(err);
		}
	});

const createExtensionPackage = async ctx =>
	new Observable(async observer => {
		try {
			observer.next('Package files');

			await asar.createPackage(
				tempDir,
				path.join(outputDir, ctx.packageInfo.package + '.asar')
			);

			observer.next('Delete temp folder');
			await fs.remove(tempDir);
		} catch (err) {
			observer.error();
			throw new Error(chalk.bold.red(err));
		}
		observer.complete();
	});

const copyPackageToExtension = async ctx =>
	new Observable(async observer => {
		try {
			observer.next('Copy package to extensions folder');

			await fs.copy(
				path.join(outputDir, ctx.packageInfo.package + '.asar'),
				path.join(extDir, ctx.packageInfo.package + '.asar'),
			);
		} catch (err) {
			observer.error();
			throw new Error(chalk.bold.red(err));
		}
		observer.complete();
	});

module.exports = {
	buildExtension
};
