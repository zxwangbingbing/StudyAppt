import WeCropper from '../../../lib/we-cropper/we-cropper.js' 
const PassportBiz = require('../../../biz/passport_biz.js');
const UserBiz = require('../../../biz/user_biz.js');  
const pageHelper = require('../../../helper/page_helper.js');

const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50

Page({
	data: {
		formId: '',
		source: 'my_base',
		cropperOpt: {
			id: 'cropper',
			targetId: 'targetCropper',
			pixelRatio: device.pixelRatio,
			width,
			height,
			scale: 2.5,
			zoom: 8,
			cut: {
				x: (width - 300) / 2,
				y: (height - 300) / 2,
				width: 300,
				height: 300
			},
			boundStyle: {
				color: '#04b00f',
				mask: 'rgba(0,0,0,0.8)',
				lineWidth: 1
			}
		}
	},

	onLoad: async function (options) {
		PassportBiz.initPage(this);
		
		if (!await PassportBiz.loginMustReturnWin(this)) return;

		if (!options || !options.id || !options.src) return;

		if (options.source) {
			this.setData({
				source: options.source
			});
		}

		this.setData({
			formId: options.id
		});

		const {
			cropperOpt
		} = this.data;
		cropperOpt.src = options.src;
		this.cropper = new WeCropper(cropperOpt)
			.on('ready', (ctx) => {
				//console.log(`wecropper is ready for work!`)
			})
			.on('beforeImageLoad', (ctx) => {
				//console.log(`before picture loaded, i can do something`)
				//console.log(`current canvas context:`, ctx)
				wx.showToast({
					title: '上传中',
					icon: 'loading',
					duration: 20000
				});
			})
			.on('imageLoad', (ctx) => {
				//console.log(`picture loaded`)
				//console.log(`current canvas context:`, ctx)
				wx.hideToast();
			})
			.on('beforeDraw', (ctx, instance) => {
				//console.log(`before canvas draw,i can do something`)
				//console.log(`current canvas context:`, ctx)
			})

	},

	touchStart: function (e) {
		this.cropper.touchStart(e);
	},
	touchMove: function (e) {
		this.cropper.touchMove(e);
	},
	touchEnd: function (e) {
		this.cropper.touchEnd(e);
	},

	getCropperImage: async function () {
		let that = this;
		wx.showLoading({
		  title: '头像上传中',
		});
		this.cropper.getCropperImage(async function (path, err) {
			if (err) {
				wx.showModal({
					title: '温馨提示',
					content: err.message
				});
			} else {
				//上传逻辑
				await UserBiz.uploadAvatar(path, that.data.source, that.data.formId);  
			} 
		})
		
	},

	uploadTap: function () {
		let that = this;
		wx.chooseImage({
			count: 1, // 默认9
			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success(res) {
				const src = res.tempFilePaths[0];
				//  获取裁剪图片资源后，给data添加src属性及其值 
				that.cropper.pushOrign(src);
			}
		})
	},

})