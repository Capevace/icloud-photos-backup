const { coreDataDateToJSDate } = require('./helpers');

module.exports = class Media {
	constructor(library, row) {
		this.id = row.modelId;
		this.uuid = row.uuid;
		this.name = row.name;
		this.orientation = row.orientation; // 1 = 'correct', 6 = 'left'
		this.created = coreDataDateToJSDate(row.createDate);
		this.lastModified = coreDataDateToJSDate(row.lastModifiedDate);
		this.synced = Boolean(row.hasBeenSynced);
		this.size = { width: row.processedWidth, height: row.processedHeight };
		this.aspectRatio = this.size.width / this.size.height;
		this.masterSize = { width: row.masterWidth, height: row.masterHeight };
		this.masterAspectRatio = this.masterSize.width / this.masterSize.height;
		this.fileName = row.fileName;
		this.imagePath = row.imagePath;
		this.imageDate = coreDataDateToJSDate(row.imageDate);
		this.cloudId = row.cloudIdentifier;
		this.type = row.type;
		this.masterId = row.masterId;
	}
}