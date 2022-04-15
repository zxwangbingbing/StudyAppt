const AdminBiz = require('../../../../biz/admin_biz.js');
const pageHelper = require('../../../../helper/page_helper.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isSuperAdmin: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		if (!AdminBiz.isAdmin(this)) return;

		//设置搜索菜单
		this.setData(this._getSearchMenu());

		this.setData({
			isSuperAdmin: AdminBiz.isSuperAdmin(),
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
	onShow: async function () {},

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

	url: async function (e) {
		pageHelper.url(e, this);
	},

	bindCommListCmpt: function (e) {
		pageHelper.commListListener(this, e);
	},


	_getSearchMenu: function () {

		let sortItems = [];
		let sortMenus = [{
				label: '全部',
				type: '',
				value: ''
			}, {
				label: '系统',
				type: 'type',
				value: 99
			},
			{
				label: '用户',
				type: 'type',
				value: 0
			},
			{
				label: '内容/文章',
				type: 'type',
				value: 2
			},
			{
				label: '预约/活动',
				type: 'type',
				value: 1
			}
		]

		return {
			sortItems,
			sortMenus
		}

	}

})