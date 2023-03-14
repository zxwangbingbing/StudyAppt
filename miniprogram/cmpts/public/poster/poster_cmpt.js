/*
https://github.com/jasondu/wxa-plugin-canvas
### 标准尺寸：
width: 375, // rpx
height: 670,

### 父页面分享按钮取值
onShareAppMessage: function (e) {
	let img = e.target.dataset.img;
	return {
		title: 'xxx',
		imageUrl: img,
		path: 'xxxx',
	}
}
*/
import Poster from '../../../cmpts/public/poster/wxa-plugin-canvas/poster/poster.js'
const pageHelper = require('../../../helper/page_helper.js');
const picHelper = require('../../../helper/pic_helper.js');
const helper = require('../../../helper/helper.js');

Component({
	externalClasses: ['poster-class'],

	options: {
		addGlobalClass: true,
		multipleSlots: true
	},

	/**
	 * 组件的属性列表
	 */
	properties: {
		config: { // 图形参数
			type: Object,
			value: null,
		},
		isQr: { // 是否叠加小程序码
			type: Boolean,
			value: false
		},
		isFace: { // 是否叠加头像
			type: Boolean,
			value: false
		},
		doPoster: {  
			type: Boolean,
			value: true
		},
		show: { // 显示
			type: Boolean,
			value: false
		},
		img: { //图片文件
			type: String,
			value: ''
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		isLoad: false,
	},

	lifetimes: {
		attached: function () {

		},
		ready: function () {
			this._init();
		},
		detached: function () {
			// 在组件实例被从页面节点树移除时执行
		},
	},

	/**
	 * 组件的方法列表 
	 */
	methods: {
		_init: async function () {

		},

		bindPosterTap: function (e) {
			this.setData({
				isCreate:true,
				isLoad: false,
			}, async () => {
				await this.createPoster();
			});
		},
		bindCloseTap: function () {
			this.setData({
				show: false
			});
		},

		/**
		 * 异步生成海报
		 */
		createPoster: async function () {
			// TODO:根据屏幕大小来生成，但是没有负定位

			let posterConfig = {
				width: 480, // rpx
				height: 650,
				pixelRatio: 2, // 2 为原始大小
				backgroundColor: '#345678',
				debug: false,
			}

			let config = this.data.config;
			if (!helper.isDefined(config['width']))
				config.width = posterConfig.width;

			if (!helper.isDefined(config['height']))
				config.height = posterConfig.height;

			if (!helper.isDefined(config['pixelRatio']))
				config.pixelRatio = posterConfig.pixelRatio;

			if (!helper.isDefined(config['backgroundColor']))
				config.backgroundColor = posterConfig.backgroundColor;

			if (!helper.isDefined(config['debug']))
				config.debug = posterConfig.debug;

			//Object.assign(posterConfig, this.data.config); // TODO有问题

			this.setData({
				posterConfig: config
			}, async () => {
				await Poster.create(true, this);
			});

		},

		onPosterFail: function (e) {
			console.log(e)
		},

		bindPosterSuccessListener(e) {
			let img = e.detail;
			this.setData({
				img,
				isLoad: true
			});

		},

		url: function (e) {
			pageHelper.url(e, this);
		},

		bindPosterFailListener(e) {
			console.log(e);
		},

		bindSaveTap: function (e) {
			let that = this;
			let callback = function () {
				wx.saveImageToPhotosAlbum({
					filePath: that.data.img,
					success: function (data) {
						wx.showToast({
							title: '保存成功',
							icon: 'success',
							duration: 1000
						})
					},
				});
			}

			picHelper.getWritePhotosAlbum(callback);
		}


	}
})