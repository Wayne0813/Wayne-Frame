$(document).ready(function () {
    //初始化
    layui.config({
        base: '/static/webFrames/layuiadmin/' //静态资源所在路径
    }).extend({
        index: 'lib/index' //主入口模块
    }).use(['index', 'user'], function () {
        var $ = layui.$
            , setter = layui.setter
            , admin = layui.admin
            , form = layui.form
            , router = layui.router()
            , search = router.search;

        form.render();

        //提交
        form.on('submit(LAY-user-login-submit)', function (obj) {
            //请求登入接口
            var index = layer.load(5, {time: 1000, shade: 0.1});
            admin.callAjaxPost({
                url: '/login/login.do',
                data: obj.field,
                success: function (result) {
                    //1、判断状态
                    layer.close(index);
                    if (result.success && result.code === 200) {
                        //登陆成功，写入token执行跳转
                        //请求成功后，写入 access_token
                        layui.data(setter.tableName, {
                            key: setter.request.tokenName,
                            value: result.data['token']
                        });
                        //登入成功的提示与跳转
                        layer.msg('登陆成功', {
                            offset: '15px',
                            icon: 1,
                            time: 500
                        }, function () {
                            location.href = '/index/index.html'; //后台主页
                        });
                    } else {
                        //登陆失败
                        admin.errorMsg(admin.msgtemp(result.code, result.message));
                    }
                },
                error: function (result) {
                    layer.close(index);
                    console.log(result);
                }
            });
        });
    });
});