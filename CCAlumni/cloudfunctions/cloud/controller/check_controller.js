/**
 * Notes: 内容检测控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-10-14 07:00:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */

const BaseController = require('./base_controller.js');
const contentCheck = require('../framework/validate/content_check.js');

class CheckController extends BaseController {

	/**
	 * 图片校验 
	 */
	async checkImg() {

		// 数据校验
		let rules = {
			img: 'name=img',
			mine: 'required|default=jpg',
		};

		// 取得数据
		let input = this.validateData(rules);

		return await contentCheck.checkImg(input.img, 'jpg');

	}

}

module.exports = CheckController;