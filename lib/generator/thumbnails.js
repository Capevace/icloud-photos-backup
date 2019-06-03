const fs = require('fs-extra');
const sharp = require('sharp');
const { progress } = require('../helpers');

const basePath = '/Users/mat/Pictures/Photos Library.photoslibrary/Masters/';

module.exports.generateThumbnails = async function generateThumbnails(
	outputFolder,
	medias
) {
	let promises = [];

	medias.forEach(media => {
		promises.push(
			new Promise(async resolve => {
				try {
					const outputImagePath = outputFolder + '/' + media.imagePath;

					if (await fs.exists(outputImagePath)) {
						progress().increment(1);
						resolve();
						return;
					}
				
					await fs.mkdirp(outputImagePath.substring(0, outputImagePath.lastIndexOf('/')));

					await sharp(basePath + media.imagePath)
						.resize(300)
						.jpeg({quality: 50})
						.toFile(outputImagePath);
				} catch (e) {
					// log something idk
				}

				progress().increment(1);
				resolve();
			})
		);
	});

	await Promise.all(promises);
};
