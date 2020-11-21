const AlbumBiz = require('../../biz/album_biz.js');
const pageHelper = require('../../helper/page_helper.js');
const PassportBiz = require('../../biz/passport_biz.js');
const setting = require('../../helper/setting.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) { 
		PassportBiz.initPage(this);
		
		this.setData({
			isOpenComment: setting.IS_OPEN_COMMENT
		});
		
		//设置搜索菜单
		this.setData(AlbumBiz.getSearchMenu());
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: async function () {
		if (!setting.TABBAR_IS_GUEST) {
			if (!await PassportBiz.loginMustRegWin(this)) return;  
		} 
		else { 
			PassportBiz.loginSilence(this);
			this.setData({isLogin:true});
		} 
 
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
		pageHelper.url(e);
	}, 
 
	myCommListListener: function (e) {
		pageHelper.commListListener(this, e); 
	}, 

})