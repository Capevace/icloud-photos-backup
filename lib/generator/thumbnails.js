const fs = require('fs-extra');
const sharp = require('sharp');
const { progress } = require('../helpers');

module.exports.generateThumbnails = async function generateThumbnails(
	library,
	outputFolder,
	medias
) {
	const basePath = `${library.libraryPath}/Masters`;

	let promises = [];
	let missing = 0;
	medias.forEach(media => {
		promises.push(
			new Promise(async resolve => {
				try {
					const outputImagePath = outputFolder + '/' + media.imagePath;

					if (await fs.exists(outputImagePath)) {
						missing++;
						progress().increment(1);
						resolve();
						return;
					}
				
					await fs.mkdirp(outputImagePath.substring(0, outputImagePath.lastIndexOf('/')));

					await sharp(basePath + '/' + media.imagePath)
						.rotate() // rotate by utilizing the EXIF data in the picture
						.resize(300)
						.jpeg({quality: 50})
						.toFile(outputImagePath);
				} catch (e) {
					// log something idk
					// TODO: ERROR LOGGING HERE!
					// console.log('error', e, basePath + '/' + media.imagePath);
				}

				progress().increment(1);
				resolve();
			})
		);
	});

	await Promise.all(promises);
};
