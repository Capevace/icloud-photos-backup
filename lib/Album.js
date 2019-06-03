const { coreDataDateToJSDate } = require('./helpers');

module.exports = class Album {
	constructor(library, row) {
		this.library = library;
		this.id = row.modelId;
		this.uuid = row.uuid;
		this.cloudId = row.cloudIdentifier;
		this.name = row.name;
		this.type = row.albumType;
		this.magic = Boolean(row.isMagic);
		this.created = coreDataDateToJSDate(row.createDate);
		this.folderUuid = row.folderUuid;

		this._media = null;
	}

	async media() {
		if (this._media)
			return this._media;

		this._media = await this.library.getMediaForAlbum(this.id);

		return this._media;
	}

	toJSON() {
		return {
			...this,
			library: undefined
		}
	}
}