cc.Class({
    extends: require("BaseView"),

    properties: {
        bgColorNode: cc.Node,
        isShow: false,
        // loadingPrefab: cc.Prefab,
        waitCmds: [],
        triggerWaitCmd: [],
    },

    onLoad() {
        this._super();
        this.setUIID(window.gUIIDs.UI_LOADINGPROGRESS);

        // let aniNode = cc.instantiate(this.loadingPrefab);
        // aniNode.parent = this.bgColorNode;
        // aniNode.getComponent("BaseView").play("show1", true);
        // this.bgColorNode.opacity = 0;
        // this.node.active = false;
        // this.noLoadingCmd = [];
        // this.setClickEvent(this, this.onClickLoading.bind(this));
    },
    onClickLoading() {
        console.log("onClickLoading:", this.waitCmds, this.triggerWaitCmd);
    },

    setIsShow(isShow) {
        // this.bgColorNode.stopAllActions();
        // this.isShow = isShow;
        // if (isShow) {
        //     this.bgColorNode.runAction(
        //         cc.sequence(
        //             cc.delayTime(50/ 60),
        //             cc.callFunc(function() {
        //                 this.node.active = true;
        //             }.bind(this)),
        //             cc.delayTime(0.2),
        //             cc.fadeTo(0, 0),
        //         )
        //     );
        // } else {
        //     this.bgColorNode.runAction(
        //         cc.sequence(
        //             cc.delayTime(0.2),
        //             cc.fadeTo(0, 0),
        //             cc.callFunc((function() {
        //                 this.node.active = false;
        //             }).bind(this))
        //         ),
        //     );
        // }
    },

    onDestroy() {
        this._super();
    },
    triggerCmd(key) {
        // for (let i = this.triggerWaitCmd.length - 1; i >= 0; i--) {
        //     if (this.triggerWaitCmd[i] == key) {
        //         this.triggerWaitCmd.splice(i, 1);
        //         if (this.waitCmds.indexOf(key) == -1) {
        //             this.waitCmds.push(key);
        //         }
        //         break;
        //     }
        // }
        // this.checkShow();
    },
    addWaitCmd(key, timeoutTime, isTrigger, needReconnect, noLoading) {
        // if (!isTrigger) {
        //     if (this.waitCmds.indexOf(key) == -1) {
        //         this.waitCmds.push(key);
        //     }
        // } else {
        //     this.triggerWaitCmd.push(key);
        // }
        // if (noLoading) {
        //     this.noLoadingCmd.push(key);
        // }
        // this.needReconnect = needReconnect;
        // this.checkShow(timeoutTime);
    },
    checkShow(timeoutTime) {
        // if (this.waitCmds.length) {
        //     for (let i = 0; i < this.waitCmds.length; i++) {
        //         let hasCmd = false;
        //         for (let j = 0; j < this.noLoadingCmd.length; j++) {
        //             if (this.waitCmds[i] == this.noLoadingCmd) {
        //                 hasCmd = true;
        //             }
        //         }
        //         if (hasCmd == false) {
        //             this.setIsShow(true);
        //         }
        //     }
        //     this.unscheduleAllCallbacks();
        //     if (timeoutTime == null || timeoutTime == undefined) {
        //         timeoutTime = 20;
        //     }
        //     this.scheduleOnce(function() {
        //             // GameTool.showToast(GameTool.getDataString("common_7"));
        //             // console.log("LoadingProgress overTime go reconnect");
        //             gGameCmd.callCmdOverTime();
        //             if (gGameCmd.isConnected && gGameCmd.ws) {
        //                 gGameCmd.dealReconnect(true);
        //             }
        //             this.waitTimeout();
        //         }.bind(this),
        //         timeoutTime);
        //     console.log("timeoutTime = ", timeoutTime)
        // }
    },

    removeWaitCmd(key) {
        // if (key != 0 && !key) {
        //     this.waitTimeout();
        //     return;
        // }
        // for (let i = this.waitCmds.length - 1; i >= 0; i--) {
        //     if (this.waitCmds[i] == key) {
        //         this.waitCmds.splice(i, 1);
        //         break;
        //     }
        // }
        // for (let i = this.triggerWaitCmd.length - 1; i >= 0; i--) {
        //     if (this.triggerWaitCmd[i] == key) {
        //         this.triggerWaitCmd.splice(i, 1);
        //         break;
        //     }
        // }
        // for (let i = this.noLoadingCmd.length - 1; i >= 0; i--) {
        //     if (this.noLoadingCmd[i] == key) {
        //         this.noLoadingCmd.splice(i, 1);
        //         break;
        //     }
        // }
        // if (this.waitCmds.length == 0) {
        //     this.unscheduleAllCallbacks();
        //     this.setIsShow(false);
        // }
    },
    waitTimeout() {
        // this.unscheduleAllCallbacks();
        // this.waitCmds = [];
        // this.triggerWaitCmd = [];
        // this.noLoadingCmd = [];
        // this.setIsShow(false);
        // // if(this.needReconnect)
        // {
        //     gGameCmd.checkReconnect();
        // }
    },

    onEnable() {
        this._super();
        // this.node.x = this.node.parent.width - this.node.width >> 1;
        // this.node.y = this.node.parent.height - this.node.height >> 1;
    },
    onDisable() {
        this._super();

    }

    //如果需要接收指定服务端数据的通知 则使用这个方法
    //handleNotification(key ,data){},
    // start() {},

    // update (dt) {},
});
