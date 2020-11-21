const pageHelper = require('../../../helper/page_helper.js');
const helper = require('../../../helper/helper.js');
const PassportBiz = require('../../../biz/passport_biz.js');
const FootBiz = require('../../../biz/foot_biz.js');
const bizHelper = require('../../../helper/biz_helper.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		footList: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		PassportBiz.initPage(this);
		if (!await PassportBiz.loginMustReturnWin(this)) return;

		let footList = FootBiz.getFootList();
		this.setData({
			footList
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


	/**
	 * 查看详情
	 */
	bindDetailTap: async function (e) {
		let oid = e.currentTarget.dataset.oid;
		let type = e.currentTarget.dataset.type;

		if (!oid || !helper.isDefined(type)) return;
		let url = '';
		switch (type) {
			case bizHelper.TYPE.USER:
				url = '/pages/user/user_detail?id=' + oid;
				break;
			case bizHelper.TYPE.INFO:
				url = '/pages/info/info_detail?id=' + oid;
				break;
			case bizHelper.TYPE.MEET:
				url = '/pages/meet/meet_detail?id=' + oid;
				break;
			case bizHelper.TYPE.ALBUM:
				url = '/pages/album/album_detail?id=' + oid;
				break;
			case bizHelper.TYPE.NEWS:
				url = '/pages/news/news_detail?id=' + oid;
				break;
		}

		wx.navigateTo({
			url: url
		});
	},
})