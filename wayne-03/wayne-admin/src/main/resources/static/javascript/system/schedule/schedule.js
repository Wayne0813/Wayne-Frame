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
        url: '/schedule/list.do',
        method: 'post',
        where: {data: {}},
        headers: {token: layui.data(setter.tableName)[setter.request.tokenName]},
        contentType: 'application/json',
        cols: [[
            {type: 'checkbox', fixed: 'left'},
            {type: 'numbers',title:'序号', fixed: 'left'},
            {field: 'JOB_NAME', title: '任务名称'},
            {field: 'BEAN_NAME', title: 'BEAN名称'},
            {field: 'METHOD_NAME', title: '方法名称'},
            {field: 'PARAMS', title: '传递参数'},
            {field: 'CRON', title: 'CRON表达式'},
            {field: 'JOB_STATUS', title: '任务状态', templet: '#buttonTpl', align: 'center'},
            {field: 'CREATE_TIME', title: '创建时间', sort: false},
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
                title: '编辑定时任务',
                content: '/schedule/scheduleAdd.html?ID=' + data.ID,
                resize: false,
                area: ['450px', '550px'],
                btn: ['确定', '取消'],
                yes: function (index, layero) {
                    //点击确认触发 iframe 内容中的按钮提交
                    var submit = layero.find('iframe').contents().find("#layuiadmin-app-form-submit");
                    submit.click();
                }
            });
        } else if (obj.event === 'pause') {
            //暂停
            batchPause({IDS: [data.ID], JOB_STATUS: 1})
        } else if (obj.event === 'resume') {
            //恢复
            batchResume({IDS: [data.ID], JOB_STATUS: 0})
        } else if (obj.event === 'delete') {
            //删除
            batchDel({IDS: [data.ID]})
        } else if (obj.event === 'log') {
            //删除
            layer.open({
                type: 2,
                title: '定时任务【' + data.JOB_NAME + "】执行日志",
                content: '/schedule/scheduleLog.html?JOB_ID=' + data.ID,
                resize: false,
                area: ['80%', '70%'],
                btn: ['确定', '取消'],
                yes: function (index, layero) {
                    //点击确认触发 iframe 内容中的按钮提交
                    var submit = layero.find('iframe').contents().find("#layuiadmin-app-form-submit");
                    submit.click();
                }
            });
        }
    });
    //*************************** 表格初始化 ***************************//

    //绑定表格上方的按钮组
    var toolBarActive = {
        //新增
        add: function () {
            layer.open({
                type: 2,
                title: '编辑定时任务',
                content: '/schedule/scheduleAdd.html',
                resize: false,
                area: ['450px', '550px'],
                btn: ['确定', '取消'],
                yes: function (index, layero) {
                    //点击确认触发 iframe 内容中的按钮提交
                    var submit = layero.find('iframe').contents().find("#layuiadmin-app-form-submit");
                    submit.click();
                }
            });
        },
        //批量恢复
        batchresume: function () {
            //获取表格勾选项
            var checkStatus = table.checkStatus('grid-table')
                , checkData = checkStatus.data; //得到选中的数据
            if (checkData.length === 0) {
                return layer.msg('请选择数据');
            }

            //检查状态是否都是未发布状态
            var ids = [];
            for (var i = 0; i < checkData.length; i++) {
                if (checkData[i].JOB_STATUS === 1) {
                    return layer.msg('只能选择已暂停的任务');
                }
                ids[i] = checkData[i].ID;
            }
            var params = {
                IDS: ids,
                JOB_STATUS: 1
            };
            batchResume(params);
        },
        //批量暂停
        batchpause: function () {
            //获取表格勾选项
            var checkStatus = table.checkStatus('grid-table')
                , checkData = checkStatus.data; //得到选中的数据
            if (checkData.length === 0) {
                return layer.msg('请选择数据');
            }

            //检查状态是否都是未发布状态
            var ids = [];
            for (var i = 0; i < checkData.length; i++) {
                if (checkData[i].JOB_STATUS === 0) {
                    return layer.msg('只能选择运行中的任务');
                }
                ids[i] = checkData[i].ID;
            }
            var params = {
                IDS: ids,
                JOB_STATUS: 0
            };
            batchPause(params);
        },
        //批量删除
        batchdel: function () {
            //获取表格勾选项
            var checkStatus = table.checkStatus('grid-table')
                , checkData = checkStatus.data; //得到选中的数据
            if (checkData.length === 0) {
                return layer.msg('请选择数据');
            }

            //检查状态是否都是未发布状态
            var ids = [];
            for (var i = 0; i < checkData.length; i++) {
                if (checkData[i].JOB_STATUS === 1) {
                    return layer.msg('只能选择已暂停的任务');
                }
                ids[i] = checkData[i].ID;
            }
            var params = {
                IDS: ids
            };
            batchDel(params);
        }
    };

    $('.layui-btn.layuiadmin-btn-admin').not('.layui-btn-disabled').on('click', function () {
        var type = $(this).data('type');
        toolBarActive[type] ? toolBarActive[type].call(this) : '';
    });


    //************* 方法封装区域 ***************
    //批量发布
    function batchResume(data) {
        layer.confirm('确定恢复这些任务吗？', function (index) {
            layer.close(index);
            //调用ajax删除
            //请求登入接口
            var lTip = layer.load(5, {time: 1000, shade: 0.1});
            //调用接口
            admin.callAjaxPost({
                url: '/schedule/resume.do',
                data: data,
                success: function (result) {
                    //1、判断状态
                    layer.close(lTip);
                    if (result.success && result.code === 200) {
                        layer.msg("恢复成功");
                        var param = {
                            JOB_NAME: $('input[name="JOB_NAME"]').val(),
                            BEAN_NAME: $('input[name="BEAN_NAME"]').val(),
                            JOB_STATUS: $('select[name="JOB_STATUS"]').val()
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
                }
            });
        });
    }

    //批量暂停
    function batchPause(data) {
        layer.confirm('确定暂停这些任务吗？', function (index) {
            layer.close(index);
            //调用ajax删除
            //请求登入接口
            var lTip = layer.load(5, {time: 1000, shade: 0.1});
            //调用接口
            admin.callAjaxPost({
                url: '/schedule/pause.do',
                data: data,
                success: function (result) {
                    //1、判断状态
                    layer.close(lTip);
                    if (result.success && result.code === 200) {
                        layer.msg("暂停成功");
                        var param = {
                            JOB_NAME: $('input[name="JOB_NAME"]').val(),
                            BEAN_NAME: $('input[name="BEAN_NAME"]').val(),
                            JOB_STATUS: $('select[name="JOB_STATUS"]').val()
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

    //批量删除
    function batchDel(data) {
        layer.confirm('确定删除这些任务吗？', function (index) {
            layer.close(index);
            //调用ajax删除
            //请求登入接口
            var lTip = layer.load(5, {time: 1000, shade: 0.1});
            //调用接口
            admin.callAjaxPost({
                url: '/schedule/delete.do',
                data: data,
                success: function (result) {
                    //1、判断状态
                    layer.close(lTip);
                    if (result.success && result.code === 200) {
                        layer.msg("删除成功");
                        var param = {
                            JOB_NAME: $('input[name="JOB_NAME"]').val(),
                            BEAN_NAME: $('input[name="BEAN_NAME"]').val(),
                            JOB_STATUS: $('select[name="JOB_STATUS"]').val()
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