/**
 * Notes: 缓存相关函数
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2022-01-26 04:00:00 
 */

const CacheModel = require('../../project/model/cache_model.js');
const config = require('../../config/config.js');

/**
 * 设置
 * key 键key
 * val 值value
 * t 秒
 */
async function set(key, val, t = 86400 * 30) {
	if (!config.IS_CACHE) return;

	if (!key) return null;

	let where = {
		CACHE_KEY: key
	}

	let seconds = parseInt(t);
	if (seconds > 0) {
		let timeout = new Date().getTime();
		timeout = timeout + seconds * 1000;

		let data = {
			CACHE_VALUE: {
				val
			},
			CACHE_TIMEOUT: timeout
		}
		await CacheModel.insertOrUpdate(where, data);

	} else {
		await CacheModel.del(where);
	}
}


/**
 * 获取
 * k 键key
 * def 默认值
 */
async function get(key, def = null) {
	if (!config.IS_CACHE) return null;

	if (!key) return null;

	let where = {
		CACHE_KEY: key
	}

	let cache = await CacheModel.getOne(where, 'CACHE_VALUE,CACHE_TIMEOUT');
	if (!cache) return def;

	if (cache.CACHE_TIMEOUT < new Date().getTime()) {
		CacheModel.del(where);
		return def;
	}

	let res = cache.CACHE_VALUE.val;

	if (res === undefined) {
		return def;
	} else {
		return res;
	}
}

/**
 * 删除
 * @param {*} key 
 * @param {*} fuzzy  是否模糊匹配
 */
async function remove(key, fuzzy = false) {
	if (!config.IS_CACHE) return;
	if (!key) return;

	let where = {
		CACHE_KEY: key
	}

	if (fuzzy) {
		where.CACHE_KEY = {
			$regex: '.*' + key,
			$options: 'i'
		};
	}

	await CacheModel.del(where);
}

/**
 * 清除所有key
 */
async function clear() {
	if (!config.IS_CACHE) return;
	await CacheModel.clear();
}

module.exports = {
	set,
	get,
	remove,
	clear
}