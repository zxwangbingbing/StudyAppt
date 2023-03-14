/**
 * Notes: 消息模块业务逻辑 
 * Date: 2022-09-26 07:48:00 
 */

const BaseProjectService = require('./base_project_service.js');
const util = require('../../../framework/utils/util.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const miniLib = require('../../../framework/lib/mini_lib.js');
const config = require('../../../config/config.js');

class MsgService extends BaseProjectService {

	// 预约成功
	async apptSucc(userId, time) {
		userId = userId.replace('meetlib^^^', '');

		let page = '/projects/meetlib/pages/meet/my_join_list/meet_my_join_list';
		let body = {
			touser: userId,
			page,
			data: {
				thing1: { //时间
					value: '门票预约',
				},
				date2: { //时间
					value: time,
				},
				thing4: { //温馨提示
					value: '点击查看详情！'
				},
			},

			// 预约成功通知 预约/报名 主题>预约时间>备注
			templateId: 'RYDxYPJynjoRcC9lLYGM8P1nuQr68f5sd7mQftVULgk',
		}
		// 异步消息提醒
		miniLib.sendMiniOnceTempMsg(body, 'orderPayTimeout');
	}


	async apptCancel(userId, time, desc = '') {
		userId = userId.replace('meetlib^^^', '');

		let page = '/projects/meetlib/pages/meet/my_join_list/meet_my_join_list';
		let body = {
			touser: userId,
			page,
			data: {
				thing1: { //主题
					value: '门票预约',
				},
				date2: { //
					value: time,
				},
				thing9: { //温馨提示
					value: desc || '点击查看详情！'
				},
			},

			// 986 预约/报名  预约取消通知 预约主题>预约时间>温馨提示
			templateId: 'OTw2KKPEt_OVteo8yP10sLN8mWhMHwX9SRv8yVXgy28',
		}
		// 异步消息提醒
		miniLib.sendMiniOnceTempMsg(body, 'orderPayTimeout');
	}



}

module.exports = MsgService;