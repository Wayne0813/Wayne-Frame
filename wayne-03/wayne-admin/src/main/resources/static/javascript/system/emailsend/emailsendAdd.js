layui.config({
    base: '/static/webFrames/layuiadmin/' //静态资源所在路径
}).extend({
    index: 'lib/index' //主入口模块
}).use(['index', 'form'], function () {
    var $ = layui.$
        , admin = layui.admin
        , form = layui.form;

    //监听选择配置下拉框事件
    form.on('select(sms-config)', function (data) {
        //取出val
        var val = data.value;
        if (!val) {
            var $s = $('select[name="EMAIL_CONFIG_ID"]');
            $s.empty();
            return;
        }
        var lTip = layer.load(5, {time: 1000, shade: 0.1});
        //去后台查询出改配置对应的所有的模版
        admin.callAjaxPost({
            url: "/emailconfig/listTemplateNoPage.do",
            data: {EMAIL_CONFIG_ID: val},
            success: function (result) {
                //1、判断状态
                layer.close(lTip);
                if (result.success && result.code === 200) {
                    //重新渲染
                    var $s = $('select[name="EMAIL_TEMPLATE_ID"]');
                    $s.empty();
                    //重新填充
                    var first = '<option value="">选择模版</option>';
                    $s.append(first);
                    for (var i = 0; i < result.data.length; i++) {
                        var opt = '<option value="' + result.data[i].ID + '" data-params="' + result.data[i].TEMPLATE_CONTENT + '">' + result.data[i].TEMPLATE_NAME + '</option>';
                        $s.append(opt);
                    }
                    form.render();
                } else {
                    admin.errorMsg(admin.msgtemp(result.code, result.message));
                }
            },
            error: function (result) {
                layer.close(lTip);
                console.log(result);
            }
        });
    });

    form.on('select(sms-config-template)', function (data) {
        //取出val
        console.log(data);
        var selectedIndex = data.elem.selectedIndex;
        var params = data.elem.children[selectedIndex].dataset.params;
        $('textarea[name="EMAIL_CONTENT"]').text(params);
    });

    //监听提交
    form.on('submit(layuiadmin-app-form-submit)', function (data) {
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        //提交 Ajax 成功后，关闭当前弹层并重载表格
        var param = data.field;
        param.HAS_SEND = param.HAS_SEND && param.HAS_SEND === 'on' ? 1 : 0;
        var lTip = layer.load(5, {time: 1000, shade: 0.1});
        //调用接口
        admin.callAjaxPost({
            url: '/emailsend/addEmail.do',
            data: param,
            success: function (result) {
                //1、判断状态
                layer.close(lTip);
                if (result.success && result.code === 200) {
                    layer.msg('已发送', {
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