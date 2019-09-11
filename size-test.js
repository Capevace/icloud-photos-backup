const fs = require('fs');

let obj = [];
for (var i = 0; i < 10000; i++) {
	obj.push({
		id: i,
		aspectRatio: 0.802675585284281,
		imagePath: '2019/06/04/20190604-114351/C54A766A-1021-4D4D-AE4F-748246A38290.jpg',
		imageDate: '2019-06-04T11:43:49.000Z'
	});
}

fs.writeFileSync('all.json', JSON.stringify(obj));