layui.config({
    base: '/static/webFrames/layuiadmin/' //静态资源所在路径
}).extend({
    index: 'lib/index' //主入口模块
}).use(['index', 'table'], function () {
    var table = layui.table,
        $ = layui.$,
        setter = layui.setter,
        admin = layui.admin,
        form = layui.form;

    //示例代码
    form.render();
    //表格渲染

    //*************************** 表格初始化 ***************************//
    var myTable = table.render({
        elem: '#grid-table',
        url: '/workflowconfig/list.do',
        method: 'post',
        where: {data: {}},
        headers: {token: layui.data(setter.tableName)[setter.request.tokenName]},
        contentType: 'application/json',
        cols: [[
            {type: 'checkbox', fixed: 'left'},
            {type: 'numbers',title:'序号', fixed: 'left'},
            {field: 'WF_ID', title: '流程ID'},
            {field: 'WF_NAME', title: '流程名称'},
            {field: 'WF_TITLE', title: '流程标题'},
            {field: 'WF_DESC', title: '流程描述'},
            {field: 'WF_STATUS', title: '流程状态', templet: '#buttonTpl1', align: 'center'},
            {title: '操作', align: 'center', width: 350, fixed: 'right', toolbar: '#table-operator-menus'}
        ]],
        request: {
            pageName: 'page', //页码的参数名称，默认：page
            limitName: 'limit' //每页数据量的参数名，默认：limit
        },
        parseData: function (result) { //res 即为原始返回的数据
            return {
                "code": result.code, //解析接口状态
                "msg": "处理成功",
                "count": result.total, //解析数据长度
                "data": result.data //解析数据列表
            };
        },
        page: true,
        limit: 10,
        limits: [10, 15, 20, 25, 30],
        text: {
            none: '暂无匹配的数据'
        },
        response: {
            statusName: 'code', //规定数据状态的字段名称，默认：code
            statusCode: 0, //规定成功的状态码，默认：0
            msgName: 'msg', //规定状态信息的字段名称，默认：msg
            countName: 'count', //规定数据总数的字段名称，默认：count
            dataName: 'data' //规定数据列表的字段名称，默认：data
        },
        done: function (res, curr, count) {
            console.log(res)
        }
    });

    //监听搜索
    form.on('submit(LAY-app-contlist-search)', function (data) {
        var field = data.field;
        //执行重载
        table.reload('grid-table', {
            where: {data: field}
        });
    });

    //监听重置
    form.on('submit(LAY-app-contlist-reset)', function (data) {
        $('input,select').val("");
        form.render();
        //执行重载
        myTable.reload('grid-table', {
            where: {data: {}}
        });
    });

    //表格按钮处理
    table.on('tool(grid-table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'edit') {
            //编辑
            layer.open({
                type: 2,
                title: '编辑流程',
                content: '/workflowconfig/workflowconfigAdd.html?ID=' + data.ID,
                resize: false,
                area: ['550px', '650px'],
                btn: ['确定', '取消'],
                yes: function (index, layero) {
                    //点击确认触发 iframe 内容中的按钮提交
                    var submit = layero.find('iframe').contents().find("#layuiadmin-app-form-submit");
                    submit.click();
                }
            });
        } else if (obj.event === 'nodes') {
            layer.open({
                type: 2,
                title: '节点配置',
                content: '/workflowconfig/workflownode.html?WF_ID=' + data.ID,
                resize: false,
                area: ['95%', '95%'],
                yes: function (index, layero) {
                    //点击确认触发 iframe 内容中的按钮提交
                    var submit = layero.find('iframe').contents().find("#layuiadmin-app-form-submit");
                    submit.click();
                }
            });
        } else if (obj.event === 'deploy') {
            //部署
            deployWorkflow({ID:data.ID})
        } else if (obj.event === 'disable') {
            //禁用
            updateWorkflowStatus({ID: data.ID, WF_STATUS: 0})
        } else if (obj.event === 'enable') {
            //启用
            updateWorkflowStatus({ID: data.ID, WF_STATUS: 1})
        } else if (obj.event === 'delete') {
            deleteWorkflow({ID: data.ID})
        }
    });

    //绑定表格上方的按钮组
    var toolBarActive = {
        //新增
        add: function () {
            layer.open({
                type: 2,
                title: '新增配置',
                content: '/workflowconfig/workflowconfigAdd.html',
                resize: false,
                area: ['550px', '650px'],
                btn: ['确定', '取消'],
                yes: function (index, layero) {
                    //点击确认触发 iframe 内容中的按钮提交
                    var submit = layero.find('iframe').contents().find("#layuiadmin-app-form-submit");
                    submit.click();
                }
            });
        }
    };

    $('.layui-btn.layuiadmin-btn-admin').on('click', function () {
        var type = $(this).data('type');
        toolBarActive[type] ? toolBarActive[type].call(this) : '';
    });


    //########## 公共方法
    //删除
    function deleteWorkflow(data) {
        layer.confirm('确定删除这些流程吗？', function (index) {
            layer.close(index);
            //调用ajax删除
            //请求登入接口
            var lTip = layer.load(5, {time: 1000, shade: 0.1});
            //调用接口
            admin.callAjaxPost({
                url: '/workflowconfig/delete.do',
                data: data,
                success: function (result) {
                    //1、判断状态
                    layer.close(lTip);
                    if (result.success && result.code === 200) {
                        layer.msg("删除成功");
                        var param = {
                            WF_ID: $('input[name="WF_ID"]').val(),
                            WF_NAME: $('input[name="WF_NAME"]').val()
                        };
                        myTable.reload('grid-table', {
                            where: {data: param}
                        });
                    } else {
                        admin.errorMsg(admin.msgtemp(result.code, result.message));
                    }
                },
                error: function (result) {
                    layer.close(lTip);
                    admin.errorMsg(JSON.stringify(result));
                }
            });
        });
    }

    //禁用
    function updateWorkflowStatus(data) {
        layer.confirm('确定' + data.WF_STATUS === 1 ? '启用' : '禁用' + '禁用这些流程吗？', function (index) {
            layer.close(index);
            //调用ajax删除
            //请求登入接口
            var lTip = layer.load(5, {time: 1000, shade: 0.1});
            //调用接口
            admin.callAjaxPost({
                url: data.WF_STATUS === 1 ? '/workflowconfig/enable.do' : '/workflowconfig/disable.do',
                data: data,
                success: function (result) {
                    //1、判断状态
                    layer.close(lTip);
                    if (result.success && result.code === 200) {
                        layer.msg("删除成功");
                        var param = {
                            WF_ID: $('input[name="WF_ID"]').val(),
                            WF_NAME: $('input[name="WF_NAME"]').val()
                        };
                        myTable.reload('grid-table', {
                            where: {data: param}
                        });
                    } else {
                        admin.errorMsg(admin.msgtemp(result.code, result.message));
                    }
                },
                error: function (result) {
                    layer.close(lTip);
                    admin.errorMsg(JSON.stringify(result));
                }
            });
        });
    }

    //部署
    function deployWorkflow(data) {
        layer.confirm('确定部署这些流程吗？', function (index) {
            layer.close(index);
            //调用ajax删除
            //请求登入接口
            var lTip = layer.load(5, {time: 1000, shade: 0.1});
            //调用接口
            admin.callAjaxPost({
                url: '/workflowconfig/deploy.do',
                data: data,
                success: function (result) {
                    //1、判断状态
                    layer.close(lTip);
                    if (result.success && result.code === 200) {
                        layer.msg(result.message);
                        var param = {
                            WF_ID: $('input[name="WF_ID"]').val(),
                            WF_NAME: $('input[name="WF_NAME"]').val()
                        };
                        myTable.reload('grid-table', {
                            where: {data: param}
                        });
                    } else {
                        admin.errorMsg(admin.msgtemp(result.code, result.message));
                    }
                },
                error: function (result) {
                    layer.close(lTip);
                    admin.errorMsg(JSON.stringify(result));
                }
            });
        });
    }


});