/**
 * Notes: 用户实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2020-10-14 19:20:00 
 */


const BaseModel = require('./base_model.js');
class UserModel extends BaseModel {}

// 集合名
UserModel.CL = "ax_user";

UserModel.DB_STRUCTURE = {
	_pid: 'string|true',
	USER_ID: 'string|true',

	USER_MINI_OPENID: 'string|true|comment=小程序openid',
	USER_STATUS: 'int|true|default=1|comment=状态 0=待审核,1=正常',

	USER_NAME: 'string|false|comment=用户姓名',
	USER_MOBILE: 'string|false|comment=联系电话',

	USER_WORK: 'string|false|comment=所在单位',
	USER_CITY: 'string|false|comment=所在城市',
	USER_TRADE: 'string|false|comment=职业领域',


	USER_LOGIN_CNT: 'int|true|default=0|comment=登陆次数',
	USER_LOGIN_TIME: 'int|false|comment=最近登录时间',


	USER_ADD_TIME: 'int|true',
	USER_ADD_IP: 'string|false',

	USER_EDIT_TIME: 'int|true',
	USER_EDIT_IP: 'string|false',
}

// 字段前缀
UserModel.FIELD_PREFIX = "USER_";

/**
 * 状态 0=待审核,1=正常 
 */
UserModel.STATUS = {
	UNUSE: 0,
	COMM: 1
};

UserModel.STATUS_DESC = {
	UNUSE: '待审核',
	COMM: '正常'
};


module.exports = UserModel;