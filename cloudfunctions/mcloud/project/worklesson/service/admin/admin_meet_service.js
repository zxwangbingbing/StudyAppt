/**
 * Notes: 预约后台管理
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2021-12-08 07:48:00 
 */

const BaseProjectAdminService = require('./base_project_admin_service.js');
const MeetService = require('../meet_service.js');
const AdminHomeService = require('../admin/admin_home_service.js');
const dataUtil = require('../../../../framework/utils/data_util.js');
const timeUtil = require('../../../../framework/utils/time_util.js');
const setupUtil = require('../../../../framework/utils/setup/setup_util.js');
const util = require('../../../../framework/utils/util.js');
const cloudUtil = require('../../../../framework/cloud/cloud_util.js');
const cloudBase = require('../../../../framework/cloud/cloud_base.js');
const md5Lib = require('../../../../framework/lib/md5_lib.js');


const MeetModel = require('../../model/meet_model.js');
const JoinModel = require('../../model/join_model.js');
const LessonLogModel = require('../../model/lesson_log_model.js');
const DayModel = require('../../model/day_model.js');
const TempModel = require('../../model/temp_model.js');

const exportUtil = require('../../../../framework/utils/export_util.js');


// 导出报名数据KEY
const EXPORT_JOIN_DATA_KEY = 'EXPORT_JOIN_DATA';

class AdminMeetService extends BaseProjectAdminService {

	/** 推荐首页SETUP */
	async vouchMeetSetup(id, vouch) {
		this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}


	/** 预约数据列表 */
	async getDayList(meetId, start, end) {
		let where = {
			DAY_MEET_ID: meetId,
			day: ['between', start, end]
		}
		let orderBy = {
			day: 'asc'
		}
		return await DayModel.getAllBig(where, 'day,times,dayDesc', orderBy);
	}

	// 按项目统计人数
	async statJoinCntByMeet(meetId) {
		this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}


	/** 管理员按钮核销 */
	async checkinJoin(joinId, flag) {
		this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/** 管理员扫码核销 */
	async scanJoin(meetId, code) {
		this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**
	 * 判断本日是否有预约记录
	 * @param {*} daySet daysSet的节点
	 */
	checkHasJoinCnt(times) {
		this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	// 判断含有预约的日期
	getCanModifyDaysSet(daysSet) {
		this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	// 更新forms信息
	async updateMeetForms({
		id,
		hasImageForms
	}) {
		this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}


	/**添加 */
	async insertMeet(adminId, {
		title,
		order,
		cancelSet,
		cateId,
		cateName,
		daysSet,
		phone,
		password,
		forms,
		joinForms,
	}) {

		this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}


	/**排期设置 */
	async setDays(id, {
		daysSet,
	}) {

		this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}


	/**删除数据 */
	async delMeet(id) {
		let where = {
			_id: id
		}

		this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**获取信息 */
	async getMeetDetail(id) {
		let fields = '*';

		let where = {
			_id: id
		}
		let meet = await MeetModel.getOne(where, fields);
		if (!meet) return null;

		let meetService = new MeetService();
		meet.MEET_DAYS_SET = await meetService.getDaysSet(id, timeUtil.time('Y-M-D')); //今天及以后

		return meet;
	}


	/** 更新日期设置 */
	async _editDays(meetId, nowDay, daysSetData) {
		this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**更新数据 */
	async editMeet({
		id,
		title,
		cateId,
		cateName,
		order,
		cancelSet,
		daysSet,
		phone,
		password,
		forms,
		joinForms
	}) {
		this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}

	/**预约名单分页列表 */
	async getJoinList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		meetId,
		mark,
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'JOIN_ADD_TIME': 'desc'
		};
		let fields = 'JOIN_IS_CHECKIN,JOIN_CHECKIN_TIME,JOIN_CODE,JOIN_ID,JOIN_REASON,JOIN_USER_ID,JOIN_MEET_ID,JOIN_MEET_TITLE,JOIN_MEET_DAY,JOIN_MEET_TIME_START,JOIN_MEET_TIME_END,JOIN_MEET_TIME_MARK,JOIN_FORMS,JOIN_STATUS,JOIN_ADD_TIME';

		let where = {
			JOIN_MEET_ID: meetId,
			JOIN_MEET_TIME_MARK: mark
		};
		if (util.isDefined(search) && search) {
			where['JOIN_FORMS.val'] = {
				$regex: '.*' + search,
				$options: 'i'
			};
		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'status':
					// 按类型
					sortVal = Number(sortVal);
					if (sortVal == 1099) //取消的2种
						where.JOIN_STATUS = ['in', [10, 99]]
					else
						where.JOIN_STATUS = Number(sortVal);
					break;
				case 'checkin':
					// 核销
					where.JOIN_STATUS = JoinModel.STATUS.SUCC;
					if (sortVal == 1) {
						where.JOIN_IS_CHECKIN = 1;
					} else {
						where.JOIN_IS_CHECKIN = 0;
					}
					break;
			}
		}

		return await JoinModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	/**预约项目分页列表 */
	async getAdminMeetList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		whereEx, //附加查询条件
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'MEET_ORDER': 'asc',
			'MEET_ADD_TIME': 'desc'
		};
		let fields = 'MEET_CATE_ID,MEET_CATE_NAME,MEET_TITLE,MEET_STATUS,MEET_DAYS,MEET_ADD_TIME,MEET_EDIT_TIME,MEET_ORDER,MEET_VOUCH,MEET_QR';

		let where = {};
		if (util.isDefined(search) && search) {
			where.MEET_TITLE = {
				$regex: '.*' + search,
				$options: 'i'
			};
		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'status':
					// 按类型
					where.MEET_STATUS = Number(sortVal);
					break;
				case 'cateId':
					// 按类型
					where.MEET_CATE_ID = sortVal;
					break;
				case 'sort':
					// 排序
					if (sortVal == 'view') {
						orderBy = {
							'MEET_VIEW_CNT': 'desc',
							'MEET_ADD_TIME': 'desc'
						};
					}

					break;
			}
		}

		return await MeetModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	/** 删除 */
	async delJoin(joinId) {
		this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}

	/**修改报名状态 
	 * 特殊约定 99=>正常取消 
	 */
	async statusJoin(joinId, status, reason = '') {
		this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**修改项目状态 */
	async statusMeet(id, status) {
		this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**置顶排序设定 */
	async sortMeet(id, sort) {
		this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**首页设定 */
	async vouchMeet(id, vouch) {
		this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	//##################模板
	/**添加模板 */
	async insertMeetTemp({
		name,
		times,
	}, meetId = 'admin') {

		this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}

	/**更新数据 */
	async editMeetTemp({
		id,
		limit,
		isLimit
	}, meetId = 'admin') {

		this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}


	/**删除数据 */
	async delMeetTemp(id, meetId = 'admin') {
		this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}


	/**模板列表 */
	async getMeetTempList(meetId = 'admin') {
		let orderBy = {
			'TEMP_ADD_TIME': 'desc'
		};
		let fields = 'TEMP_NAME,TEMP_TIMES';

		let where = {
			TEMP_MEET_ID: meetId
		};
		return await TempModel.getAll(where, fields, orderBy);
	}

	// #####################导出报名数据
	/**获取报名数据 */
	async getJoinDataURL() {
		return await exportUtil.getExportDataURL(EXPORT_JOIN_DATA_KEY);
	}

	/**删除报名数据 */
	async deleteJoinDataExcel() {
		this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**导出报名数据 */
	async exportJoinDataExcel({
		meetId,
		startDay,
		endDay,
		status
	}) {
		this.AppError('[课时]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}

}

module.exports = AdminMeetService;