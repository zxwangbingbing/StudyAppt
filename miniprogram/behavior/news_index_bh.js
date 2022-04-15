const NewsBiz = require('../biz/news_biz.js');
const pageHelper = require('../helper/page_helper.js');
let dataHelper = require('../helper/data_helper.js');
const setting = require('../setting/setting.js');

module.exports = Behavior({

	/**
	 * 页面的初始数据
	 */
	data: {

	},

	methods: {
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: async function (options) {
			if (options && options.id) {
				this.setData({
					_params: {
						cateId: options.id,
					}
				});
			} else {
				this.setData({
					_params: {
						cateId: 0,
					}
				});
			}
			
			if (setting.IS_SUB) wx.hideHomeButton();
			
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function () {},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: async function () {
			/*
			// 获取当前小程序的页面栈
			let pages = getCurrentPages();
			// 数组中索引最大的页面--当前页面
			let currentPage = pages[pages.length - 1];
			// 附加参数 
			if (currentPage.options && currentPage.options.id) {
				this.setData({
					_params: {
						cateId: currentPage.options.id,
					}
				});
			}
			*/
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

		_setCateTitle: function (skin, cateId = null) {

			// 获取当前小程序的页面栈
			let pages = getCurrentPages();
			// 数组中索引最大的页面--当前页面
			let currentPage = pages[pages.length - 1];
			// 附加参数 
			if (currentPage.options && currentPage.options.id) {
				cateId = currentPage.options.id;
			}
			let cateList = dataHelper.getSelectOptions(skin.NEWS_CATE);
			for (let k in cateList) {
				if (cateList[k].val == cateId) {
					wx.setNavigationBarTitle({
						title: cateList[k].label
					});

					if (cateList[k].ext) { //样式
						this.setData({
							listMode: cateList[k].ext
						});
					} else {
						this.setData({
							listMode: 'leftbig'
						});
					}

				}
			}
			return '';

		}
	}
})