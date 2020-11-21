/**
 * Notes: 业务通用
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-11-14 07:48:00 
 */

const cacheHelper = require('./cache_helper.js');
const setting = require('./setting.js');

const TYPE = {
	//类型 0=用户，1=互助，2=活动 3=相册 4=资讯 5=接龙
	USER: 0,
	INFO: 1,
	MEET: 2,
	ALBUM: 3,
	NEWS: 4,
	GROUP: 5
}

 

function getSkin(skin) {
	for (let k in SKIN) {
		if (SKIN[k].def == skin)
			return SKIN[k];
	}
}

function getType(type) {
	let ret = 0;
	switch (type) {
		case 'user':
			ret = 0;
			break;
		case 'info':
			ret = 1;
			break;
		case 'meet':
			ret = 2;
			break;
		case 'album':
			ret = 3;
			break;
		case 'news':
			ret = 4;
			break;
	}
	return ret;
}

function isCacheList(key) {
	key = key.toUpperCase();
	if (setting.CACHE_IS_LIST)
		return cacheHelper.get(key + '_LIST');
	else
		return false;
}

function removeCacheList(key) {
	key = key.toUpperCase();
	if (setting.CACHE_IS_LIST)
		cacheHelper.remove(key + '_LIST');
}

function setCacheList(key, time = setting.CACHE_LIST_TIME) {
	key = key.toUpperCase();
	if (setting.CACHE_IS_LIST)
		cacheHelper.set(key + '_LIST', 'TRUE', time);
}


module.exports = {
	isCacheList,
	removeCacheList,
	setCacheList,
	TYPE,
	getType, 
	getSkin
}