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
        url: '/bulletin/list.do',
        method: 'post',
        where: {data: {}},
        headers: {token: layui.data(setter.tableName)[setter.request.tokenName]},
        contentType: 'application/json',
        cols: [[
            {type: 'checkbox', fixed: 'left'},
            {type: 'numbers',title:'序号', fixed: 'left'},
            {field: 'TITLE', title: '标题', minWidth: 100},
            {field: 'KEY_WORDS', title: '关键字', minWidth: 100},
            {field: 'PUB_STATUS', title: '发布状态', templet: '#buttonTpl', align: 'center'},
            {field: 'CREATE_USER', title: '创建人', minWidth: 100, sort: false},
            {field: 'CREATE_TIME', title: '创建时间', minWidth: 100, sort: false},
            {title: '操作', align: 'center', width: 300, fixed: 'right', toolbar: '#table-operator-menus'}
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
                title: '编辑公告',
                content: '/bulletin/bulletinAdd.html?ID=' + data.ID,
                resize: false,
                area: ['550px', '550px'],
                btn: ['确定', '取消'],
                yes: function (index, layero) {
                    //点击确认触发 iframe 内容中的按钮提交
                    var submit = layero.find('iframe').contents().find("#layuiadmin-app-form-submit");
                    submit.click();
                }
            });
        } else if (obj.event === 'pub') {
            //发布
            batchPublish({IDS: [data.ID], PUB_STATUS: 1})
        } else if (obj.event === 'revoke') {
            //撤销
            batchRevoke({IDS: [data.ID], PUB_STATUS: 0})
        } else if (obj.event === 'del') {
            //删除
            batchDel({IDS: [data.ID]})
        }
    });

    //绑定表格上方的按钮组
    var toolBarActive = {
        //新增
        add: function () {
            layer.open({
                type: 2,
                title: '编辑公告',
                content: '/bulletin/bulletinAdd.html',
                resize: false,
                area: ['550px', '550px'],
                btn: ['确定', '取消'],
                yes: function (index, layero) {
                    //点击确认触发 iframe 内容中的按钮提交
                    var submit = layero.find('iframe').contents().find("#layuiadmin-app-form-submit");
                    submit.click();
                }
            });
        },
        //批量发布
        batchpub: function () {
            //获取表格勾选项
            var checkStatus = table.checkStatus('grid-table')
                , checkData = checkStatus.data; //得到选中的数据
            if (checkData.length === 0) {
                return layer.msg('请选择数据');
            }

            //检查状态是否都是未发布状态
            var ids = [];
            for (var i = 0; i < checkData.length; i++) {
                if (checkData[i].PUB_STATUS === 1) {
                    return layer.msg('只能选择待发布的公告');
                }
                ids[i] = checkData[i].ID;
            }
            var params = {
                IDS: ids,
                PUB_STATUS: 1
            };
            batchPublish(params);
        },
        //批量撤销
        batchrev: function () {
            //获取表格勾选项
            var checkStatus = table.checkStatus('grid-table')
                , checkData = checkStatus.data; //得到选中的数据
            if (checkData.length === 0) {
                return layer.msg('请选择数据');
            }

            //检查状态是否都是未发布状态
            var ids = [];
            for (var i = 0; i < checkData.length; i++) {
                if (checkData[i].PUB_STATUS === 0) {
                    return layer.msg('只能选择已发布的公告');
                }
                ids[i] = checkData[i].ID;
            }
            var params = {
                IDS: ids,
                PUB_STATUS: 0
            };
            batchRevoke(params);
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
                if (checkData[i].PUB_STATUS === 1) {
                    return layer.msg('只能选择待发布的公告');
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
    function batchPublish(data) {
        layer.confirm('确定发布这些公告吗？', function (index) {
            layer.close(index);
            //调用ajax删除
            //请求登入接口
            var lTip = layer.load(5, {time: 1000, shade: 0.1});
            //调用接口
            admin.callAjaxPost({
                url: '/bulletin/publish.do',
                data: data,
                success: function (result) {
                    //1、判断状态
                    layer.close(lTip);
                    if (result.success && result.code === 200) {
                        layer.msg("发布成功");
                        var param = {
                            TITLE: $('input[name="TITLE"]').val(),
                            KEY_WORDS: $('input[name="KEY_WORDS"]').val(),
                            PUB_STATUS: $('select[name="PUB_STATUS"]').val()
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

    //批量撤销
    function batchRevoke(data) {
        layer.confirm('确定撤销这些公告吗？', function (index) {
            layer.close(index);
            //调用ajax删除
            //请求登入接口
            var lTip = layer.load(5, {time: 1000, shade: 0.1});
            //调用接口
            admin.callAjaxPost({
                url: '/bulletin/revoke.do',
                data: data,
                success: function (result) {
                    //1、判断状态
                    layer.close(lTip);
                    if (result.success && result.code === 200) {
                        layer.msg("撤销成功");
                        var param = {
                            TITLE: $('input[name="TITLE"]').val(),
                            KEY_WORDS: $('input[name="KEY_WORDS"]').val(),
                            PUB_STATUS: $('select[name="PUB_STATUS"]').val()
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
        layer.confirm('确定删除这些公告吗？', function (index) {
            layer.close(index);
            //调用ajax删除
            //请求登入接口
            var lTip = layer.load(5, {time: 1000, shade: 0.1});
            //调用接口
            admin.callAjaxPost({
                url: '/bulletin/delete.do',
                data: data,
                success: function (result) {
                    //1、判断状态
                    layer.close(lTip);
                    if (result.success && result.code === 200) {
                        layer.msg("删除成功");
                        var param = {
                            TITLE: $('input[name="TITLE"]').val(),
                            KEY_WORDS: $('input[name="KEY_WORDS"]').val(),
                            PUB_STATUS: $('select[name="PUB_STATUS"]').val()
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