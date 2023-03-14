/**
 * Notes: 课时变动记录实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2023-03-08 19:20:00 
 */


const BaseProjectModel = require('./base_project_model.js');
class LessonLogModel extends BaseProjectModel { }

// 集合名
LessonLogModel.CL = BaseProjectModel.C('lesson_log');

LessonLogModel.DB_STRUCTURE = {
	_pid: 'string|true',
	LESSON_LOG_ID: 'string|true',


	LESSON_LOG_USER_ID: 'string|true|comment=用户ID',

	LESSON_LOG_MEET_ID: 'string|false|comment=预约项目PK',

	LESSON_LOG_DESC: 'string|false|comment=备注',

	LESSON_LOG_TYPE: 'int|true|default=1|comment=类型 0=用户约课-,1=用户取消预约+,10=后台增加课时+,11=后台减少课时-,12=后台取消预约+，13=后台恢复+',

	LESSON_LOG_EDIT_ADMIN_ID: 'string|false|comment=最近修改的管理员ID',
	LESSON_LOG_EDIT_ADMIN_NAME: 'string|false|comment=最近修改的管理员名',
	LESSON_LOG_EDIT_ADMIN_TIME: 'int|true|default=0|comment=管理员最近修改的时间',


	LESSON_LOG_CHANGE_CNT: 'int|true|default=0|comment=当变动课时数(可正负)',
	LESSON_LOG_LAST_CNT: 'int|true|default=0|comment=变动前次数',
	LESSON_LOG_NOW_CNT: 'int|true|default=0|comment=当前次数', 

	LESSON_LOG_ADD_TIME: 'int|true',
	LESSON_LOG_ADD_IP: 'string|false',

	LESSON_LOG_EDIT_TIME: 'int|true',
	LESSON_LOG_EDIT_IP: 'string|false',
}

// 字段前缀
LessonLogModel.FIELD_PREFIX = "LESSON_LOG_";

/**
 * 类型 0=初始赠送，1=学员约课,2=学员取消预约,10=后台增加课时,11=后台减少课时,12=后台取消预约，13=后台恢复
 */
LessonLogModel.TYPE = {
	INIT: 0,
	USER_APPT: 1,
	USER_CANCEL: 2,
	ADMIN_ADD: 10,
	ADMIN_REDUCE: 11,
	ADMIN_CANCEL: 12,
	ADMIN_RECOVER: 13
};

LessonLogModel.TYPE_DESC = {
	INIT: '初始赠送',
	USER_APPT: '学员约课',
	USER_CANCEL: '学员取消预约',
	ADMIN_ADD: '后台增加课时',
	ADMIN_REDUCE: '后台减少课时',
	ADMIN_CANCEL: '后台取消预约',
	ADMIN_RECOVER: '后台恢复预约'
};


module.exports = LessonLogModel;