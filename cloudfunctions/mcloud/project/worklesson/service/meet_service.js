/**
 * Notes: 预约模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2021-12-10 07:48:00 
 */

const BaseProjectService = require('./base_project_service.js');
const util = require('../../../framework/utils/util.js');
const MeetModel = require('../model/meet_model.js');
const JoinModel = require('../model/join_model.js');
const DayModel = require('../model/day_model.js');
const LogUtil = require('../../../framework/utils/log_util.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const dataUtil = require('../../../framework/utils/data_util.js');
const projectConfig = require('../public/project_config.js');

const UserModel = require('../model/user_model.js');
const LessonLogModel = require('../model/lesson_log_model.js');

const MEET_LOG_LEVEL = 'debug';

class MeetService extends BaseProjectService {

	constructor() {
		super();
		this._log = new LogUtil(projectConfig.MEET_LOG_LEVEL);
	}

	/**
	 * 抛出异常
	 * @param {*} msg 
	 * @param {*} code 
	 */
	AppError(msg) {
		this._log.error(msg);
		super.AppError(msg);
	}

	_meetLog(meet, func = '', msg = '') {
		let str = '';
		str = `[MEET=${meet.MEET_TITLE}][${func}] ${msg}`;
		this._log.debug(str);
	}


	// 修改用户课时数 同时进行统计  changeCnt可正负
	async editUserMeetLesson(admin, userId, changeCnt, type, meetId = '', desc = '') {
		changeCnt = Number(changeCnt);
		let whereUser = {
			USER_MINI_OPENID: userId,
		}
		let user = await UserModel.getOne(whereUser, 'USER_LESSON_TOTAL_CNT');
		if (!user) this.AppError('用户不存在');


		let totalCnt = 0;

		// 统计现有课时
		let lastCnt = await LessonLogModel.sum({ LESSON_LOG_USER_ID: userId }, 'LESSON_LOG_CHANGE_CNT');
		if (lastCnt == 0 && type == LessonLogModel.TYPE.ADMIN_REDUCE)
			this.AppError('当前课时数为0，不能减少');


		// 总课时
		totalCnt = lastCnt + changeCnt;

		if (totalCnt < 0 && type == LessonLogModel.TYPE.ADMIN_REDUCE)
			this.AppError('减少的课时数不能少于' + lastCnt);
		else if (totalCnt < 0)
			this.AppError('课时数异常');


		// 入日志
		let logData = {
			LESSON_LOG_USER_ID: userId,

			LESSON_LOG_TYPE: type,

			LESSON_LOG_CHANGE_CNT: changeCnt,

			LESSON_LOG_MEET_ID: meetId,
			LESSON_LOG_DESC: desc,

			LESSON_LOG_LAST_CNT: lastCnt,
			LESSON_LOG_NOW_CNT: totalCnt
		}

		if (admin) {
			logData.LESSON_LOG_EDIT_ADMIN_ID = admin._id;
			logData.LESSON_LOG_EDIT_ADMIN_NAME = admin.ADMIN_NAME;
			logData.LESSON_LOG_EDIT_ADMIN_TIME = this._timestamp;
		}
		await LessonLogModel.insert(logData);

		// 计算用户当前使用了多少课时
		let usedWhere = {
			LESSON_LOG_USER_ID: userId,
			LESSON_LOG_TYPE: ['not in', [LessonLogModel.TYPE.INIT, LessonLogModel.TYPE.ADMIN_ADD, LessonLogModel.TYPE.ADMIN_REDUCE]]
		}
		let usedCnt = await LessonLogModel.sum(usedWhere, 'LESSON_LOG_CHANGE_CNT');

		// 修改用户
		let userData = {
			USER_LESSON_TOTAL_CNT: totalCnt,
			USER_LESSON_USED_CNT: Math.abs(Number(usedCnt)),
			USER_LESSON_TIME: this._timestamp
		}
		await UserModel.edit(whereUser, userData);
	}

	/** 统一获取Meet（某天) */
	async getMeetOneDay(meetId, day, where, fields = '*') {

		let meet = await MeetModel.getOne(where, fields);
		if (!meet) return meet;

		meet.MEET_DAYS_SET = await this.getDaysSet(meetId, day, day);
		return meet;
	}

	/** 获取日期设置 */
	async getDaysSet(meetId, startDay, endDay = null) {
		let where = {
			DAY_MEET_ID: meetId
		}
		if (startDay && endDay && endDay == startDay)
			where.day = startDay;
		else if (startDay && endDay)
			where.day = ['between', startDay, endDay];
		else if (!startDay && endDay)
			where.day = ['<=', endDay];
		else if (startDay && !endDay)
			where.day = ['>=', startDay];

		let orderBy = {
			'day': 'asc'
		}
		let list = await DayModel.getAllBig(where, 'day,dayDesc,times', orderBy, 1000);

		for (let k = 0; k < list.length; k++) {
			delete list[k]._id;
		}

		return list;
	}

	// 按时段统计某时段报名情况
	async statJoinCnt(meetId, timeMark) {
		let whereDay = {
			DAY_MEET_ID: meetId,
			day: this.getDayByTimeMark(timeMark)
		};
		let day = await DayModel.getOne(whereDay, 'times');
		if (!day) return;

		let whereJoin = {
			JOIN_MEET_TIME_MARK: timeMark,
			JOIN_MEET_ID: meetId
		};
		let ret = await JoinModel.groupCount(whereJoin, 'JOIN_STATUS');

		let stat = { //统计数据
			succCnt: ret['JOIN_STATUS_1'] || 0, //1=预约成功,
			cancelCnt: ret['JOIN_STATUS_10'] || 0, //10=已取消, 
			adminCancelCnt: ret['JOIN_STATUS_99'] || 0, //99=后台取消
		};

		let times = day.times;
		for (let j in times) {
			if (times[j].mark === timeMark) {
				let data = {
					['times.' + j + '.stat']: stat
				}
				await DayModel.edit(whereDay, data);
				return;
			}
		}

	}


	// 预约前检测
	async beforeJoin(userId, meetId, timeMark) {
		await this.checkMeetRules(userId, meetId, timeMark);
	}

	// 用户预约逻辑
	async join(userId, meetId, timeMark, formsList) {
		// 预约时段是否存在
		let meetWhere = {
			_id: meetId
		};
		let day = this.getDayByTimeMark(timeMark);
		let meet = await this.getMeetOneDay(meetId, day, meetWhere);

		if (!meet) {
			this.AppError('预约时段选择错误1，请重新选择');
		}

		let daySet = this.getDaySetByTimeMark(meet, timeMark);
		if (!daySet)
			this.AppError('预约时段选择错误2，请重新选择');

		let timeSet = this.getTimeSetByTimeMark(meet, timeMark);
		if (!timeSet)
			this.AppError('预约时段选择错误3，请重新选择');

		// 规则校验
		await this.checkMeetRules(userId, meetId, timeMark, formsList);


		let data = {};

		data.JOIN_USER_ID = userId;
		data.JOIN_MEET_ID = meetId;
		data.JOIN_MEET_CATE_ID = meet.MEET_CATE_ID;
		data.JOIN_MEET_CATE_NAME = meet.MEET_CATE_NAME;
		data.JOIN_MEET_TITLE = meet.MEET_TITLE;
		data.JOIN_MEET_DAY = daySet.day;
		data.JOIN_MEET_TIME_START = timeSet.start;
		data.JOIN_MEET_TIME_END = timeSet.end;
		data.JOIN_MEET_TIME_MARK = timeMark;
		data.JOIN_START_TIME = timeUtil.time2Timestamp(daySet.day + ' ' + timeSet.start + ':00');
		data.JOIN_STATUS = JoinModel.STATUS.SUCC;
		data.JOIN_COMPLETE_END_TIME = daySet.day + ' ' + timeSet.end;

		// 入库
		for (let k = 0; k < formsList.length; k++) {
			let forms = formsList[k];
			data.JOIN_FORMS = forms;
			data.JOIN_OBJ = dataUtil.dbForms2Obj(forms);
			data.JOIN_CODE = dataUtil.genRandomIntString(15);
			await JoinModel.insert(data);
		}


		// 统计
		await this.statJoinCnt(meetId, timeMark);

		// 课时统计
		await this.editUserMeetLesson(null, userId, -1, LessonLogModel.TYPE.USER_APPT, meetId, '《' + meet.MEET_TITLE + '》')

		return {
			result: 'ok',
		}
	}



	// 根据日期获取其所在天设置
	getDaySetByDay(meet, day) {
		for (let k = 0; k < meet.MEET_DAYS_SET.length; k++) {
			if (meet.MEET_DAYS_SET[k].day == day)
				return dataUtil.deepClone(meet.MEET_DAYS_SET[k]);
		}
		return null;
	}

	// 根据时段标识获取其所在天 
	getDayByTimeMark(timeMark) {
		return timeMark.substr(1, 4) + '-' + timeMark.substr(5, 2) + '-' + timeMark.substr(7, 2);
	}

	// 根据时段标识获取其所在天设置
	getDaySetByTimeMark(meet, timeMark) {
		let day = this.getDayByTimeMark(timeMark);

		for (let k = 0; k < meet.MEET_DAYS_SET.length; k++) {
			if (meet.MEET_DAYS_SET[k].day == day)
				return dataUtil.deepClone(meet.MEET_DAYS_SET[k]);
		}
		return null;
	}

	// 根据时段标识获取其所在时段设置
	getTimeSetByTimeMark(meet, timeMark) {
		let day = this.getDayByTimeMark(timeMark);

		for (let k = 0; k < meet.MEET_DAYS_SET.length; k++) {
			if (meet.MEET_DAYS_SET[k].day != day) continue;

			for (let j in meet.MEET_DAYS_SET[k].times) {
				if (meet.MEET_DAYS_SET[k].times[j].mark == timeMark)
					return dataUtil.deepClone(meet.MEET_DAYS_SET[k].times[j]);
			}
		}
		return null;
	}

	// 预约时段人数和状态控制校验
	async checkMeetTimeControll(meet, timeMark, meetPeopleCnt = 1) {
		if (!meet) this.AppError('预约时段设置错误, 预约项目不存在');

		let daySet = this.getDaySetByTimeMark(meet, timeMark); // 当天设置
		let timeSet = this.getTimeSetByTimeMark(meet, timeMark); // 预约时段设置

		if (!daySet || !timeSet) this.AppError('预约时段设置错误day&time');

		let statusDesc = timeSet.status == 1 ? '开启' : '关闭';
		let limitDesc = '';
		if (timeSet.isLimit) {
			limitDesc = '人数上限MAX=' + timeSet.limit;
		} else
			limitDesc = '人数不限制NO';

		this._meetLog(meet, `------------------------------`);
		this._meetLog(meet, `#预约时段控制,预约日期=<${daySet.day}>`, `预约时段=[${timeSet.start}-${timeSet.end}],状态=${statusDesc}, ${limitDesc} 当前预约成功人数=${timeSet.stat.succCnt}`);

		if (timeSet.status == 0) this.AppError('该时段预约已经关闭，请选择其他');

		// 时段总人数限制
		if (timeSet.isLimit) {
			if (timeSet.stat.succCnt >= timeSet.limit) {
				this.AppError('该时段预约人员已满，请选择其他');
			}

			let maxCnt = timeSet.limit - timeSet.stat.succCnt;

			if (maxCnt < meetPeopleCnt) {
				this.AppError('本时段最多还可以预约' + (maxCnt) + '人，您当前提交了' + meetPeopleCnt + '人，请调整后再提交');
			}
		}

	}


	/** 报名规则校验 */
	async checkMeetRules(userId, meetId, timeMark, formsList = null) {

		// 预约时段是否存在
		let meetWhere = {
			_id: meetId
		};
		let day = this.getDayByTimeMark(timeMark);
		let meet = await this.getMeetOneDay(meetId, day, meetWhere);

		if (meet.MEET_STATUS != MeetModel.STATUS.COMM)
			this.AppError('该预约已经停止或者关闭，无法预约');

		if (!meet) {
			this.AppError('预约时段选择错误，请重新选择');
		}

		// 用户课时控制
		let user = await UserModel.getOne({ USER_MINI_OPENID: userId }, 'USER_LESSON_TOTAL_CNT');
		if (!user) this.AppError('用户不存在');
		if (user.USER_LESSON_TOTAL_CNT <= 0) this.AppError('您当前的课时数为0，暂无法进行预约');


		// 预约时段人数和状态控制校验
		let meetPeopleCnt = formsList ? formsList.length : 1;

		await this.checkMeetTimeControll(meet, timeMark, meetPeopleCnt);

		// 截止规则  
		await this.checkMeetEndSet(meet, timeMark);


		// 针对用户的次数限制
		await this.checkMeetLimitSet(userId, meet, timeMark, meetPeopleCnt);

	}


	// 预约次数限制校验
	async checkMeetLimitSet(userId, meet, timeMark, nowCnt) {
		if (!meet) this.AppError('预约次数规则错误, 预约项目不存在');
		let meetId = meet._id;

		let daySet = this.getDaySetByTimeMark(meet, timeMark); // 当天设置
		let timeSet = this.getTimeSetByTimeMark(meet, timeMark); // 预约时段设置

		this._meetLog(meet, `------------------------------`);
		this._meetLog(meet, `#预约次数规则,预约日期=<${daySet.day}>`, `预约时段=[${timeSet.start}～${timeSet.end}]`);

		let where = {
			JOIN_MEET_ID: meetId,
			JOIN_MEET_TIME_MARK: timeMark,
			JOIN_USER_ID: userId,
			JOIN_STATUS: JoinModel.STATUS.SUCC
		}
		let cnt = await JoinModel.count(where);
		let maxCnt = projectConfig.MEET_MAX_JOIN_CNT;
		this._meetLog(meet, `预约次数规则,mode=本时段可预约${maxCnt}次`, `当前已预约=${cnt}次`);

		if (cnt >= maxCnt)
			this.AppError(`您本时段已经预约，不能继续预约`);

	}



	// 预约截止设置校验
	async checkMeetEndSet(meet, timeMark) {
		if (!meet) this.AppError('预约截止规则错误, 预约项目不存在');


		this._meetLog(meet, `------------------------------`);
		let daySet = this.getDaySetByTimeMark(meet, timeMark); // 当天设置
		let timeSet = this.getTimeSetByTimeMark(meet, timeMark); // 预约时段设置

		this._meetLog(meet, `#预约截止规则,预约日期=<${daySet.day}>`, `预约时段=[${timeSet.start}-${timeSet.end}]`);

		let nowTime = timeUtil.time('Y-M-D h:m:s');

		/*
		let startTime = daySet.day + ' ' + timeSet.start + ':00';
		this._meetLog(meet, `预约开始规则,mode=<时段过期判定>`, `预约开始时段=${startTime},当前时段=${nowTime}`);
		if (nowTime > startTime) {
			this.AppError('该时段已开始，无法预约，请选择其他');
		}*/

		let endTime = daySet.day + ' ' + timeSet.end + ':59';
		this._meetLog(meet, `预约开始规则,mode=<时段过期判定>`, `预约结束时段=${endTime},当前时段=${nowTime}`);
		if (nowTime > endTime) {
			this.AppError('该时段已结束，无法预约，请选择其他');
		}

	}


	/**  预约详情 */
	async viewMeet(meetId) {

		let fields = '*';

		let where = {
			_id: meetId,
			MEET_STATUS: ['in', [MeetModel.STATUS.COMM, MeetModel.STATUS.OVER]]
		}
		let meet = await MeetModel.getOne(where, fields);
		if (!meet) return null;


		let getDaysSet = [];
		meet.MEET_DAYS_SET = await this.getDaysSet(meetId, timeUtil.time('Y-M-D')); //今天及以后
		let daysSet = meet.MEET_DAYS_SET;

		let now = timeUtil.time('Y-M-D');
		for (let k = 0; k < daysSet.length; k++) {
			let dayNode = daysSet[k];

			if (dayNode.day < now) continue; // 排除过期

			let getTimes = [];

			for (let j in dayNode.times) {
				let timeNode = dayNode.times[j];

				// 排除状态关闭的时段
				if (timeNode.status != 1) continue;

				// 判断数量是否已满
				if (timeNode.isLimit && timeNode.stat.succCnt >= timeNode.limit)
					timeNode.error = '预约已满';

				// 截止规则
				if (!timeNode.error) {
					try {
						await this.checkMeetEndSet(meet, timeNode.mark);
					} catch (ex) {
						if (ex.name == 'AppError')
							timeNode.error = '预约结束';
						else
							throw ex;
					}
				}

				getTimes.push(timeNode);
			}
			dayNode.times = getTimes;

			getDaysSet.push(dayNode);
		}

		// 只返回需要的字段
		let ret = {};
		ret.MEET_DAYS_SET = getDaysSet;

		ret.MEET_QR = meet.MEET_QR;
		ret.MEET_CANCEL_SET = meet.MEET_CANCEL_SET;
		ret.MEET_TITLE = meet.MEET_TITLE;
		ret.MEET_CATE_NAME = meet.MEET_CATE_NAME;
		ret.MEET_OBJ = meet.MEET_OBJ;
		ret.MEET_STATUS = meet.MEET_STATUS;


		return ret;
	}


	/**  预约前获取关键信息 */
	async detailForJoin(userId, meetId, timeMark) {

		let fields = 'MEET_DAYS_SET,MEET_JOIN_FORMS, MEET_TITLE';

		let where = {
			_id: meetId,
			MEET_STATUS: ['in', [MeetModel.STATUS.COMM, MeetModel.STATUS.OVER]]
		}
		let day = this.getDayByTimeMark(timeMark);
		let meet = await this.getMeetOneDay(meetId, day, where, fields);
		if (!meet) return null;

		let dayDesc = timeUtil.fmtDateCHN(this.getDaySetByTimeMark(meet, timeMark).day);

		let timeSet = this.getTimeSetByTimeMark(meet, timeMark);
		let timeDesc = timeSet.start + '～' + timeSet.end;
		meet.dayDesc = dayDesc + ' ' + timeDesc;

		// 取出本人最近一次本时段填写表单
		let whereMy = {
			JOIN_USER_ID: userId,
		}
		let orderByMy = {
			JOIN_ADD_TIME: 'desc'
		}
		let joinMy = await JoinModel.getOne(whereMy, 'JOIN_FORMS', orderByMy);


		if (joinMy)
			meet.myForms = joinMy.JOIN_FORMS;
		else
			meet.myForms = [];

		return meet;
	}



	/** 按天获取预约项目 */
	async getMeetListByDay(day) {
		let where = {
			'meet.MEET_STATUS': ['in', [MeetModel.STATUS.COMM, MeetModel.STATUS.OVER]],
			'day': day,
		}; 

		let orderBy = {
			'MEET_ORDER': 'asc',
			'MEET_ADD_TIME': 'desc'
		};

		let fields = 'meet.MEET_TITLE,meet.MEET_DAYS_SET,meet.MEET_OBJ.cover, DAY_MEET_ID, day, times';


		let joinParams = {
			from: MeetModel.CL,
			localField: 'DAY_MEET_ID',
			foreignField: '_id',
			as: 'meet',
		};

		let list = await DayModel.getListJoin(joinParams, where, fields, orderBy, 1, 100, false);
		list = list.list; 
		let retList = [];

		for (let k = 0; k < list.length; k++) {

			let usefulTimes = [];

			for (let j in list[k].times) {
				if (list[k].times[j].status != 1) continue;
				usefulTimes.push(list[k].times[j]);
			}

			if (usefulTimes.length == 0) continue;

			let node = {};
			node.timeDesc = usefulTimes.length > 1 ? usefulTimes.length + '个时段' : usefulTimes[0].start;
			node.title = list[k].meet.MEET_TITLE;
			node.pic = list[k].meet.MEET_OBJ.cover;
			node._id = list[k].DAY_MEET_ID;
			retList.push(node);

		}
		return retList;
	}

	/** 获取从某天开始可预约的日期 */
	async getHasDaysFromDay(day) {
		// 查出现有正常的预约项目
		let meetList = await MeetModel.getAll({ MEET_STATUS: ['in', [MeetModel.STATUS.COMM, MeetModel.STATUS.OVER]] }, '_id');

		meetList = dataUtil.getArrByKey(meetList, '_id');


		let whereDay = {
			day: ['>=', day],
			'times.status': 1
		};
		return await DayModel.distinct(whereDay, 'day');

	}

	/** 取得预约分页列表 */
	async getMeetList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序 
		cateId, //分类查询条件
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'MEET_ORDER': 'asc',
			'MEET_ADD_TIME': 'desc'
		};
		let fields = 'MEET_TITLE,MEET_OBJ,MEET_DAYS,MEET_CATE_NAME,MEET_CATE_ID';

		let where = {};
		where.and = {
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};

		if (cateId && cateId !== '0') where.and.MEET_CATE_ID = cateId;

		where.and.MEET_STATUS = ['in', [MeetModel.STATUS.COMM, MeetModel.STATUS.OVER]]; // 状态  

		if (util.isDefined(search) && search) {
			where.or = [
				{ MEET_TITLE: ['like', search] },
			];

		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'NEWS_ADD_TIME');
					break;
				}
				case 'cateId': {
					if (sortVal) where.and.MEET_CATE_ID = String(sortVal);
					break;
				}
			}
		}
		let result = await MeetModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);

		return result;
	}



	/** 取消我的预约 只有成功可以取消 */
	async cancelMyJoin(userId, joinId) {
		let where = {
			JOIN_USER_ID: userId,
			_id: joinId,
			JOIN_IS_CHECKIN: 0, // 核销不能取消
			JOIN_STATUS: JoinModel.STATUS.SUCC
		};
		let join = await JoinModel.getOne(where);

		if (!join) {
			this.AppError('未找到可取消的预约记录');
		}

		// 取消规则判定
		let whereMeet = {
			_id: join.JOIN_MEET_ID,
			MEET_STATUS: ['in', [MeetModel.STATUS.COMM, MeetModel.STATUS.OVER]]
		}
		let meet = await this.getMeetOneDay(join.JOIN_MEET_ID, join.JOIN_MEET_DAY, whereMeet);
		if (!meet) this.AppError('预约项目不存在或者已关闭');

		let daySet = this.getDaySetByTimeMark(meet, join.JOIN_MEET_TIME_MARK);
		let timeSet = this.getTimeSetByTimeMark(meet, join.JOIN_MEET_TIME_MARK);
		if (!timeSet) this.AppError('被取消的时段不存在');


		if (meet.MEET_CANCEL_SET == 0)
			this.AppError('该预约不能取消');


		let startT = daySet.day + ' ' + timeSet.start + ':00';
		let startTime = timeUtil.time2Timestamp(startT);
		let now = timeUtil.time();
		if (meet.MEET_CANCEL_SET == 10 && now > startTime)
			this.AppError('该预约已经开始，无法取消');
		else if (meet.MEET_CANCEL_SET > 10 && now > startTime - (meet.MEET_CANCEL_SET - 10) * 3600 * 1000) {
			let before = timeUtil.timestamp2Time(startTime - (meet.MEET_CANCEL_SET - 10) * 3600 * 1000, 'Y-M-D h:m');
			this.AppError('该预约仅在开始前' + (meet.MEET_CANCEL_SET - 10) + '小时 (' + before + '前) 可取消');
		}




		await JoinModel.del(where);


		// 统计
		await this.statJoinCnt(join.JOIN_MEET_ID, join.JOIN_MEET_TIME_MARK);

		// 课时统计
		await this.editUserMeetLesson(null, userId, 1, LessonLogModel.TYPE.USER_CANCEL, join.JOIN_MEET_ID, '《' + meet.MEET_TITLE + '》')

	}

	/** 取得我的预约详情 */
	async getMyJoinDetail(userId, joinId) {

		let fields = 'JOIN_COMPLETE_END_TIME,JOIN_IS_CHECKIN,JOIN_CHECKIN_TIME,JOIN_REASON,JOIN_MEET_ID,JOIN_MEET_TITLE,JOIN_MEET_DAY,JOIN_MEET_TIME_START,JOIN_MEET_TIME_END,JOIN_STATUS,JOIN_ADD_TIME,JOIN_CODE,JOIN_FORMS';

		let where = {
			_id: joinId,
			JOIN_USER_ID: userId
		};
		return await JoinModel.getOne(where, fields);
	}

	/** 取得我的预约分页列表 */
	async getMyJoinList(userId, {
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序 
		page,
		size,
		isTotal = true,
		oldTotal
	}) {
		orderBy = orderBy || {
			//	'JOIN_MEET_DAY': 'desc',
			//	'JOIN_MEET_TIME_START': 'desc',
			'JOIN_ADD_TIME': 'desc'
		};
		let fields = 'JOIN_COMPLETE_END_TIME,JOIN_IS_CHECKIN,JOIN_REASON,JOIN_MEET_ID,JOIN_MEET_TITLE,JOIN_MEET_DAY,JOIN_MEET_TIME_START,JOIN_MEET_TIME_END,JOIN_STATUS,JOIN_ADD_TIME,JOIN_OBJ';

		let where = {
			JOIN_USER_ID: userId
		};
		//where.MEET_STATUS = ['in', [MeetModel.STATUS.COMM, MeetModel.STATUS.OVER]]; // 状态  

		if (util.isDefined(search) && search) {
			where['JOIN_MEET_TITLE'] = {
				$regex: '.*' + search,
				$options: 'i'
			};
		} else if (sortType) {
			// 搜索菜单
			switch (sortType) {

				case 'cateId': {
					if (sortVal) where.JOIN_MEET_CATE_ID = String(sortVal);
					break;
				}
				case 'use': { //可用未过期
					where.JOIN_STATUS = JoinModel.STATUS.SUCC;
					where.JOIN_COMPLETE_END_TIME = ['>=', timeUtil.time('Y-M-D h:m')];
					break;
				}
				case 'check': { //已核销
					where.JOIN_STATUS = JoinModel.STATUS.SUCC;
					where.JOIN_IS_CHECKIN = 1;
					break;
				}
				case 'timeout': { //已过期未核销
					where.JOIN_STATUS = JoinModel.STATUS.SUCC;
					where.JOIN_IS_CHECKIN = 0;
					where.JOIN_COMPLETE_END_TIME = ['<', timeUtil.time('Y-M-D h:m')];
					break;
				}
				case 'succ': { //预约成功
					where.JOIN_STATUS = JoinModel.STATUS.SUCC;
					//where.JOIN_MEET_DAY = ['>=', timeUtil.time('Y-M-D h:m')];
					//where.JOIN_MEET_TIME_START = ['>=', timeUtil.time('h:m')];
					break;
				}
				case 'cancel': { //已取消
					where.JOIN_STATUS = ['in', [JoinModel.STATUS.CANCEL, JoinModel.STATUS.ADMIN_CANCEL]];
					break;
				}
			}
		}
		let result = await JoinModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);

		return result;
	}

	/** 取得我的某日预约列表 */
	async getMyJoinSomeday(userId, day) {

		let fields = 'JOIN_IS_CHECKIN,JOIN_MEET_ID,JOIN_MEET_TITLE,JOIN_MEET_DAY,JOIN_MEET_TIME_START,JOIN_MEET_TIME_END,JOIN_STATUS,JOIN_ADD_TIME';

		let where = {
			JOIN_USER_ID: userId,
			JOIN_MEET_DAY: day
		};
		//where.MEET_STATUS = ['in', [MeetModel.STATUS.COMM, MeetModel.STATUS.OVER]]; // 状态  

		let orderBy = {
			'JOIN_MEET_TIME_START': 'asc',
			'JOIN_ADD_TIME': 'desc'
		}

		return await JoinModel.getAll(where, fields, orderBy);


	}


	/** 取得某人的约课记录分页列表 */
	async getOneLessonLogList(userId, {
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序 
		page,
		size,
		isTotal = true,
		oldTotal
	}) {
		orderBy = orderBy || {
			//	'JOIN_MEET_DAY': 'desc',
			//	'JOIN_MEET_TIME_START': 'desc',
			'LESSON_LOG_ADD_TIME': 'desc'
		};
		let fields = '*';

		let where = {
			LESSON_LOG_USER_ID: userId
		};

		if (util.isDefined(search) && search) {
			where['LESSON_LOG_DESC'] = {
				$regex: '.*' + search,
				$options: 'i'
			};
		} else if (sortType) {
			// 搜索菜单
			switch (sortType) {

				case 'type': {
					if (sortVal) where.LESSON_LOG_TYPE = Number(sortVal);
					break;
				}


			}
		}
		let result = await LessonLogModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);

		return result;
	}
}

module.exports = MeetService;