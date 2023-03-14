/**
 * Notes: 设置管理
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2021-07-11 07:48:00 
 */

const BaseProjectAdminService = require('./base_project_admin_service.js');
const cloudBase = require('../../../../framework/cloud/cloud_base.js');
const cloudUtil = require('../../../../framework/cloud/cloud_util.js');
const setupUtil = require('../../../../framework/utils/setup/setup_util.js');
const config = require('../../../../config/config.js');
const md5Lib = require('../../../../framework/lib/md5_lib.js');

class AdminSetupService extends BaseProjectAdminService {

	// 通用setup
	async setSetup(key, val, type = '') {
		await setupUtil.set(key, val, type);
	}

	// 富文本setup
	async setContentSetup(key, val, type = '') {
		let oldVal = await setupUtil.get(key);
		if (oldVal)
			await cloudUtil.handlerCloudFilesByRichEditor(oldVal, val);

		await setupUtil.set(key, val, type);
	}

	/** 小程序码 */
	async genMiniQr(page, sc = 'qr') {
		//生成小程序qr buffer
		let cloud = cloudBase.getCloud();

		if (page.startsWith('/')) page = page.substring(1);
		console.log('page=' + page, ', scene=' + sc);

		let result = await cloud.openapi.wxacode.getUnlimited({
			scene: sc,
			width: 280,
			check_path: false,
			//env_version: 'trial', //release,trial,develop
			page
		});

		let cloudPath = PID + '/' + 'setup/' + md5Lib.md5(page) + '.png';
		let upload = await cloud.uploadFile({
			cloudPath,
			fileContent: result.buffer,
		});

		if (!upload || !upload.fileID) return;

		let ret = await cloudUtil.getTempFileURLOne(upload.fileID);
		return ret + '?rd=' + this._timestamp;
	}

}

module.exports = AdminSetupService;