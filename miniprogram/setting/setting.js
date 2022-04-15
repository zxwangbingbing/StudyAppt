 module.exports = {
 	//### 环境相关 
 	CLOUD_ID: 'dev-5gf0o85o226fad1d', //你的云环境id 

 	// #### 版本信息 
 	VER: 'build 2022.03',
 	COMPANY: '',

 	// #### 系统参数
 	PID: 'A00',
 	IS_SUB: false,

 	// #### setup相关 
 	SETUP_PIC_PATH: 'setup/pic/',

 	// #### 预约相关
 	MEET_CAN_NULL_TIME: false, // 是否允许有无时段的日期保存和展示  
 	MEET_PIC_PATH: 'meet/pic/',

 	//#################  
 	CHECK_CONTENT: false, //图片文字是否校验  

 	// ### 内容安全
 	CLIENT_CHECK_CONTENT: false, //前台图片文字是否校验
 	ADMIN_CHECK_CONTENT: false, //后台图片文字是否校验 


 	IMG_UPLOAD_SIZE: 20, //图片上传大小M兆   


 	// #### 缓存相关
 	CACHE_IS_LIST: true, //列表是否缓存
 	CACHE_LIST_TIME: 60 * 30, //列表缓存时间秒  


 	// #### 资讯相关
 	NEWS_PIC_PATH: 'news/pic/',


 	// #### 后台相关
 	ADMIN_TOKEN_EXPIRE: 3600 * 2, //管理员过期时间2小时有效 秒  

 }