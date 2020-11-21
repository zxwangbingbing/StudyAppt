/**
 * Notes: 相册模块控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-09-05 04:00:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */

const BaseController = require('./base_controller.js');
const AlbumModel = require('../model/album_model.js');
const AlbumService = require('../service/album_service.js');
const UserService = require('../service/user_service.js');
const timeUtil = require('../framework/utils/time_util.js');
const strUtil = require('../framework/utils/str_util.js');
const contentCheck = require('../framework/validate/content_check.js');

class AlbumController extends BaseController {


	/**
	 * 相册列表 
	 */
	async getAlbumList() {

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
		let result = await service.getAlbumList(input);

		// 数据格式化
		let list = result.list;
		for (let k in list) { 

			// 最新
			if (list[k].ALBUM_ADD_TIME >= timeUtil.time() - 86400 * 1000 * 3)
				list[k].new = 1;

			// 最热
			if (list[k].ALBUM_VIEW_CNT >= 30 ||
				list[k].ALBUM_LIKE_CNT >= 30 ||
				list[k].ALBUM_FAV_CNT >= 30 ||
				list[k].ALBUM_COMMENT_CNT >= 30)
				list[k].hot = 1;

			list[k].ALBUM_ADD_TIME = timeUtil.timestamp2Time(list[k].ALBUM_ADD_TIME, 'Y-M-D');
			list[k].ALBUM_EXPIRE_TIME = timeUtil.timestamp2Time(list[k].ALBUM_EXPIRE_TIME);
			
			// 默认图片
			list[k].ALBUM_PIC = strUtil.getArrByKey(list[k].ALBUM_PIC, 'cloudId');
		 
		}
		result.list = list;

		return result;

	}
 
	/**
	 * 发布相册信息
	 */
	async insertAlbum() {
		// 数据校验
		let rules = {
			title: 'required|string|min:5|max:50|name=相册标题',
			type: 'required|string|min:2|max:10|name=相册分类', 
			content: 'required|string|min:10|max:500|name=简要描述'

		};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMulti(input);

		let service = new AlbumService();
		let result = await service.insertAlbum(this._userId, input);

		// 异步更新用户动态
		let userService = new UserService();
		userService.saveUserActive(this._userId);

		return result;

	}

	/**
	 * 点赞
	 */
	async likeAlbum() {
		// 数据校验
		let rules = {
			id: 'required|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AlbumService();
		return await service.likeAlbum(input.id);

	}

	/**
	 * 获取我的相册信息用于编辑修改
	 */
	async getMyAlbumDetail() {
		// 数据校验
		let rules = {
			id: 'required|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AlbumService();
		return await service.getMyAlbumDetail(this._userId, input.id);

	}

	async editAlbum() {
		// 数据校验
		let rules = {
			id: 'required|id',
			title: 'required|string|min:5|max:50|name=相册标题',
			type: 'required|string|min:2|max:10|name=相册分类', 
			content: 'required|string|min:10|max:500|name=简要描述',
			desc: 'required|string|min:10|max:200|name=简介',

		};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMulti(input);

		let service = new AlbumService();
		let result = service.editAlbum(this._userId, input);

		// 异步更新用户动态
		let userService = new UserService();
		userService.saveUserActive(this._userId);

		return result;
	}

	async delAlbum() {
		// 数据校验
		let rules = {
			id: 'required|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AlbumService();
		let result = service.delAlbum(this._userId, input.id);

		// 异步更新用户动态
		let userService = new UserService();
		userService.saveUserActive(this._userId);

		return result;
	}

	/**
	 * 浏览相册信息
	 */
	async viewAlbum() {
		// 数据校验
		let rules = {
			id: 'required|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AlbumService();
		let album = await service.viewAlbum(input.id);

		if (album) {
			// 显示转换 
			album.ALBUM_ADD_TIME = timeUtil.timestamp2Time(album.ALBUM_ADD_TIME, 'Y-M-D');
			album.ALBUM_EXPIRE_TIME = timeUtil.timestamp2Time(album.ALBUM_EXPIRE_TIME, 'Y-M-D'); 

			album.ALBUM_PIC = strUtil.getArrByKey(album.ALBUM_PIC, 'cloudId');
		}

		return album;
	}

	/**
	 * 更新图片信息
	 * @returns 返回 urls数组 [url1, url2, url3, ...]
	 */
	async updateAlbumPic() {
		// 数据校验
		let rules = {
			albumId: 'required|id',
			imgList: 'array'
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AlbumService();
		return await service.updateAlbumPic(input);
	}

}

module.exports = AlbumController;