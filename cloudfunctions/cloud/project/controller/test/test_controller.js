/**
 * Notes: 测试模块控制器
 * Date: 2021-03-15 19:20:00 
 */

const BaseController = require('../base_controller.js'); 
const config = require('../../../config/config.js');
class TestController {

	async test() {
		console.log('1111')
	 
		let userId = 'userid3243l4l3j24324324';

		console.log(__filename); 
	}

}

module.exports = TestController;