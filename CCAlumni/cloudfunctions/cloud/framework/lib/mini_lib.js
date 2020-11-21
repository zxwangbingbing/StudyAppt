/**
 * Notes: 小程序封装类库
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-09-06 14:00:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */
const cloudBase = require('../cloud/cloud_base.js');
const cloudUtil = require('../cloud/cloud_util.js');

async function sendOnceTempMsg(body) {
	console.log('sendOnceTempMsg', body);
	let cloud = cloudBase.getCloud();
	try {
		await cloud.openapi.subscribeMessage.send(body);
	} catch (err) {
		cloudUtil.log('sendOnceTempMsg', err);
	}
}
module.exports = {
	sendOnceTempMsg
}