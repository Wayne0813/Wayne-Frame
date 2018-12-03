layui.config({
    base: '/static/webFrames/layuiadmin/' //静态资源所在路径
}).extend({
    index: 'lib/index' //主入口模块
}).use(['index', 'set', 'table'], function () {

    var setter = layui.setter
        , admin = layui.admin
        , form = layui.form
        , router = layui.router()
        , table = layui.table
        , search = router.search;

    //分割面板(div必须有高度，否则不显示)
    $('#split-panel').jqxSplitter({
        width: '100%',
        height: '100%',
        panels: [{size: '20%', min: 150}, {size: '80%', min: 250}]
    });
    $('.jqx-splitter-splitbar-vertical').css('border', 'none');
    $('.jqx-widget-content').css("border-color", "");

    form.render();

    //表格初始化
    var myTable = table.render({
        elem: '#grid-table',
        url: '/dictionary/listDictByPid.do',
        method: 'post',
        where: {data: {PID: -1}},
        headers: {token: layui.data(setter.tableName)[setter.request.tokenName]},
        contentType: 'application/json',
        cols: [[
            {type: 'checkbox', fixed: 'left'},
            {field: 'PARA_CODE', title: '数据编号', sort: false},
            {field: 'PARA_NAME', title: '数据名称', sort: false},
            {field: 'REMARK', title: '备注', sort: false},
            {field: 'EXTEND1', title: '扩展1', sort: false},
            {field: 'EXTEND2', title: '扩展2', sort: false},
            {field: 'EXTEND3', title: '扩展3', sort: false},
            {title: '操作', width: 150, align: 'center', fixed: 'right', toolbar: '#table-useradmin-admin'}
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

    //保存当前用户点击的节点
    var currClickNodeId = null;
    //树结构配置
    var dictTreeConfig = {
        view: {
            selectedMulti: false
        },
        check: {
            enable: true
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        edit: {
            enable: true
        },
        callback: {
            onClick: dictTreeCallback
        }
    };

    //调用接口查询树结构信息，利用函数进行填充
    refreshTree();


    //监听行按钮，通过event参数进行判断
    table.on('tool(LAY-user-back-manage)', function (obj) {
        //当前行数据
        var data = obj.data;
        //删除后执行：obj.del();
        if (obj.event === 'del') {
            //提示框
            deleteData([data.ID], function () {
                //刷新table
                var param = {
                    PARA_CODE: $('input[name="PARA_CODE"]').val(),
                    PARA_NAME: $('input[name="PARA_NAME"]').val(),
                    PID: currClickNodeId
                };
                myTable.reload('grid-table', {
                    where: {data: param}
                });
                refreshTree();
            }, function () {
            })
        } else if (obj.event === 'edit') {
            //编辑
            layer.open({
                type: 2,
                title: '编辑数据字典',
                resize: false,
                content: '/dictionary/dictionaryAdd.html?ID=' + data.ID,
                area: ['1000px', '420px'],
                btn: ['确定', '取消'],
                yes: function (index, layero) {
                    var iframeWindow = window['layui-layer-iframe' + index]
                        , submitID = 'LAY-form-submit'
                        , submit = layero.find('iframe').contents().find('#' + submitID);

                    //监听提交
                    iframeWindow.layui.form.on('submit(' + submitID + ')', function (data) {
                        var field = data.field; //获取提交的字段
                        var ldTip = layer.load(5, {time: 1000, shade: 0.1});
                        //调用ajax提交
                        admin.callAjaxPost({
                            url: '/dictionary/dictionarySave.do',
                            data: field,
                            success: function (result) {
                                layer.close(ldTip);
                                //1、判断状态
                                console.log(result);
                                if (result.success && result.code === 200) {
                                    layer.msg(result.message, {
                                        time: 1000
                                    }, function () {
                                        //刷新表格
                                        var param = {
                                            PARA_CODE: $('input[name="PARA_CODE"]').val(),
                                            PARA_NAME: $('input[name="PARA_NAME"]').val(),
                                            PID: currClickNodeId
                                        };
                                        myTable.reload('grid-table', {
                                            where: {data: param}
                                        });
                                        //刷新树结构
                                        refreshTree();
                                    });
                                } else {
                                    //失败
                                    admin.errorMsg(admin.msgtemp(result.code, result.message));
                                }
                            },
                            error: function (result) {
                                layer.close(ldTip);
                                console.log(result);
                            }
                        });
                        layer.close(index); //关闭弹层
                    });

                    submit.trigger('click');
                }
            });

        }
    });

    //数据字典树结构回调
    function dictTreeCallback(event, treeId, treeNode, clickFlag) {
        //点击节点时的回调
        var nodeId = treeNode.id;
        currClickNodeId = nodeId;
        $('input[name="PID"]').val(nodeId);
        var param = {
            PARA_CODE: $('input[name="PARA_CODE"]').val(),
            PARA_NAME: $('input[name="PARA_NAME"]').val(),
            PID: nodeId
        };
        myTable.reload({
            where: {data: param}
        });
    }

    //监听搜索
    form.on('submit(LAY-form-search)', function (data) {
        var field = data.field;
        //执行重载
        table.reload('grid-table', {
            where: {data: field}
        });
    });

    //监听重置
    form.on('submit(LAY-form-reset)', function (data) {
        $('input[name="PARA_CODE"]').val("");
        $('input[name="PARA_NAME"]').val("");
        form.render();
        //执行重载
        myTable.reload('grid-table', {
            where: {data: data.field}
        });
    });

    //*************  按钮触发事件配置：针对表格上方的操作按钮   **************
    var active = {
        batchdel: function () {
            var checkStatus = table.checkStatus('grid-table')
                , checkData = checkStatus.data; //得到选中的数据
            if (checkData.length === 0) {
                return layer.msg('请选择数据');
            }
            var ids = [];
            for (var i = 0; i < checkData.length; i++) {
                ids[i] = checkData[i].ID;
            }
            deleteData(ids, function () {
                //刷新table
                var param = {
                    PARA_CODE: $('input[name="PARA_CODE"]').val(),
                    PARA_NAME: $('input[name="PARA_NAME"]').val(),
                    PID: currClickNodeId
                };
                myTable.reload('grid-table', {
                    where: {data: param}
                });
                refreshTree();
            }, function () {

            });
        },
        add: function () {
            //判断是否已经选择了上级节点
            var PID = $('input[name="PID"]').val();
            if (!PID) return layer.msg('请先选择一个节点');
            layer.open({
                type: 2,
                title: '编辑数据字典',
                resize: false,
                content: '/dictionary/dictionaryAdd.html?PID=' + PID,
                area: ['1000px', '420px'],
                btn: ['确定', '取消'],
                yes: function (index, layero) {
                    var iframeWindow = window['layui-layer-iframe' + index]
                        , submitID = 'LAY-form-submit'
                        , submit = layero.find('iframe').contents().find('#' + submitID);

                    //监听提交
                    iframeWindow.layui.form.on('submit(' + submitID + ')', function (data) {
                        var field = data.field; //获取提交的字段
                        var ldTip = layer.load(5, {time: 1000, shade: 0.1});
                        //调用ajax提交
                        admin.callAjaxPost({
                            url: '/dictionary/dictionarySave.do',
                            data: field,
                            success: function (result) {
                                layer.close(ldTip);
                                //1、判断状态
                                console.log(result);
                                if (result.success && result.code === 200) {
                                    layer.msg(result.message, {
                                        time: 1000
                                    }, function () {
                                        //刷新表格
                                        var param = {
                                            PARA_CODE: $('input[name="PARA_CODE"]').val(),
                                            PARA_NAME: $('input[name="PARA_NAME"]').val(),
                                            PID: currClickNodeId
                                        };
                                        myTable.reload('grid-table', {
                                            where: {data: param}
                                        });
                                        //刷新树结构
                                        refreshTree();
                                    });
                                } else {
                                    //失败
                                    admin.errorMsg(admin.msgtemp(result.code, result.message));
                                }
                            },
                            error: function (result) {
                                layer.close(ldTip);
                                console.log(result);
                            }
                        });
                        layer.close(index); //关闭弹层
                    });

                    submit.trigger('click');
                }
            });
        }
    };
    $('.layui-btn.layuiadmin-btn-admin').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });


    //删除数据：批量和单个删除
    function deleteData(dataArray, callback, errorCallback) {
        layer.confirm('确定删除吗？', function (index) {
            layer.close(index);
            //调用ajax删除
            //请求登入接口
            var lTip = layer.load(5, {time: 1000, shade: 0.1});
            //调用接口
            admin.callAjaxPost({
                url: '/dictionary/deleteDictData.do',
                data: {IDS: dataArray},
                success: function (result) {
                    //1、判断状态
                    layer.close(lTip);
                    if (result.success && result.code === 200) {
                        layer.msg(result.message);
                        callback && callback();
                    } else {
                        admin.errorMsg(admin.msgtemp(result.code, result.message));
                        errorCallback && errorCallback();
                    }
                },
                error: function (result) {
                    layer.close(lTip);
                    admin.errorMsg(JSON.stringify(result));
                    errorCallback && errorCallback();
                }
            });
        });
    }

    //刷新树结构菜单
    function refreshTree() {
        admin.callAjaxPost({
            url: '/dictionary/listForTree.do',
            data: {},
            success: function (result) {
                //1、判断状态
                if (result.success && result.code === 200) {
                    //取出
                    $.fn.zTree.init($("#dictTree"), dictTreeConfig, result.data);
                } else {
                    //失败
                    admin.errorMsg(admin.msgtemp(result.code, result.message));
                }
            },
            error: function (result) {
                admin.errorMsg(JSON.stringify(result));
            }
        });
    }

});