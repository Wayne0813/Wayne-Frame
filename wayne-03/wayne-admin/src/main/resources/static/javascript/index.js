$(document).ready(function () {
    layui.config({
        base: '/static/webFrames/layuiadmin/' //静态资源所在路径
    }).extend({
        index: 'lib/index' //主入口模块
    }).use('index', function () {
        var $ = layui.$
            , setter = layui.setter;
        var token = layui.data(setter.tableName);

        if(!token) location.href="/login/login.html";

    });
});