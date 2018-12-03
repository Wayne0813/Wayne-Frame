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
    var myTable = table.render({
        elem: '#grid-table',
        url: '/schedule/listLog.do',
        method: 'post',
        where: {data: {JOB_ID:$('input[name="JOB_ID"]').val()}},
        headers: {token: layui.data(setter.tableName)[setter.request.tokenName]},
        contentType: 'application/json',
        cols: [[
            {field: 'BEAN_NAME', title: 'BEAN名称'},
            {field: 'METHOD_NAME', title: '方法名称', sort: false},
            {field: 'PARAMS', title: '参数', sort: false},
            {field: 'EXEC_STATUS', title: '执行结果', templet: '#buttonTpl', align: 'center'},
            {field: 'ERROR_MSG', title: '错误信息', sort: false},
            {field: 'SPEND_TIME', title: '耗时', sort: true},
            {field: 'CREATE_TIME', title: '执行时间', sort: true}
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
});