const RegBiz = require('../../biz/reg_biz.js');
const PassportBiz = require('../../biz/passport_biz.js');
const pageHelper = require('../../helper/page_helper.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) { 
		PassportBiz.initPage(this);
		
		if (await PassportBiz.isRegister(this)) return;

		// 判断是否有phone认证
		if (!RegBiz.isStep1())
			return wx.redirectTo({
				url: 'reg_step1',
			});
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

	bindGetUserInfo: async function (e) {
		await RegBiz.registerStep2(e);
	},

	url: function (e) {
		pageHelper.url(e, this);
	} 

})