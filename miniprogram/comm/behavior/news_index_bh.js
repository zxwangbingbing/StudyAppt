const BaseBiz = require('../../comm/biz/base_biz.js');
const pageHelper = require('../../helper/page_helper.js');
module.exports = Behavior({
	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,
		_params: null,

		sortMenus: [],
		sortItems: []
	},

	methods: {
		/**
			* 生命周期函数--监听页面加载
			*/
		onLoad: async function (options) {

		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function () { },

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: async function () {

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

		url: async function (e) {
			pageHelper.url(e, this);
		},

		bindCommListCmpt: function (e) {
			pageHelper.commListListener(this, e);
		},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function () {

		},

		_setCate(cateList, options, cateId = null) {
			if (cateId) {
				if (options) options.id = cateId;

			} 

			if (options && options.id) {
			this.setData({
					isLoad: true,
				_params: {
						cateId: options.id,
				}
			});
				BaseBiz.setCateTitle(cateList, cateId);
			} else {
				this._getSearchMenu(cateList);
				this.setData({
					isLoad: true
				});
			} 

		},

		_getSearchMenu: function (cateList) {

			let sortItem1 = [{
				label: '全部',
				type: 'cateId',
				value: ''
			}];

			sortItem1 = sortItem1.concat(cateList);
			if (sortItem1.length <= 2) return;


			let sortItems = [];
			let sortMenus = sortItem1;
						this.setData({
				sortItems,
				sortMenus
			})

				}

	}
})