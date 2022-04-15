const pageHelper = require('../helper/page_helper.js');
const PassportBiz = require('../biz/passport_biz.js');

module.exports = Behavior({

	/**
	 * 页面的初始数据
	 */
	data: {
		type: -1, //0-需要注册提示 1=用户异常提示 2=认证中提示 9=自定义错误
		msg: ''
	},

	methods: {
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: async function (options) { 

			let type = -1;
			let msg = (options && options.msg) ? decodeURIComponent(options.msg) : '';

			if (options && options.type) type = options.type;

			this.setData({
				type,
				msg
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
		}
	}

})