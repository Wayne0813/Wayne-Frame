/**
 * 当前的 “注册” 等操作，是基于 “本地存储” 完成的
 **/
(function (owner) {

    /* 异步调用服务器端方法 */
    owner.callAjaxPost = function (url, params, callback, scope) {
        callback = callback || $.noop;
        url = url || "";
        if (url !== '')
            url = url + "?_dc=" + Math.random();
        params = params || {};
        /* 处理返回结果 */
        function dealwithResult(scope, result) {
            if (result) {
                if (callback) {
                    if (scope)
                        callback.call(scope, result);
                    else
                        callback.call(undefined, result);
                }
                else {
                    if (result.message !== '')
                        layer.alert(result.message);
                    else if (result.success !== true)
                        layer.alert("请求失败！", {icon: 5});
                }
            }
        }

        $.ajax({
            url: url,
            data: JSON.stringify(params),
            dataType: 'json', //服务器返回json格式数据
            type: 'post', //HTTP请求类型
            contentType: "application/json",
            timeout: 15000, //超时时间设置为10秒；
            headers: {'Content-type': 'application/json;charset=UTF-8'},
            success: function (result) {
                dealwithResult(scope, result);
            },
            error: function (xhr, type, errorThrown) {
                layer.alert("无法连接到服务器！", {icon: 5});
            }
        });
    };

    /* 同步调用服务器端方法 */
    owner.callAjaxPostSync = function (url, params) {
        var obj;
        url = url || "";
        if (url !== '')
            url = url + "?_dc=" + Math.random();
        params = params || {};

        $.ajax({
            url: url,
            data: JSON.stringify(params),
            dataType: 'json', //服务器返回json格式数据
            type: 'post', //HTTP请求类型
            contentType: "application/json",
            async: false,
            timeout: 15000, //超时时间设置为10秒；
            headers: {'Content-type': 'application/json;charset=UTF-8'},
            success: function (result) {
                obj = result;
            },
            error: function (xhr, type, errorThrown) {
                layer.alert("无法连接到服务器！", {icon: 5});
            }
        });
        return obj;
    };

    /**
     * 获取当前URL
     *
     * @returns {string}
     */
    owner.getRootPath = function () {
        var strFullPath = window.document.location.href;
        var strPath = window.document.location.pathname;
        var pos = strFullPath.indexOf(strPath);
        var prePath = strFullPath.substring(0, pos);
        var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
        var result = (prePath + postPath);
        if (result.indexOf('Layout') > -1)
            result = result.substring(0, result.indexOf('Layout'));
        return result;
    }

    /**
     * 设置应用本地配置
     **/
    owner.getSettings = function () {
        var settingsText = localStorage.getItem('$settings') || "{}";
        return JSON.parse(settingsText);
    }

    // 获取url参数
    owner.getUrlParam = function (param) {
        var params = decodeURIComponent(location.search.substring(1));
        var strs = params.split('&');
        var theRequest = {};
        for (var i = 0; i < strs.length; i++)
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        return theRequest[param];
    };
}(window.app = {}));