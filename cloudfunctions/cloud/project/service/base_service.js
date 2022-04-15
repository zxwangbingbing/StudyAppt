/**
 * Notes: 业务基类 
 * Date: 2021-03-15 04:00:00 
 */

const AppError = require('../../framework/core/app_error.js');
const appCode = require('../../framework/core/app_code.js');
const timeUtil = require('../../framework/utils/time_util.js');
const dbUtil = require('../../framework/database/db_util.js');
const SetupModel = require('../model/setup_model.js');
const AdminModel = require('../model/admin_model.js');
const NewsModel = require('../model/news_model.js');
const MeetModel = require('../model/meet_model.js');
const config = require('../../config/config.js');

class BaseService {
	constructor() {
		// 当前时间戳
		this._timestamp = timeUtil.time();

	}

	/**
	 * 抛出异常
	 * @param {*} msg 
	 * @param {*} code 
	 */
	AppError(msg, code = appCode.LOGIC) {
		throw new AppError(msg, code);
	}

	getProjectId() {
		if (global.PID)
			return global.PID;
		else
			return 'unknow';
	}


	async initSetup() {
		if (await dbUtil.isExistCollection('ax_setup')) {
			let setupCnt = await SetupModel.count({});
			if (setupCnt > 0) return;
		}

		console.log('### initSetup...');

		let arr = config.COLLECTION_NAME.split('|');
		for (let k in arr) {
			if (!await dbUtil.isExistCollection(arr[k])) {
				await dbUtil.createCollection(arr[k]);
			}
		} 

		if (await dbUtil.isExistCollection('ax_admin')) {
			let adminCnt = await AdminModel.count({});
			if (adminCnt == 0) {

				let data = {};
				data.ADMIN_NAME = '系统管理员';
				data.ADMIN_PHONE = '13900000000';
				data.ADMIN_TYPE = 1;

				await AdminModel.insert(data);
			}
		}

		if (await dbUtil.isExistCollection('ax_news')) {
			let newsCnt = await NewsModel.count({});
			if (newsCnt == 0) {

				// 插入
				let newsArr = config.NEWS_CATE.split(',');
				for (let j in newsArr) {
					let title = newsArr[j].split('=')[1];
					let cateId = newsArr[j].split('=')[0];

					let data = {};
					data.NEWS_TITLE = title + '标题1';
					data.NEWS_DESC = title + '简介1';
					data.NEWS_CATE_ID = cateId;
					data.NEWS_CATE_NAME = title;
					data.NEWS_ADMIN_ID = '1';
					data.NEWS_CONTENT = [{
						type: 'text',
						val: title + '内容1'
					}];
					data.NEWS_PIC = ['../../../../images/default_cover_pic.gif'];

					await NewsModel.insert(data);
				}
			}

		}

		if (await dbUtil.isExistCollection('ax_meet')) {
			let meetCnt = await MeetModel.count({});
			if (meetCnt == 0) {

				// 插入
				let meetArr = config.MEET_TYPE.split(',');
				for (let j in meetArr) {
					let title = meetArr[j].split('=')[1];
					let typeId = meetArr[j].split('=')[0];

					let data = {};
					data.MEET_TITLE = title + '标题1';
					data.MEET_STYLE_SET = {
						desc: title + '简介1',
						pic: '../../../../images/default_cover_pic.gif'
					};
					data.MEET_TYPE_ID = typeId;
					data.MEET_TYPE_NAME = title;
					data.MEET_ADMIN_ID = '1';
					data.MEET_CONTENT = [{
						type: 'text',
						val: title + '内容1'
					}];
					data.MEET_DAYS = [];
					data.MEET_FORM_SET = [{
							type: 'line',
							title: '姓名',
							desc: '请填写您的姓名',
							must: true,
							len: 50,
							onlySet: {
								mode: 'all',
								cnt: -1
							},
							selectOptions: ['', ''],
							mobileTruth: true,
							checkBoxLimit: 2,
						},
						{
							type: 'line',
							title: '手机',
							desc: '请填写您的手机号码',
							must: true,
							len: 50,
							onlySet: {
								mode: 'all',
								cnt: -1
							},
							selectOptions: ['', ''],
							mobileTruth: true,
							checkBoxLimit: 2,
						}
					];

					await MeetModel.insert(data);
				}
			}

		}

		if (await dbUtil.isExistCollection('ax_setup')) {
			let setupCnt = await SetupModel.count({});
			if (setupCnt == 0) {
				let data = {};
				data.SETUP_ABOUT = '关于我们';
				await SetupModel.insert(data);
			}
		}
	}

}

module.exports = BaseService;