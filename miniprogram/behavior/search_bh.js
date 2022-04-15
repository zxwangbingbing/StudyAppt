const SearchBiz = require('../biz/search_biz.js');
const pageHelper = require('../helper/page_helper.js');
const PassportBiz = require('../biz/passport_biz.js');

module.exports = Behavior({

	/**
	 * 页面的初始数据
	 */
	data: {
		type: '', // 来自哪个业务标识
		returnUrl: '', //搜索完返回哪个地址
		cacheName: '', //本业务搜索历史缓存
		search: '', //搜索关键字

		hisKeys: []
	},

	methods: {
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: async function (options) { 

			let type = options.type;
			let returnUrl = options.returnUrl;

			let cacheName = 'SERACH_HIS_' + type;

			let hisKeys = SearchBiz.getHistory(cacheName);
			if (hisKeys)
				this.setData({
					hisKeys
				});

			this.setData({
				hisKeys,
				type,
				cacheName,
				returnUrl
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

		url: function (e) {
			pageHelper.url(e, this);
		},


		/**
		 *  点击确认搜索
		 */
		bindSearchConfirm: function (e) {

			if (!this.data.type) return;

			let search = this.data.search.trim();
			if (!search) return;

			// 历史记录
			let hisKeys = SearchBiz.addHistory(this.data.cacheName, search);
			this.setData({
				search,
				hisKeys
			});

			let prevPage = pageHelper.getPrevPage();
			// 直接调用上一个页面的setData()方法，把数据存到上一个页面中去
			prevPage.setData({
				search,
			})
			wx.navigateBack({
				delta: 0,
			});

		},

		// 清空搜索记录
		bindDelHisTap: function (e) {
			SearchBiz.clearHistory(this.data.cacheName);
			this.setData({
				hisKeys: []
			});
		},

		//清除关键字
		bindClearKeyTap: function (e) {
			this.setData({
				search: ''
			});
		},

		// 点击历史
		bindKeyTap: function (e) {
			let search = e.currentTarget.dataset.key.trim();
			if (search) {
				this.setData({
					search
				});
				this.bindSearchConfirm(e);
			}
		}
	}

})