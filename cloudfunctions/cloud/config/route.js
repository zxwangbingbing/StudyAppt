/**
 * Notes: 路由配置文件
 * User: CC
 * Date: 2020-10-14 07:00:00
 */

module.exports = { 
	'home/setup_all': 'home_controller@getSetupAll', //获取全局配置(所有)

	'passport/phone': 'passport_controller@getPhone',
	'passport/my_detail': 'passport_controller@getMyDetail',
	'passport/edit_base': 'passport_controller@editBase',

	'news/list': 'news_controller@getNewsList',
	'news/home_list': 'news_controller@getHomeNewsList',
	'news/view': 'news_controller@viewNews', 

	'meet/list': 'meet_controller@getMeetList',
	'meet/list_by_day': 'meet_controller@getMeetListByDay',
	'meet/list_has_day': 'meet_controller@getHasDaysFromDay',
	'meet/view': 'meet_controller@viewMeet',
	'meet/detail_for_join': 'meet_controller@detailForJoin',
	'meet/before_join': 'meet_controller@beforeJoin',
	'meet/join': 'meet_controller@join',

	'my/my_join_list': 'meet_controller@getMyJoinList',
	'my/my_join_cancel': 'meet_controller@cancelMyJoin',
	'my/my_join_detail': 'meet_controller@getMyJoinDetail',
	'my/my_join_someday': 'meet_controller@getMyJoinSomeday',
	'my/my_join_checkin': 'meet_controller@userSelfCheckin', 

	'test/test': 'test/test_controller@test',
	'test/meet_test_join': 'test/test_meet_controller@testJoin',

	//***########### ADMIN ################## */  
	'admin/login': 'admin/admin_home_controller@adminLogin',
	'admin/home': 'admin/admin_home_controller@adminHome',
	'admin/clear_cache': 'admin/admin_home_controller@clearCache#noDemo',

	'admin/setup_about': 'admin/admin_setup_controller@setupAbout#noDemo',
	'admin/setup_contact': 'admin/admin_setup_controller@setupContact#noDemo', 
	'admin/setup_qr': 'admin/admin_setup_controller@genMiniQr', 

	'admin/news_list': 'admin/admin_news_controller@getNewsList',
	'admin/news_insert': 'admin/admin_news_controller@insertNews#noDemo',
	'admin/news_detail': 'admin/admin_news_controller@getNewsDetail',
	'admin/news_edit': 'admin/admin_news_controller@editNews#noDemo',
	'admin/news_update_pic': 'admin/admin_news_controller@updateNewsPic#noDemo',
	'admin/news_update_content': 'admin/admin_news_controller@updateNewsContent#noDemo',
	'admin/news_del': 'admin/admin_news_controller@delNews#noDemo', 
	'admin/news_sort': 'admin/admin_news_controller@sortNews#noDemo',
	'admin/news_status': 'admin/admin_news_controller@statusNews#noDemo',

	'admin/meet_list': 'admin/admin_meet_controller@getMeetList',
	'admin/meet_join_list': 'admin/admin_meet_controller@getJoinList',
	'admin/join_status': 'admin/admin_meet_controller@statusJoin#noDemo',
	'admin/join_del': 'admin/admin_meet_controller@delJoin#noDemo',
	'admin/meet_insert': 'admin/admin_meet_controller@insertMeet#noDemo',
	'admin/meet_detail': 'admin/admin_meet_controller@getMeetDetail',
	'admin/meet_edit': 'admin/admin_meet_controller@editMeet#noDemo',
	'admin/meet_del': 'admin/admin_meet_controller@delMeet#noDemo',
	'admin/meet_update_content': 'admin/admin_meet_controller@updateMeetContent#noDemo',
	'admin/meet_update_style': 'admin/admin_meet_controller@updateMeetStyleSet#noDemo',
	'admin/meet_sort': 'admin/admin_meet_controller@sortMeet#noDemo',
	'admin/meet_status': 'admin/admin_meet_controller@statusMeet#noDemo',
	'admin/meet_cancel_time_join': 'admin/admin_meet_controller@cancelJoinByTimeMark#noDemo',
	'admin/join_scan': 'admin/admin_meet_controller@scanJoin#noDemo',
	'admin/join_checkin': 'admin/admin_meet_controller@checkinJoin#noDemo',
	'admin/self_checkin_qr': 'admin/admin_meet_controller@genSelfCheckinQr',
	'admin/meet_day_list': 'admin/admin_meet_controller@getDayList',

	'admin/join_data_get': 'admin/admin_export_controller@joinDataGet',
	'admin/join_data_export': 'admin/admin_export_controller@joinDataExport',
	'admin/join_data_del': 'admin/admin_export_controller@joinDataDel#noDemo',

	'admin/temp_insert': 'admin/admin_meet_controller@insertTemp#noDemo',
	'admin/temp_list': 'admin/admin_meet_controller@getTempList',
	'admin/temp_del': 'admin/admin_meet_controller@delTemp#noDemo',
	'admin/temp_edit': 'admin/admin_meet_controller@editTemp#noDemo', 

	'admin/log_list': 'admin/admin_mgr_controller@getLogList',

	'admin/user_list': 'admin/admin_user_controller@getUserList',
	'admin/user_detail': 'admin/admin_user_controller@getUserDetail',
	'admin/user_del': 'admin/admin_user_controller@delUser#noDemo',  

	'admin/user_data_get': 'admin/admin_export_controller@userDataGet',
	'admin/user_data_export': 'admin/admin_export_controller@userDataExport',
	'admin/user_data_del': 'admin/admin_export_controller@userDataDel#noDemo',


}