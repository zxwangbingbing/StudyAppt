/**
 * Notes: 互助模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-10-14 07:48:00 
 */

const BaseService = require('./base_service.js');
const dbUtil = require('../framework/database/db_util.js');
const util = require('../framework/utils/util.js');
const bizUtil = require('../comm/biz_util.js');
const strUtil = require('../framework/utils/str_util.js');
const timeUtil = require('../framework/utils/time_util.js');
const cloudUtil = require('../framework/cloud/cloud_util.js');
const InfoModel = require('../model/info_model.js');
const UserModel = require('../model/user_model.js');  

class InfoService extends BaseService {

	/**
	 * 更新图片信息
	 * @returns 返回 urls数组 [url1, url2, url3, ...]
	 */
	async updateInfoPic({
		infoId,
		imgList // 图片数组
	}) {

		// 获取图片的公网地址
		let newList = await cloudUtil.getTempFileURL(imgList);

		// 获取数据库里的图片数据
		let info = await InfoModel.getOne(infoId, 'INFO_PIC');

		// 处理 新旧文件
		let picList = await cloudUtil.handlerCloudFiles(info.INFO_PIC, newList);

		//更新数据库
		let data = {
			INFO_PIC: picList
		};
		await InfoModel.edit(infoId, data);

		// 返回url地址
		let urls = strUtil.getArrByKey(picList, 'url');

		return {
			urls
		};

	}

	/**
	 * 添加互助 
	 */
	async insertInfo(userId, {
		title,
		content,
		type,
		expireTime,
		region
	}) {


		// 重复性判断
		let where = {
			INFO_TITLE: title,
			INFO_USER_ID: userId,
		}
		if (await InfoModel.count(where))
			this.AppError('该标题已经存在');

		// 赋值 
		let data = {};
		data.INFO_TITLE = title;
		data.INFO_CONTENT = content;
		data.INFO_TYPE = type;
		data.INFO_DESC = strUtil.fmtText(content, 100);

		data.INFO_EXPIRE_TIME = timeUtil.time2Timestamp(expireTime + ' 23:59:59');
		data.INFO_REGION_PROVINCE = region[0];
		data.INFO_REGION_CITY = region[1];
		data.INFO_REGION_COUNTY = region[2];

		data.INFO_USER_ID = userId;

		let id = await InfoModel.insert(data);

		//  异步统计
		this.statUserInfoCnt(userId);

		return {
			id
		};
	}

	/**
	 * 更新数据
	 * @param {*} param0 
	 */
	async editInfo(userId, {
		id,
		title,
		content,
		desc,
		type,
		expireTime,
		region
	}) {

		// 重复性判断
		let where = {
			INFO_TITLE: title,
			INFO_USER_ID: userId,
			_id: ['<>', id]
		}
		if (await InfoModel.count(where))
			this.AppError('该标题已经存在');

		// 赋值 
		let data = {};
		data.INFO_TITLE = title;
		data.INFO_CONTENT = content;
		data.INFO_TYPE = type;
		data.INFO_DESC = strUtil.fmtText(desc, 100);

		data.INFO_REGION_PROVINCE = region[0];
		data.INFO_REGION_CITY = region[1];
		data.INFO_REGION_COUNTY = region[2];

		data.INFO_EXPIRE_TIME = timeUtil.time2Timestamp(expireTime + ' 23:59:59');

		await InfoModel.edit(id, data);
	}

	/**
	 * 删除数据
	 * @param {*} param0 
	 */
	async delInfo(userId, id) {
		let where = {
			INFO_USER_ID: userId,
			_id: id
		}

		// 取出图片数据
		let info = await InfoModel.getOne(where, 'INFO_PIC');
		if (!info) return;

		await InfoModel.del(where);

		// 异步删除图片 
		let cloudIds = strUtil.getArrByKey(info.INFO_PIC, 'cloudId');
		cloudUtil.deleteFiles(cloudIds);

		//  异步统计
		this.statUserInfoCnt(userId); 

		return;
	}

	/**
	 * 浏览互助信息
	 */
	async viewInfo(id) {

		let fields = 'INFO_TITLE,INFO_CONTENT,INFO_TYPE,INFO_REGION_PROVINCE,INFO_REGION_CITY,INFO_REGION_COUNTY,INFO_EXPIRE_TIME,INFO_PIC,INFO_ADD_TIME,INFO_USER_ID,INFO_FAV_CNT,INFO_VIEW_CNT,INFO_COMMENT_CNT,INFO_LIKE_CNT';

		let where = {
			_id: id,
			INFO_STATUS: InfoModel.STATUS.COMM
		}
		let info = await InfoModel.getOne(where, fields);
		if (!info) return null;

		// 作者信息
		info.USER_DETAIL = await this.getUserOne(info.INFO_USER_ID);

		// 异步增加访问量
		InfoModel.inc(id, 'INFO_VIEW_CNT', 1);

		return info;
	}

	/**
	 * 获取互助信息
	 * @param {*} id 
	 */
	async getMyInfoDetail(userId, id) {
		let fields = 'INFO_TITLE,INFO_CONTENT,INFO_TYPE,INFO_REGION_PROVINCE,INFO_REGION_CITY,INFO_REGION_COUNTY,INFO_EXPIRE_TIME,INFO_PIC';

		let where = {
			INFO_USER_ID: userId,
			_id: id
		}
		let info = await InfoModel.getOne(where, fields);
		if (!info) return null;

		if (info) {
			info.INFO_EXPIRE_TIME = timeUtil.timestamp2Time(info.INFO_EXPIRE_TIME, 'Y-M-D');
		}

		// 返回url地址
		let urls = strUtil.getArrByKey(info.INFO_PIC, 'url');
		info.INFO_PIC = urls;

		return info;
	}

	// 取得分页列表
	async getInfoList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		whereEx, //附加查询条件
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'INFO_ORDER': 'asc',
			'INFO_ADD_TIME': 'desc'
		};
		let fields = 'INFO_TITLE,INFO_EXPIRE_TIME,INFO_REGION_PROVINCE,INFO_REGION_CITY,INFO_REGION_COUNTY,INFO_ADD_TIME,INFO_DESC,INFO_PIC,INFO_TYPE,INFO_FAV_CNT,INFO_COMMENT_CNT,INFO_VIEW_CNT,INFO_LIKE_CNT,INFO_ORDER,' + this.getJoinUserFields();

		let where = {};
		where.INFO_STATUS = InfoModel.STATUS.COMM; // 状态
		//where.INFO_EXPIRE_TIME = ['>', this._timestamp]; //超时时间

		if (util.isDefined(search) && search) {
			where.INFO_TITLE = {
				$regex: '.*' + search,
				$options: 'i'
			};
		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'type':
					// 按类型
					where.INFO_TYPE = sortVal;
					break;
				case 'sort':
					// 排序
					if (sortVal == 'view') {
						orderBy = {
							'INFO_VIEW_CNT': 'desc',
							'INFO_ADD_TIME': 'desc'
						};
					}
					if (sortVal == 'new') {
						orderBy = {
							'INFO_ADD_TIME': 'desc'
						};
					}
					if (sortVal == 'fav') {
						orderBy = {
							'INFO_FAV_CNT': 'desc',
							'INFO_ADD_TIME': 'desc'
						};
					}
					if (sortVal == 'comment') {
						orderBy = {
							'INFO_COMMENT_CNT': 'desc',
							'INFO_ADD_TIME': 'desc'
						};
					}
					if (sortVal == 'like') {
						orderBy = {
							'INFO_LIKE_CNT': 'desc',
							'INFO_ADD_TIME': 'desc'
						};
					}
					break;
			}
		}

		// 附加查询条件
		if (whereEx && whereEx['userId'])
			where.INFO_USER_ID = String(whereEx['userId']);

		let joinParams = this.getJoinUserParams('INFO_USER_ID');
		return await dbUtil.getListJoin(InfoModel.CL, joinParams, where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	/**
	 * 重新统计用户发互助数量
	 * @param {*} userId 
	 */
	async statUserInfoCnt(userId) {
		let where = {
			INFO_USER_ID: userId
		}
		let cnt = await InfoModel.count(where);

		let whereUpdate = {
			USER_MINI_OPENID: userId
		};
		let data = {
			USER_INFO_CNT: cnt
		};
		await UserModel.edit(whereUpdate, data);

	}

	/**
	 * 点赞
	 * @param {*} id 
	 */
	async likeInfo(id) {
		await InfoModel.inc(id, 'INFO_LIKE_CNT');
	}

	/**
	 * 取得我的分页列表
	 * @param {*} param0 
	 */
	async getMyInfoList(userId, {
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序 
		page,
		size,
		isTotal = true,
		oldTotal = 0
	}) {
		orderBy = orderBy || {
			'INFO_ADD_TIME': 'desc'
		};
		let fields = 'INFO_TITLE,INFO_EXPIRE_TIME,INFO_REGION_PROVINCE,INFO_REGION_CITY,INFO_REGION_COUNTY,INFO_ADD_TIME,INFO_DESC,INFO_PIC,INFO_TYPE,INFO_FAV_CNT,INFO_COMMENT_CNT,INFO_VIEW_CNT,INFO_LIKE_CNT,INFO_ORDER';

		let where = {};
		// where.INFO_STATUS = InfoModel.STATUS.COMM;
		if (util.isDefined(search) && search) {
			where.INFO_TITLE = {
				$regex: '.*' + search,
				$options: 'i'
			};
		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'type':
					// 按类型
					where.INFO_TYPE = Number(sortVal);
					break;
				case 'city':
					// 按城市
					where.INFO_REGION_CITY = String(sortVal);
					break;
				case 'sort':
					// 排序
					if (sortVal == 'view') {
						orderBy = {
							'INFO_VIEW_CNT': 'desc',
							'INFO_ADD_TIME': 'desc'
						};
					}
					break;
			}
		}

		where.INFO_USER_ID = userId;
		return await InfoModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}
}

module.exports = InfoService;