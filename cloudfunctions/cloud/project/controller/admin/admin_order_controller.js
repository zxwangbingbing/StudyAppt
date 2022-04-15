/**
 * Notes: 资讯模块后台管理-控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2021-07-11 10:20:00 
 */

const BaseAdminController = require('./base_admin_controller.js');

const AdminOrderService = require('../../service/admin/admin_order_service.js');

const timeUtil = require('../../../framework/utils/time_util.js');
const dataUtil = require('../../../framework/utils/data_util.js');
const contentCheck = require('../../../framework/validate/content_check.js');

class AdminOrderController extends BaseAdminController {

	/**
	 * 退款
	 */
	async refund() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminOrderService();
		await service.refund(input.id);
	}

	/** 资讯列表 */
	async getOrderList() {
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

		let service = new AdminOrderService();
		let result = await service.getOrderList(input);

		// 数据格式化
		let list = result.list;
		for (let k in list) {

			list[k].ORDER_ADD_TIME = timeUtil.timestamp2Time(list[k].ORDER_ADD_TIME);
			list[k].ORDER_REFUND_TIME = timeUtil.timestamp2Time(list[k].ORDER_REFUND_TIME);
			 
		}
		result.list = list;

		return result;

	}


	/************** 数据导出 BEGIN ********************* */
	// 当前是否有导出文件生成
	async orderDataGet() {
		await this.isAdmin();

		// 数据校验
		let rules = {};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminOrderService();
		return await service.getOrderDataURL();
	}

	// 导出数据
	async orderDataExport() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			condition: 'string|name=导出条件',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminOrderService();
		return await service.exportOrderDataExcel(input.condition);
	}

	// 删除导出的订单数据
	async orderDataDel() {
		await this.isAdmin();

		// 数据校验
		let rules = {};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminOrderService();
		return await service.deleteOrderDataExcel();
	}

	/************** 数据导出 END ********************* */

}

module.exports = AdminOrderController;