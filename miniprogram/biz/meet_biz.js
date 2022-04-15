/**
 * Notes: 预约模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2021-12-10 07:48:00 
 */

const BaseBiz = require('./base_biz.js');
const setting = require('../setting/setting.js');
const pageHelper = require('../helper/page_helper.js');

class MeetBiz extends BaseBiz {

	static async subscribeMessageMeet(callback) {
		callback && await callback();
	}

	static addMeetPhoneCalendar(title, startTime, endTime, alarmOffset = 3600) {
		wx.addPhoneCalendar({
			title,
			startTime,
			endTime,
			//	description: "这是日程内容", 
			alarm: 'true',
			alarmOffset, //提前时间，秒
			success: () => {
				pageHelper.showSuccToast('添加成功');
			},
			fail: (res) => {
				if (res && res.errMsg && res.errMsg.includes('refuesed')) {
					pageHelper.showModal('请在手机的"设置›微信" 选项中，允许微信访问你的日历', '日历权限未开启')
				}
			},
			complete: (res) => {
				console.log(res)
			}

		})
	}

}

module.exports = MeetBiz;