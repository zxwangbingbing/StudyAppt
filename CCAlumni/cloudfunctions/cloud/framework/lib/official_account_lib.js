/**
 * Notes: 公众号封装类库
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-09-06 04:00:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */

const request = require('request');

/**
 * 获取公众号access_token
 */
async function getOfficialAccountAccessToken() {
	let appid = 'wx63eb61409e1a25f5';
	let secret = '1c3ae7d1af911085b84355bd5e27ab13';
	let token_url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appid + '&' + 'secret=' + secret;
	const rp = options =>
		new Promise((resolve, reject) => {
			request(options, (error, response, body) => {
				if (error) {
					reject(error);
				}
				resolve(response);
			});
		});
	const result = await rp({
		url: token_url,
		method: 'GET'
	});
	return (typeof result.body === 'object') ? result.body : JSON.parse(result.body);;
}


/**
 *  发送公众号模板消息
 */
async function sendTemp() {
	try {
		const cloud = cloudUtil.getCloud();
		const result = await cloud.openapi.uniformMessage.send({
			touser: 'oYyk-5Q4WyAc0DWnqt2x89kfR_y0',
			mpTemplateMsg: {
				appid: 'wx63eb61409e1a25f5',
				url: 'http://weixin.qq.com/download',
				miniprogram: {
					appid: 'wxac22c5d07761ba60',
					path: 'info/info_index'
				},
				data: {
					first: {
						value: '恭喜你购买成功！',
						color: '#173177'
					},
					keyword1: {
						value: '巧克力',
						color: '#173177'
					},
					keyword2: {
						value: '39.8元',
						color: '#173177'
					},

					remark: {
						value: '欢迎再次购买！',
						color: '#173177'
					}
				},
				templateId: '4-OLRJmUxTyCSZJH1IJHn6DPFvz6f2nDjS0XSL4UwJM'
			},
		});
		console.log(result)
	} catch (err) {
		console.log(err)
	}
}

module.exports = {
	getOfficialAccountAccessToken,
	sendTemp //发送模板消息
}