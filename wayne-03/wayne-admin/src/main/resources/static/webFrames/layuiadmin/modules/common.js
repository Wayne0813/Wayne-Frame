/**

 @Name：layuiAdmin 公共业务
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License：LPPL

 */

layui.define(function (exports) {
    var $ = layui.$
        , layer = layui.layer
        , laytpl = layui.laytpl
        , setter = layui.setter
        , view = layui.view
        , admin = layui.admin

    //公共业务的逻辑处理可以写在此处，切换任何页面都会执行
    //……

    //退出
    admin.events.logout = function () {
        //执行退出接口
        admin.callAjaxPost({
            url: '/index/logout.do',
            data: {},
            success: function (result) {
                //1、判断状态
                if (result.success && result.code === 200) {
                    admin.exit(function () {
                        location.href = '/login/login.html';
                    });
                } else {
                    //登陆失败
                    admin.errorMsg(admin.msgtemp(result.code, result.message));
                }
            },
            error: function (result) {
                console.log(result);
            }
        });
    };

    //对外暴露的接口
    exports('common', {});
});