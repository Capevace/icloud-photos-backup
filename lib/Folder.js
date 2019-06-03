const { coreDataDateToJSDate } = require('./helpers');

module.exports = class Folder {
	constructor(library, row) {
		this.library = library;
		this.id = row.modelId;
		this.uuid = row.uuid;
		this.name = row.name;
		this.cloudId = row.cloudIdentifier;
		this.synced = row.hasBeenSynced;
		this.created = coreDataDateToJSDate(row.createDate);
		this.magic = Boolean(row.isMagic);
		this.parentFolderUuid = row.parentFolderUuid;

		this.albums = []; // will be initialized in initFolder method

		this.folders = [];

		if (row.children) {
			row.children.forEach(child => {
				if (child.isInTrash) return;
				
				const folder = new Folder(this.library, child);
				this.folders.push(folder);
			});	
		}
	}

	async initFolder() {
		this.albums = await this.library.getAlbumsInFolder(this.uuid);

		for (const folder of Object.values(this.folders)) {
			await folder.initFolder();
		}
	}

	countAlbums(folder) {
		let count = this.albums.length;

		return this.folders.reduce((total, folder) => {
			return total + folder.countAlbums();
		}, count);
	}

	toJSON() {
		return {
			...this,
			library: undefined
		}
	}
}