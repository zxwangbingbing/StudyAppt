module.exports = {

	//### 环境相关 
	CLOUD_ID: 'cloud1-3go08kosfd9d453c', //你的云环境id   

	// ##################################################################   
	COLLECTION_PRFIX: 'bx_',

	IS_DEMO: false, //是否演示版 (后台不可操作提交动作)  
	// ##################################################################
	// #### 调试相关 
	TEST_MODE: false, // 测试模式 涉及小程序码生成路径， 用以下 TEST_TOKEN_ID openid.. 
	TEST_TOKEN_ID: 'oD58U5Ej-gK0BjqSspqjQEPgXuQQ',
 

	// #### 内容安全
	CLIENT_CHECK_CONTENT: false, //前台图片文字是否校验
	ADMIN_CHECK_CONTENT: false, //后台图片文字是否校验     

	// ### 后台业务相关
	ADMIN_LOGIN_EXPIRE: 86400, //管理员token过期时间 (秒) 

	// ### 服务者相关
	WORK_LOGIN_EXPIRE: 86400, //服务者token过期时间 (秒) 
}