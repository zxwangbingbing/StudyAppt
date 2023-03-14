/**
 * Notes: 预约模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2021-12-10 07:48:00 
 */

const BaseBiz = require('./base_biz.js');
const cloudHelper = require('../../helper/cloud_helper.js');
const pageHelper = require('../../helper/page_helper.js');

class FavBiz extends BaseBiz {

	static async isFav(that, oid) {
		if (!oid) return;

		that.setData({
			isFav: -1
		});

		// 异步获取是否收藏
		let params = {
			oid
		};
		cloudHelper.callCloudSumbit('fav/is_fav', params, { title: 'bar' }).then(result => {
			that.setData({
				isFav: result.data.isFav
			});
		}).catch(error => { })
	}

	static async updateFav(that, oid, isFav, type, title) {
		let path = pageHelper.getCurrentPageUrlWithArgs();
		if (!oid || !path || !title || !type) return;

		let params = {
			oid,
			title,
			type,
			path
		}
		let opts = {
			title: (isFav == 0) ? '收藏中' : '取消中'
		}
		try {
			let result = await cloudHelper.callCloudSumbit('fav/update', params, opts);
			that.setData({
				isFav: result.data.isFav,
			});
		} catch (e) {
			console.log(e);
		}
	}

}

module.exports = FavBiz;