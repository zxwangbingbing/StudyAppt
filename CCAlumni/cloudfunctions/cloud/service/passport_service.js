/**
 * Notes: passport模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-10-14 07:48:00 
 */

const BaseService = require('./base_service.js');
const bizUtil = require('../comm/biz_util.js');
const timeUtil = require('../framework/utils/time_util.js');
const cloudUtil = require('../framework/cloud/cloud_util.js');
const cloudBase = require('../framework/cloud/cloud_base.js');
const UserModel = require('../model/user_model.js');  
const appCode = require('../framework/handler/app_code.js');
const config = require('../comm/config.js');
const miniLib = require('../framework/lib/mini_lib.js');

class PassportService extends BaseService {


	/**
	 * 修改用户头像
	 * @param {*} userId 
	 * @param {*} fileID 
	 * @returns {url} 图片网络地址
	 */
	async updatePic(userId, fileID) {
		let where = {
			USER_MINI_OPENID: userId
		};
		let user = await UserModel.getOne(where, 'USER_PIC_CLOUD_ID');
		if (!user) return;

		let url = await cloudUtil.getTempFileURLOne(fileID);
		let data = {
			USER_PIC_CLOUD_ID: fileID,
			USER_PIC: url
		};
		await UserModel.edit(where, data);

		// 异步删除老的 
		if (user.USER_PIC_CLOUD_ID)
			cloudUtil.deleteFiles([user.USER_PIC_CLOUD_ID]);
 

		return {
			url
		};

	}

	/**
	 * 修改用户资料
	 * @param {*} formData=表单填写数据
	 */
	async modifyBase(userId, {
		formData
	}) {

		// 表单值
		let data = {};

		data.USER_NAME = formData.name;

		data.USER_SEX = formData.sex;
		data.USER_BIRTH = formData.birth;

		data.USER_OPEN_SET = formData.openSet;
		data.USER_MOBILE = formData.mobile;
		data.USER_WECHAT = formData.wechat;
		data.USER_EMAIL = formData.email;
		data.USER_QQ = formData.qq;

		data.USER_RESOURCE = formData.resource;
		data.USER_DESC = formData.desc;

		data.USER_EDU = formData.edu;
		data.USER_NATIVE = formData.native;
		data.USER_ENROLL = formData.enroll;
		data.USER_GRAD = formData.grad;

		data.USER_CITY = formData.city;
		data.USER_ITEM = formData.item;

		data.USER_COMPANY = formData.company;
		data.USER_COMPANY_DEF = formData.companyDef;
		data.USER_COMPANY_DUTY = formData.companyDuty;
		data.USER_TRADE = formData.trade;
		data.USER_WORK_STATUS = formData.workStatus;

		let where = {
			USER_MINI_OPENID: userId
		};
		await UserModel.edit(where, data);
 
	}


	/**
	 * 注册用户
	 * @param {*} formData=表单填写数据,wechatData微信授权数据,phone授权的手机数据
	 */
	async register(userId, {
		phone,
		formData,
		inviteData,
		wechatData
	}) {
		// 判断唯一性
		let whereCnt = {
			USER_MINI_OPENID: userId
		}
		let cnt = await UserModel.count(whereCnt);
		if (cnt) {
			// 已经存在
			return await this.login(userId);
		}

		// 判断邀请信息
		let inviteId = '';
		if (inviteData && inviteData.code) {

			let where = {
				USER_ID: inviteData.code,
				USER_STATUS: UserModel.STATUS.COMM
			}
			let parentUser = await UserModel.getOne(where, 'USER_MINI_OPENID');
			if (parentUser) inviteId = parentUser.USER_MINI_OPENID;

		}
  

		// 表单值
		let data = {};

		// 设定值    
		data.USER_PHONE_CHECKED = phone; // 已校验的手机号码
		data.USER_PIC = wechatData.avatarUrl; //默认头像 
		data.USER_MINI_OPENID = userId;
		data.USER_INVITE_ID = inviteId;

		data.USER_NAME = formData.name;

		// 是否审核
		data.USER_STATUS = UserModel.STATUS.COMM;

		data.USER_SEX = formData.sex;
		data.USER_BIRTH = formData.birth;

		data.USER_EDU = formData.edu;
		data.USER_NATIVE = formData.native;
		data.USER_ENROLL = formData.enroll;
		data.USER_GRAD = formData.grad;

		data.USER_CITY = formData.city;
		data.USER_ITEM = formData.item;


		// 微信值
		data.USER_WX_GENDER = wechatData.gender;
		data.USER_WX_AVATAR_URL = wechatData.avatarUrl;
		data.USER_WX_NICKNAME = wechatData.nickName;
		data.USER_WX_LANGUAGE = wechatData.language;
		data.USER_WX_CITY = wechatData.city;
		data.USER_WX_PROVINCE = wechatData.province;
		data.USER_WX_COUNTRY = wechatData.country;
		data.USER_WX_UPDATE_TIME = this._timestamp;

		await UserModel.insert(data);
 

		 

		return await this.login(userId);
	}
 

	/**
	 * 登录
	 */
	async login(userId) {


		let where = {
			'USER_MINI_OPENID': userId
		};
		let fields = 'USER_ID,USER_SEX,USER_MINI_OPENID,USER_ITEM,USER_NAME,USER_PIC,USER_STATUS,USER_WORK';
		let user = await UserModel.getOne(where, fields);


		let token = {};
		if (user) {
			if (user.USER_STATUS == UserModel.STATUS.PEDDING || user.USER_STATUS == UserModel.STATUS.DEL)
				this.AppError('用户状态异常，无法登陆', appCode.USER_EXCEPTION);

			if (user.USER_STATUS == UserModel.STATUS.UNUSE)
				this.AppError('用户审核中', appCode.USER_CHECK);

			token.id = user.USER_MINI_OPENID;
			token.key = user.USER_ID;
			token.name = user.USER_NAME;
			token.pic = user.USER_PIC;
			token.status = user.USER_STATUS;
			token.item = user.USER_ITEM;
			token.sex = user.USER_SEX;

			// 异步更新最近更新时间
			let dataUpdate = {
				USER_LOGIN_TIME: this._timestamp
			};
			UserModel.edit(where, dataUpdate);
			UserModel.inc(where, 'USER_LOGIN_CNT', 1);

		} else
			token = null;

		return {
			token
		};
	}

	/**
	 * 获取手机号码
	 */
	async getPhone(cloudID) {
		let cloud = cloudBase.getCloud();
		let res = await cloud.getOpenData({
			list: [cloudID], // 假设 event.openData.list 是一个 CloudID 字符串列表
		});
		if (res && res.list && res.list[0] && res.list[0].data) {
			return res.list[0].data.phoneNumber;
		} else
			return '';
	}

	 
 
}

module.exports = PassportService;