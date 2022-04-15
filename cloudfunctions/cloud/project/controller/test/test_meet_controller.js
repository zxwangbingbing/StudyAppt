/**
 * Notes: MEET测试模块控制器
 * Date: 2021-12-28 19:20:00 
 */

const BaseController = require('../base_controller.js'); 
const MeetService = require('../../service/meet_service.js');
const AdminMeetService = require('../../service/admin/admin_meet_service.js');
const config = require('../../../config/config.js');
const AppError = require('../../../framework/core/app_error.js');
const fakerLib = require('../../../framework/lib/faker_lib.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const cacheUtil = require('../../../framework/utils/cache_util.js');
const SetupModel = require('../../model/setup_model.js');
const MeetModel = require('../../model/meet_model.js');
const JoinModel = require('../../model/join_model.js');
const DayModel = require('../../model/day_model.js');
const JobService = require('../../service/job_service.js');

class TestController {

	async testJoin() {
		let meetService = new MeetService();
		let userId = 'obytx5EuMzFj-rC7t3x8PY5S3GHs';
		let meetId = '617ef50c620ab4160556a8537944a517';
		global.PID = 'A00'
		let timeMark = 'T20220215AAABCAUSBXXMH';
		let admin = null;

		await meetService.checkMeetRules(userId, meetId, timeMark);

	//	await this.multiInsertJoin();
		/*
	//	 
		return;
		let serviceAdmin = new AdminMeetService();

		global.PID = 'A00'
		//	this.setMeetDaysAndTimes();
		await this.multiInsertJoin();

		//	SetupModel.insert({

		//	});

		//serviceAdmin.genSelfCheckinQr('','11','x')


		//service.statJoinCnt(m)
		 */
		/*
		let meetService = new MeetService();

		let form = {};


		let userId = 'obytx5EuMzFj-rC7t3x8PY5S3GHs';
		let meetId = '617ef50c61fb411f02e81edc03e24013';
		global.PID = 'A00'
		let timeMark = 'T20220205AAAPKZBBVIRTV';
		let admin = null;

		await meetService.checkMeetRules(userId, meetId, timeMark);
		*/
		// await meetService.join(admin, userId, meetId, timeMark, form);
		//await meetService.removeJoinByTimeMark(meetId, timeMark);

		// let timesMark = 'TSWUIWJRHN'; //12-30
		// let timesMark = 'PJUTJBXUHQ';  //01-03
		// let timesMark = 'LCULAJIGDN';  //12-31
		for (let i = 0; i < 7; i++) {
			//	let timeMark = 'TSWUIWJRHN';    
			//	await meetService.join(userId, meetId, timeMark, form);
		}

		for (let i = 0; i < 2; i++) {
			//	let timeMark = 'LCULAJIGDN';    
			//	await meetService.join(userId, meetId, timeMark, form);
		}

		//let timeMark = 'HIPHMOQOSW';
		//await meetService.statJoinCnt(meetId, timeMark)


		// await meetService.checkMeetRules(userId, meetId, timeMark); 


	}


	// 批量添加预约
	async multiInsertJoin() {
		let day = timeUtil.time('Y-M-D');

		let service = new MeetService();
		let where = {
			MEET_STATUS: 1
		}
		let meetList = await MeetModel.getAll(where, '*', {}, 1000, false);

		// 取所有
		for (let k in meetList) {
			let meetId = meetList[k]._id;
			let title = meetList[k].MEET_TITLE;
			let pid = meetList[k]._pid;
			console.log('base info=', meetId, title, pid);

			global.PID = pid;
			let meet = await service.getMeetOneDay(meetId, day, {
				_id: meetId
			});
			if (!meet || !meet.MEET_DAYS_SET || !meet.MEET_DAYS_SET.length || !meet.MEET_DAYS_SET[0].times) continue;

			let times = meet.MEET_DAYS_SET[0].times;
			console.log('times=', times);

			// 批量插入
			for (let i = 0; i < fakerLib.getIntBetween(3, 20); i++) {
				let time = times[fakerLib.getIntBetween(0, times.length - 1)];
				let data = {
					JOIN_USER_ID: fakerLib.getStrLower(32),
					JOIN_MEET_ID: meetId,
					JOIN_MEET_TITLE: title,
					JOIN_MEET_DAY: day,
					JOIN_CODE: fakerLib.getIntStr(15),
					JOIN_MEET_TIME_START: time.start,
					JOIN_MEET_TIME_END: time.end,
					JOIN_MEET_TIME_MARK: time.mark,
					JOIN_STATUS: fakerLib.getRnd([0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 10, 99]),
					JOIN_FORMS: [{
						'title': '姓名',
						'mark': fakerLib.getStrUpper(8),
						'type': 'line',
						'val': fakerLib.getName(),
					}, {
						'title': '手机',
						'mark': fakerLib.getStrUpper(8),
						'type': 'mobile',
						'val': fakerLib.getMobile(),
					}]
				}
				data.JOIN_START_TIME = timeUtil.time2Timestamp(day + ' ' + data.JOIN_MEET_TIME_START + ':00');
				//console.log(data);
				await JoinModel.insert(data);
			}

			// 重新统计
			for (let n in times) {
				await service.statJoinCnt(meetId, times[n].mark);
			}
		}






	}

	async removeMeet(id) {
		let service = new AdminMeetService();
		console.log('删除预约项目 SUCC, MEET_ID=' + id);
		await service.delMeet(id);
	}

	async setMeetDaysAndTimes() {
		let days = [];
		for (let i = 2; i <= 2; i++) {
			for (let j = 1; j <= 31; j++) {
				let day = '2022-' + String(i < 10 ? '0' + i : i) + '-' + String(j < 10 ? '0' + j : j);
				console.log(day)
				let node = {}
				node.DAY_MEET_ID = 'bf4a0bf261d98dd003e9938f52a28b34';
				node.DAY_ID = '2022233432432434';
				node.day = day;
				node.dayDesc = day + '描述';

				let timesCnt = fakerLib.getIntBetween(1, 10);
				let times = [];
				for (let k = 0; k < timesCnt; k++) {
					let timeNode = {};
					timeNode.mark = 'T' + day.replace(/-/g, '') + 'AAA' + fakerLib.getStr(10);
					timeNode.start = '0' + k + ':00';
					timeNode.end = fakerLib.getIntBetween(10, 23) + ':' + fakerLib.getIntBetween(10, 59);
					timeNode.isLimit = false;
					timeNode.limit = 50;
					timeNode.status = 1;
					timeNode.stat = {
						 
						succCnt: fakerLib.getIntBetween(10, 100), 
						cancelCnt: fakerLib.getIntBetween(10, 100),
						adminCancelCnt: fakerLib.getIntBetween(10, 100),
					};
					times.push(timeNode);
				}
				node.times = times;
				days.push(node);
			}
		}

		console.log(days);
		await DayModel.insertBatch(days);
	}

	async makeMeetData(setData, day, daysSet) {

		let service = new AdminMeetService();
		let adminId = 'test-admin-id';

		day = day || timeUtil.time('Y-M-D', 86400 * 5);
		console.log('设定预约日期=', day);
		daysSet = daysSet || [{
			day,
			desc: day + ' Test desc',
			times: [{
				mark: 'test-mark',
				start: '09:00',
				end: '20:00',
				isLimit: false,
				limit: -1,
				cnt: 0,
			}]
		}]



		let beginSet = setData['beginSet'] || {
			mode: 'no',
			day: 0,
			time: null,
		};

		let endSet = setData['endSet'] || {};
		let limitSet = setData['limitSet'] || {};
		let cancelSet = setData['cancelSet'] || {};
		let succSet = setData['succSet'] || 0;
		let formSet = setData['formSet'] || [];

		let id = await service.insertMeet(adminId, {
			title: '测试用例' + timeUtil.time('Y-M-D h:m:s'),
			daysSet,
			beginSet,
			endSet,
			limitSet,
			cancelSet,
			succSet,
			formSet
		});
		console.log('添加预约项目makeMeetData SUCC, MEET_ID=' + id);
		return id;
	}

}

module.exports = TestController;