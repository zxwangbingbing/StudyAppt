/**
 * Notes: 内容检测控制器
 * Date: 2021-03-15 19:20:00 
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 */

const BaseProjectController = require('./base_project_controller.js');
const contentCheck = require('../../framework/validate/content_check.js');

class CheckController extends BaseProjectController {

	/**
	 * 图片校验 
	 */
	async checkImg() {

		// 数据校验
		let rules = {
			img: 'name=img',
			mine: 'must|default=jpg',
		};

		// 取得数据
		let input = this.validateData(rules);

		return await contentCheck.checkImg(input.img, 'jpg');

	}

}

module.exports = CheckController;