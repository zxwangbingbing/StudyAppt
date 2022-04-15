/**
 * Notes: 预约模块控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2021-12-10 04:00:00 
 */

const BaseController = require('./base_controller.js');
const MeetService = require('../service/meet_service.js');
const timeUtil = require('../../framework/utils/time_util.js');
const JoinModel = require('../model/join_model.js');
const cacheUtil = require('../../framework/utils/cache_util.js');
const config = require('../../config/config.js');

const CACHE_CALENDAR_INDEX = 'cache_calendar_index';
const CACHE_CALENDAR_HAS_DAY = 'cache_calendar_has_day';

class MeetController extends BaseController {


	// 把列表转换为显示模式
	transMeetList(list) {
		let ret = [];
		for (let k in list) {
			let node = {};
			node.type = 'meet';
			node._id = list[k]._id;
			node.title = list[k].MEET_TITLE;
			node.desc = list[k].MEET_STYLE_SET.desc;
			node.ext = list[k].openRule;
			node.pic = list[k].MEET_STYLE_SET.pic;
			ret.push(node);
		}
		return ret;
	}


	/** 按天获取预约项目 */
	async getMeetListByDay() {

		// 数据校验
		let rules = {
			day: 'must|date|name=日期',
		};

		// 取得数据
		let input = this.validateData(rules);

		let cacheKey = CACHE_CALENDAR_INDEX + '_' + input.day;
		let list = await cacheUtil.get(cacheKey);
		if (list) {
			return list;
		} else {
			let service = new MeetService();
			let list = await service.getMeetListByDay(input.day);
			cacheUtil.set(cacheKey, list, config.CACHE_CALENDAR_TIME);
			return list;
		}

	}

	/** 获取从某天开始可预约的日期 */
	async getHasDaysFromDay() {

		// 数据校验
		let rules = {
			day: 'must|date|name=日期',
		};

		// 取得数据
		let input = this.validateData(rules);


		let cacheKey = CACHE_CALENDAR_HAS_DAY + '_' + input.day;
		let list = await cacheUtil.get(cacheKey);
		if (list) {
			return list;
		} else {
			let service = new MeetService();
			let list = await service.getHasDaysFromDay(input.day);
			cacheUtil.set(cacheKey, list, config.CACHE_CALENDAR_TIME);
			return list;
		}

	}

	/** 预约列表 */
	async getMeetList() {

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			typeId: 'string',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new MeetService();
		let result = await service.getMeetList(input);

		// 数据格式化
		let list = result.list;

		for (let k in list) {
			list[k].openRule = this._getLeaveDay(list[k].MEET_DAYS) + '天可预约';
		}

		result.list = this.transMeetList(list);

		return result;

	}

	/** 我的预约列表 */
	async getMyJoinList() {

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new MeetService();
		let result = await service.getMyJoinList(this._userId, input);

		// 数据格式化
		let list = result.list;

		let now = timeUtil.time('Y-M-D h:m');

		for (let k in list) {
			if (now > (list[k].JOIN_MEET_DAY + ' ' + list[k].JOIN_MEET_TIME_END))
				list[k].isTimeout = 1;
			else
				list[k].isTimeout = 0;

			list[k].JOIN_MEET_DAY = timeUtil.fmtDateCHN(list[k].JOIN_MEET_DAY) + ' (' + timeUtil.week(list[k].JOIN_MEET_DAY) + ')';

			list[k].JOIN_ADD_TIME = timeUtil.timestamp2Time(list[k].JOIN_ADD_TIME, 'Y-M-D h:m');
		}

		result.list = list;

		return result;

	}

	/** 我的某日预约列表 */
	async getMyJoinSomeday() {
		// 数据校验
		let rules = {
			day: 'must|date|name=日期',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new MeetService();
		let list = await service.getMyJoinSomeday(this._userId, input.day);

		// 数据格式化  
		for (let k in list) {

		}

		return list;

	}

	/** 我的预约详情 */
	async getMyJoinDetail() {
		// 数据校验
		let rules = {
			joinId: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new MeetService();
		let join = await service.getMyJoinDetail(this._userId, input.joinId);
		if (join) {
			join.JOIN_STATUS_DESC = JoinModel.getDesc('STATUS', join.JOIN_STATUS);
			join.JOIN_ADD_TIME = timeUtil.timestamp2Time(join.JOIN_ADD_TIME);
		}
		return join;

	}

	/** 用户预约取消 */
	async cancelMyJoin() {

		// 数据校验
		let rules = {
			joinId: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new MeetService();
		return await service.cancelMyJoin(this._userId, input.joinId);
	}

	/** 用户自助签到 */
	async userSelfCheckin() {

		// 数据校验
		let rules = {
			timeMark: 'must|string',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new MeetService();
		return await service.userSelfCheckin(this._userId, input.timeMark);
	}


	/**  预约前获取关键信息 */
	async detailForJoin() {
		// 数据校验
		let rules = {
			meetId: 'must|meetId',
			timeMark: 'must|string',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new MeetService();
		let meet = await service.detailForJoin(this._userId, input.meetId, input.timeMark);

		if (meet) {
			// 显示转换  
		}

		return meet;
	}

	/** 浏览预约信息 */
	async viewMeet() {
		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new MeetService();
		let meet = await service.viewMeet(input.id);

		if (meet) {
			// 显示转换  
		}

		return meet;
	}

	/** 预约前检测 */
	async beforeJoin() {
		// 数据校验
		let rules = {
			meetId: 'must|id',
			timeMark: 'must|string',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new MeetService();
		return await service.beforeJoin(this._userId, input.meetId, input.timeMark);
	}

	/** 预约提交 */
	async join() {
		// 数据校验
		let rules = {
			meetId: 'must|id',
			timeMark: 'must|string',
			forms: 'must|array',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new MeetService();
		let admin = null;
		return await service.join(this._userId, input.meetId, input.timeMark, input.forms);
	}


	// 计算可约天数
	_getLeaveDay(days) {
		let now = timeUtil.time('Y-M-D');
		let count = 0;
		for (let k in days) {
			if (days[k] >= now) count++;
		}
		return count;
	}

}

module.exports = MeetController;