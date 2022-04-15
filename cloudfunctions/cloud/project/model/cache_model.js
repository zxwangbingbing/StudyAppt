/**
 * Notes: 缓存实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2022-01-26 19:20:00 
 */


const BaseModel = require('./base_model.js');

class CacheModel extends BaseModel {

}

// 集合名
CacheModel.CL = "ax_cache";

CacheModel.DB_STRUCTURE = {
	_pid: 'string|true',
	CACHE_ID: 'string|true',

	CACHE_KEY: 'string|true',
	CACHE_VALUE: 'object|true',

	CACHE_TIMEOUT: 'int|true|comment=超时时间，毫秒',

	CACHE_ADD_TIME: 'int|true',
	CACHE_EDIT_TIME: 'int|true',
	CACHE_ADD_IP: 'string|false',
	CACHE_EDIT_IP: 'string|false',
};

// 字段前缀
CacheModel.FIELD_PREFIX = "CACHE_";

module.exports = CacheModel;