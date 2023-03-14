/**
 * Notes: 基础业务逻辑
 * Ver : CCMiniCloud Framework 2.0.9 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2022-04-24 04:00:00 
 */

const AppError = require('../../core/app_error.js');
const appCode = require('../../core/app_code.js');
const timeUtil = require('../../utils/time_util.js');

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

	/** 时期范围处理 */
	fmtSearchDate(where, search, field) {
		if (!search || search.length != 21 || !search.includes('#')) return where;

		let arr = search.split('#');
		let start = arr[0];
		let end = arr[1];
		where[field] = ['between', start, end];
		return where;
	}

	/* 数据库字段排序处理 */
	fmtOrderBySort(sortVal, defaultSort) {
		let orderBy = {
			[defaultSort]: 'desc'
		};

		if (sortVal.includes('|')) {
			let field = sortVal.split('|')[0];
			let order = sortVal.split('|')[1];
			orderBy = {
				[field]: order,
			};
			if (defaultSort != field) orderBy[defaultSort] = 'desc';
		}
		return orderBy;
	}

}

module.exports = BaseService;