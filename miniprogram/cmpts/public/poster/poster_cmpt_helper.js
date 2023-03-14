const cloudHelper = require('../../../helper/cloud_helper.js');

async function config1({
	cover,
	title,
	desc,
	qr,
	bg = ''
}) {
	if (cover.startsWith('cloud'))
		cover = await cloudHelper.getTempFileURLOne(cover);

	if (qr.startsWith('cloud'))
		qr = await cloudHelper.getTempFileURLOne(qr);

	let posterConfig = {
		width: 480, // rpx
		height: 650,
		backgroundColor: '#eeeeee'
	};
	if (bg) posterConfig.backgroundColor = bg;


	let blocks = [];
	blocks = [{
		x: 30,
		y: 30,
		backgroundColor: '#ffffff',
		width: 420,
		height: 590,
		borderRadius: 20
	}];

	let texts = [];
	texts = [{
		x: 50,
		y: 350,
		text: title,
		width: 360,
		lineNum: 2,
		lineHeight: 40,
		fontSize: 26,
		color: '#000000',
		textAlign: 'left',
		zIndex: 9999
	},
	{
		x: 55,
		y: 510,
		text: '长按识别小程序码',
		fontSize: 18,
		color: '#aaaaaa',
		zIndex: 9999
	}, {
		x: 55,
		y: 540,
		text: desc,
		fontSize: 18,
		color: '#aaaaaa',
		zIndex: 9999
	}];

	let images = [];
	if (cover) {
		images.push({ // 底图
			x: 40,
			y: 40,
			url: cover,
			width: 400,
			height: 260,
			zIndex: 999
		});
	}

	if (qr) {
		images.push({ // 小程序码
			x: 310,
			y: 460,
			url: qr,
			width: 120,
			height: 120
		});
	}

	posterConfig.texts = texts;
	posterConfig.blocks = blocks
	posterConfig.images = images;

	return posterConfig;
}


module.exports = {
	config1
}