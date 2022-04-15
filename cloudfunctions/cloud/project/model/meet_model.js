/**
 * Notes: 预约实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2020-12-07 19:20:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */


const BaseModel = require('./base_model.js');

class MeetModel extends BaseModel {

}

// 集合名
MeetModel.CL = "ax_meet";

MeetModel.DB_STRUCTURE = {
	_pid: 'string|true',
	MEET_ID: 'string|true',
	MEET_ADMIN_ID: 'string|true|comment=添加的管理员',
	MEET_TITLE: 'string|true|comment=标题',

	MEET_CONTENT: 'array|true|default=[]|comment=详细介绍',
	/* img=cloudID, text=文本
	[{type:'text/img',val:''}]
	*/

	// MEET_DAYS_SET: //**** 映射到day表
	MEET_DAYS: 'array|true|default=[]|comment=最近一次修改保存的可用日期',
  
	MEET_TYPE_ID: 'string|true|comment=分类编号',
	MEET_TYPE_NAME: 'string|true|comment=分类冗余', 

	MEET_IS_SHOW_LIMIT: 'int|true|default=1|comment=是否显示可预约人数',

	MEET_STYLE_SET: 'object|true|default={}|comment=样式设置',
	/*{ 
		desc: 'string|false|comment=简介',
		pic:' string|false|default=[]|comment=封面图cloudId]'
	}
	*/

	MEET_FORM_SET: 'array|true|default=[]|comment=表单字段设置',


	MEET_STATUS: 'int|true|default=1|comment=状态 0=未启用,1=使用中,9=停止预约,10=已关闭',
	MEET_ORDER: 'int|true|default=9999',

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



module.exports = MeetModel;