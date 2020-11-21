const cloudHelper = require('../../../helper/cloud_helper.js');
const helper = require('../../../helper/helper.js');
const pageHelper = require('../../../helper/page_helper.js');
const UserBiz = require('../../../biz/user_biz.js');
const PassportBiz = require('../../../biz/passport_biz.js');
const validate = require('../../../helper/validate.js'); 

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,

		eduOptions: UserBiz.EDU_OPTIONS,
		companyDefOptions: UserBiz.COMPANY_DEF_OPTIONS,
		workStatusOptions: UserBiz.WORK_STATUS_OPTIONS,

		formEduIndex: 0,
		formCompanyDefIndex: 0,
		formWorkStatusIndex: 0
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		PassportBiz.initPage(this);
		
		if (!await PassportBiz.loginMustReturnWin(this)) return;

		// 取得用户信息 
		let params = {
			fields: 'USER_EDU,USER_ITEM,USER_ID,USER_PIC,USER_NAME,USER_WORK,USER_BIRTH,USER_SEX,USER_CITY,USER_NATIVE,USER_OPEN_SET,USER_MOBILE,USER_QQ,USER_WECHAT,USER_EMAIL,USER_ENROLL,USER_GRAD,USER_COMPANY,USER_COMPANY_DEF,USER_COMPANY_DUTY,USER_TRADE,USER_CITY,USER_WORK_STATUS,USER_DESC,USER_RESOURCE'
		};
		let opts = {
			title: 'bar'
		}
		let user = await cloudHelper.callCloudData('user/my_detail', params, opts);
		user = helper.model2Form(user);

		let formEduIndex = UserBiz.EDU_OPTIONS.indexOf(user.formEdu);
		formEduIndex = (formEduIndex < 0) ? 0 : formEduIndex;

		let formWorkStatusIndex = UserBiz.WORK_STATUS_OPTIONS.indexOf(user.formWorkStatus);
		formWorkStatusIndex = (formWorkStatusIndex < 0) ? 0 : formWorkStatusIndex;

		let formCompanyDefIndex = UserBiz.COMPANY_DEF_OPTIONS.indexOf(user.formCompanyDef);
		formCompanyDefIndex = (formCompanyDefIndex < 0) ? 0 : formCompanyDefIndex;

		this.setData({
			...user,
			isLoad: true,
			formEduIndex,
			formWorkStatusIndex,
			formCompanyDefIndex
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

	bindSubmitForm: async function (e) {
		let data = this.data;
		data.formEdu = UserBiz.EDU_OPTIONS[data.formEduIndex];
		data.formWorkStatus = UserBiz.WORK_STATUS_OPTIONS[data.formWorkStatusIndex];
		data.formCompanyDef = UserBiz.COMPANY_DEF_OPTIONS[data.formCompanyDefIndex];

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

			trade: 'formTrade|string|min:2|max:50|name=当前行业',
			workStatus: 'formWorkStatus|string|min:2|max:50|name=工作状态',
			company: 'formCompany|string|min:2|max:50|name=工作单位',
			companyDef: 'formCompanyDef|string|min:2|max:50|name=单位性质',
			companyDuty: 'formCompanyDuty|string|min:2|max:50|name=工作职位',

			openSet: 'formOpenSet|required|int|len:1|in:1,8|name=联系方式公开方式',
			mobile: 'formMobile|string|min:2|max:50|name=电话',
			wechat: 'formWechat|string|min:2|max:50|name=微信',
			email: 'formEmail|email|min:2|max:50|name=Email',
			qq: 'formQq|string|min:2|max:50|name=QQ',

			desc: 'formDesc|string|max:500|name=自我介绍',
			resource: 'formResource|string|max:500|name=需求与资源',
		}


		data = validate.check(data, checkRules, this);
		if (!data) return;
		if (Number(data.enroll) > Number(data.grad))
			return pageHelper.showModal('开始年份不能大于结束年份');

		let params = {
			formData: data
		};
		await cloudHelper.callCloudSumbit('passport/modify', params).then(result => {
			wx.redirectTo({
				url: '../reload/my_reload',
			});
		}).catch(err => {
			console.log(err);
		});

	},


	model: function (e) {
		let that = this;
		pageHelper.model(that, e);
	},

	bindAvatarTap: async function () {
		UserBiz.chooseAvatar(this.data.formId, 'my_base');
	}

})