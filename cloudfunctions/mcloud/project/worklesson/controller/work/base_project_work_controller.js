/**
 * Notes: 服务者管理控制器模块
 * Ver : CCMiniCloud Framework 2.0.3 ALL RIGHTS RESERVED BY cclinuX0730 (wechat)
 * Date: 2023-01-16 19:20:00 
 */

const BaseController = require('../../../../framework/platform/controller/base_controller.js');
const BaseWorkService = require('../../service/work/base_project_work_service.js');
const BaseProjectService = require('../../service/base_project_service.js');

const timeUtil = require('../../../../framework/utils/time_util.js');

class BaseProjectWorkController extends BaseController {

	constructor(route, openId, event) {
		super(route, openId, event);

		// 当前时间戳
		this._timestamp = timeUtil.time();

		this._work = null;
		this._workId = '0';

	}


	// TODO
	async initSetup() {
		let service = new BaseProjectService();
		await service.initSetup();
	}

	/** 是否登陆  */
	async isWork() {
		let service = new BaseWorkService();
		let work = await service.isWork(this._token);
		this._work = work;
		this._workId = work._id; 
 
	}

}

module.exports = BaseProjectWorkController;