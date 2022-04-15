 /**
  * Notes: 基础控制器
  * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
  * Date: 2020-09-05 04:00:00 
  */
 class Controller {

 	constructor(route, openId, event) {
 		this._route = route; // 路由
 		this._openId = openId; //用户身份
		this._event = event; // 所有参数   
		this._request = event.params; //数据参数

 	}
 }

 module.exports = Controller;