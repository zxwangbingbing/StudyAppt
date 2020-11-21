/**
 * Notes: 业务相关公用
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-10-24 19:20:00
 */
const TYPE = {
	//类型 0=用户，1=互助，2=活动 3=相册 4=资讯 5=接龙 99=系统
	USER: 0,
	INFO: 1,
	MEET: 2,
	ALBUM: 3,
	NEWS: 4,
	GROUP: 5,
	SYS: 99
}

function getTypeDesc(type) {
	switch (type) {
		//类型 0=用户，1=互助，2=活动 3=相册 4=资讯 5=接龙 99=系统 
		case TYPE.USER:
			return '用户';
		case TYPE.INFO:
			return '互助';
		case TYPE.MEET:
			return '活动';
		case TYPE.ALBUM:
			return '相册';
		case TYPE.NEWS:
			return '资讯';
		case TYPE.GROUP:
			return '接龙';
		case TYPE.SYS:
			return '系统';
	}
}
module.exports = {
	TYPE,
	getTypeDesc
}