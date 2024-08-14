let mLastPhpAction = {};
let MAX_ERROR_COUNT = 3;
let mErrorCount = 0;
//连接的socket地址
let mWSAddress = "";
//http协议管理
let mReConnectTime = 3.33;
let mReConnectTime_ms = mReConnectTime * 1000;
let mAppKey = "vgcli";
let loadCmds = [];
var gGameCmd = window.gGameCmd = {
    //发送Http请求
    postAction: function(gsmKey, params, callback, errorCallback, retry) {
        // if (params) {
        //     console.log("jpzmg sendCmd gsmKey = ", gsmKey, params)
        //     params.time = new Date().getTime();
        //     //计算签名
        //     let sortStrs = [];
        //     for (let k in params) {
        //         if (k != "sign") {
        //             sortStrs.push(k);
        //         }
        //     }
        //     sortStrs.sort();
        //     console.log("jpzmg sortStrs = ", sortStrs);

        //     let urlStr = "";
        //     for (var i = 0; i < sortStrs.length; i++) {
        //         urlStr += params[sortStrs[i]];
        //     }
        //     urlStr += mAppKey;
        //     console.log("jpzmg sign = ", urlStr);
        //     let sign = gFuncs.md5String(urlStr);
        //     params["sign"] = sign;

        // }
        retry = true; //设置全部可重发
        mLastPhpAction = {
            "gsmKey": gsmKey,
            "params": params,
            "callback": callback,
            "errorCallback": errorCallback
        };
        let postCompleteCallback = function(response) {
            window.gUICtrl.hideLoadingProgress(gsmKey);
            mErrorCount = 0;
            let obj = gDataMgr.analyzeGsmData(gsmKey, response);

            if (cc.sys.isNative) {
               // GameTool.log("[接收]", CircularJSON.stringify(obj), gsmKey);
            } else {
              //  GameTool.log("[接收]", obj, gsmKey);
            }
            if (obj.code == 0 || obj.code == 1 || obj.code == 2) {
                if(obj.data) {
                    obj.data.code = obj.code;
                }
                
                if (callback != null && callback != undefined) {
                    callback(obj.data);
                }

                // gDataMgr._dispatchEvent(GameConfig.RECV_CMD_NOTIFY_UI, {
                //     "key": gsmKey,
                //     "data": obj.data
                // });
                NotifyMgr.send(gsmKey, obj.data);
            } else {
                if (errorCallback != null && errorCallback != undefined) {
                    errorCallback(obj.code, obj.message);
                } else {
                    //GameTool.showAlert(GameTool.getDataString("error_server_" + obj.code));
                }
                // add by lind
                //NotifyMgr.send(gsmKey, obj.data);
            }
        }.bind(this);

        let postErrorCallback = function(error) {
            // window.gUICtrl.hideLoadingProgress(gsmKey);
            // this.onErrorRequest(params, error);
            //自动重新发送
            if (!retry) {
                if (mLastPhpAction["errorCallback"]) {
                    mLastPhpAction["errorCallback"](-9999, GameTool.getErrorString("local_4"));
                } else {
                    if (gUICtrl.getUIByUIID(gUIIDs.UI_MAINSCENE)) {
                        if (gUICtrl.getUIByUIID(gUIIDs.UI_MAINSCENE).isShowGuildAlert) {
                            gUICtrl.closeUIWithUIID(gUIIDs.UI_Alert);
                            gUICtrl.getUIByUIID(gUIIDs.UI_MAINSCENE).isShowGuildAlert = false;
                        }
                    }
                    //弹出错误提示
                    // if (!this.isShowAlert) {
                    //     this.isShowAlert = true;
                    //     GameTool.showAlert(GameTool.getErrorString("local_4"), function() {
                    //         GameData.LoginProxy.back2Login();
                    //         this.isShowAlert = false;
                    //     }.bind(this));
                    // }
                }
            } else {
                if (mErrorCount < MAX_ERROR_COUNT) {
                    mErrorCount = mErrorCount + 1;
                    setTimeout(function() {
                        if (mLastPhpAction["gsmKey"] == gGSM.APP_NOTICE_LIST || gGSM.APP_GAME_INFO) { //未进入登陆流程的断线   APP_NOTICE_LIST可丢弃  APP_GAME_INFO需要restart游戏
                            this.postAction(mLastPhpAction["gsmKey"], mLastPhpAction["params"], mLastPhpAction["callback"], mLastPhpAction["errorCallback"], retry);
                        } else {
                            // this.socketReconnectTimes = 0;
                            // GameData.LoginProxy.clearGameLoginToken();
                            // GameData.LoginProxy.reconnect();
                            //this.dealReconnect(true);
                        }
                    }.bind(this), mReConnectTime_ms);
                    return;
                } else if (mErrorCount >= MAX_ERROR_COUNT) {
                    mErrorCount = 0;
                    window.gUICtrl.hideLoadingProgress(gsmKey);
                    window.gUICtrl.hideLoadingProgress(-1);
                    if (mLastPhpAction["errorCallback"]) {
                        mLastPhpAction["errorCallback"](-9999, GameTool.getErrorString("local_4"));
                    } else {
                        // if (gUICtrl.getUIByUIID(gUIIDs.UI_MAINSCENE)) {
                        //     if (gUICtrl.getUIByUIID(gUIIDs.UI_MAINSCENE).isShowGuildAlert) {
                        //         gUICtrl.closeUIWithUIID(gUIIDs.UI_Alert);
                        //         gUICtrl.getUIByUIID(gUIIDs.UI_MAINSCENE).isShowGuildAlert = false;
                        //     }
                        // }
                        //弹出错误提示
                        // if (!this.isShowAlert) {
                        //     this.isShowAlert = true;
                        //     GameTool.showAlert(GameTool.getErrorString("local_4"), function() {
                        //         GameData.LoginProxy.back2Login();
                        //         this.isShowAlert = false;
                        //     }.bind(this));
                        // }
                        if(mLastPhpAction["gsmKey"] == gGSM.GAME_OVER && mLastPhpAction["params"].type == 2) {
                            gUICtrl.openUI(gUIIDs.UI_WALLET_EXIT_TIP,null, {tip:"network error",showNo:false});
                        }
                    }
                }
            }
            // if (mLastPhpAction["errorCallback"]) {
            //     mLastPhpAction["errorCallback"](-9999, GameTool.getErrorString("local_4"));
            // } else {
            //     //弹出错误提示
            //     GameTool.showAlert(GameTool.getErrorString("local_4"));
            // }
        }.bind(this);
        if (cc.sys.isNative) {
           // GameTool.log("[发送]", gsmKey, CircularJSON.stringify(params));
        } else {
           // GameTool.log("[发送]", gsmKey, params);
        }
        
        let initData = "user=%7B%22id%22%3A7167753342%2C%22first_name%22%3A%22qiu%22%2C%22last_name%22%3A%22lin%22%2C%22language_code%22%3A%22zh-hans%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=-523994480771332679&chat_type=private&auth_date=1721974522&hash=16710abeee447799c25ac1ae3f6dc163aff03fe2cc423168f81e8c8339a1a248";
        if(window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData){
            initData = window.Telegram.WebApp.initData;
        }
        console.log(initData, "==========helloworld");
        game.http.sendRequest(GameConfig.gateHttpAddr + gsmKey, params, true, postCompleteCallback.bind(this), postErrorCallback.bind(this),null, initData);
        if (retry) {
            window.gUICtrl.showLoadingProgress(gsmKey);
        }
    }

}