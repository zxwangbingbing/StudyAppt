const WorkBiz = require('../../../../biz/work_biz.js');
const behavior = require('../../../admin/meet/join/admin_meet_join_bh.js');

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
	onLoad: function (options) {
		if (!WorkBiz.isWork(this)) return;

		this._init(options);

	},

})