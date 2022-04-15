/**
 * Notes: 后台HOME/登录模块 
 * Date: 2021-03-15 07:48:00 
 */

const BaseAdminService = require('./base_admin_service.js');

const dataUtil = require('../../../framework/utils/data_util.js');
const cacheUtil = require('../../../framework/utils/cache_util.js');

const cloudBase = require('../../../framework/cloud/cloud_base.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const config = require('../../../config/config.js');
const AdminModel = require('../../model/admin_model.js');
const LogModel = require('../../model/log_model.js');

const UserModel = require('../../model/user_model.js');
const MeetModel = require('../../model/meet_model.js');
const NewsModel = require('../../model/news_model.js');
const JoinModel = require('../../model/join_model.js');

class AdminHomeService extends BaseAdminService {

	/**
	 * 首页数据归集
	 */
	async adminHome() {
		let where = {};

		let userCnt = await UserModel.count(where);
		let meetCnt = await MeetModel.count(where);
		let newsCnt = await NewsModel.count(where);
		let joinCnt = await JoinModel.count(where);
		return {
			userCnt,
			meetCnt,
			newsCnt,
			joinCnt
		}
	}

	/** 清除缓存 */
	async clearCache() {
		await cacheUtil.clear();
	}

	/**
	 * 管理员登录
	 * @param {*} cloudID 
	 */
	async adminLogin(name, password) {

		if (name != config.ADMIN_NAME)
			this.AppError('管理员账号或密码不正确');

		if (password != config.ADMIN_PWD)
			this.AppError('管理员账号或密码不正确');


		// 判断是否存在
		let where = {
			ADMIN_STATUS: 1
		}
		let fields = 'ADMIN_ID,ADMIN_NAME,ADMIN_TYPE,ADMIN_LOGIN_TIME,ADMIN_LOGIN_CNT';
		let admin = await AdminModel.getOne(where, fields);
		if (!admin)
			this.AppError('管理员不存在');

		let cnt = admin.ADMIN_LOGIN_CNT;

		// 生成token
		let token = dataUtil.genRandomString(32);
		let tokenTime = timeUtil.time();
		let data = {
			ADMIN_TOKEN: token,
			ADMIN_TOKEN_TIME: tokenTime,
			ADMIN_LOGIN_TIME: timeUtil.time(),
			ADMIN_LOGIN_CNT: cnt + 1
		}
		await AdminModel.edit(where, data);

		let type = admin.ADMIN_TYPE;
		let last = (!admin.ADMIN_LOGIN_TIME) ? '尚未登录' : timeUtil.timestamp2Time(admin.ADMIN_LOGIN_TIME);

		// 写日志
		this.insertLog('登录了系统', admin, LogModel.TYPE.SYS);

		return {
			token,
			name: admin.ADMIN_NAME,
			type,
			last,
			cnt
		}

	}


}

module.exports = AdminHomeService;