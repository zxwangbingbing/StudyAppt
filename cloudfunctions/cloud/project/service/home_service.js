/**
 * Notes: 全局/首页模块业务逻辑
 * Date: 2021-03-15 04:00:00 
 */

const BaseService = require('./base_service.js');

const SetupModel = require('../model/setup_model.js');
const dataUtil = require('../../framework/utils/data_util.js');
const config = require('../../config/config.js');

class HomeService extends BaseService {
	/**
	 * 取得系统设置
	 * @param {*} param0 
	 */
	async getSetup(fields = '*') {
		let where = {}
		let setup = await SetupModel.getOne(where, fields);

		if (!setup) {
			let data = {
				SETUP_ABOUT: '关于我们'
			};
			await SetupModel.insert(data);
			setup = await SetupModel.getOne(where, fields);
		}
		return setup;

	}
}

module.exports = HomeService;