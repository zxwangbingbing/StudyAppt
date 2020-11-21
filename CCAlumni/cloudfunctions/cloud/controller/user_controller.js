/**
 * Notes: 用户模块控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-10-05 04:00:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */

const BaseController = require('./base_controller.js');
const UserModel = require('../model/user_model.js');
const UserService = require('../service/user_service.js');
const timeUtil = require('../framework/utils/time_util.js');

class UserController extends BaseController {
	/**
	 * 取得自我用户信息 
	 */
	async getMyDetail() {

		// 数据校验
		let rules = {
			fields: 'string|min:1|max:500|name=字段',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new UserService();
		return await service.getMyDetail(this._userId, input.fields);
	}

	/**
	 * 用户列表 
	 */
	async getUserList() {

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			whereEx: 'object|name=附加查询条件',
			page: 'required|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new UserService();
		let result = await service.getUserList(this._userId, input);

		// 数据格式化
		let list = result.list;
		for (let k in list) {
			list[k].USER_LOGIN_TIME = timeUtil.timestame2Ago(list[k].USER_LOGIN_TIME, 'Y-M-D');
			list[k].USER_BIRTH = timeUtil.getAge(list[k].USER_BIRTH);
		}
		result.list = list;

		return result;

	} 
	 

	/**
	 * 谁浏览了我
	 */
	async getVisitMeList() {
		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			page: 'required|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new UserService();
		let result = await service.getVisitMeList(this._userId, input);

		// 数据格式化
		let list = result.list;
		for (let k in list) {
			list[k].VISIT_ADD_TIME = timeUtil.timestame2Ago(list[k].VISIT_ADD_TIME, 'Y-M-D');
			list[k].USER_DETAIL.USER_BIRTH = timeUtil.getAge(list[k].USER_DETAIL.USER_BIRTH);
			list[k].USER_DETAIL.USER_WORK_DESC = UserModel.getDesc('WORK', list[k].USER_DETAIL.USER_WORK);
		}
		result.list = list;

		return result;
	}

	/**
	 * 我的邀请列表
	 */
	async getMyLinkList() {
		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			whereEx: 'object|name=附加查询条件',
			page: 'required|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new UserService();
		let result = await service.getMyLinkList(this._userId, input);

		// 数据格式化
		let list = result.list;
		for (let k in list) {
			list[k].USER_LOGIN_TIME = timeUtil.timestamp2Time(list[k].USER_LOGIN_TIME, 'Y-M-D');
			list[k].USER_BIRTH = timeUtil.getAge(list[k].USER_BIRTH);
			list[k].USER_WORK_DESC = UserModel.getDesc('WORK', list[k].USER_WORK);
		}
		result.list = list;

		return result;
	}

	/**
	 * 获得某个用户信息
	 */
	async getUser() {

		let rules = {
			userId: 'string|min:15|max:50|name=userId',
			isInfoList: 'bool|name=是否获取互助信息',
			isWellList: 'bool|name=是否获取福利信息',
			fields: 'string|name=显示字段',
		};


		// 取得数据
		let input = this.validateData(rules);

		let service = new UserService();
		return await service.getUser(input);

	}

	/**
	 * 用户资料单页
	 */
	async viewUser() { 

		let rules = {
			userId: 'id|required|name=userId',
			isActive: 'bool|name=是否获取动态', 
			fields: 'string|name=显示字段',
		};


		// 取得数据
		let input = this.validateData(rules);

		let service = new UserService();
		return await service.viewUser(this._userId, input);
	}
}

module.exports = UserController;