const path = require('path');
const fs = require('fs');
const tempfile = require('tempfile');
const sqlite3 = require('sqlite3').verbose();
const arrayToTree = require('array-to-tree');
const Album = require('./Album');
const Folder = require('./Folder');
const Media = require('./Media');

module.exports = class PhotosLibrary {
	constructor(libraryPath) {
		this.libraryPath = libraryPath;
		this.originalDatabasePath = path.resolve(this.libraryPath, 'database/photos.db');

		if (!fs.existsSync(this.originalDatabasePath))
			throw new Error(`No database found at "${this.originalDatabasePath}"`);

		this.tempDatabasePath = tempfile('.db');

		// Copy the original db to a temp file to workaround the lock
		this._copyDbToTemp();

		// Open the database in read-only mode
		this.db = new sqlite3.Database(this.tempDatabasePath, sqlite3.OPEN_READONLY);
	}

	/**
	 * Copy the contents of the original database file to a temp file to work around the db lock.
	 */
	_copyDbToTemp() {
		const dbContent = fs.readFileSync(this.originalDatabasePath);
		fs.writeFileSync(this.tempDatabasePath, dbContent);
	}

	/**
	 * Get all the folders (also nested ones) in the Photos library.
	 *
	 * @async
	 * @return {Array.<Folder>} An array of folders. Each folder has a `folders` property which contains a folders subfolders.
	 */
	getFolders(restrictToAlbum = null) {
		return new Promise(resolve => {
			const query = !restrictToAlbum
				? `SELECT * FROM RKFolder`
				: `SELECT a.*, f.* FROM RKFolder f
						LEFT JOIN RKAlbum a ON a.folderUuid = f.uuid
						WHERE a.modelId = ${restrictToAlbum}
				`;

			this.db.all(
				query,
				async (err, rows) => {
					if (err)
						throw err;

					const rowsTree = arrayToTree(rows, {
						parentProperty: 'parentFolderUuid',
	  					customID: 'uuid'
					});

					const folders = [];

					for (const row of rowsTree) {
						if (row.isInTrash) continue;

						const folder = new Folder(this, row);
						await folder.initFolder();

						folders.push(folder);
					}

					resolve(folders);
				}
			);
		});
	}

	/**
	 * Get all media for a given album.
	 *
	 * @async
	 * @param  {int} albumId The albums id.
	 * @return {Array.<Media>} An array of all the media objects in the album.
	 */
	getMediaForAlbum(albumId) {
		return new Promise(resolve => {
			let media = [];

			this.db.each(
				`SELECT v.*, m.imagePath FROM RKVersion v
					LEFT JOIN RKMaster m ON v.masterId = m.modelId
					LEFT JOIN RKAlbumVersion av ON av.versionId = v.modelId
					WHERE av.albumId = ${parseInt(albumId)}
				`,
				(err, row) => {
					if (err) {
						throw err;
					}

					media.push(new Media(this, row));
				},
				() => resolve(media)
			);
		});
	}

	/**
	 * Get all albums in a given folder.
	 *
	 * @async
	 * @param  {string} folderUuid The folder's uuid.
	 * @return {Array.<Album>} An array made up of all the albums in the folder.
	 */
	getAlbumsInFolder(folderUuid) {
		return new Promise(resolve => {
			let albums = [];

			this.db.each(
				`SELECT * FROM RKAlbum WHERE folderUuid = '${folderUuid}'`,
				(err, row) => {
					if (err) {
						throw err;
					}

					if (!row.name || row.isInTrash) return;

					albums.push(new Album(this, row));
				},
				() => resolve(albums)
			);
		});
	}
}