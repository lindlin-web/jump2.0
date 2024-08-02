var NotifyMgrCls = window.NotifyMgrCls = (function(){
    function NotifyMgrCls() {

    }  
    NotifyMgrCls.prototype._init = function() {
        if (!this._hasInited) {
            this._defaultHost = {};
            this._typeMap = {};
            this._hasInited = true;
        }
    };
    /**
     * @param {*} type 通知类型
     * @param {...} args 自定义数据
     */
    NotifyMgrCls.prototype.send = function(type) {
        this._init();
        // if (GameTool.debugMode) {
        //     if (cc.sys.isNative) {
        //         GameTool.info("[NotifyMgr.send]", Array.prototype.slice.call(arguments).join(","));
        //     } else {
        //         GameTool.info("[NotifyMgr.send]", Array.prototype.slice.call(arguments));
        //     }
        // }

        var recordsOfType = this._typeMap[type];
        if (recordsOfType) {
            recordsOfType = recordsOfType.concat();
            for (var i = 0, len = recordsOfType.length; i < len; ++i) {
                var record = recordsOfType[i];
                var args = Array.prototype.slice.call(arguments, 1);
                record.callback && record.callback.apply(null, args);
            }
        }
    };
    
    /**
     * @param  {} type
     * @param  {} callback
     * @param  {} host
     * @param  {} priority 优先级，默认为0,请输入大于或者等于0的数值
     * @param  {} cover
     */
    NotifyMgrCls.prototype.on = function(type, callback, host, priority, cover) {
        this._init();
        if (!callback) {
            return;
        }

        host = host || this._defaultHost;
        priority = priority || 0;

        var recordsOfType = this._typeMap[type];
        if (!recordsOfType) {
            recordsOfType = [];
            this._typeMap[type] = recordsOfType;
        }
        var notCover = !cover;
        if (!notCover) { // 自动覆盖
            for (var i = recordsOfType.length - 1; i >= 0; --i) {
                var record = recordsOfType[i];
                if (record.callback.call == callback.call && record.host == host) {
                    recordsOfType.splice(i, 1);
                }
            }   
        }
        var record = {
            type: type,
            callback: callback,
            host: host,
            priority: priority,
        };
        recordsOfType.push(record);
        // if (priority != 0) {
            GameTool.sortArrayWithKeys(recordsOfType, [
                -1,
                "priority"
            ])
        // }
    };
    NotifyMgrCls.prototype.off = function(type, callback, host) {
        this._init();

        if (type == null) {
            return;
        }
        host = host || this._defaultHost;

        var recordsOfType = this._typeMap[type];
        if (recordsOfType) {
            for (var i = recordsOfType.length - 1; i >= 0; --i) {
                var record = recordsOfType[i];
                if (record.host == host && (!callback || callback.call == record.callback.call)) {
                    recordsOfType.splice(i, 1);
                }
            }
        }
    };
    NotifyMgrCls.prototype.offAll = function(host) {
        this._init();

        if (!host) {
            return;
        }
        for (var type in this._typeMap) {
            var recordsOfType = this._typeMap[type];
            if (recordsOfType) {
                for (var i = recordsOfType.length - 1; i >= 0; --i) {
                    var record = recordsOfType[i];
                    if (record.host == host) {
                        recordsOfType.splice(i, 1);
                    }
                }
            }
        }

    };
    return NotifyMgrCls;
})();
var NotifyMgr = window.NotifyMgr = new NotifyMgrCls();