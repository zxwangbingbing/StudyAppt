/**
 * Notes: 足迹模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-11-14 07:48:00 
 */

const BaseBiz = require('./base_biz.js');
const cacheHelper = require('../../helper/cache_helper.js');
const timeHelper = require('../../helper/time_helper.js');
const pageHelper = require('../../helper/page_helper.js');
const CACHE_FOOT = 'CACHE_FOOT';

class FootBiz extends BaseBiz {

	static getFootList() {
		let foot = cacheHelper.get(CACHE_FOOT);
		if (foot) {
			for (let i = 0; i < foot.length; i++) {
				foot[i].time = timeHelper.timestamp2Time(foot[i].time);
			}
		}

		return foot;
	}

	/**添加足迹缓存
	 * 
	 * @param {*} key 键
	 * @param {*} val 值 
	 * 格式 key:{ 
	 *  type:类型  
	 *  title:标题
	 *  time:加入时间
	 * }
	 * @param {*} size 最大个数
	 * @param {*} expire 过期时间
	 */
	static addFoot(type, title, size = 60, expire = 86400 * 365 * 3) {
		let path = pageHelper.getCurrentPageUrlWithArgs();
		if (!path || !title || !type) return [];

		let foot = cacheHelper.get(CACHE_FOOT, []);

		//查询是否存在 并删除
		for (let k = 0; k < foot.length; k++) {
			if (path == foot[k].path)
				foot.splice(k, 1);
		}

		// 加到头部
		let val = {
			path,
			type,
			title,
			time: timeHelper.time()
		}
		foot.unshift(val);

		// 判断个数， 多的删除
		if (foot.length > size)
			foot.splice(foot.length - 1, 1);

		// 存缓存
		cacheHelper.set(CACHE_FOOT, foot, expire);

		return foot;
	}
}

module.exports = FootBiz;