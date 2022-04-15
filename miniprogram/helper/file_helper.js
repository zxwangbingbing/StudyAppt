/**
 * Notes: 文件处理相关函数
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2022-02-05 04:00:00 
 */
const pageHelper = require('./page_helper.js');
const timeHelper = require('./time_helper.js');

function openDoc(name, url, ext = '.xlsx') {

	wx.showLoading({
		title: '文件下载中',
	});

	wx.downloadFile({
		url,
		//fileID:' ',
		filePath: wx.env.USER_DATA_PATH + '/' + name + timeHelper.time('YMDhms') + ext,
		success: function (res) {
			wx.hideLoading();
			console.log(res);
			if (res.statusCode != 200)
				return pageHelper.showModal('打开文件失败，请重试或者采取别的下载方式');

			const filePath = res.filePath;
			wx.openDocument({
				showMenu: true,
				filePath: filePath,
				success: function (res) {
					console.log('打开文档成功');
				}
			})
		},
		fail: function (err) {
			wx.hideLoading();
			console.log(err);
			pageHelper.showModal('打开文件失败，请重试或者采取别的下载方式');
		}
	})
}

module.exports = {
	openDoc
}