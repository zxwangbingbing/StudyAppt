const pageHelper = require('../../helper/page_helper.js');
const validate = require('../../helper/validate.js');
const UserBiz = require('../../biz/user_biz.js');
const RegBiz = require('../../biz/reg_biz.js');
const cloudHelper = require('../../helper/cloud_helper.js');
const PassportBiz = require('../../biz/passport_biz.js');
const cacheHelper = require('../../helper/cache_helper.js');
const setting = require('../../helper/setting.js');
const helper = require('../../helper/helper.js');
const comm = require('../../helper/comm.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		formSex: 1,
		formEduIndex: 3,
		eduOptions: UserBiz.EDU_OPTIONS
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		PassportBiz.initPage(this);

		if (await PassportBiz.isRegister(this)) return;

		// 判断是否有phone认证
		if (!RegBiz.isStep1())
			return wx.redirectTo({
				url: 'reg_step1',
			});

		if (!RegBiz.isStep2())
			return wx.redirectTo({
				url: 'reg_step2',
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

	model: function (e) {
		let that = this;
		pageHelper.model(that, e);
	},

	bindSubmitForm: async function (e) {
		let data = this.data;
		data.formEdu = UserBiz.EDU_OPTIONS[data.formEduIndex];

		// 判断是否有phone认证和微信授权
		if (!RegBiz.isStep1() || !RegBiz.isStep2())
			return wx.redirectTo({
				url: 'reg_step1',
			});

		// 数据清洗与校验
		let checkRules = {
			name: 'formName|required|string|min:2|max:20|name=姓名',
			sex: 'formSex|required|int|len:1|in:1,2|name=性别',
			item: 'formItem|required|string|min:2|max:50|name=班级',
			birth: 'formBirth|required|date|name=生日',
			enroll: 'formEnroll|required|int|len:4|name=入学年份',
			grad: 'formGrad|required|int|len:4|name=毕业年份',

			city: 'formCity|required|string|min:2|max:50|name=所在城市',
			native: 'formNative|required|string|min:2|max:50|name=籍贯',
			edu: 'formEdu|required|string|min:2|max:50|name=学历',
		}


		data = validate.check(data, checkRules, this);
		if (!data) return;
		if (data.work == 1 && Number(data.enroll) > Number(data.grad))
			return pageHelper.showModal('入学年份不能大于毕业年份');

		let opt = {
			title: '注册中'
		};
		let params = {};
		params.wechatData = RegBiz.getRegCache('user');
		params.phone = RegBiz.getRegCache('phone');
		params.inviteData = RegBiz.getRegCache('invite');
		params.formData = data;


		await cloudHelper.callCloudSumbit('passport/reg', params, opt).then(result => {
			cacheHelper.clear(); 
			if (result && helper.isDefined(result.data.token) && result.data.token) {
				cacheHelper.set(comm.CACHE_TOKEN, result.data.token, setting.PASSPORT_TOKEN_EXPIRE);

				// 清除注册缓存
				RegBiz.clearRegCache();
				pageHelper.showSuccToast('注册成功！');

				setTimeout(() => {
					wx.redirectTo({
						url: '/pages/my/reload/my_reload',
					});
				}, 1500);

			} else if (result && result.data && result.data === 'CODE_WAITCHECK') {
				pageHelper.hint('注册成功！正在等待系统审核', 'reLaunch');
			} else
				pageHelper.showModal('注册遇到了一点小问题，请重新提交');
		}).catch(err => {
			console.log(err)
		});

	},
})