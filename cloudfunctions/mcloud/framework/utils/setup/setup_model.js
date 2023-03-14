/**
 * Notes: 系统设置实体
 * Ver : CCMiniCloud Framework 2.0.15 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2020-11-05 19:20:00 
 */


const MultiModel = require('../../database/multi_model.js');

class SetupModel extends MultiModel {

}

// 集合名
SetupModel.CL = MultiModel.C('setup');

SetupModel.DB_STRUCTURE = {
	_pid: 'string|true',
	SETUP_ID: 'string|true',

	SETUP_TYPE: 'string|false', //content/cache/vouch
	SETUP_KEY: 'string|true',
	SETUP_VALUE: 'object|true', // {val:}
 
	SETUP_ADD_TIME: 'int|true',
	SETUP_EDIT_TIME: 'int|true',
	SETUP_ADD_IP: 'string|false',
	SETUP_EDIT_IP: 'string|false',
};

// 字段前缀
SetupModel.FIELD_PREFIX = "SETUP_"; 


module.exports = SetupModel;

/* 
### 富文本
[{"type":"text","val":"xxx"},{"type":"img","val":"cloudId://xxxx"}]

### 导出
{"EXPORT_CLOUD_ID":"","EXPORT_EDIT_TIME":""}
*/