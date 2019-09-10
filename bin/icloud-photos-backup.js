#! /usr/bin/env node

const yargs = require('yargs');

yargs
	.command(
		'build [library]',
		'Build the web app',
		yargs =>
			yargs
				.usage('Usage: $0 build [library] <options>')
				.positional('library', {
					describe: 'The .photosLibrary to parse.',
					required: true
				})
				.option('output', {
					alias: 'o',
					default: 'output'
				})
				.describe('o', 'Set the output folder')
				.option('album', {
					alias: 'a',
					default: false
				})
				.describe('a', 'Limit execution to an album')
				.option('progress', {
					alias: 'p',
					default: true
				})
				.describe('p', 'Show the processing progress')
				.option('thumbnails', {
					alias: 't',
					default: false
				})
				.describe('t', 'Generate thumbnails')
				.argv,
		buildWebApp
	)
	.help('h')
	.alias('h', 'help')
	.usage('Usage: $0 <command> [options]')
	.demandCommand().argv;

async function buildWebApp(argv) {
	if (!argv.library) {
		console.error(
			'You need to specify a path to your iCloud Photos .photosLibrary file.'
		);
		process.exit(1);
	}

	const { progress, setShowProgress } = require('../lib/helpers');
	const { PhotosLibrary } = require('../lib');
	const generateOutputFolder = require('../lib/generator');

	setShowProgress(argv.progress === true || argv.progress === 'true');

	progress().start(1, 0, { album: '', action: 'readLibrary' });

	const library = new PhotosLibrary(argv.library);

	progress().increment(0, { album: '', action: 'loadFolders' });

	const folders = await library.getFolders(argv.album);
	await generateOutputFolder(argv.output, library, folders, {
		shouldGenerateThumbnails:
			argv.thumbnails === true || argv.thumbnails === 'true'
	});

	progress().update(1, { action: 'done', album: '' });
	progress().setTotal(1);
	progress().stop();
}
