/**
 * Notes: 用户控制模块
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2022-01-22 10:20:00 
 */

const BaseAdminController = require('./base_admin_controller.js');

const UserModel = require('../../model/user_model.js');
const LogModel = require('../../model/log_model.js');
const AdminUserService = require('../../service/admin/admin_user_service.js');
const timeUtil = require('../../../framework/utils/time_util.js');

class AdminUserController extends BaseAdminController { 


	/** 用户信息 */
	async getUserDetail() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'required|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminUserService();
		let user = await service.getUser({
			userId: input.id
		});

		if (user) {
			// 显示转换  
			user.USER_ADD_TIME = timeUtil.timestamp2Time(user.USER_ADD_TIME);
			user.USER_LOGIN_TIME = user.USER_LOGIN_TIME ? timeUtil.timestamp2Time(user.USER_LOGIN_TIME) : '未登录';
		}

		return user;
	}


	/** 用户列表 */
	async getUserList() {
		await this.isAdmin();

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

		let service = new AdminUserService();
		let result = await service.getUserList(input);

		// 数据格式化
		let list = result.list;
		for (let k in list) {
			list[k].USER_STATUS_DESC = UserModel.getDesc('STATUS', list[k].USER_STATUS);
			list[k].USER_ADD_TIME = timeUtil.timestamp2Time(list[k].USER_ADD_TIME);
			list[k].USER_LOGIN_TIME = list[k].USER_LOGIN_TIME ? timeUtil.timestamp2Time(list[k].USER_LOGIN_TIME) : '未登录';

		}
		result.list = list;
		return result;
	} 

	/** 删除用户 */
	async delUser() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'required|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let name = await this.getNameBeforeLog('user', input.id);

		let service = new AdminUserService();
		await service.delUser(input.id);

		this.log('删除了客户「' + name + '」', LogModel.TYPE.USER);

	}
}

module.exports = AdminUserController;