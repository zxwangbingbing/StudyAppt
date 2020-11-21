/**
 * Notes: 用户中心模块控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-11-04 04:00:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */

const BaseController = require('./base_controller.js');
const UserModel = require('../model/user_model.js');
const UserService = require('../service/user_service.js'); 
const InfoService = require('../service/info_service.js');
const AlbumService = require('../service/album_service.js'); 
const timeUtil = require('../framework/utils/time_util.js');
const strUtil = require('../framework/utils/str_util.js');
const bizUtil = require('../comm/biz_util.js');

class MyController extends BaseController {

	/**
	 * 我的邀请列表
	 */
	async getMyInviteList() {
		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			whereEx: 'object|name=附加查询条件',
			page: 'required|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new UserService();
		let result = await service.getMyInviteList(this._userId, input);

		// 数据格式化
		let list = result.list;
		for (let k in list) {
			list[k].USER_LOGIN_TIME = timeUtil.timestamp2Time(list[k].USER_LOGIN_TIME, 'Y-M-D');
			list[k].USER_BIRTH = timeUtil.getAge(list[k].USER_BIRTH);
		}
		result.list = list;

		return result;
	}


	/**
	 * 我的互助列表
	 */
	async getMyInfoList() {
		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			whereEx: 'object|name=附加查询条件',
			page: 'required|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new InfoService();
		let result = await service.getMyInfoList(this._userId, input);

		// 数据格式化
		let list = result.list;
		for (let k in list) {
			list[k].INFO_ADD_TIME = timeUtil.timestamp2Time(list[k].INFO_ADD_TIME);
			list[k].INFO_EXPIRE_TIME = timeUtil.timestamp2Time(list[k].INFO_EXPIRE_TIME, 'Y-M-D');
 
		}
		result.list = list;

		return result;
	}

	/**
	 * 我的活动列表
	 */
	async getMyMeetList() {
		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			whereEx: 'object|name=附加查询条件',
			page: 'required|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new MeetService();
		let result = await service.getMyMeetList(this._userId, input);

		// 数据格式化
		let list = result.list;
		for (let k in list) {
			list[k].MEET_ADD_TIME = timeUtil.timestamp2Time(list[k].MEET_ADD_TIME);
			list[k].MEET_EXPIRE_TIME = timeUtil.timestamp2Time(list[k].MEET_EXPIRE_TIME);
			list[k].MEET_DAY = timeUtil.timestamp2Time(list[k].MEET_DAY, 'Y-M-D');

			// 地区
			let area = '';
			if (list[k].MEET_REGION_CITY != '全部') {
				area = list[k].MEET_REGION_CITY;
				area += (list[k].MEET_REGION_COUNTY != '全部') ? ' ' + list[k].MEET_REGION_COUNTY : '';
			} else {
				area = list[k].MEET_REGION_PROVINCE;
				area += (list[k].MEET_REGION_CITY != '全部') ? ' ' + list[k].MEET_REGION_CITY : '';
				area += (list[k].MEET_REGION_COUNTY != '全部') ? ' ' + list[k].MEET_REGION_COUNTY : '';
			}
			list[k].MEET_REGION = area;
		 
		}
		result.list = list;

		return result;
	}

	/**
	 * 谁收藏了我 
	 */
	async getFavMeList() {

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			page: 'required|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new FavService();
		let result = await service.getFavMeList(this._userId, input);

		// 数据格式化
		let list = result.list;
		// 显示转换
		for (let k in list) {
			list[k].FAV_TYPE_DESC = bizUtil.getTypeDesc(list[k].FAV_TYPE);
			if (list[k].FAV_TYPE != bizUtil.TYPE.USER)
				list[k].FAV_TITLE = '《' + list[k].FAV_TITLE + '》';
			else
				list[k].FAV_TITLE = list[k].USER_DETAIL.USER_NAME + ' 关注了我';

			list[k].FAV_ADD_TIME = timeUtil.timestamp2Time(list[k].FAV_ADD_TIME, 'Y-M-D');
		}
		result.list = list;

		return result;

	}


	/**
	 * 我的收藏列表 
	 */
	async getMyFavList() {

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			page: 'required|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new FavService();
		let result = await service.getMyFavList(this._userId, input);

		// 数据格式化
		let list = result.list;
		// 显示转换
		for (let k in list) {
			list[k].FAV_ADD_TIME = timeUtil.timestamp2Time(list[k].FAV_ADD_TIME);
			list[k].FAV_TYPE_DESC = bizUtil.getTypeDesc(list[k].FAV_TYPE);

			switch (list[k].FAV_TYPE) {
				case bizUtil.TYPE.USER: 
				list[k].color = 'red';
					break;
				case bizUtil.TYPE.INFO: 
				list[k].color = 'blue';
					break;
				case bizUtil.TYPE.MEET: 
				list[k].color = 'green';
					break;
				case bizUtil.TYPE.ALBUM: 
				list[k].color = 'yellow';
					break;
				case bizUtil.TYPE.NEWS: 
				list[k].color = 'pink';
					break;
			}
		}
		result.list = list;

		return result;

	}

	/**
	 * 我的相册列表
	 */
	async getMyAlbumList() {
		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			whereEx: 'object|name=附加查询条件',
			page: 'required|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AlbumService();
		let result = await service.getMyAlbumList(this._userId, input);

		// 数据格式化
		let list = result.list;
		for (let k in list) {
			list[k].ALBUM_ADD_TIME = timeUtil.timestamp2Time(list[k].ALBUM_ADD_TIME, 'Y-M-D');

			// 默认图片
			list[k].ALBUM_PIC = strUtil.getArrByKey(list[k].ALBUM_PIC, 'cloudId');

		}
		result.list = list;

		return result;
	}

}

module.exports = MyController;