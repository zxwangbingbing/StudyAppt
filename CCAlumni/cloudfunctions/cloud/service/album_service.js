/**
 * Notes: 相册模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-10-24 07:48:00 
 */

const BaseService = require('./base_service.js');
const dbUtil = require('../framework/database/db_util.js');
const util = require('../framework/utils/util.js');
const bizUtil = require('../comm/biz_util.js');
const strUtil = require('../framework/utils/str_util.js');
const timeUtil = require('../framework/utils/time_util.js');
const cloudUtil = require('../framework/cloud/cloud_util.js');
const AlbumModel = require('../model/album_model.js');
const UserModel = require('../model/user_model.js');  

class AlbumService extends BaseService {

	/**
	 * 更新图片信息
	 * @returns 返回 urls数组 [url1, url2, url3, ...]
	 */
	async updateAlbumPic({
		albumId,
		imgList // 图片数组
	}) {

		// 获取图片的公网地址
		let newList = await cloudUtil.getTempFileURL(imgList);

		// 获取数据库里的图片数据
		let album = await AlbumModel.getOne(albumId, 'ALBUM_PIC');

		// 处理 新旧文件
		let picList = await cloudUtil.handlerCloudFiles(album.ALBUM_PIC, newList);

		//更新数据库
		let data = {
			ALBUM_PIC: picList
		};
		await AlbumModel.edit(albumId, data);

		// 返回url地址
		let urls = strUtil.getArrByKey(picList, 'url');

		return {
			urls
		};

	}

	/**
	 * 添加互助 
	 */
	async insertAlbum(userId, {
		title,
		content,
		type
	}) {


		// 重复性判断
		let where = {
			ALBUM_TITLE: title,
			ALBUM_USER_ID: userId,
		}
		if (await AlbumModel.count(where))
			this.AppError('该标题已经存在');

		// 赋值 
		let data = {};
		data.ALBUM_TITLE = title;
		data.ALBUM_CONTENT = content;
		data.ALBUM_TYPE = type;
		data.ALBUM_DESC = strUtil.fmtText(content, 100);


		data.ALBUM_USER_ID = userId;

		let id = await AlbumModel.insert(data);

		//  异步统计
		this.statUserAlbumCnt(userId);

		return {
			id
		};
	}

	/**
	 * 更新数据
	 * @param {*} param0 
	 */
	async editAlbum(userId, {
		id,
		title,
		content,
		desc,
		type
	}) {

		// 重复性判断
		let where = {
			ALBUM_TITLE: title,
			ALBUM_USER_ID: userId,
			_id: ['<>', id]
		}
		if (await AlbumModel.count(where))
			this.AppError('该标题已经存在');

		// 赋值 
		let data = {};
		data.ALBUM_TITLE = title;
		data.ALBUM_CONTENT = content;
		data.ALBUM_TYPE = type;
		data.ALBUM_DESC = strUtil.fmtText(desc, 100);

		await AlbumModel.edit(id, data);
	}

	/**
	 * 删除数据
	 * @param {*} param0 
	 */
	async delAlbum(userId, id) {
		let where = {
			ALBUM_USER_ID: userId,
			_id: id
		}

		// 取出图片数据
		let album = await AlbumModel.getOne(where, 'ALBUM_PIC');
		if (!album) return;

		await AlbumModel.del(where);

		// 异步删除图片 
		let cloudIds = strUtil.getArrByKey(album.ALBUM_PIC, 'cloudId');
		cloudUtil.deleteFiles(cloudIds);

		//  异步统计
		this.statUserAlbumCnt(userId); 

		return;
	}

	/**
	 * 浏览互助信息
	 */
	async viewAlbum(id) {

		let fields = 'ALBUM_TITLE,ALBUM_CONTENT,ALBUM_TYPE,ALBUM_PIC,ALBUM_ADD_TIME,ALBUM_USER_ID,ALBUM_FAV_CNT,ALBUM_VIEW_CNT,ALBUM_COMMENT_CNT,ALBUM_LIKE_CNT';

		let where = {
			_id: id,
			ALBUM_STATUS: AlbumModel.STATUS.COMM
		}
		let album = await AlbumModel.getOne(where, fields);
		if (!album) return null;

		// 作者信息
		album.USER_DETAIL = await this.getUserOne(album.ALBUM_USER_ID);

		// 异步增加访问量
		AlbumModel.inc(id, 'ALBUM_VIEW_CNT', 1);

		return album;
	}

	/**
	 * 获取互助信息
	 * @param {*} id 
	 */
	async getMyAlbumDetail(userId, id) {
		let fields = 'ALBUM_TITLE,ALBUM_CONTENT,ALBUM_TYPE,ALBUM_EXPIRE_TIME,ALBUM_PIC';

		let where = {
			ALBUM_USER_ID: userId,
			_id: id
		}
		let album = await AlbumModel.getOne(where, fields);
		if (!album) return null;

		// 返回url地址
		let urls = strUtil.getArrByKey(album.ALBUM_PIC, 'url');
		album.ALBUM_PIC = urls;

		return album;
	}

	// 取得分页列表
	async getAlbumList({
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
			'ALBUM_ORDER': 'asc',
			'ALBUM_ADD_TIME': 'desc'
		};
		let fields = 'ALBUM_TITLE,ALBUM_ADD_TIME,ALBUM_DESC,ALBUM_PIC,ALBUM_TYPE,ALBUM_FAV_CNT,ALBUM_COMMENT_CNT,ALBUM_VIEW_CNT,ALBUM_LIKE_CNT,ALBUM_ORDER,' + this.getJoinUserFields();

		let where = {};
		where.ALBUM_STATUS = AlbumModel.STATUS.COMM; // 状态 

		if (util.isDefined(search) && search) {
			where.ALBUM_TITLE = {
				$regex: '.*' + search,
				$options: 'i'
			};
		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'type':
					// 按类型
					where.ALBUM_TYPE = sortVal;
					break;
				case 'sort':
					// 排序
					if (sortVal == 'view') {
						orderBy = {
							'ALBUM_VIEW_CNT': 'desc',
							'ALBUM_ADD_TIME': 'desc'
						};
					}
					if (sortVal == 'new') {
						orderBy = {
							'ALBUM_ADD_TIME': 'desc'
						};
					}
					if (sortVal == 'fav') {
						orderBy = {
							'ALBUM_FAV_CNT': 'desc',
							'ALBUM_ADD_TIME': 'desc'
						};
					}
					if (sortVal == 'comment') {
						orderBy = {
							'ALBUM_COMMENT_CNT': 'desc',
							'ALBUM_ADD_TIME': 'desc'
						};
					}
					if (sortVal == 'like') {
						orderBy = {
							'ALBUM_LIKE_CNT': 'desc',
							'ALBUM_ADD_TIME': 'desc'
						};
					}
					break;
			}
		}

		// 附加查询条件
		if (whereEx && whereEx['userId'])
			where.ALBUM_USER_ID = String(whereEx['userId']);

		let joinParams = this.getJoinUserParams('ALBUM_USER_ID');
		return await dbUtil.getListJoin(AlbumModel.CL, joinParams, where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	/**
	 * 重新统计用户发互助数量
	 * @param {*} userId 
	 */
	async statUserAlbumCnt(userId) {
		let where = {
			ALBUM_USER_ID: userId
		}
		let cnt = await AlbumModel.count(where);

		let whereUpdate = {
			USER_MINI_OPENID: userId
		};
		let data = {
			USER_ALBUM_CNT: cnt
		};
		await UserModel.edit(whereUpdate, data);

	}

	/**
	 * 点赞
	 * @param {*} id 
	 */
	async likeAlbum(id) {
		await AlbumModel.inc(id, 'ALBUM_LIKE_CNT');
	}

	/**
	 * 取得我的分页列表
	 * @param {*} param0 
	 */
	async getMyAlbumList(userId, {
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
			'ALBUM_ADD_TIME': 'desc'
		};
		let fields = 'ALBUM_TITLE,ALBUM_ADD_TIME,ALBUM_DESC,ALBUM_PIC,ALBUM_TYPE,ALBUM_FAV_CNT,ALBUM_COMMENT_CNT,ALBUM_VIEW_CNT,ALBUM_LIKE_CNT,ALBUM_ORDER';

		let where = {};
		// where.ALBUM_STATUS = AlbumModel.STATUS.COMM;
		if (util.isDefined(search) && search) {
			where.ALBUM_TITLE = {
				$regex: '.*' + search,
				$options: 'i'
			};
		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'type':
					// 按类型
					where.ALBUM_TYPE = (sortVal);
					break;
				case 'sort':
					// 排序
					if (sortVal == 'view') {
						orderBy = {
							'ALBUM_VIEW_CNT': 'desc',
							'ALBUM_ADD_TIME': 'desc'
						};
					}
					break;
			}
		}

		where.ALBUM_USER_ID = userId;
		return await AlbumModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}
}

module.exports = AlbumService;