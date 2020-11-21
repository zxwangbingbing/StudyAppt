 module.exports = {
 	CLOUD_ID: 'xxx', // 云环境ID 

 	CHECK_CONTENT: true, //图片文字是否校验 


 	TEST_MODE: false,

 	SKIN: 'skin1', //皮肤

 	TEST_USER_ID: 'oYyk-5Q4WyAc0DWnqt2x89kfR_y0',
 	TEST_TOKEN: {
 		id: 'aa133ce55f4048a400124d2b38b64f60',
 		name: '刘敏',
 		pic: '',
 		status: 1,
 		type: 1
 	},

 	VER: 'CC校友录Free',

 	IMG_UPLOAD_SIZE: 2, //图片上传大小M兆

 	IS_OPEN_COMMENT: true, //是否开启评论

 	PASSPORT_TOKEN_EXPIRE: 86400, //登录有效时间 秒

 	ADMIN_TOKEN_EXPIRE: 3600 * 2, //管理员过期时间2小时有效 秒

 	CACHE_IS_LIST: true, //列表是否缓存
 	CACHE_LIST_TIME: 60 * 30, //列表缓存时间秒

 	CHAT_IS_WATCH: true, // 开启聊天观察者监控

 	TABBAR_IS_GUEST: true, //是否开启tabbar可游客访问


 	USER_PIC_DIR: 'client/user/pic/', //用户头像图片目录 

 	AD_PIC_DIR: 'client/ad/pic/', //海报底图图片目录 
 	AD_MAX_PIC: 8, //海报底图上限 

 	SCHOOL_PIC_DIR: 'client/school/pic/', //校园底图   

 	INFO_PIC_DIR: 'client/info/pic/', //互助图片目录
 	INFO_MAX_EXPIRE: 86400 * 60, //互助有效期 秒
 	INFO_DEFAULT_REGION: ['广东省', '广州市', '越秀区'], //默认区域
 	INFO_MAX_PIC: 8, //互助图片上限

 	MEET_PIC_DIR: 'client/info/pic/', //活动图片目录 
 	MEET_DEFAULT_REGION: ['广东省', '广州市', '越秀区'], //默认区域
 	MEET_MAX_PIC: 8, //活动图片上限

 	ALBUM_PIC_DIR: 'client/album/pic/', //活动图片目录 
 	ALBUM_MAX_PIC: 8, //活动图片上限 

 	NEWS_PIC_DIR: 'client/news/pic/', //资讯图片目录 
 	NEWS_MAX_PIC: 8, //资讯图片上限 

 	HOME_CACHE_TIME: 60 * 5, //秒

 	CACHE_SETUP: 3600 * 10, //系统全局配置缓存时间 秒

 }