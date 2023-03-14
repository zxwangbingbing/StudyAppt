/**
 * Notes: 用户控制模块
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2022-01-22 10:20:00 
 */

const BaseProjectAdminController = require('./base_project_admin_controller.js');

const UserModel = require('../../model/user_model.js');
const AdminUserService = require('../../service/admin/admin_user_service.js');
const timeUtil = require('../../../../framework/utils/time_util.js');

class AdminUserController extends BaseProjectAdminController {


	/** 用户信息 */
	async getUserDetail() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
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
			user.USER_REG_TIME = timeUtil.timestamp2Time(user.USER_REG_TIME);
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
			page: 'must|int|default=1',
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
		for (let k = 0; k < list.length; k++) {
			list[k].USER_STATUS_DESC = UserModel.getDesc('STATUS', list[k].USER_STATUS);
			list[k].USER_ADD_TIME = timeUtil.timestamp2Time(list[k].USER_ADD_TIME);
			list[k].USER_REG_TIME = timeUtil.timestamp2Time(list[k].USER_REG_TIME);
			list[k].USER_LOGIN_TIME = list[k].USER_LOGIN_TIME ? timeUtil.timestamp2Time(list[k].USER_LOGIN_TIME) : '未登录';

		}
		result.list = list;
		return result;
	}


	/** 添加用户 */
	async insertUser() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			name: 'must|string|min:2|max:20|name=姓名',
			mobile: 'must|string|len:11|name=手机',
			lessonCnt: 'must|int|name=课时数',
		};

		// 取得数据
		let input = this.validateData(rules);


		let service = new AdminUserService();
		await service.insertUser(this._admin, input); 

		this.logUser('添加了用户「' + input.name + '」');

	}


	/** 删除用户 */
	async delUser() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let title = await UserModel.getOneField({ USER_MINI_OPENID: input.id }, 'USER_NAME');

		let service = new AdminUserService();
		await service.delUser(input.id);

		if (title)
			this.logUser('删除了用户「' + title + '」');

	} 


	async statusUser() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
			status: 'must|int',
			reason: 'string'
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminUserService();
		await service.statusUser(input.id, input.status, input.reason);
	}

	/************** 用户数据导出 BEGIN ********************* */
	/** 当前是否有导出文件生成 */
	async userDataGet() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			isDel: 'int|must', //是否删除已有记录
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminUserService();

		if (input.isDel === 1)
			await service.deleteUserDataExcel(); //先删除 

		return await service.getUserDataURL();
	}

	/** 导出数据 */
	async userDataExport() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			condition: 'string|name=导出条件',
			fields: 'array',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminUserService();
		return await service.exportUserDataExcel(input.condition, input.fields);
	}

	/** 删除导出的用户数据 */
	async userDataDel() {
		await this.isAdmin();

		// 数据校验
		let rules = {};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminUserService();
		return await service.deleteUserDataExcel();
	}
}

module.exports = AdminUserController;