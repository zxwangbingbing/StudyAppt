const pageHelper = require('../helper/page_helper.js');
const dataHelper = require('../helper/data_helper.js');
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
						typeId: options.id,
					}
				});
			} else {
				this.setData({
					_params: {
						typeId: 0,
					}
				});
			}
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function () {},

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

		_setTypeTitle: function (skin, typeId = null) {

			wx.setNavigationBarTitle({
				title: skin.MEET_NAME
			});

			// 获取当前小程序的页面栈
			let pages = getCurrentPages();
			// 数组中索引最大的页面--当前页面
			let currentPage = pages[pages.length - 1];
			// 附加参数 
			if (currentPage.options && currentPage.options.id) {
				typeId = currentPage.options.id;
			}
			let typeList = dataHelper.getSelectOptions(skin.MEET_TYPE);
			for (let k in typeList) {
				if (typeList[k].val == typeId) {
					wx.setNavigationBarTitle({
						title: typeList[k].label
					});

					if (typeList[k].ext) { //样式
						this.setData({
							listMode: typeList[k].ext
						});
					} else {
						this.setData({
							listMode: 'rightpic'
						});
					}
				}
			}
			return '';

		}
	}
})