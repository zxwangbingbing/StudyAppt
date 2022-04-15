/**
 * Notes: 管理员控制模块
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2021-07-11 10:20:00 
 */

const BaseAdminController = require('./base_admin_controller.js');
const LogModel = require('../../model/log_model.js');

const AdminMgrService = require('../../service/admin/admin_mgr_service.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const contentCheck = require('../../../framework/validate/content_check.js');

class AdminMgrController extends BaseAdminController {
 

	async getLogList() {
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

		let service = new AdminMgrService();
		let result = await service.getLogList(input);

		// 数据格式化
		let list = result.list;
		for (let k in list) {
			list[k].LOG_TYPE_DESC = LogModel.getDesc('TYPE', list[k].LOG_TYPE);
			list[k].LOG_ADD_TIME = timeUtil.timestamp2Time(list[k].LOG_ADD_TIME);
		}
		result.list = list;

		return result;

	}
}

module.exports = AdminMgrController;