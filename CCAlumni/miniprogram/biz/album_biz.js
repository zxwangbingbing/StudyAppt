/**
 * Notes: 相册模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-11-14 07:48:00 
 */

const BaseBiz = require('./base_biz.js');
const cloudHelper = require('../helper/cloud_helper.js');
const helper = require('../helper/helper.js');
const setting = require('../helper/setting.js');

class AlbumBiz extends BaseBiz {


	/**
	 * 表单初始化相关数据
	 */
	static initFormData(id = '') {

		return {
			id,

			// 分类
			typeOptions: AlbumBiz.TYPE_OPTIONS,

		 

			// 图片数据
			imgMax: setting.ALBUM_MAX_PIC,
			imgList: [], 

			// 表单数据 
			formTypeIndex: 0,
			formTitle: '',
			formContent: '', 
		}

	}

	/** 
	 * 图片上传
	 * @param {string} albumId 
	 * @param {Array} imgList  图片数组
	 */
	static async updateAlbumPic(albumId, imgList) {

		// 图片上传到云空间
		imgList = await cloudHelper.transTempPics(imgList, setting.ALBUM_PIC_DIR, albumId);

		// 更新本记录的图片信息
		let params = {
			albumId: albumId,
			imgList: imgList
		}

		try {
			// 更新数据 从promise 里直接同步返回
			let res = await cloudHelper.callCloudSumbit('album/update_pic', params);
			return res.data.urls;
		} catch (e) {}
	}

	/**
	 * 搜索菜单设置
	 */
	static getSearchMenu() {

		let sortItem1 = [{
			label: '综合排序',
			type: '',
			value: 0
		}];

		// 分类
		let sortItem2 = [{
			label: '所有分类',
			type: '',
			value: 0
		}];
		for (let k in AlbumBiz.TYPE_OPTIONS){
			sortItem2.push(
				{
					label: AlbumBiz.TYPE_OPTIONS[k],
					type: 'type',
					value: AlbumBiz.TYPE_OPTIONS[k],
				}
			)
		}   

		let sortItems = [sortItem2];
		let sortMenus = [{
				label: '最新',
				type: 'sort',
				value: 'new'
			},
			{
				label: '最热',
				type: 'sort',
				value: 'view'
			}, 
			{
				label: '全部',
				type: '',
				value: ''
			}
		]

		return {
			sortItems,
			sortMenus
		}

	}
}
/**
 * 分类
 */
AlbumBiz.TYPE_OPTIONS = "同学时光,校园追忆,校友今夕,活动聚会,个人风采,其他".split(',');

//表单校验
AlbumBiz.CHECK_FORM = {
	title: 'formTitle|required|string|min:5|max:50|name=相册标题',
	type: 'formType|required|string|min:2|max:10|name=相册分类', 
	content: 'formContent|required|string|min:10|max:500|name=简要描述'
};

module.exports = AlbumBiz;