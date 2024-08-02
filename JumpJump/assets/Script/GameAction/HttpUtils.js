let waitUrls = {};
let requestTimeout = 10 * 1000;

game.http = module.exports = {
    get: function(url, completeCallback, errorCallback) {
        game.http.sendRequest(url, null, false, completeCallback, errorCallback);
    },

    getByArraybuffer: function(url, completeCallback, errorCallback) {
        game.http.sendRequest(url, null, false, completeCallback, errorCallback, 'arraybuffer');
    },

    getWithParams: function(url, params, completeCallback, errorCallback) {
        game.http.sendRequest(url, params, false, completeCallback, errorCallback);
    },

    getWithParamsByArraybuffer: function(url, params, callback, errorCallback) {
        game.http.sendRequest(url, params, false, completeCallback, errorCallback, 'arraybuffer');
    },

    post: function(url, params, completeCallback, errorCallback) {
        game.http.sendRequest(url, params, true, completeCallback, errorCallback);
    },

    _getParamString: function(params) {
        let result = "";
        for (let name in params) {
            result += gFuncs.formatString("{0}={1}&", name, params[name]);
        }
        return result.substr(0, result.length - 1);
    },

    sendRequest: function(url, params, isPost, completeCallback, errorCallback, responseType, data) {
        let newUrl;
        if (params) {
            newUrl = url + "?" + this._getParamString(params);
        } else {
            newUrl = url;
        }
        if (waitUrls[newUrl] != null) {
            gFuncs.formatString("[{0}]正在处理中, 不能重复请求", newUrl);
            return;
        }

        window.GameTool.log(newUrl);
        let xhr = cc.loader.getXMLHttpRequest();
        if (isPost) {
            xhr.open("POST", url, true);
        } else {
            xhr.open("GET", newUrl);
        }

        xhr.setRequestHeader("Content-Type", "charset=UTF-8;application/x-www-form-urlencoded;");
        if(data && data != "") {
            xhr.setRequestHeader("Use-Agen", data);
        }
        xhr.timeout = requestTimeout;

        // 事件：'onloadstart', 'onabort', 'onerror', 'onload', 'onloadend', 'ontimeout'
        ['abort', 'error', 'timeout'].forEach(function(eventname) {
            xhr["on" + eventname] = function() {
                errorCallback && errorCallback(eventname);
                errorCallback = null;
            };
        });

       

        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4)
                return;
            delete waitUrls[newUrl];
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                if (completeCallback) {
                    if (responseType == 'arraybuffer') {
                        xhr.responseType = responseType;
                        completeCallback(xhr.response);
                    } else {
                        completeCallback(xhr.responseText);
                    }
                }
            } else {
                errorCallback && errorCallback(xhr.status);
                errorCallback = null;
            }
        };

        if (params == null || params == "") {
            xhr.send();
        } else {
            xhr.send(this._getParamString(params));
        }
    }
}
