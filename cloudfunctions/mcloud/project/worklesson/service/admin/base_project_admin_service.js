/**
 * Notes: 后台管理模块 基类
 * Date: 2021-03-15 07:48:00 
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 */

const BaseAdminService = require('../../../../framework/platform/service/base_admin_service.js');
;
const util = require('../../../../framework/utils/util.js');
const cloudBase = require('../../../../framework/cloud/cloud_base.js');

class BaseProjectAdminService extends BaseAdminService {

	getProjectId() {
		return util.getProjectId();
	}

	async genDetailQr(type, id) {
		let cloud = cloudBase.getCloud();

		let page = `projects/${this.getProjectId()}/pages/${type}/detail/${type}_detail`;
		console.log('page=', page);
		let result = await cloud.openapi.wxacode.getUnlimited({
			scene: id,
			width: 280,
			check_path: false,
			//env_version: 'trial', //release,trial,develop
			page
		});

		let cloudPath = `${this.getProjectId()}/${type}/${id}/qr.png`;
		console.log('cloudPath=', cloudPath);
		let upload = await cloud.uploadFile({
			cloudPath,
			fileContent: result.buffer,
		});

		if (!upload || !upload.fileID) return;

		return upload.fileID;
	}
}

module.exports = BaseProjectAdminService;