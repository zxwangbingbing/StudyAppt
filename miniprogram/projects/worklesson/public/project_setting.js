module.exports = { //worklesson
	PROJECT_COLOR: '#636DEA',
	NAV_COLOR: '#000000',
	NAV_BG: '#E8EDF4',

	// setup
	SETUP_CONTENT_ITEMS: [
		{ title: '关于我们', key: 'SETUP_CONTENT_ABOUT' }, 
	],

	// 用户
	USER_REG_CHECK: true,
	USER_FIELDS: [
	],

	NEWS_NAME: '最新通知',
	NEWS_CATE: [
		{ id: 1, title: '最新通知', style: 'leftpic' },
	],
	NEWS_FIELDS: [

	],

	MEET_NAME: '预约',
	MEET_CATE: [
		{ id: 1, title: '老师预约', style: 'leftbig1' }, 
		{ id: 2, title: '课程预约', style: 'leftbig1' }, 
	],
	MEET_CAN_NULL_TIME: false, // 是否允许有无时段的日期保存和展示
	MEET_FIELDS: [ 
		{ mark: 'cover', title: '封面图片', type: 'image', min: 1, max: 1, must: true },
		{ mark: 'desc', title: '简介', type: 'textarea', max: 60, must: true },
		{ mark: 'content', title: '详情', type: 'content', must: true },
	],

	MEET_JOIN_FIELDS: [
		{ mark: 'name', type: 'text', title: '姓名', must: true, min: 2, max: 30, edit: false },
		{ mark: 'phone', type: 'text', len: 11, title: '手机号', must: true, edit: false },
	],

	// 时间默认设置
	MEET_NEW_NODE:
	{
		mark: 'mark-no', start: '10:00', end: '10:59', limit: 50, isLimit: true, status: 1,
		stat: { succCnt: 0, cancelCnt: 0, adminCancelCnt: 0, }
	},
	MEET_NEW_NODE_DAY: [
		{
			mark: 'mark-am', start: '10:00', end: '10:59', limit: 30, isLimit: true, status: 1,
			stat: { succCnt: 0, cancelCnt: 0, adminCancelCnt: 0, }
		},
		{
			mark: 'mark-pm', start: '15:00', end: '16:59', limit: 50, isLimit: true, status: 1,
			stat: { succCnt: 0, cancelCnt: 0, adminCancelCnt: 0, }
		},
		{
			mark: 'mark-pm', start: '18:00', end: '19:59', limit: 40, isLimit: true, status: 1,
			stat: { succCnt: 0, cancelCnt: 0, adminCancelCnt: 0, }
		}
	]


}