/**
 * Notes: 用户实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-10-14 19:20:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */


const BaseModel = require('./base_model.js');
class UserModel extends BaseModel {}

// 集合名
UserModel.CL = "t_user";

UserModel.DB_STRUCTURE = {
	USER_ID: 'string|true',

	USER_NAME: 'string|true|comment=用户姓名',
	USER_PIC: 'string|true|comment=用户头像',
	USER_PIC_CLOUD_ID: 'string|false|comment=用户头像云存储地址',

	USER_PHONE_CHECKED: 'string|true|comment=已校验的手机号码',
	USER_MINI_QRCODE: 'object|false|comment=小程序码地址{url,cloudId}',

	USER_MINI_OPENID: 'string|true|comment=小程序openid',
	USER_UNIONID: 'string|false|comment=微信开放平台unionid',

	USER_WX_OPENID: 'string|false|comment=公众号openid',
	USER_IS_SUBSCRIBE: 'int|true|default=0|comment=公众号是否关注 0/1',
	USER_SUBSCRIBE_TIME: 'int|true|default=0|comment=公众号关注时间',

	USER_STATUS: 'int|true|default=1|comment=状态 0=待审核,1=正常,8=VIP,9=禁用, 10=已删除',
	USER_INVITE_ID: 'string|false|comment=邀请码',

	USER_ITEM: 'string|true|comment=班级',
	USER_SEX: 'int|true|default=1|comment=性别 1=男,2=女',
	USER_BIRTH: 'string|true|comment=出生年月',
	USER_NATIVE: 'string|false|comment=籍贯',

	USER_OPEN_SET: 'int|true|default=1|comment=资料公开方式 1=所有用户,8=vip, 3=好友',

	USER_MOBILE: 'string|false|comment=联系电话',
	USER_WECHAT: 'string|false|comment=微信',
	USER_QQ: 'string|false|comment=QQ',
	USER_EMAIL: 'string|false',

	USER_ENROLL: 'int|true|default=0|comment=入学年份',
	USER_GRAD: 'int|true|default=0|comment=毕业年份',
	USER_EDU: 'string|true|comment=学历 中学,高职,大专,本科,硕士,博士,博士后,其他',

	USER_COMPANY: 'string|false|comment=当前单位',
	USER_COMPANY_DEF: 'string|false|comment=当前单位性质 保留,机关部门,事业单位,国企,世界500强,外企,上市企业,民营企业,自有企业,个体经营,自由职业,其他',
	USER_COMPANY_DUTY: 'string|false|comment=当前职位',
	USER_TRADE: 'string|false|comment=当前行业',
	USER_CITY: 'string|false|comment=当前城市',
	USER_WORK_STATUS: 'string|false|comment=工作状态 保留,全职,兼职,学生,待业,退休,老板,自由职业者,家庭主妇,其他',

	USER_DESC: 'string|false|comment=自我介绍',
	USER_RESOURCE: 'string|false|comment=可提供资源&需求',

	USER_FAV_CNT: 'int|true|default=0|comment=被收藏人数',
	USER_INVITE_CNT: 'int|true|default=0|comment=邀请人数',
	USER_VIEW_CNT: 'int|true|default=0|comment=被查看次数',
	USER_ALBUM_CNT: 'int|true|default=0|comment=发相册数量',
	USER_INFO_CNT: 'int|true|default=0|comment=发互助数量',
	USER_MEET_CNT: 'int|true|default=0|comment=发起活动次数',
	USER_MEET_JOIN_CNT: 'int|true|default=0|comment=活动报名次数',

	USER_WX_GENDER: 'int|true|default=0|comment=微信性别 0=未定义,1=男,2=女',
	USER_WX_AVATAR_URL: 'string|false|comment=微信头像链接',
	USER_WX_NICKNAME: 'string|false|comment=微信昵称',
	USER_WX_LANGUAGE: 'string|false|comment=微信语言',
	USER_WX_CITY: 'string|false|comment=微信城市',
	USER_WX_PROVINCE: 'string|false|comment=微信省份',
	USER_WX_COUNTRY: 'string|false|comment=微信国家',
	USER_WX_UPDATE_TIME: 'int|false|comment=微信信息更新时间',

	USER_ACTIVE: 'array|false|comment=用户动态', 

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
 * 状态 0=待审核,1=正常,8=VIP,9=禁用,10=已删除
 */
UserModel.STATUS = {
	UNUSE: 0,
	COMM: 1,
	VIP: 8,
	PEDDING: 9,
	DEL: 10
};

UserModel.STATUS_DESC = {
	UNUSE: '待审核',
	COMM: '正常',
	VIP: 'VIP',
	PEDDING: '禁用',
	DEL: '已删除'
};



module.exports = UserModel;