/**
 * Notes: 系统设置相关函数
 * Ver : CCMiniCloud Framework 2.31.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2022-05-25 04:00:00 
 */

const SetupModel = require('./setup_model.js');

/**
 * 设置
 * key 键key
 * val 值value
 * t 秒
 */
async function set(key, val, type = '') {
	if (!key) return null;

	let where = {
		SETUP_KEY: key
	}

	let data = {
		SETUP_TYPE: type,
		SETUP_VALUE: {
			val
		}, 
	}
	 
	await SetupModel.insertOrUpdate(where, data);

}

/**
 * 获取
 * k 键key
 * def 默认值
 */
async function get(key) {

	if (!key) return null;

	let where = {
		SETUP_KEY: key
	}

	let setup = await SetupModel.getOne(where, 'SETUP_VALUE');
	if (!setup) return null;


	let res = setup.SETUP_VALUE.val;

	if (res === undefined) {
		return null;
	} else {
		return res;
	}
}

async function get(key) {

	if (!key) return null;

	let where = {
		SETUP_KEY: key
	}

	let setup = await SetupModel.getOne(where, 'SETUP_VALUE');
	if (!setup) return null;


	let res = setup.SETUP_VALUE.val;

	if (res === undefined) {
		return null;
	} else {
		return res;
	}
}

async function remove(key, fuzzy = false) {
	if (!key) return;

	let where = {
		SETUP_KEY: key
	}

	if (fuzzy) {
		where.SETUP_KEY = {
			$regex: '.*' + key,
			$options: 'i'
		};
	}

	await SetupModel.del(where);
}

module.exports = {
	set,
	get,
	remove
}