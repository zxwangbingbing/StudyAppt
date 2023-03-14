/**
 * Notes:服务者预约控制器模块
 * Ver : CCMiniCloud Framework 2.0.3 ALL RIGHTS RESERVED BY cclinuX0730 (wechat)
 * Date: 2023-01-16 19:20:00 
 */

const BaseProjectWorkController = require('./base_project_work_controller.js');
const timeUtil = require('../../../../framework/utils/time_util.js');
const dataUtil = require('../../../../framework/utils/data_util.js');
const AdminMeetService = require('../../service/admin/admin_meet_service.js');

class WorkMeetController extends BaseProjectWorkController {

	/** 获取预约信息用于编辑修改 */
	async getMeetDetail() {
		await this.isWork();

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminMeetService();
		let detail = await service.getMeetDetail(this._workId);
		return detail;
	}


	/** 编辑预约 */
	async editMeet() {
		await this.isWork();

		let rules = {
			id: 'must|id',
			title: 'must|string|min:2|max:50|name=标题',
			cateId: 'must|id|name=分类',
			cateName: 'must|string|name=分类',
			order: 'must|int|min:0|max:9999|name=排序号',
			cancelSet: 'must|int|name=取消设置',
			daysSet: 'must|array|name=预约时间设置',
			phone: 'must|string|len:11|name=登陆手机',
			password: 'string|min:6|max:30|name=登陆密码',
			forms: 'array|name=表单',
			joinForms: 'must|array|name=用户资料设置',
		};

		// 取得数据
		let input = this.validateData(rules);
		input.id = this._workId;


		let service = new AdminMeetService();
		let result = service.editMeet(input);


		return result;
	}


	/** 更新图片信息 */
	async updateMeetForms() {
		await this.isWork();

		// 数据校验
		let rules = {
			id: 'must|id',
			hasImageForms: 'array'
		};

		// 取得数据
		let input = this.validateData(rules);
		input.id = this._workId;


		let service = new AdminMeetService();
		return await service.updateMeetForms(input);
	}



	/** 创建模板 */
	async insertMeetTemp() {
		await this.isWork();

		let rules = {
			name: 'must|string|min:1|max:20|name=名称',
			times: 'must|array|name=模板时段',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminMeetService();
		let result = await service.insertMeetTemp(input, this._workId);

		return result;

	}

	/** 编辑模板 */
	async editMeetTemp() {
		await this.isWork();

		let rules = {
			id: 'must|id',
			isLimit: 'must|bool|name=是否限制',
			limit: 'must|int|name=人数上限',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminMeetService();
		let result = service.editMeetTemp(input, this._workId);

		return result;
	}

	/** 模板列表 */
	async getMeetTempList() {
		await this.isWork();

		let service = new AdminMeetService();
		let result = await service.getMeetTempList(this._workId);

		return result;
	}

	/** 删除模板 */
	async delMeetTemp() {
		await this.isWork();

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminMeetService();
		await service.delMeetTemp(input.id, this._workId);

	}


	// 删除某时段预约记录
	async cancelJoinByTimeMark() {
		await this.isWork();

		// 数据校验
		let rules = {
			meetId: 'must|id',
			timeMark: 'must|string',
			reason: 'string'
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminMeetService();
		return await service.cancelJoinByTimeMark(input._workId, input.timeMark, input.reason);
	}

	/** 预约名单列表 */
	async getJoinList() {
		await this.isWork();

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			meetId: 'must|id',
			mark: 'must|string',
			page: 'must|int|default=1',
			size: 'int|default=10',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);
		input.meetId = this._workId;

		let service = new AdminMeetService();
		let result = await service.getJoinList(input);

		// 数据格式化
		let list = result.list;
		for (let k = 0; k < list.length; k++) {
			list[k].JOIN_ADD_TIME = timeUtil.timestamp2Time(list[k].JOIN_ADD_TIME);
			list[k].JOIN_CHECKIN_TIME = timeUtil.timestamp2Time(list[k].JOIN_CHECKIN_TIME);

			//分解成数组，高亮显示
			let forms = list[k].JOIN_FORMS;
			for (let j in forms) {
				forms[j].valArr = dataUtil.splitTextByKey(forms[j].val, input.search);
			}

		}
		result.list = list;

		return result;

	}

	// 按日统计预约记录
	async getDayList() {
		await this.isWork();

		let rules = {
			meetId: 'must|id',
			start: 'must|date',
			end: 'must|date',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminMeetService();
		return await service.getDayList(this._workId, input.start, input.end);
	}


	/** 管理员按钮核销 */
	async checkinJoin() {
		await this.isWork();

		let rules = {
			joinId: 'must|id',
			flag: 'must|in:0,1'
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminMeetService();
		await service.checkinJoin(input.joinId, input.flag);
	}

	/** 管理员扫码核验 */
	async scanJoin() {
		await this.isWork();

		let rules = {
			meetId: 'must|id',
			code: 'must|string|len:15',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminMeetService();
		await service.scanJoin(this._workId, input.code);
	}


	/** 报名状态修改 */
	async statusJoin() {
		await this.isWork();

		// 数据校验
		let rules = {
			joinId: 'must|id',
			status: 'must|int',
			reason: 'string|max:200',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminMeetService();
		return await service.statusJoin(input.joinId, input.status, input.reason);
	}

	/** 报名删除 */
	async delJoin() {
		await this.isWork();

		// 数据校验
		let rules = {
			joinId: 'must|id'
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminMeetService();
		return await service.delJoin(input.joinId);
	}

}

module.exports = WorkMeetController;