/**
 * Notes: 用户模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-11-14 07:48:00 
 */

const BaseBiz = require('./base_biz.js');
const cloudHelper = require('../helper/cloud_helper.js');
const helper = require('../helper/helper.js');
const pageHelper = require('../helper/page_helper.js');
const setting = require('../helper/setting.js');
const contentCheckHelper = require('../helper/content_check_helper.js');
const PassportBiz = require('./passport_biz.js');

/**
 * 
 */
class UserBiz extends BaseBiz {

	/**
	 * 修改用户头像
	 * @param {*} path 临时路径 
	 * @param {*} source  来源页面
	 * @param {*} formId  USER_ID
	 */
	static async uploadAvatar(path, source, formId) {
 
		let check = await contentCheckHelper.imgCheck(path);
		if (!check) {
			wx.hideLoading();
			return pageHelper.showModal('不合适的图片, 请重新上传', '温馨提示');
		}

		let filePath = path;
		let ext = filePath.match(/\.[^.]+?$/)[0];
		let rd = helper.genRandomNum(100000, 999999);
		await wx.cloud.uploadFile({
			cloudPath: setting.USER_PIC_DIR + formId + '_' + rd + ext,
			filePath: filePath, // 文件路径
		}).then(async (res) => {

			try {
				let params = {
					fileID: res.fileID, 
				};
				let opts = {
					hint: false
				}
				await cloudHelper.callCloudSumbit('passport/update_pic', params, opts).then(result => {
					// 不同来源
					if (source === 'my_base') {
						let parent = pageHelper.getPrevPage();
						parent.setData({
							formPic: result.data.url
						});
						let grandParent = pageHelper.getPrevPage(3);
						grandParent.setData({
							['user.USER_PIC']: result.data.url
						});
					} else if (source === 'my_index') {
						let parent = pageHelper.getPrevPage();
						parent.setData({
							['user.USER_PIC']: result.data.url
						});
					}
					PassportBiz.setUserPic(result.data.url);
					pageHelper.showNoneToast('头像上传成功', 1000);
					wx.navigateBack();
				});
			} catch (e) {
				console.log(err)
			}

		}).catch(error => {
			// handle error TODO:剔除图片
		})
	}

	/**
	 * 
	 * @param {*} source 页面来源 my_base/my_index
	 * @param {*} formId 用户USER_ID
	 */
	static chooseAvatar(formId, source = 'my_base') {
		wx.chooseImage({
			count: 1, // 默认9
			sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success(res) {
				const src = res.tempFilePaths[0]
				wx.navigateTo({
					url: '/pages/my/base/my_avatar?src=' + src + '&id=' + formId + '&source=' + source
				});
			}
		})
	}

	/**
	 * 搜索菜单设置
	 */
	static getSearchMenu() {
		 
		let sortItem1 = [{
			label: '入学年份',
			type: '',
			value: 0
		},
		{
			label: '1950级以前',
			type: 'enroll',
			value: 1940
		},
		{
			label: '50～59级',
			type: 'enroll',
			value: 1950
		},
		{
			label: '60～69级',
			type: 'enroll',
			value: 1960
		},
		{
			label: '70～79级',
			type: 'enroll',
			value: 1970
		},
		{
			label: '80～89级',
			type: 'enroll',
			value: 1980
		},
		{
			label: '90～99级',
			type: 'enroll',
			value: 1990
		},
		{
			label: '00～09级',
			type: 'enroll',
			value: 2000
		},
		{
			label: '2010级以后',
			type: 'enroll',
			value: 2010
		},
	];
		 

		// 分类
		let sortItem2 = [];

		let sortItems = [sortItem1];
		let sortMenus = [{
				label: '最新',
				type: 'sort',
				value: 'new'
			},
			{
				label: '最近',
				type: 'sort',
				value: 'last'
			},
			{
				label: '互助',
				type: 'sort',
				value: 'info'
			},
			{
				label: '相册',
				type: 'sort',
				value: 'album'
			},
			{
				label: '入学',
				type: 'sort',
				value: 'enroll'
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

UserBiz.EDU_OPTIONS = '中学,高职,大专,本科,硕士,博士,博士后,其他'.split(',');
UserBiz.COMPANY_DEF_OPTIONS = '保留,机关部门,事业单位,国企,世界500强,外企,上市企业,民营企业,自有企业,个体经营,自由职业,其他'.split(',');
UserBiz.WORK_STATUS_OPTIONS = '保留,全职,兼职,学生,待业,退休,老板,自由职业者,家庭主妇,其他'.split(',');

module.exports = UserBiz;