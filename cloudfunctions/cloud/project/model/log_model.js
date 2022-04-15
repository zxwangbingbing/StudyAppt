/**
 * Notes: 后台操作日志实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2020-10-16 19:20:00 
 */


const BaseModel = require('./base_model.js');

class LogModel extends BaseModel {

}

// 集合名
LogModel.CL = "ax_log";

LogModel.DB_STRUCTURE = {
	_pid: 'string|true',
	LOG_ID: 'string|true',

	LOG_ADMIN_ID: 'string|true|comment=管理员',
	LOG_ADMIN_PHONE: 'string|false',
	LOG_ADMIN_NAME: 'string|true',

	LOG_CONTENT: 'string|true',

	LOG_TYPE: 'int|true|comment=日志类型 ',

	LOG_ADD_TIME: 'int|true',
	LOG_EDIT_TIME: 'int|true',
	LOG_ADD_IP: 'string|false',
	LOG_EDIT_IP: 'string|false',
};

// 字段前缀
LogModel.FIELD_PREFIX = "LOG_";

LogModel.TYPE = {
	USER: 0,
	MEET: 1,
	NEWS: 2,
	SYS: 99
}
LogModel.TYPE_DESC = {
	USER: '用户',
	MEET: '预约/活动',
	NEWS: '内容/文章',
	SYS: '系统'
}

module.exports = LogModel;