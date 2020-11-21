 /**
  * Notes: 基础控制器
  * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
  * Date: 2020-09-05 04:00:00
  * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
  */
 class Controller {

 	constructor(miniOpenId, request, router, token) {
 		this._miniOpenId = miniOpenId;
 		this._request = request;
 		this._router = router;
 		this._token = token;
 	}
 }

 module.exports = Controller;