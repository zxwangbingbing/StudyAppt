/**
 * Notes: 软硬件系统相关函数
 * Ver : CCMiniCloud Framework 2.11.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2022-01-25 29:00:00 
 */


function getAuth(auth, authName, callback) {
	auth = 'scope.' + auth;
	wx.getSetting({
		success: res => {
			console.log(res)
			if (res.authSetting[auth]) {
				console.log('true');
				callback && callback();
			} else if (res.authSetting[auth] === undefined) {
				// 未做任何授权
				wx.showModal({
					title: '提示',
					mask: true,
					content: '您尚未开启' + authName + '的权限，请点击确定去开启权限！',
					success: (res) => {
						if (res.confirm) {
							wx.authorize({
								scope: auth,
								success: (res) => {
									console.log('授权成功', res);
									callback && callback();
								},
								fail: (res) => {
									console.log('您没有授权 fail=', res);
									wx.showToast({
										mask: true,
										title: '您没有授权，无法' + authName,
										icon: 'none'
									});
								}
							});
						} else {
							wx.showToast({
								mask: true,
								title: '您没有授权，无法' + authName,
								icon: 'none'
							});
						}
					}
				});
			} else {
				// 已经禁止
				wx.showModal({
					title: '提示',
					content: '您未开启' + authName + '的权限，请点击确定去开启权限！',
					success: (res) => {
						if (res.confirm) {
							wx.openSetting({
								success: (res) => {
									wx.showToast({
										mask: true,
										icon: 'none',
										title: '正在' + authName,
									});
									if (res.authSetting[auth]) {
										console.log('false success res=', res);
										callback && callback();
									} else {
										wx.showToast({
											mask: true,
											title: '您没有授权，无法' + authName + '！',
											icon: 'none'
										});
									}
								},
								fail: (res) => {
									console.log('false file res=', res);
								}
							});
						} else {
							wx.showToast({
								mask: true,
								title: '您没有授权，无法' + authName,
								icon: 'none'
							});
						}
					}
				});
			}
		}
	});
}

module.exports = {
	getAuth
}