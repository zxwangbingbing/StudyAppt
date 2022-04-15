const pageHelper = require('../helper/page_helper.js');
const cloudHelper = require('../helper/cloud_helper.js');
const validate = require('../helper/validate.js');

module.exports = Behavior({

	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false
	},

	methods: {
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: async function (options) {
			await this._loadDetail();
		},

		_loadDetail: async function (e) {

			let opts = {
				title: 'bar'
			}
			let user = await cloudHelper.callCloudData('passport/my_detail', {}, opts);
			if (!user) {
				this.setData({
					isLoad: true,
					formName: '',
					formMobile: '',
					formCity: '',
					formWork: '',
					formTrade: ''
				});
				wx.setNavigationBarTitle({
					title: '注册'
				});
				return;
			};

			this.setData({ 
				isLoad: true,
				formName: user.USER_NAME,
				formMobile: user.USER_MOBILE,
				formTrade: user.USER_TRADE,
				formWork: user.USER_WORK,
				formCity: user.USER_CITY
			})
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
		onPullDownRefresh: async function () {
			await this._loadDetail();
			wx.stopPullDownRefresh();
		},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function () {

		},

		bindGetPhoneNumber: async function (e) {
			if (e.detail.errMsg == "getPhoneNumber:ok") {

				let cloudID = e.detail.cloudID;
				let params = {
					cloudID
				};
				let opt = {
					title: '手机验证中'
				};
				await cloudHelper.callCloudSumbit('passport/phone', params, opt).then(res => {
					let phone = res.data;
					if (!phone || phone.length < 11)
						wx.showToast({
							title: '手机号码获取失败，请重新绑定手机号码',
							icon: 'none',
							duration: 4000
						});
					else {
						let idx = pageHelper.dataset(e, 'idx');
						this._setForm(idx, phone);
					}
				});
			} else
				wx.showToast({
					title: '手机号码获取失败，请重新绑定手机号码',
					icon: 'none'
				});
		},
		bindGetPhoneNumber: async function (e) {
			if (e.detail.errMsg == "getPhoneNumber:ok") {

				let cloudID = e.detail.cloudID;
				let params = {
					cloudID
				};
				let opt = {
					title: '手机验证中'
				};
				await cloudHelper.callCloudSumbit('passport/phone', params, opt).then(res => {
					let phone = res.data;
					if (!phone || phone.length < 11)
						wx.showToast({
							title: '手机号码获取失败，请重新填写手机号码',
							icon: 'none',
							duration: 2000
						});
					else {
						this.setData({
							formMobile: phone
						});
					}
				});
			} else
				wx.showToast({
					title: '手机号码获取失败，请重新填写手机号码',
					icon: 'none'
				});
		},


		bindSubmitTap: async function (e) {
			try {
				let data = this.data;
				let mobile = data.formMobile;
				if (mobile.length != 11) return pageHelper.showModal('请填写正确的手机号码');

				let CHECK_FORM = {
					name: 'formName|must|string|min:1|max:20|name=姓名',
					mobile: 'formMobile|must|len:11|name=手机',
					city: 'formCity|string|max:100|name=所在城市',
					work: 'formWork|string|max:100|name=所在单位',
					trade: 'formTrade|string|max:100|name=行业领域',
				};
				// 数据校验 
				data = validate.check(data, CHECK_FORM, this);
				if (!data) return;

				let opts = {
					title: '提交中'
				}
				await cloudHelper.callCloudSumbit('passport/edit_base', data, opts).then(res => {
					let callback = () => {
						wx.navigateBack();
					}
					pageHelper.showSuccToast('提交成功', 1500, callback);
				});
			} catch (err) {
				console.error(err);
			}
		}
	}
})