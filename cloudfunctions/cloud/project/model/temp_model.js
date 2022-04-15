/**
 * Notes: 模板实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2022-01-02 19:20:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */


const BaseModel = require('./base_model.js');

class TempModel extends BaseModel {

}

// 集合名
TempModel.CL = "ax_temp";

TempModel.DB_STRUCTURE = {
	_pid: 'string|true',
	TEMP_ID: 'string|true',
	TEMP_NAME: 'string|true|comment=名字',

	TEMP_TIMES: 'array|true|comment=时间段',


	TEMP_ADD_TIME: 'int|true',
	TEMP_EDIT_TIME: 'int|true',
	TEMP_ADD_IP: 'string|false',
	TEMP_EDIT_IP: 'string|false',
};

// 字段前缀
TempModel.FIELD_PREFIX = "TEMP_";

module.exports = TempModel;