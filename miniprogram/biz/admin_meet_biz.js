/**
 * Notes:预约后台管理模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2020-11-14 07:48:00 
 */

const BaseBiz = require('./base_biz.js');
const cloudHelper = require('../helper/cloud_helper.js');
const dataHelper = require('../helper/data_helper.js');
const pageHelper = require('../helper/page_helper.js');
const timeHelper = require('../helper/time_helper.js');
const setting = require('../setting/setting.js');
const formSetHelper = require('../cmpts/public/form/form_set_helper.js');

const TIME_NODE = {
	mark: 'mark-no',
	start: '00:00', //开始
	end: '23:59', // 结束
	limit: 50, //人数限制
	isLimit: false,
	status: 1,
	stat: { //统计数据 
		succCnt: 0,
		cancelCnt: 0,
		adminCancelCnt: 0,
	}
};


class AdminMeetBiz extends BaseBiz {

	/** 取得分类 */
	static async getTypeList() {
		let skin = pageHelper.getSkin();

		let typeList = dataHelper.getSelectOptions(skin.MEET_TYPE);
		let arr = [];
		for (let k in typeList) {
			arr.push({
				label: typeList[k].label,
				type: 'typeId',
				val: typeList[k].val, //for options
				value: typeList[k].val, //for list
			})
		}
		return arr;
	}

	static getTypeName(typeId) {
		let skin = pageHelper.getSkin();
		let typeList = dataHelper.getSelectOptions(skin.MEET_TYPE);

		for (let k in typeList) {
			if (typeList[k].val == typeId) return typeList[k].label;
		}
		return '';
	}

	// 计算剩余天数
	static getLeaveDay(days) {
		let now = timeHelper.time('Y-M-D');
		let count = 0;
		for (let k in days) {
			if (days[k].day >= now) count++;
		}
		return count;
	}

	static getNewTimeNode(day) {
		let node = dataHelper.deepClone(TIME_NODE);
		day = day.replace(/-/g, '');
		node.mark = 'T' + day + 'AAA' + dataHelper.genRandomAlpha(10).toUpperCase();
		return node;
	}

	static getDaysTimeOptions() {
		let HourArr = [];
		let clockArr = [];
		let k = 0;

		for (k = 0; k <= 23; k++) {
			let node = {};
			node.label = k + '点';
			node.val = k < 10 ? '0' + k : k;
			HourArr.push(node);
		}

		for (k = 0; k < 59;) {
			let node = {};
			node.label = k + '分';
			node.val = k < 10 ? '0' + k : k;
			clockArr.push(node);
			k += 5;

			if (k == 60) {
				node = {};
				node.label = '59分';
				node.val = '59';
				clockArr.push(node);
			}
		}

		return [HourArr, clockArr];
	}

	static getEndBeforeSetOptions() {
		let ret = '';
		let k = 0;
		for (k = 0; k < 60;) {
			ret += ',' + k + '=预约时段开始前' + k + '分钟截止';
			k += 10;
		}

		for (k = 60; k < 360;) {
			ret += ',' + k + '=预约时段开始前' + k / 60 + '小时截止';
			k += 30;
		}

		for (k = 360; k <= 48 * 60;) {
			ret += ',' + k + '=预约时段开始前' + k / 60 + '小时截止';
			k += 60;
		}

		if (ret.startsWith(',')) ret = ret.substring(1);

		return dataHelper.getSelectOptions(ret);
	}

	static getEndYesterdaySetOptions() {
		let ret = '';
		let k = 0;
		for (k = 0; k < 24; k++) {
			ret += ',' + (k < 10 ? '0' + k : k) + ':00=前一天' + k + '点00分' + '截止';
			ret += ',' + (k < 10 ? '0' + k : k) + ':30=前一天' + k + '点30分' + '截止';
		}

		ret += ',23:59=前一天23点59分截止';
		if (ret.startsWith(',')) ret = ret.substring(1);

		return dataHelper.getSelectOptions(ret);
	}

	static getEndTodaySetOptions() {
		let ret = '';
		let k = 0;
		for (k = 0; k < 24; k++) {
			ret += ',' + (k < 10 ? '0' + k : k) + ':00=当天' + k + '点00分' + '截止';
			ret += ',' + (k < 10 ? '0' + k : k) + ':30=当天' + k + '点30分' + '截止';
		}

		ret += ',23:59=当天23点59分截止';
		if (ret.startsWith(',')) ret = ret.substring(1);

		return dataHelper.getSelectOptions(ret);
	}

	static getEndAfterSetOptions() {
		let ret = '';
		let k = 0;
		for (k = 0; k < 60;) {
			ret += ',' + k + '=预约时段开始后' + k + '分钟截止';
			k += 5;
		}

		for (k = 60; k <= 3 * 60;) {
			ret += ',' + k + '=预约时段开始后' + k / 60 + '小时截止';
			k += 30;
		}

		if (ret.startsWith(',')) ret = ret.substring(1);

		return dataHelper.getSelectOptions(ret);
	}

	static getBeginDaySetOptions() {
		let dayArr = [];
		let clockArr = [];
		let k = 0;

		let nodeCur = {};
		nodeCur.label = '当天';
		nodeCur.val = 0;
		dayArr.push(nodeCur);

		for (k = 1; k <= 180; k++) {
			let node = {};
			node.label = '提前' + k + '天';
			node.val = k;
			dayArr.push(node);
		}

		for (k = 0; k < 24; k++) {
			let node = {};
			node.label = k + '点00分' + '开始';
			node.val = (k < 10 ? '0' + k : k) + ':00';
			clockArr.push(node);

			node = {};
			node.label = k + '点30分' + '开始';
			node.val = (k < 10 ? '0' + k : k) + ':30';
			clockArr.push(node);

		}

		return [dayArr, clockArr];

	}

	static getCancelSetOptions() {
		let modeArr = [{
				label: '取消后无须后台审核',
				val: 'no'
			}
			/*, {
						label: '取消后须后台审核',
						val: 'check'
					}*/
		];
		let timeArr = [];

		let k = 0;
		for (k = -60; k < 0;) {
			let node = {};
			node.label = '开始后' + (-k) + '分钟内可取消';
			node.val = k;
			timeArr.push(node);
			k += 10;
		}

		for (k = 0; k < 60;) {
			let node = {};
			node.label = '开始前' + k + '分钟可取消';
			node.val = k;
			timeArr.push(node);
			k += 10;
		}

		for (k = 60; k < 60 * 24;) {
			let node = {};
			node.label = '开始前' + k / 60 + '小时可取消';
			node.val = k;
			timeArr.push(node);
			k += 60;
		}

		for (k = 60 * 24; k <= 60 * 24 * 10;) {
			let node = {};
			node.label = '开始前' + k / (60 * 24) + '天可取消';
			node.val = k;
			timeArr.push(node);
			k += 60 * 24;
		}

		return [timeArr, modeArr];

	}

	static getLimitSetOptions() {
		let mode = dataHelper.getSelectOptions('all=本项目全程限制次数,clock=按每一时段限制次数,day=按每天限制次数,week=按自然周限制次数,month=按自然月限制次数');

		let list = [];
		for (let k in mode) {
			let node = {};
			node.label = mode[k].label;
			node.val = mode[k].val;

			let children = [];
			if (k == 0) {
				children.push({
					label: '不限制预约次数',
					val: -1
				});
			}
			for (let j = 1; j <= 30; j++) {
				let childNode = {};
				childNode.label = '可预约' + j + '次';
				childNode.val = j
				children.push(childNode);
			}

			node.children = children;

			list.push(node);
		}

		return list;

	}

	// 上限规则的表述
	static getLimitSetDesc(rule) {
		let ret = '';
		switch (rule.mode) {
			case 'all':
				ret = rule.cnt > 0 ? '本项目全程可预约' + rule.cnt + '次' : '本项目全程不限制次数';
				break;
			case 'month':
				ret = '自然月内可预约' + rule.cnt + '次';
				break;
			case 'week':
				ret = '自然周内可预约' + rule.cnt + '次';
				break;
			case 'day':
				ret = '每天可预约' + rule.cnt + '次';
				break;
			case 'clock':
				ret = '每一时段可预约' + rule.cnt + '次';
				break;
		}
		return ret;
	}

	// 截止规则的表述
	static getEndSetDesc(rule) {
		let ret = '';
		switch (rule.mode) {
			case 'no':
				ret = '不限制';
				break;
			case 'yesterday':
				ret = '前一天' + rule.time + '预约截止';
				break;
			case 'today':
				ret = '当天' + rule.time + '预约截止';
				break;
			case 'clock':
				ret = rule.time + '预约截止';
				break;
			case 'before':
				if (rule.time < 60)
					ret = '开始前' + rule.time + '分钟预约截止';
				else
					ret = '开始前' + rule.time / 60 + '小时预约截止';
				break;
			case 'after':
				if (rule.time < 60)
					ret = '开始后' + rule.time + '分钟预约截止';
				else
					ret = '开始后' + rule.time / 60 + '小时预约截止';
				break;
		}
		return ret;
	}

	// 取消规则的表述
	static getCancelSetDesc(rule) {
		let ret = '';
		switch (rule.mode) {
			case 'no':
				if (rule.time < 0)
					ret = '开始后' + (-rule.time) + '分钟可取消,无须审核';
				else if (rule.time == 0)
					ret = '开始前均可取消,无须审核';
				else if (rule.time < 60)
					ret = '开始前' + rule.time + '分钟可取消,无须审核';
				else if (rule.time < 1440)
					ret = '开始前' + rule.time / 60 + '小时可取消,无须审核';
				else
					ret = '开始前' + rule.time / (60 * 24) + '天可取消,无须审核';
				break;
			case 'check':
				if (rule.time == 60)
					ret = '开始前均可取消,须审核';
				else if (rule.time < 60)
					ret = '开始前' + rule.time + '分钟可取消,须审核';
				else if (rule.time < 1440)
					ret = '开始前' + rule.time / 60 + '小时可取消,无须审核';
				else
					ret = '开始前' + rule.time / (60 * 24) + '天可取消,须审核';
				break;
		}

		ret = ret.replace(',无须审核', '');
		return ret;
	}


	// 开放规则的表述
	static getBeginSetDesc(rule) {
		let ret = '';
		switch (rule.mode) {
			case 'no':
				ret = '随时可预约';
				break;
			case 'day':
				if (rule.day == 0)
					ret = '当天 ' + rule.time + '开放预约';
				else
					ret = '提前' + rule.day + '天 ' + rule.time + '开放预约';
				break;
			case 'clock':
				ret = rule.time + '起开放预约';
				break;
		}
		return ret;
	}

	/** 表单初始化相关数据 */
	static async initFormData() {
		let skin = pageHelper.getSkin();

		return {

			// 选项数据  
			typeIdOptions: await AdminMeetBiz.getTypeList(),
			beginDaySetOptions: AdminMeetBiz.getBeginDaySetOptions(),

			// 表单数据  
			formTitle: '',
			formTypeId: '',
			formContent: '',
			formOrder: 9999,
			formStyleSet: {
				pic: '',
				desc: ''
			},

			formDaysSet: [], // 时间设置 


			formIsShowLimit: 1, //是否显示可预约数量

			formFormSet: formSetHelper.defaultForm(skin.DEFAULT_FORMS)
		}

	}

	/** 
	 * 样式更新
	 * @param {string} meetId 
	 * @param {Array} content  富文本数组
	 */
	static async updateMeetStyleSet(meetId, styleSet, that) {
		let pic = styleSet.pic;

		// 图片上传到云空间
		if (styleSet.pic)
			pic = await cloudHelper.transTempPicOne(pic, setting.MEET_PIC_PATH, meetId, false);

		styleSet.pic = pic;

		// 更新本记录的图片信息
		let params = {
			meetId,
			styleSet
		}

		try {
			// 更新数据 从promise 里直接同步返回
			await cloudHelper.callCloudSumbit('admin/meet_update_style', params);
			that.setData({
				formStyleSet: styleSet
			});
		} catch (e) {
			console.error(e);
			return false;
		}
		return true;
	}

	/** 
	 * 富文本中的图片上传
	 * @param {string} meetId 
	 * @param {Array} content  富文本数组
	 */
	static async updateMeetCotnentPic(meetId, content, that) {
		let imgList = [];
		for (let k in content) {
			if (content[k].type == 'img') {
				imgList.push(content[k].val);
			}
		}

		// 图片上传到云空间
		imgList = await cloudHelper.transTempPics(imgList, setting.MEET_PIC_PATH, meetId);

		// 更新图片地址
		let imgIdx = 0;
		for (let k in content) {
			if (content[k].type == 'img') {
				content[k].val = imgList[imgIdx];
				imgIdx++;
			}
		}

		// 更新本记录的图片信息
		let params = {
			meetId,
			content
		}

		try {
			// 更新数据 从promise 里直接同步返回
			await cloudHelper.callCloudSumbit('admin/meet_update_content', params);
			that.setData({
				formContent: content
			});
		} catch (e) {
			console.error(e);
			return false;
		}

		return true;
	}

}


/** 表单校验  本地 */
AdminMeetBiz.CHECK_FORM = {
	title: 'formTitle|must|string|min:2|max:50|name=标题',
	typeId: 'formTypeId|must|id|name=分类',
	order: 'formOrder|must|int|min:1|max:9999|name=排序号',

	daysSet: 'formDaysSet|must|array|name=预约时间设置',
	isShowLimit: 'formIsShowLimit|must|int|in:0,1|name=是否显示可预约人数',

	formSet: 'formFormSet|must|array|name=用户资料设置',
};


module.exports = AdminMeetBiz;