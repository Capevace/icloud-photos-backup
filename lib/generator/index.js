const path = require('path');
const fs = require('fs-extra');
const { promisify } = require('util');
const { progress } = require('../helpers');
const { generateThumbnails } = require('./thumbnails');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const copy = promisify(fs.copy);
const mkdir = promisify(fs.mkdir);
const ensureSymlink = promisify(fs.ensureSymlink);

/**
 * Create a directory if it doesn't exist yet.
 *
 * @param {string} path The path to the folder to create.
 */
async function mkdirIfNotExists(path) {
	if (!(await fs.exists(path))) await mkdir(path);
}

/**
 * Load the images and videos for a given album and return the total count of media in that folder.
 *
 * Once the media is loaded, it is cached within the Album class so it doesn't need to be
 * fetched from the database again.
 * The total count of media also includes subfolder.
 * Gets called recursively.
 *
 * @param {Folder} folder The folder to load the media for.
 * @return {int} The total count of media in that folder (including subfolders).
 */
async function loadMedia(folder) {
	let mediaCount = 0;

	for (const album of folder.albums) {
		progress().increment(0, { album: album.name, action: 'loadMedia' });

		const media = await album.media();
		mediaCount += media.length;

		progress().increment(1);
	}

	for (const subfolder of folder.folders) {
		mediaCount += await loadMedia(subfolder);
	}

	return mediaCount;
}

/**
 * Process the images and videos for a given album and return the total count of media in that folder.
 *
 * If specified at launch, this will generate the thumbnails for the images.
 *
 * @param {Folder} folder The folder to process the media from.
 * @param {Object} options Options for processing.
 * @param {Bool} options.thumbnails Wether to generate thumbnails or not.
 * @param {string} options.albumsDir The directory to put the album JSON files into.
 * @param {string} options.thumbnailsDir The directory to put the thumbnails into.
 */
async function processMedia(
	library,
	folder,
	options = { albumsDir: '', thumbnailsDir: '', symlinksDir: '', thumbnails: false, symlinks: false }
) {
	// If we want to generate the album based symlinks, we have to establish the basepath for the current folder here.
	// This traverses up the tree of parentFolders and builds up the path to the current folder.
	// This will be used to generate the symlinks later.
	let folderBasePath = '';
	if (options.symlinks) {
		let parentFolder = folder;
		while (parentFolder) {
			folderBasePath = parentFolder.name + '/' + folderBasePath;
			parentFolder = parentFolder.parentFolder;
		}
	}

	for (const album of folder.albums) {
		const medias = await album.media();

		progress().increment(0, {
			album: `${album.name} (${medias.length})`,
			action: 'writeAlbumJSON'
		});

		await writeFile(
			`${options.albumsDir}/${album.uuid}.json`,
			JSON.stringify(medias)
		);

		if (options.symlinks) {
			progress().increment(0, {
				album: `${album.name} (${medias.length})`,
				action: 'generateSymlinks'
			});

			for (const media of medias) {
				const masterPath = library.libraryPath + '/Masters/' + media.imagePath;
				const newPath = path.resolve(options.symlinksDir, folderBasePath, media.fileName);

				try {
					await ensureSymlink(masterPath, newPath);
				} catch (e) {
					// Error handling when not downloaded from icloud/file doesnt exist
				}
			}
		}

		if (options.thumbnails) {
			progress().increment(0, {
				album: `${album.name} (${medias.length})`,
				action: 'generateThumbnail'
			});

			await generateThumbnails(
				library,
				options.thumbnailsDir,
				await album.media()
			);
		}
	}

	for (const subfolder of folder.folders) {
		await processMedia(library, subfolder, options);
	}
}

/**
 * Generate the static web application for a given folder structure.
 * @param {string} outputFolder The output folder to put the web app in.
 * @param {PhotosLibrary} library The parsed .photosLibrary class.
 * @param {Array.<Folder>} folders The folder structure to process.
 * @param {Object} options The options for generation.
 * @param {Object} options.shouldGenerateThumbnails - Wether thumbnails should be generated or not.
 */
module.exports = async function generateWebApp(
	outputFolder,
	library,
	folders,
	options = { 
		shouldGenerateThumbnails: false, 
		shouldGenerateFolderSymlinks: false
	}
) {
	progress().update(0, { action: 'generateSkeleton' });

	// Resolve the output folder using the current working directory.
	// Useful so the user can specify the output folder easier.
	const outputPath = path.resolve(process.cwd(), outputFolder);

	// Copy the HTML template folder to the output folder
	await copy(path.resolve(__dirname, '../../template/dist/index.html'), outputPath + '/index.html');
	await copy(path.resolve(__dirname, '../../template/dist/index.css'), outputPath + '/index.css');
	await copy(path.resolve(__dirname, '../../template/dist/index.js'), outputPath + '/index.js');
	await copy(path.resolve(__dirname, '../../template/dist/assets'), outputPath + '/assets');

	// If the /data/ folder doesn't exist yet, create it
	const dataDir = path.resolve(outputPath, 'data');
	await mkdirIfNotExists(dataDir);

	// Write the folder structure json file.
	await writeFile(dataDir + '/folders.json', JSON.stringify(folders));

	// If the /albums/ folder doesn't exist yet, create it
	const albumsDir = path.resolve(dataDir, 'albums');
	await mkdirIfNotExists(albumsDir);

	// If the /thumbnails/ folder doesn't exist yet, create it
	const thumbnailsDir = path.resolve(dataDir, 'thumbnails');
	await mkdirIfNotExists(thumbnailsDir);

	// If the /thumbnails/ folder doesn't exist yet, create it
	const symlinksDir = path.resolve(dataDir, 'media_structured');
	await mkdirIfNotExists(symlinksDir);

	// Ensure a symlink from the library to the output direcroty exists
	await ensureSymlink(path.resolve(library.libraryPath, 'Masters'), path.resolve(dataDir, 'media'));

	// Total Count of albums to be processed.
	const albumCount = folders.reduce((total, folder) => {
		return total + folder.countAlbums();
	}, 0);

	// Set the total progress to the album count so we can see them loading
	progress().update(0, { action: 'loadMedia', album: '' });
	progress().setTotal(albumCount);

	// Load & count Media
	let totalMediaCount = 0;
	for (const folder of folders) {
		totalMediaCount += await loadMedia(folder);
	}

	// Update progress bar to process media
	progress().update(0, { action: 'processMedia', album: '' });
	progress().setTotal(totalMediaCount);

	// Process media & generate thumbnails (if enabled)
	for (const folder of folders) {
		await processMedia(library, folder, {
			thumbnails: options.shouldGenerateThumbnails,
			symlinks: options.shouldGenerateFolderSymlinks,
			thumbnailsDir,
			symlinksDir,
			albumsDir
		});
	}
};
