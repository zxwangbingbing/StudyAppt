/**
 * Notes: 用户模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-10-14 07:00:00 
 */

const BaseService = require('./base_service.js');
const util = require('../framework/utils/util.js');
const dbUtil = require('../framework/database/db_util.js');

const UserModel = require('../model/user_model.js');
const InfoModel = require('../model/info_model.js');   
const AlbumModel = require('../model/album_model.js');   
const timeUtil = require('../framework/utils/time_util.js');

// 用户信息返回字段
const FILEDS_USER_BASE = 'USER_ADD_TIME,USER_FAV_CNT,USER_VIEW_CNT,USER_EDU,USER_ITEM,USER_INFO_CNT,USER_ALBUM_CNT,USER_MEET_CNT,USER_MEET_JOIN_CNT,USER_NAME,USER_NATIVE,USER_BIRTH,USER_SEX,USER_PIC,USER_STATUS,USER_CITY,USER_COMPANY,USER_TRADE,USER_COMPANY_DUTY,USER_ENROLL,USER_GRAD,USER_LOGIN_TIME,USER_MINI_OPENID';

const FILEDS_USER_DETAIL = 'USER_DESC,USER_RESOURCE,USER_WORK_STATUS,USER_COMPANY_DEF,USER_MOBILE,USER_QQ,USER_WECHAT,USER_EMAIL,USER_OPEN_SET';

class UserService extends BaseService {

	/**
	 * 查看用户资料单页
	 * @meId 来访者 
	 * @param {*} param1 
	 */
	async viewUser(meId, {
		userId,
		isActive = false,
		fields = FILEDS_USER_BASE + ',' + FILEDS_USER_DETAIL
	}) {

		// 异步增加访问量
		let where = {
			USER_MINI_OPENID: userId
		};
		UserModel.inc(where, 'USER_VIEW_CNT', 1);


		return await this.getUser({
			userId,
			isActive,
			fields
		});


	}

	/**
	 * 保存用户动态
	 * @param {*} userId 
	 */
	async saveUserActive(userId) {
		let active = await this.getUserActive(userId);
		let where = {
			USER_MINI_OPENID: userId
		}
		let data = {
			USER_ACTIVE: active
		}
		UserModel.edit(where, data);
	}

	/**
	 * 获取用户动态
	 * @param {*} userId 
	 */
	async getUserActive(userId) {
		let recCnt = 10;
		let list = [];

		let fields = '';
		let whereGet = {};
		let orderBy = {};

		// 相册
		fields = 'ALBUM_TITLE,ALBUM_ADD_TIME';
		whereGet = {
			ALBUM_USER_ID: userId,
			ALBUM_STATUS: AlbumModel.STATUS.COMM,
		};
		orderBy = {
			ALBUM_ADD_TIME: 'desc'
		};
		let albumList = await AlbumModel.getAll(whereGet, fields, orderBy, recCnt);
		if (albumList) {
			for (let i = 0; i < albumList.length; i++) {
				let node = {};
				node.time = albumList[i].ALBUM_ADD_TIME;
				node.type = 'album';
				node._id = albumList[i]._id;
				node.title = albumList[i].ALBUM_TITLE;
				list.push(node);
			}
		}


		// 互助
		fields = 'INFO_TITLE,INFO_ADD_TIME';
		whereGet = {
			INFO_USER_ID: userId,
			INFO_STATUS: InfoModel.STATUS.COMM,
		};
		orderBy = {
			INFO_ADD_TIME: 'desc'
		};
		let infoList = await InfoModel.getAll(whereGet, fields, orderBy, recCnt);
		if (infoList) {
			for (let i = 0; i < infoList.length; i++) {
				let node = {};
				node.time = infoList[i].INFO_ADD_TIME;
				node.type = 'info';
				node._id = infoList[i]._id;
				node.title = infoList[i].INFO_TITLE;
				list.push(node);
			}
		}
 


		// 混合排序
		let sortByTime = function (a, b) {
			return b.time - a.time
		}
		list.sort(sortByTime);

		return list;
	}

	/**
	 * 获得某个用户信息
	 * @param {*} param0 
	 */
	async getUser({
		userId,
		isActive = false,
		fields = FILEDS_USER_BASE + ',' + FILEDS_USER_DETAIL
	}) {
		if (isActive) fields += ',' + 'USER_ACTIVE';
		let where = {
			USER_MINI_OPENID: userId,
			USER_STATUS: UserModel.STATUS.COMM
		}
		let user = await UserModel.getOne(where, fields);
		if (!user) return null;

		return user;
	}

	/**
	 * 取得我的用户信息
	 * @param {*} userId 
	 * @param {*} fields 
	 */
	async getMyDetail(userId,
		fields = 'USER_ITEM,USER_SEX,USER_ALBUM_CNT,USER_MEET_CNT,USER_INFO_CNT,USER_FAV_CNT,USER_VIEW_CNT,USER_NAME,USER_PIC,USER_STATUS,USER_ID,USER_MINI_QRCODE'
	) {
		return await this.getUserMyBase(userId, fields);
	}

	/**
	 * 取得用户分页列表
	 * @param {*} userId 
	 * @param {*} param1 
	 */
	async getUserList(userId, {
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		whereEx, //附加查询条件 
		page,
		size,
		oldTotal = 0
	}) {

		orderBy = orderBy || {
			USER_LOGIN_TIME: 'desc'
		};
		let fields = FILEDS_USER_BASE;


		let where = {};
		where.and = {
			USER_STATUS: UserModel.STATUS.COMM,
		};

		if (util.isDefined(search) && search) {
			where.or = [{
					USER_NAME: ['like', search]
				},
				{
					USER_ITEM: ['like', search]
				},
				{
					USER_COMPANY: ['like', search]
				},
				{
					USER_TRADE: ['like', search]
				},
			];

		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'companyDef':
					// 单位性质 
					where.and.USER_COMPANY_DEF = sortVal;
					break;
				case 'workStatus': //工作状态
					where.and.USER_WORK_STATUS = sortVal;
					break;
				case 'enroll': //按入学年份分类
					switch (sortVal) {
						case 1940:
							where.and.USER_ENROLL = ['<', 1950];
							break;
						case 1950:
							where.and.USER_ENROLL = [
								['>=', 1950],
								['<=', 1959]
							];
							break;
						case 1960:
							where.and.USER_ENROLL = [
								['>=', 1960],
								['<=', 1969]
							];
							break;
						case 1970:
							where.and.USER_ENROLL = [
								['>=', 1970],
								['<=', 1979]
							];
							break;
						case 1980:
							where.and.USER_ENROLL = [
								['>=', 1980],
								['<=', 1989]
							];
							break;
						case 1990:
							where.and.USER_ENROLL = [
								['>=', 1990],
								['<=', 1999]
							];
							break;
						case 2000:
							where.and.USER_ENROLL = [
								['>=', 2000],
								['<=', 2009]
							];
							break;
						case 2010:
							where.and.USER_ENROLL = ['>=', 2010];
							break;
					}
					break;
				case 'sort':
					// 排序
					if (sortVal == 'new') { //最新
						orderBy = {
							'USER_LOGIN_TIME': 'desc'
						};
					}
					if (sortVal == 'last') { //最近
						orderBy = {
							'USER_LOGIN_TIME': 'desc',
							'USER_ADD_TIME': 'desc'
						};
					}
					if (sortVal == 'enroll') { //入学  
						orderBy = {
							'USER_ENROLL': 'asc',
							'USER_LOGIN_TIME': 'desc'
						};
					}
					if (sortVal == 'info') {
						orderBy = {
							'USER_INFO_CNT': 'desc',
							'USER_LOGIN_TIME': 'desc'
						};
					}
					if (sortVal == 'album') {
						orderBy = {
							'USER_ALBUM_CNT': 'desc',
							'USER_LOGIN_TIME': 'desc'
						};
					}
					if (sortVal == 'meet') {
						orderBy = {
							'USER_MEET_CNT': 'desc',
							'USER_LOGIN_TIME': 'desc'
						};
					}
					break;
			}
		}
		let result = await UserModel.getList(where, fields, orderBy, page, size, true, oldTotal);


		return result;
	}

	/**
	 * 我的邀请列表
	 * @param {*} param0 
	 */
	async getMyInviteList(userId, {
		search, // 搜索条件 
		orderBy, // 排序 
		page,
		size,
		isTotal = true,
		oldTotal = 0
	}) {

		orderBy = orderBy || {
			USER_LOGIN_TIME: 'desc'
		};
		let fields = FILEDS_USER_BASE;

		let where = {};
		where = {
			USER_STATUS: UserModel.STATUS.COMM,
			USER_INVITE_ID: userId
		};

		if (util.isDefined(search) && search) {
			where = {
				USER_NAME: ['like', search]
			};

		}

		let result = await UserModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);

		return result;
	}

}

module.exports = UserService;