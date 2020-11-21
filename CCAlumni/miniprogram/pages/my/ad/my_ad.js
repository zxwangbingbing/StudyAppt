import Poster from '../../../cmpts/lib/wxa-plugin-canvas/poster/poster.js'
import PassportBiz from '../../../biz/passport_biz.js';
import cloudHelper from '../../../helper/cloud_helper.js';
let AD_HEIGHT_STEP = 0; //高度差 490则没有图片

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		adShare: '',
		user: null,
		current: 0,
		proList: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		PassportBiz.initPage(this);
		
		if (!await PassportBiz.loginMustReturnWin(this)) return;

		// 取得设置
		let opts = {
			'title': 'bar'
		};
		let setup = await cloudHelper.callCloudData('home/setup', {}, opts);
		if (!setup) return;

		// 取得用户信息 
		let user = await cloudHelper.callCloudData('user/my_detail', {}, opts);
		if (!user) return;

		this.setData({
			proList:setup.SETUP_AD_PIC,
			user,
			setup
		});

		this.catchCreatePosterTap(0);
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	bindPosterSuccessListener(e) {
		let adShare = e.detail;
		this.setData({
			adShare
		});
	},

	bindPosterFailListener(e) {
		console.log(e);
	},

	bindPreviewTap: function () {
		wx.previewImage({
			current: [this.data.adShare], // 当前显示图片的http链接
			urls: [this.data.adShare] // 需要预览的图片http链接列表
		})
	},

	/**
	 * 异步生成海报
	 */
	catchCreatePosterTap: async function (idx) {
		if (!this.data.proList || this.data.proList.length == 0)
			AD_HEIGHT_STEP = 490;

		let posterConfig = {
			width: 458,
			height: 815 - AD_HEIGHT_STEP,
			pixelRatio: 3,
			backgroundColor: '#fff',
			debug: false,
		}

		let images = [];
		images = [{
			//avatar
				x: 40,
				y: 30,
				url: this.data.user.USER_PIC,
				width: 50,
				height: 50,
				borderRadius:10
			}, 
			{ //小程序码
				x: 40,
				y: 700 - AD_HEIGHT_STEP,
				url: this.data.user.USER_MINI_QRCODE.url,
				width: 100,
				height: 100,
				zIndex: 999
			}
		];

		if (this.data.proList && this.data.proList.length) {
			let mainImg = {  //主图
				x: 40,
				y: 200,
				url: this.data.proList[idx],
				width: 378,
				height: 490 - AD_HEIGHT_STEP,
			}
			images.push(mainImg);
		}
	

		let texts = [];
		texts = [{
			//姓名专业
				x: 110,
				y: 60,
				text: this.data.user.USER_NAME,
				fontSize: 20,
				color: 'black',

			},
			{
				x: 40,
				y: 140,
				text: '邀请你加入',
				fontSize: 26,
				color: 'black',

			},
			{
				//学校名称
				x: 40,
				y: 180,
				text: this.data.setup.SETUP_TITLE,
				fontSize: 26,
				color: 'black',

			}, {
				x: 280,
				y: 750 - AD_HEIGHT_STEP,
				text: '长按识别小程序码',
				fontSize: 18,
				color: '#aaaaaa',

			},
			{
				x: 350,
				y: 780 - AD_HEIGHT_STEP,
				text: '马上加入',
				fontSize: 18,
				color: '#669900',

			}

		];

		let lines = [];
		lines = [{
			startX: 15,
			startY: 100,
			endX: 443,
			endY: 100,
			width: 1,
			color: '#efefef'

		}, {
			startX: 15,
			startY: 720 - AD_HEIGHT_STEP,
			endX: 443,
			endY: 720 - AD_HEIGHT_STEP,
			width: 1,
			color: '#efefef'

		}, ];

		posterConfig.images = images;
		posterConfig.texts = texts;
		posterConfig.lines = lines;

		this.setData({
			posterConfig: posterConfig
		}, async () => {
			await Poster.create(true);
		});

	},

	onPosterFail: function (e) {
		console.log(e)
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},



	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function (res) {

		return {
			title: '我是来自的' + this.data.user.USER_NAME + ', 诚邀您加入',
			//imageUrl: this.data.adShare,
			path: '/pages/passport/reg_step1?pid=&code=' + this.data.user.USER_ID,
		}
	},

	bindPicChange: async function (e) {
		let idx = e.detail.current;
		await this.catchCreatePosterTap(idx);
	},

	prevImg: function () {
		let current = this.data.current;
		current = current < (this.data.proList.length - 1) ? current + 1 : 0;
		this.setData({
			current,
		})
	},

	nextImg: function () {
		let current = this.data.current;
		current = current > 0 ? current - 1 : this.data.proList.length - 1;
		this.setData({
			current,
		})
	},
})