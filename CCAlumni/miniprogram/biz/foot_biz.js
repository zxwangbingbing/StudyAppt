/**
 * Notes: 足迹模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-11-14 07:48:00 
 */

const BaseBiz = require('./base_biz.js');
const cacheHelper = require('../helper/cache_helper.js');
const helper = require('../helper/helper.js');
const bizHelper = require('../helper/biz_helper.js');
const CACHE_FOOT = 'CACHE_FOOT';

class FootBiz extends BaseBiz {

	static getFootList() {
		let foot = cacheHelper.get(CACHE_FOOT);
		if (foot) {
			for (let i = 0; i < foot.length; i++) {
				foot[i].time = helper.timestamp2Time(foot[i].time);

				switch (foot[i].type) {
					case bizHelper.TYPE.USER:
						foot[i].typeDesc = '同学';
						foot[i].color = 'red';
						break;
					case bizHelper.TYPE.INFO:
						foot[i].typeDesc = '互助';
						foot[i].color = 'blue';
						break;
					case bizHelper.TYPE.MEET:
						foot[i].typeDesc = '活动';
						foot[i].color = 'green';
						break;
					case bizHelper.TYPE.ALBUM:
						foot[i].typeDesc = '相册';
						foot[i].color = 'yellow';
						break;
					case bizHelper.TYPE.NEWS:
						foot[i].typeDesc = '资讯';
						foot[i].color = 'pink';
						break;
				}
			}
		}

		return foot;
	}

	/**添加足迹缓存
	 * 
	 * @param {*} key 键
	 * @param {*} val 值 
	 * 格式 key:{
	 *  oid: 
	 *  type:类型  
	 *  title:标题
	 *  time:加入时间
	 * }
	 * @param {*} size 最大个数
	 * @param {*} expire 过期时间
	 */
	static addFoot(oid, type, title, size = 60, expire = 86400 * 365 * 3) {
		if (!oid || !title) return [];

		let foot = cacheHelper.get(CACHE_FOOT, []);

		//查询是否存在 并删除
		for (let k in foot) {
			if (oid == foot[k].oid && type == foot[k].type)
				foot.splice(k, 1);
		}

		// 加到头部
		let val = {
			oid,
			type,
			title,
			time: helper.time()
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