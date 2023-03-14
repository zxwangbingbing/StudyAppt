/**
 * Notes: 通用业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2022-05-22 07:48:00 
 */

const BaseBiz = require('./base_biz.js');
const setting = require('../../setting/setting.js');
const cacheHelper = require('../../helper/cache_helper.js');
const dataHelper = require('../../helper/data_helper.js');

class PublicBiz extends BaseBiz {
	/**
	 * 页面初始化   
	 * @param {*} skin   
	 * @param {*} that  
	 */
	static initPageBase(that, { skin, isSetNavColor = true }) {
		if (skin) {
			skin.IS_SUB = setting.IS_SUB;

			if ((setting.IS_SUB)) {

				wx.hideHomeButton();

				// 顶部
				if (isSetNavColor)
					wx.setNavigationBarColor({
						backgroundColor: skin.NAV_BG,
						frontColor: skin.NAV_COLOR,
					});
			}

			that.setData({
				skin
			})
		}

	}

	// 从富文本提取简介
	static getRichEditorDesc(desc, content) {
		if (desc) return dataHelper.fmtText(desc, 100);
		if (!Array.isArray(content)) return desc;

		for (let k = 0; k < content.length; k++) {
			if (content[k].type == 'text') return dataHelper.fmtText(content[k].val, 100);
		}
		return desc;
	}

	static isCacheList(key) {
		key = key.toUpperCase();
		if (setting.CACHE_IS_LIST)
			return cacheHelper.get(key + '_LIST');
		else
			return false;
	}

	static removeCacheList(key) {
		key = key.toUpperCase();
		if (setting.CACHE_IS_LIST)
			cacheHelper.remove(key + '_LIST');
	}

	static setCacheList(key, time = setting.CACHE_LIST_TIME) {
		key = key.toUpperCase();
		if (setting.CACHE_IS_LIST)
			cacheHelper.set(key + '_LIST', 'TRUE', time);
	}

}

module.exports = PublicBiz;