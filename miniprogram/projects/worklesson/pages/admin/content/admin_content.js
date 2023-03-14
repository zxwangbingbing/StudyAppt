const AdminBiz = require('../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../helper/page_helper.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		formContent: [{
			type: 'text',
			val: '',
		}]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;

		let parent = pageHelper.getPrevPage(2);
		if (!parent) return;

		let formContent = parent.data.formContent;
		if (formContent && formContent.length > 0)
			this.setData({
				formContent
			});
	},




	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: async function () {

	},

	model: function (e) {
		pageHelper.model(this, e);
	},

	url: function (e) {
		pageHelper.url(e, this);
	},

	bindSaveTap: function (e) {
		let formContent = this.selectComponent("#contentEditor").getNodeList();

		let parent = pageHelper.getPrevPage(2);
		if (!parent) return;

		parent.setData({
			formContent
		}, () => {
			parent._setContentDesc();
		});

		wx.navigateBack();
	}
})