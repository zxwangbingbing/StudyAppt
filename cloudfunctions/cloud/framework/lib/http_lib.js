/**
 * Notes: HTTP接口封装类库
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2021-02-17 14:00:00 
 */
const config = require('../../config/config');
const util = require('../utils/util.js');

function https(url, postData) {
	var request = require('request');
	return new Promise(function (resolve, reject) {

		request.post(url, {
				form: postData
			},
			function (error, response, body) {
				console.log('[BODY]' + body);
				if (!error && response.statusCode == 200) {
					let json = JSON.parse(body);
					resolve(json);
				} else {
					console.error('https error', error || response.statusCode);
					reject(error || response.statusCode);
				}
			}
		);
	});

}
// 同步方法
function post({
	host,
	port = 80,
	path,
	timeout = 2000, //超时时间， 毫秒
	method = 'POST',
	headers = {
		'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
	}
}, postData) {
	let http = require('http');
	let querystring = require('querystring');
	let content = querystring.stringify(postData);

	let options = {};
	if (util.isDefined(host)) options.host = host;
	if (util.isDefined(port)) options.port = port;
	if (util.isDefined(path)) options.path = path;
	if (util.isDefined(timeout)) options.timeout = timeout;
	if (util.isDefined(method)) options.method = method;
	if (util.isDefined(headers)) options.headers = headers;

	return new Promise(function (resolve, reject) {
		let req = http.request(options, function (res) {
			console.log('[STATUS]: ' + res.statusCode);
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				console.log('[BODY]: ' + chunk);

				if (res.statusCode == 200) {
					if (chunk) {
						let json = JSON.parse(chunk);
						resolve(json);
					} else
						resolve({});
				} else {
					reject('status error=' + res.statusCode); //失败回调函数
				}

			});
		});


		req.on('error', function (e) {
			console.log('[Problem with request]: ' + e.message);
			reject(e);
		});

		// write data to request body
		req.write(content);
		req.end();

	});
}
module.exports = {
	post,
	https
}