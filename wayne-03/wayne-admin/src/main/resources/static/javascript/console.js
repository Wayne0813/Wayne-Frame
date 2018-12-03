$(document).ready(function () {
    layui.config({
        base: '/static/webFrames/layuiadmin/' //静态资源所在路径
    }).extend({
        index: 'lib/index' //主入口模块
    }).use(['index','console','admin','table'], function () {
        var $ = layui.$,
            admin = layui.admin,
            setter = layui.setter,
            table = layui.table;

        table.render({
            elem: '#LAY-index-topSearch',
            url: '/bulletin/list.do',
            method: 'post',
            where: {data: {PUB_STATUS: 1}},
            headers: {token: layui.data(setter.tableName)[setter.request.tokenName]},
            contentType: 'application/json',
            cols: [[
                {field: 'TITLE', title: '标题', width: 200},
                {field: 'CONTENT', title: '内容', minWidth: 100},
                {field: 'CREATE_TIME', title: '发布时间', width: 200, sort: false}
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

});