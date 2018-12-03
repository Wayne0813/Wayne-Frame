layui.config({
    base: '/static/webFrames/layuiadmin/' //静态资源所在路径
}).extend({
    index: 'lib/index' //主入口模块
}).use(['index', 'set'], function () {

    var $ = layui.$
        , setter = layui.setter
        , admin = layui.admin
        , form = layui.form
        , router = layui.router()
        , search = router.search;

    form.render();

    //提交
    form.on('submit(setmypass)', function (obj) {
        //请求登入接口
        var index = layer.load(5, {time: 1000, shade: 0.1});
        //调用接口
        admin.callAjaxPost({
            url: '/password/change.do',
            data: obj.field,
            success: function (result) {
                //1、判断状态
                console.log(result)
                layer.close(index);
                if (result.success && result.code === 200) {
                    layer.msg('密码修改成功，下次登陆时生效', {
                        time: 3000
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