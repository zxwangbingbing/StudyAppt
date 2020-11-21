const cloudHelper = require('../../helper/cloud_helper.js');
const helper = require('../../helper/helper.js');
const bizHelper = require('../../helper/biz_helper.js');
const pageHelper = require('../../helper/page_helper.js');
const PassportBiz = require('../../biz/passport_biz.js');
const FootBiz = require('../../biz/foot_biz.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,

		isShowBase: true,
		isFav: -1,
		isOpenSet: false //资料公开方式
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		PassportBiz.initPage(this);
		PassportBiz.setSetup(this);

		if (!await PassportBiz.loginMustRegWin(this)) return;
		if (!pageHelper.getId(this, options)) return;

		this._loadDetail();
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

	_loadDetail: async function () {
		let id = this.data.id;
		if (!id) return;

		let params = {
			userId: id,
			isActive: true
		};
		let opt = {
			hint: false
		};
		let user = await cloudHelper.callCloudData('user/view', params, opt);
		if (!user) {
			this.setData({
				isLoad: null
			})
			return;
		}

		user.USER_LOGIN_TIME = helper.timestamp2Time(user.USER_LOGIN_TIME, 'Y-M-D');

		// 资料公开方式
		let isOpenSet = false;
		if (user.USER_OPEN_SET == 2) {
			if (PassportBiz.getType() >= 2)
				isOpenSet = true;
		} else if (user.USER_OPEN_SET == 1) {
			isOpenSet = true;
		}

		// 处理动态
		if (user.USER_ACTIVE) {
			for (let i in user.USER_ACTIVE) {
				let node = user.USER_ACTIVE[i];
				let type = node.type;
				node.timeShow = helper.timestame2Ago(node.time);
				switch (type) {
					case 'info':
						node.url = '/pages/info/info_detail?id=' + node._id;
						node.title = '发布了互助 《' + node.title + '》';
						break;
					case 'meet':
						node.url = '/pages/meet/meet_detail?id=' + node._id;
						node.title = '发布了活动《' + node.title + '》';
						break;
					case 'join':
						node.url = '/pages/meet/meet_detail?id=' + node._id;
						node.title = '报名了活动《' + node.title + '》';
						break;
					case 'album':
						node.url = '/pages/album/album_detail?id=' + node._id;
						node.title = '发布了相册《' + node.title + '》';
						break;
				}
			}
		}

		this.setData({
			isLoad: true,
			user,
			isOpenSet
		});

		this._isFav(id);

		// 足迹
		FootBiz.addFoot(id, bizHelper.TYPE.USER, user.USER_NAME);
	},

	_isFav: function (id) {
		let params = {
			oid: id,
			type: 0,
		};
		cloudHelper.callCloudSumbitAsync('fav/is_fav', params).then(result => {
			this.setData({
				isFav: result.data.isFav
			});
		}).catch(error => {})
	},

	bindShowTap: function () {
		this.setData({
			isShowBase: !this.data.isShowBase
		});
	},

	// 点击收藏/取消
	bindFavTap: async function () {

		let params = {
			oid: this.data.id,
			type: 0
		}
		let opts = {
			title: (this.data.isFav == 0) ? '关注中' : '取消中'
		}
		try {
			let result = await cloudHelper.callCloudSumbit('fav/update', params, opts);
			this.setData({
				isFav: result.data.isFav
			});

		} catch (e) {
			console.log(e);
		}
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: PassportBiz.getUserName() + '向您推荐了校友' + this.data.user.USER_NAME,
			path: '/pages/user/user_detail?id=' + this.data.id,
		}
	},

	url: function (e) {
		pageHelper.url(e);
	},

	top: function (e) {
		// 回页首事件
		pageHelper.top();
	},

	onPageScroll: function (e) {
		// 回页首按钮
		pageHelper.showTopBtn(e, this);

	},
})