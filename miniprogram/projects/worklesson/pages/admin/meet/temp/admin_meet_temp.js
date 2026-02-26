const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const behavior = require('./admin_meet_temp_bh.js');

Page({


	behaviors: [behavior],

	/**
	 * 页面的初始数据
	 */
	data: {  
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;

		await this._loadList();
	},


})