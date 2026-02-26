const pageHelper = require('../../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');


module.exports = Behavior({
	/**
	 * 页面的初始数据
	 */
	data: {

		oprt: 'admin',

		isLoad: true,
		title: '',
	},

	methods: {
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

		bindScanTap: function (e) {
			let meetId = this.data.meetId;
			let that = this;
			wx.scanCode({
				async success(res) { 
					if (!res ||
						!res.result ||
						!res.result.includes('meet=') ||
						res.result.length != 20) {
						pageHelper.showModal('错误的预约码，请重新扫码');
						return;
					}

					let code = res.result.replace('meet=', '');
					let params = {
						meetId,
						code
					};
					let options = {
						title: '预约码核销中'
					}
					await cloudHelper.callCloudSumbit(that.data.oprt + '/join_scan', params, options).then(res => {
						pageHelper.showModal('核销成功');

					}).catch(err => {
						console.log(err);
					});
				},
				fail(err) {
					if (err && err.errMsg == 'scanCode:fail')
						pageHelper.showModal('预约码核销错误，请重新扫码');
				}
			});
		}
	}
})