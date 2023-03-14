const WorkBiz = require('../../../../biz/work_biz.js');
const behavior = require('../../../admin/meet/time/admin_meet_time_bh.js');

Page({

	behaviors: [behavior],

	/**
	 * 页面的初始数据
	 */
	data: {
		oprt: 'work'
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!WorkBiz.isWork(this)) return;

		this._init();
	},

})