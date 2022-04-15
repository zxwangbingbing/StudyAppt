const MeetBiz = require('../biz/meet_biz.js');
const pageHelper = require('../helper/page_helper.js');
const cloudHelper = require('../helper/cloud_helper.js');

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
		onLoad: function (options) {
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
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function () {

		},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function () {

		},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function () {

		},

		url: async function (e) {
			pageHelper.url(e, this);
		},

		bindCommListCmpt: function (e) {
			pageHelper.commListListener(this, e);
		},

		/** 搜索菜单设置 */
		getSearchMenu: function (skin, that) {

			wx.setNavigationBarTitle({
				title: '我的' + skin.MEET_NAME
			});

			let sortItem1 = [{
				label: '排序',
				type: '',
				value: ''
			}, {
				label: '按时间倒序',
				type: 'timedesc',
				value: ''
			}, {
				label: '按时间正序',
				type: 'timeasc',
				value: ''
			}];

			let sortItems = [sortItem1];
			let sortMenus = [{
					label: '全部',
					type: '',
					value: ''
				}, {
					label: '今日',
					type: 'today',
					value: ''
				}, {
					label: '明日',
					type: 'tomorrow',
					value: ''
				}, {
					label: '已预约',
					type: 'succ',
					value: ''
				},
				{
					label: '已取消',
					type: 'cancel',
					value: ''
				}
			]

			that.setData({
				sortItems,
				sortMenus
			});

		},
		bindCancelTap: async function (e) {
			let callback = async () => {
				let joinId = pageHelper.dataset(e, 'id');
				try {
					let params = {
						joinId
					}
					let opts = {
						title: '取消中'
					}

					await cloudHelper.callCloudSumbit('my/my_join_cancel', params, opts).then(res => {
						pageHelper.modifyListNode(joinId, this.data.dataList.list, 'JOIN_STATUS', 10, '_id');
						this.setData({
							dataList: this.data.dataList
						});
						pageHelper.showNoneToast('已取消');
					});
				} catch (err) {
					console.log(err);
				}
			}

			pageHelper.showConfirm('确认取消该预约?', callback);
		}
	}
})