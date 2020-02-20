/*const fs = require('fs');

let obj = [];
for (var i = 0; i < 10000; i++) {
	obj.push({
		id: i,
		aspectRatio: 0.802675585284281,
		imagePath: '2019/06/04/20190604-114351/C54A766A-1021-4D4D-AE4F-748246A38290.jpg',
		imageDate: '2019-06-04T11:43:49.000Z'
	});
}

fs.writeFileSync('all.json', JSON.stringify(obj));*/
const Media = require('./lib/Media');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('/Users/Lukas/Downloads/ph.db', sqlite3.OPEN_READONLY);
const db2 = new sqlite3.Database('/Users/Lukas/Downloads/ph2.db');

let media = [];
db.each(
	`SELECT v.*, m.imagePath FROM RKVersion v
		LEFT JOIN RKMaster m ON v.masterId = m.modelId
	`,
	(err, row) => {
		if (err) {
			throw err;
		}

		media.push(new Media(this, row));
	},
	() => {
		db2.serialize(() => {
			db2.run('CREATE TABLE if not exists media (id INTEGER, uuid TEXT, name TEXT, orientation INTEGER, created TEXT, lastModified TEXT, synced INTEGER, sizeWidth INTEGER, sizeHeight INTEGER, aspectRatio REAL, masterSizeWidth INTEGER, masterSizeHeight INTEGER, masterAspectRatio REAL, fileName TEXT, imagePath TEXT, imageDate TEXT, cloudId TEXT, type INTEGER, masterId INTEGER)');
			const stmt = db2.prepare('INSERT INTO media VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
			media.forEach((m, i) => {
				console.log('running', i);
				stmt.run([
					m.id,
					m.uuid,
					m.name,
					m.orientation,
					m.created.toISOString(),
					m.lastModified.toISOString(),
					m.synced ? 1 : 0,
					m.size.width,
					m.size.height,
					m.aspectRatio,
					m.masterSize.width,
					m.masterSize.height,
					m.masterAspectRatio,
					m.fileName,
					m.imagePath,
					m.imageDate.toISOString(),
					m.cloudId,
					m.type,
					m.masterId
				]);
			});

			stmt.finalize();
			console.log('finalized');
		});
	}
);