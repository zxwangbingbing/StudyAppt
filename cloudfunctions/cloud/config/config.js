module.exports = {

	//### 环境相关 
	CLOUD_ID: 'dev-5gf0o85o226fad1d', //你的云环境id 

	ADMIN_NAME: 'admin', // 管理员账号（5-30位)
	ADMIN_PWD: '123456', // 管理员密码（5-30位) 


	// ##################################################################  
	PID: 'A00',  
	IS_DEMO: false,  

	NEWS_CATE: '1=最新动态,2=政策法规',
	MEET_TYPE: '1=户籍办理,2=就业创业,3=社会保障,4=证件办理,5=出境入境,6=离职退休,7=行驶驾驶,8=婚姻登记,9=职业资格,10=行政缴费',
	// ##################################################################
	// #### 调试相关 
	TEST_MODE: false,  
	TEST_TOKEN_ID: '',

	COLLECTION_NAME: 'ax_admin|ax_cache|ax_day|ax_export|ax_join|ax_log|ax_meet|ax_news|ax_setup|ax_temp|ax_user',

	DATA_EXPORT_PATH: 'export/', //数据导出路径
	MEET_TIMEMARK_QR_PATH: 'meet/usercheckin/', //用户签到码路径 
	SETUP_PATH: 'setup/',

	// ## 缓存相关 
	IS_CACHE: true, //是否开启缓存
	CACHE_CALENDAR_TIME: 60 * 30, //日历缓存   

	// #### 内容安全
	CLIENT_CHECK_CONTENT: false, //前台图片文字是否校验
	ADMIN_CHECK_CONTENT: false, //后台图片文字是否校验    

	// #### 预约相关
	MEET_LOG_LEVEL: 'debug',

	// ### 后台业务相关
	ADMIN_LOGIN_EXPIRE: 86400, //管理员token过期时间 (秒) 
}