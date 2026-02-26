const pageHelper = require('../../../../../helper/page_helper.js');
const helper = require('../../../../../helper/helper.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		formContent: [{
			type: 'text',
			val: '',
		}],

		cmptId: '', // 父页面editor或者rows控件id
		cmptFormName: '', // 父页面show-content对应表单的名字或者索引

		cmptParentId: '', //父页面包含rows控件的控件id

		upDirectDir: '',//直接上传的目录
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {

		let parent = pageHelper.getPrevPage(2);
		if (!parent) return;

		if (!options) return;

		if (!helper.isDefined(options.cmptId) || !helper.isDefined(options.cmptFormName)) return;
		let cmptId = '#' + options.cmptId;
		let cmptFormName = options.cmptFormName;

		// 父父页面控件id
		let cmptParentId = '';
		if (options.cmptParentId) cmptParentId = '#' + options.cmptParentId;
 
		let formContent = [];
		if (!cmptParentId)
			formContent = parent.selectComponent(cmptId).getOneFormVal(cmptFormName);
		else
			formContent = parent.selectComponent(cmptParentId).selectComponent(cmptId).getOneFormVal(cmptFormName);

		if (formContent.length == 0) {
			formContent = [{ type: 'text', val: '' }];
		}

		this.setData({
			cmptId,
			cmptFormName,
			cmptParentId,

			formContent
		});

		// 直接上传 与IS_DEMO结合使用
		if (options.upDirectDir) {
			this.setData({
				upDirectDir: options.upDirectDir
			});
		} 

		let curPage = pageHelper.getPrevPage(1);
		if (!curPage) return;
		if (curPage.options && curPage.options.source == 'admin') {
			wx.setNavigationBarColor({ //管理端顶部
				backgroundColor: '#2499f2',
				frontColor: '#ffffff',
			});
		}

	},




	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () { },

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

	},

	model: function (e) {
		pageHelper.model(this, e);
	},


	url: function (e) {
		pageHelper.url(e, this);
	},

	bindSaveTap: function (e) {
		// 获取富文本，如果没填写则为[]
		let formContent = this.selectComponent("#contentEditor").getNodeList();

		let parent = pageHelper.getPrevPage(2);
		if (!parent) return;

		if (!this.data.cmptParentId)
		parent.selectComponent(this.data.cmptId).setOneFormVal(this.data.cmptFormName, formContent);
		else
			parent.selectComponent(this.data.cmptParentId).selectComponent(this.data.cmptId).setOneFormVal(this.data.cmptFormName, formContent);

		wx.navigateBack();
	}
})