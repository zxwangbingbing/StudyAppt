/**
 * Notes: 路由配置文件
 * User: CC
 * Date: 2020-10-14 07:00:00
 */

module.exports = {
	 
 

	'info/list': 'InfoController@getInfoList',
	'info/my_list': 'InfoController@getMyInfoList',
	'info/insert': 'InfoController@insertInfo',
	'info/my_detail': 'InfoController@getMyInfoDetail',
	'info/edit': 'InfoController@editInfo',
	'info/del': 'InfoController@delInfo',
	'info/like': 'InfoController@likeInfo',
	'info/view': 'InfoController@viewInfo',
	'info/update_pic': 'InfoController@updateInfoPic',
  

	'album/list': 'AlbumController@getAlbumList',
	'album/my_list': 'AlbumController@getMyAlbumList',
	'album/insert': 'AlbumController@insertAlbum',
	'album/my_detail': 'AlbumController@getMyAlbumDetail',
	'album/edit': 'AlbumController@editAlbum',
	'album/del': 'AlbumController@delAlbum',
	'album/like': 'AlbumController@likeAlbum',
	'album/view': 'AlbumController@viewAlbum',
	'album/update_pic': 'AlbumController@updateAlbumPic',
 
 

	'user/list': 'UserController@getUserList',
	'user/detail': 'UserController@getUser',
	'user/view': 'UserController@viewUser', //用户单页面查看
	'user/my_detail': 'UserController@getMyDetail',

	'my/invite': 'MyController@getMyInviteList', //我邀请的人
	'my/info': 'MyController@getMyInfoList', //我发布的互助 
	'my/album': 'MyController@getMyAlbumList', //我发布的相册  
 

	'passport/phone': 'PassportController@getPhone',
	'passport/unionid': 'PassportController@getUnionId',
	'passport/reg': 'PassportController@register',
	'passport/modify': 'PassportController@modifyBase',
	'passport/login': 'PassportController@login',
	'passport/check_family': 'PassportController@checkFamily',
	'passport/update_pic': 'PassportController@updatePic',
 
	'check/img': 'CheckController@checkImg',

	'test/test': 'TestController@test',
 

}