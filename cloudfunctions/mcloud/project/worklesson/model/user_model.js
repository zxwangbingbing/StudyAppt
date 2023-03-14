/**
 * Notes: 用户实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2020-10-14 19:20:00 
 */


const BaseProjectModel = require('./base_project_model.js');
class UserModel extends BaseProjectModel { }

// 集合名
UserModel.CL = BaseProjectModel.C('user');

UserModel.DB_STRUCTURE = {
	_pid: 'string|true',
	USER_ID: 'string|true',

	USER_MINI_OPENID: 'string|true|comment=小程序openid',
	USER_STATUS: 'int|true|default=1|comment=状态 0=待审核,1=正常,8=审核未过,9=禁用',
	USER_CHECK_REASON: 'string|false|comment=审核未过的理由',

	USER_TYPE: 'int|true|default=1|comment=类型 0=未注册,1=已注册',

	USER_NAME: 'string|false|comment=用户昵称',
	USER_MOBILE: 'string|false|comment=联系电话',

	USER_FORMS: 'array|true|default=[]',
	USER_OBJ: 'object|true|default={}',

	USER_LOGIN_CNT: 'int|true|default=0|comment=登陆次数',
	USER_LOGIN_TIME: 'int|false|comment=最近登录时间',

	USER_LESSON_TOTAL_CNT: 'int|true|default=0|comment=当前课时数',
	USER_LESSON_USED_CNT: 'int|true|default=0|comment=已约课时数',
	USER_LESSON_TIME: 'int|false|comment=最近课时变动时间', 
	
	USER_REG_TIME: 'int|true|default=0',

	USER_ADD_TIME: 'int|true',
	USER_ADD_IP: 'string|false',

	USER_EDIT_TIME: 'int|true',
	USER_EDIT_IP: 'string|false',
}

// 字段前缀
UserModel.FIELD_PREFIX = "USER_";

/**
 * 状态 0=待审核,1=正常,8=审核未过,9=禁用
 */
UserModel.STATUS = {
	UNUSE: 0,
	COMM: 1,
	UNCHECK: 8,
	FORBID: 9
};

UserModel.STATUS_DESC = {
	UNUSE: '待审核',
	COMM: '正常',
	UNCHECK: '未通过审核',
	FORBID: '禁用'
};


module.exports = UserModel;