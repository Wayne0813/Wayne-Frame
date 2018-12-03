layui.config({
    base: '/static/webFrames/layuiadmin/' //静态资源所在路径
}).extend({
    index: 'lib/index' //主入口模块
}).use(['index', 'form'], function () {
    var $ = layui.$
        , admin = layui.admin
        , form = layui.form;
    //监听提交
    form.on('submit(layuiadmin-app-form-submit)', function (data) {
        var field = data.field; //获取提交的字段
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引

        //提交 Ajax 成功后，关闭当前弹层并重载表格
        var param = data.field;
        param.JOB_STATUS = param.JOB_STATUS && param.JOB_STATUS === 'on' ? 1 : 0;

        var lTip = layer.load(5, {time: 1000, shade: 0.1});
        //调用接口
        admin.callAjaxPost({
            url: param.ID ? '/schedule/edit.do' : '/schedule/add.do',
            data: param,
            success: function (result) {
                //1、判断状态
                layer.close(lTip);
                if (result.success && result.code === 200) {
                    layer.msg('保存成功', {
                        time: 1000
                    }, function () {
                        parent.layui.table.reload('grid-table'); //重载表格
                        parent.layer.close(index); //再执行关闭
                    });
                } else {
                    admin.errorMsg(admin.msgtemp(result.code, result.message));
                }
            },
            error: function (result) {
                layer.close(lTip);
            }
        });
    });
});