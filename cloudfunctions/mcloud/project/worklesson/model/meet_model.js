/**
 * Notes: 服务者实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wx)
 * Date: 2022-01-17 19:20:00 
 */


const BaseProjectModel = require('./base_project_model.js');

class MeetModel extends BaseProjectModel {

}

// 集合名
MeetModel.CL = BaseProjectModel.C('meet');

MeetModel.DB_STRUCTURE = {
	_pid: 'string|true',
	MEET_ID: 'string|true',
	MEET_ADMIN_ID: 'string|true|comment=添加的管理员',
	MEET_TITLE: 'string|true|comment=标题',
 
	MEET_JOIN_FORMS: 'array|true|default=[]|comment=表单字段设置',
	MEET_DAYS: 'array|true|default=[]|comment=最近一次修改保存的可用日期',

	MEET_CATE_ID: 'string|true|comment=分类编号',
	MEET_CATE_NAME: 'string|true|comment=分类冗余', 

	MEET_FORMS: 'array|true|default=[]',
	MEET_OBJ: 'object|true|default={}',  

	MEET_CANCEL_SET: 'int|true|default=1|comment=取消设置 0=不允,1=允许,10=开始前均可取消,11=开始前1小时可取消,12=开始前2小时可取消,13=开始前3小时可取消,14=开始前4小时可取消,15=开始前5小时可取消',

	MEET_STATUS: 'int|true|default=1|comment=状态 0=未启用,1=使用中,9=停止预约,10=已关闭',
	MEET_ORDER: 'int|true|default=9999',
	MEET_VOUCH: 'int|true|default=0',

	MEET_QR: 'string|false',

	MEET_PHONE: 'string|false|comment=登录手机',
	MEET_PASSWORD: 'string|false|comment=登录密码',
	MEET_TOKEN: 'string|false|comment=当前登录token',
	MEET_TOKEN_TIME: 'int|true|default=0|comment=当前登录token time',
	MEET_MINI_OPENID: 'string|false|comment=小程序openid',
	MEET_LOGIN_CNT: 'int|true|default=0|comment=登陆次数',
	MEET_LOGIN_TIME: 'int|false|comment=最近登录时间',


	MEET_ADD_TIME: 'int|true',
	MEET_EDIT_TIME: 'int|true',
	MEET_ADD_IP: 'string|false',
	MEET_EDIT_IP: 'string|false',
};

// 字段前缀
MeetModel.FIELD_PREFIX = "MEET_";

/**
 * 状态 0=未启用,1=使用中,9=停止预约,10=已关闭 
 */
MeetModel.STATUS = {
	UNUSE: 0,
	COMM: 1,
	OVER: 9,
	CLOSE: 10
};

MeetModel.STATUS_DESC = {
	UNUSE: '未启用',
	COMM: '使用中',
	OVER: '停止预约(可见)',
	CLOSE: '已关闭(不可见)'
};


MeetModel.NAME = '老师';


module.exports = MeetModel;