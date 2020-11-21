/**
 * Notes: 业务基类
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-09-05 04:00:00 
 */

const AppError = require('../framework/handler/app_error.js');
const appCode = require('../framework/handler/app_code.js');
const timeUtil = require('../framework/utils/time_util.js');
const UserModel = require('../model/user_model.js');

class BaseService {
	constructor() {
		// 当前时间戳
		this._timestamp = timeUtil.time();
	}

	/**
	 * 抛出异常
	 * @param {*} msg 
	 * @param {*} code 
	 */
	AppError(msg, code = appCode.LOGIC) {
		throw new AppError(msg, code);
	}

	/**
	 * 与用户表联表查询 默认用户表参数
	 * @param {*} localField 
	 */
	getJoinUserParams(localField = '_openid') {
		return {
			from: 't_user',
			localField: localField,
			foreignField: 'USER_MINI_OPENID',
			as: 'USER_DETAIL',
		};
	}

	/**
	 * 与用户表联表查询 默认用户表输出字段
	 */
	getJoinUserFields() {
		return 'USER_DETAIL.USER_ITEM,USER_DETAIL.USER_NAME,USER_DETAIL.USER_PIC,USER_DETAIL.USER_MINI_OPENID,USER_DETAIL.USER_SEX';
	}

	/**
	 * 与用户表联表查询 默认用户表输出字段 for ADMIN
	 */
	getJoinUserFieldsAdmin() {
		return 'USER_DETAIL.USER_ITEM,USER_DETAIL.USER_NAME,USER_DETAIL.USER_MINI_OPENID,USER_DETAIL.USER_SEX';
	}


	/**
	 * 单独用户表 默认输出字段
	 */
	getUserFields() {
		return 'USER_NAME,USER_PIC,USER_SEX,USER_MINI_OPENID,USER_ITEM';
	}

	/** 
	 * 获取当前授权用户信息
	 * @param {*} openid  
	 */
	async getUserMyBase(userId, fields = this.getUserFields()) { 
		let where = {
			USER_MINI_OPENID: userId
		}
		return await UserModel.getOne(where, fields);
	}

	/** 
	 * 获取某个用户信息
	 * @param {*} openid  
	 */
	async getUserOne(userId, fields = this.getUserFields()) {
		let where = {
			USER_MINI_OPENID: userId
		}
		return await UserModel.getOne(where, fields);
	}
}

module.exports = BaseService;