/**
 * Notes: 搜索模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2020-11-14 07:48:00 
 */

const BaseBiz = require('./base_biz.js');
const cacheHelper = require('../helper/cache_helper.js');

/**
 * 
 */
class SearchBiz extends BaseBiz {
	
	static clearHistory(key){
		cacheHelper.remove(key);
	}

	static getHistory(key)
	{ 
		return cacheHelper.get(key, []);

	}

	/**添加关键字缓存
	 * 
	 * @param {*} key 
	 * @param {*} val 
	 * @param {*} size 个数
	 * @param {*} expire 过期时间
	 */
	static addHistory(key, val, size = 20, expire = 86400 * 30)  {
		if (!val || val.length == 0) return [];
		
		let his = cacheHelper.get(key, []);
		
		//查询是否存在 并删除
		let pos = his.indexOf(val);	 
		if (pos > -1) his.splice(pos, 1);
 
		// 加到头部
		his.unshift(val);
 
		// 判断个数， 多的删除
		if (his.length > size)
			his.splice(his.length - 1, 1);
			
		// 存缓存
		cacheHelper.set(key, his, expire);

		return his;
	}

}

module.exports = SearchBiz;