/** BaseView的关闭动作 */
var BaseViewCloseAction = window.BaseViewCloseAction = {
    /** 正常关闭退出 */
    Back: 0,
    /** 前往操作 */
    Forward: 1,
    /** 异常关闭 */
    Abnormal: 2,
};
/*
 * Author: admin
 * Date: 2017-11-27 11:01:22
 * Desc:
 **/
cc.Class({
    extends: cc.Component,

    properties: {
        uiid: {
            default: 0
        },
        escBtn: {
            default: null,
            type: cc.Button
        },
        _params: {
            default: {}
        },
        _cacheCompones: {
            default: {}
        },
        isFullDialog: {
            default: 1,
        },

        isShowAni: {
            default: true,
        },
        isDialogBg: {
            default: true,
            tooltip: "是否使用通用弹窗黑色底板"
        },
    },

    // use this for initialization
    onLoad: function() {
        GameConfig.checkWinsize();
        this.requireEmitTest = true;
        /** 是否为异常关闭 */
        this.closeAction = BaseViewCloseAction.Abnormal;


        /** 需要抛出点击事件 */
        this.willEmitClick = true;
        this.hoverMap = new Dictionary();
        this.soundMap = new Dictionary();
        this.btnMap = new Dictionary();
        this.animationCbMap = new Dictionary();
        // this.handlerMap = new Dictionary();
        this.clickHandler = this.onClickEvent.bind(this);

        this.callLaterHandlers = [];

        // this.btnHandlers = {};
        //用来标记是否激活 主要是因为onEnable和ondisable需要执行完才会使active改变，用该标记在onEnable中直接标记当前是否即将被隐藏或激活
        this.mIsActive = false;
        //用来标记界面是重新打开 还是从隐藏状态直接恢复，用于单例界面区分直接打开和战斗返回的恢复
        this.mIsReOpen = true;

        // if (this.node.getContentSize().width == 640 && this.node.getContentSize().height == 1136) {
        //     this.node.setContentSize(cc.director.getWinSize());
        // }
        //如果有设置退出按钮
        if (this.escBtn) {
            this.setClickEvent(this.escBtn.node, this.onCloseClick.bind(this, null));
        }
        // 在测试阶段，并且是一级面板.
        if(gUICtrl.isOneLevelPanel(this.uiid)) {
            if(GameConfig.isTest) {
                this.escBtn && (this.escBtn.node.active = true);
            } else {
                this.escBtn && (this.escBtn.node.active = false);
            }
        }
        
        let baseViewCtrl = this.node.addComponent("BaseViewCtrl");
        baseViewCtrl.mBaseView = this;

        // if (GameConfig.debugLevel >= 1) {
        //   this._setBtnInSubNodes([this.node]);
        // }


        // 判断 ScreenAdaptor
        if (GameConfig.needScreenAdaptor && !GameConfig.hasScreenAdaptor) {
            var adaptorHeight = (GameConfig.winSize.height - GameConfig.maxH) / 2;
            GameConfig.marginTop = adaptorHeight;
            GameConfig.marginBottom = adaptorHeight;
            //GameTool.log("GameConfig.winSize", GameConfig.winSize.width, GameConfig.winSize.height, "marginTop", GameConfig.marginTop, "marginBottom", GameConfig.marginBottom);
            gUICtrl.openUI(gUIIDs.UI_ScreenAdaptor);
            GameConfig.hasScreenAdaptor = true;
        }

        // 舞台注册重绘事件
        var uiCfg = gUICfgs[this.uiid];
        if (uiCfg && uiCfg.type == gE.VTYPE.SCENE) {
            var baseScene = this;
            cc.view.on("design-resolution-changed", function(event) {
                baseScene.updateLocaleAlign();
            });
        }
    },

    onCloseClick() {
        this.removeSelf();
    },


    onActiveAniEnd() {

    },
    /**
     * 设置是否挡住底下的其他UI
     * @param {*} block 默认为true，即不可穿透
     */
    setTouchBlock: function(block) {
        var blockComponent = this.node.getComponent(cc.BlockInputEvents);
        if (!blockComponent) {
            blockComponent = this.node.addComponent(cc.BlockInputEvents);
        }
        block = block == null ? true : false;
        blockComponent.enabled = block;
    },
    _setBtnInSubNodes(nodeTable) {
        if (nodeTable.length == 0) {
            return;
        }
        for (let i = 0; i < nodeTable.length; i++) {
            let node = nodeTable[i];
            if (node.getComponent(cc.Button)) {
                // node.on("click", this._testShowBtnName.bind(this));
            }
            this._setBtnInSubNodes(node.children);
        }
    },

    _testShowBtnName(event) {
        let btnNode = event.target;
        if (!btnNode) {
            return;
        }
        if (GameConfig.debugLevel >= 1) {
            let btnName = btnNode.getName();
            let parents = [btnNode];
            let parent = btnNode.parent;
            let uiid = this.uiid;
            let parentName = "";
            let btnRealName = btnName;
            while (parent) {
                if (!this.node) {
                    return;
                }
                if ((this.node.getName() == parent.getName() && this.uiid != 0) || (parent.getComponent && parent.getComponent("BaseView") && parent.getComponent("BaseView").uiid)) {
                    if (parent.getComponent("BaseView")) {
                        uiid = parent.getComponent("BaseView").uiid;
                    }
                    break;
                }
                if (parent.getName() == "content") {
                    parentName = parent.getName();
                    let index = btnRealName.indexOf("/");
                    if (index >= 0) {
                        btnRealName = btnRealName.slice(index + 1);
                    } else {
                        btnRealName = "";
                    }
                } else if (parentName != "") {
                    parentName = parent.getName() + "/" + parentName;
                }
                if (parentName == "") {
                    btnRealName = parent.getName() + "/" + btnRealName;
                }
                btnName = parent.getName() + "/" + btnName;
                parents.push(parent);
                parent = parent.parent;
            }
            let nameStr = "";
            for (var i = 0; i < parents.length; i++) {
                nameStr = parents[i] + nameStr
            }
            if (this.getUIID() == 1000) {
                GameTool.error(this.node.getName() + "界面id没设置快找程序" + " name =" + btnName);
            } else {
                GameTool.warn("界面id = " + uiid + " name =" + btnName);
                if (parentName != "") {
                    GameTool.warn("parent_name = " + parentName + ",  button_name =" + btnRealName);
                }
            }
        }
    },

    onDestroy: function() {
        this.mIsActive = false;

        //GameData.ReminderProxy.removeReminder(this);

        this.clearDependentRes();

        var uiCfg = gUICfgs[this.uiid];
        this.removeUIID();
        if (uiCfg) {
            switch (this.closeAction) {
                case BaseViewCloseAction.Abnormal:
                case BaseViewCloseAction.Back:
                    uiCfg.__prevBackHandler = null;
                    break;
            }
            NotifyMgr.send(AppNotify.OnViewClosed, this.uiid);
        }
        this.onRemoveShowEnd();
    },

    onRemoveShowEnd() {

    },

    onEnable: function() {
        this.mIsActive = true;
        // this.reloadBtnStates(this._btnStateParams);
        // this.reloadRedPoints();
        //如果有设置接收消息事件
        var notifications = this._listNotificationInterests();
        notifications.forEach(function(notification) {
            NotifyMgr.on(notification, this._handleNotification.bind(this, notification), this);
        }, this);
        //刷新是否显示顶栏
        if (this.uiid == 0 || this.uiid == null || this.uiid == undefined || this.uiid == gUIIDs.UI_BASE || this.uiid == gUIIDs.UI_MAINTOPBAR) {
            return;
        }
        //gUICtrl.updateTopBar();


        // if (gCfgMgr.getIsCfgLoaded()) {
        //     // GameData.SoundProxy.refreshBGM();
        // }


        this.updateLocaleAlign();
    },

    onDisable: function() {
        // 关闭音效
        if (this.soundMap && this.soundMap.keys) {
            this.soundMap.keys.forEach(function(soundID) {
                GameData.SoundProxy.stop(soundID);
            });
        }
        this.mIsReOpen = false;
        this.mIsActive = false;
        if (gUIIDs.UI_BASE == this.uiid) {
            return;
        }
        NotifyMgr.offAll(this);
        //刷新是否显示顶栏
        if (this.uiid == 0 || this.uiid == null || this.uiid == undefined || this.uiid == gUIIDs.UI_BASE || this.uiid == gUIIDs.UI_MAINTOPBAR) {
            return;
        }
        //gUICtrl.updateTopBar();
    },

    //透传参数
    setParams(params) {
        this._params = params;
    },

    getParams() {
        return this._params;
    },
    setHoverView(hoverTarget, checkTarget, isChecked) {
        if (hoverTarget instanceof cc.Component) {
            hoverTarget = hoverTarget.node;
        }
        if (checkTarget instanceof cc.Component) {
            checkTarget = checkTarget.node;
        }
        if (!hoverTarget) {
            return;
        }
        var hoverData = this.hoverMap.get(hoverTarget);
        if (!hoverData) {
            hoverData = {};
            hoverData.hoverTarget = hoverTarget;
            hoverTarget.on(cc.Node.EventType.TOUCH_START, this.onHoverTarget.bind(this));
            hoverTarget.on(cc.Node.EventType.TOUCH_END, this.onHoverTarget.bind(this));
            hoverTarget.on(cc.Node.EventType.TOUCH_CANCEL, this.onHoverTarget.bind(this));
            hoverTarget.on(cc.Node.EventType.MOUSE_LEAVE, this.onHoverTarget.bind(this));
            hoverTarget.on(cc.Node.EventType.MOUSE_ENTER, this.onHoverTarget.bind(this));
            this.hoverMap.set(hoverTarget, hoverData);
        } else {
            if (hoverData.checkTarget) {
                hoverData.checkTarget.active = true;
            }
        }
        if (checkTarget) {
            checkTarget.active = isChecked;
        }
        hoverData.checkTarget = checkTarget;
        hoverData.isChecked = isChecked;

    },
    onHoverTarget(event) {
        var hoverTarget = event.target;
        var hoverData = this.hoverMap.get(hoverTarget);
        if (!hoverData) {
            return;
        }
        var result = false;
        switch (event.type) {
            case cc.Node.EventType.TOUCH_START:
            case cc.Node.EventType.TOUCH_END:
            case cc.Node.EventType.MOUSE_ENTER:
                result = true;
                break;
            case cc.Node.EventType.TOUCH_CANCEL:
            case cc.Node.EventType.MOUSE_LEAVE:
                break;
        }
        result = result || hoverData.isChecked;
        if (hoverData.checkTarget) {
            hoverData.checkTarget.active = result;
        }
    },
    //设置用于按钮刷新的数据 比如宠物等级
    setBtnStateParams(params) {
        this._btnStateParams = params;
    },

    getBtnStateParams() {
        return this._btnStateParams;
    },

    setUIID: function(uiid) {
        if (uiid == 0 || uiid == null || uiid == undefined || uiid == gUIIDs.UI_BASE) {
            return;
        }
        // gUICtrl.removeUIID(this.uiid);
        this.uiid = uiid;
        this.canRemoveUIID = uiid;
        gUICtrl.addUIID(uiid, this);
    },

    getUIID: function() {
        return this.uiid;
    },


    reOpenUI() {

    },
    
    start() {
        var uiCfg = gUICfgs[this.uiid];
        // 取出__prevBackHandler
        if (!this.getParams()['backHandler']) {
            this.getParams()['backHandler'] = uiCfg && uiCfg.__prevBackHandler;
        }


        if (uiCfg && uiCfg.type == gE.VTYPE.SCENE) {

            if (!GameConfig.hasStarted) {
                GameConfig.hasStarted = true;
            }

            // 添加资源依赖
            // this.addDependentRes(gUICtrl.getScene().dependAssets.concat());

            this.node.on(cc.Node.EventType.TOUCH_START, this.onSceneTouchStart.bind(this));
            this.node.on(cc.Node.EventType.TOUCH_END, this.onSceneTouchEnd.bind(this));
        } else {
            // if (uiCfg && uiCfg.prefab) {
            //     this.addDependentRes(cc.loader.getDependsRecursively(uiCfg.prefab));
            // }
        }
        // 添加预先加载的依赖
        // if (uiCfg && uiCfg.depRes) {
        //     var depRes = uiCfg.depRes ? uiCfg.depRes.concat() : [];
        //     depRes.forEach(function(res) {
        //         this.addDependentRes(res.__realAssets);
        //         // this.addDependentRes(res.__realAssets.map(function(assets){
        //         //     return cc.loader.getDependsRecursively(assets);
        //         // }));
        //     }, this);
        // }

        if (this.uiid) {
            var alignNodes = [];
            if (!this.getComponent(cc.Canvas) || true) {
                alignNodes.push(this.node);
            }
            var wrapperNode = this.wrapperNode = this.node.getChildByName("wrapper");
            alignNodes.push(wrapperNode);
            if (wrapperNode) {
                // 添加遮罩处理
                // var maskComponent = wrapperNode.getComponent(cc.Mask);
                // if (!maskComponent) {
                //     maskComponent = wrapperNode.addComponent(cc.Mask);
                // }
                // maskComponent.type = cc.Mask.Type.RECT;
            }
            if (!uiCfg.noMargin) {
                for (var i = 0, len = alignNodes.length; i < len; ++i) {
                    var node = alignNodes[i];
                    if (!node) {
                        continue;
                    }
                    // 添加 异形屏处理
                    var useMargin = GameConfig.needScreenAdaptor && (uiCfg && !uiCfg.noAdaptorMargin) && (i == len - 1);
                    var marginTop = useMargin ? GameConfig.marginTop : 0;
                    var marginBottom = useMargin ? GameConfig.marginBottom : 0;
                    var marginLeft = 0;
                    var marginRight = 0;
                    var widget = node.getComponent(cc.Widget);
                    if (!widget) {
                        widget = node.addComponent(cc.Widget);
                    }
                    if (widget) {
                        widget.top = marginTop;
                        widget.bottom = marginBottom;
                        widget.left = marginLeft;
                        widget.right = marginRight;
                        widget.isAlignTop = widget.isAlignBottom = widget.isAlignLeft = widget.isAlignRight = true;
                        widget.updateAlignment();
                    }
                }
            }
        }

        if (!this.__beforeOpened && this.uiid) {
            NotifyMgr.send(AppNotify.OnViewOpened, this.uiid);
        }

        this.updateLocaleAlign();
    },

    update(dt) {
        //一秒检查一次
        if (!this.__framePassTime || this.__framePassTime <= 0) {
            this.__framePassTime = 1.0;
            //检查一次
            this.updateSecond();
        }
        this.__framePassTime -= dt;
        if (!this.willEmitClick) {
            this.willEmitClick = true;
        }
        if (this.callLaterHandlers && this.callLaterHandlers.length) {
            var handlers = this.callLaterHandlers.concat();
            for (var i = 0, len = handlers.length; i < len; ++i) {
                var handler = handlers[i];
                if (handler) {
                    var idx = this.callLaterHandlers.indexOf(handler);
                    if (idx != -1) {
                        this.callLaterHandlers.splice(idx, 1);
                    }
                    handler();
                }
            }
        }
    },
    /** 跳秒 */
    updateSecond() {
        //刷新红点
        if (!this.mRpBtnCaches || this.mRpBtnCaches.length == 0) {
            return;
        }
        //检查一次
        this.mRedPointJs.onUpdateSearchBtn(this);
    },
    removeSelf: function(closeAction) {
        var readyForBackHandler = function() {
            gUICtrl.removeNode(this.node);
            this.removeUIID();
        }.bind(this);

        this.readyForRemove(closeAction, readyForBackHandler);
    },
    removeUIID: function() {
        gUICtrl.removeUIID(this.canRemoveUIID);
        this.canRemoveUIID = null;
    },
    readyForRemove: function(closeAction, readyForBackHandler) {
        var uiCfg = gUICfgs[this.uiid];
        /** 非正常关闭 */
        this.closeAction = closeAction || BaseViewCloseAction.Back;
        this.isOpened = false;

        if (uiCfg && uiCfg.order != UIOrder.Toast) {
            gUICtrl.createBlockLayer(this);
        }
        if (this._params && this._params.closeHandler) {
            this._params.closeHandler();
        }
        if (this._params && this._params.backHandler) {
            switch (this.closeAction) {
                case BaseViewCloseAction.Back:
                    if (!this._params.backHandler(readyForBackHandler)) {
                        readyForBackHandler();
                    }
                    break;
                case BaseViewCloseAction.Forward:
                    if (uiCfg) {
                        uiCfg.__prevBackHandler = this._params.backHandler;
                    }
                    readyForBackHandler();
                    break;
                case BaseViewCloseAction.Abnormal:
                    readyForBackHandler();
                    break;
            }
        } else {
            readyForBackHandler();
        }
    },
    //isBanDoubleHit 是否禁止连点
    setClickEvent: function(btnNode, callback, isMute, useToggleSound, isBanDoubleHit, doubleHitTime, isIgnorSound) {
        if (btnNode == null || btnNode == undefined) {
            window.GameTool.error("btnNode == null");
            return;
        }
        if (btnNode instanceof cc.Component) {
            btnNode = btnNode.node;
        }
        var btnCom = btnNode.getComponent(cc.Button);
        if (!btnCom) {
            btnNode.addComponent(cc.Button);
        }
        if (callback) {
            // if (this._btnEvents[btnNode.uuid]) {
            //     this._btnEvents[btnNode.uuid] = callback;
            //     return;
            // }
            if (this.btnMap.get(btnNode)) {
                this.btnMap.set(btnNode, {
                    callback: callback,
                    isMute: isMute,
                    useToggleSound: useToggleSound,
                    isBanDoubleHit: isBanDoubleHit,
                    doubleHitTime: doubleHitTime,
                    isClicked: false,
                });
                return;
            }
            this.btnMap.set(btnNode, {
                callback: callback,
                isMute: isMute,
                useToggleSound: useToggleSound,
                isBanDoubleHit: isBanDoubleHit,
                doubleHitTime: doubleHitTime,
                isClicked: false,
                isIgnorSound: isIgnorSound
            });
            // this._btnEvents[btnNode.uuid] = callback;
            // this.btnMap.set(btnNode, callback);
            // var handler = this.onClickEvent.bind(this);
            // this.btnHandlers[btnNode.uuid] = handler;
            btnNode.on("click", this.clickHandler);
        } else {
            if(this.btnMap) {
                this.btnMap.remove(btnNode);
                btnNode.off("click", this.clickHandler);
            }
        }
    },

    setCheckEvent: function(checkNode, callback, isMute, useToggleSound) {
        if (checkNode == null || checkNode == undefined) {
            window.GameTool.error("checkNode == null");
        }
        if (checkNode instanceof cc.Component) {
            checkNode = checkNode.node;
        }
        if (callback) {
            if (this.btnMap.get(checkNode)) {
                this.btnMap.set(checkNode, {
                    callback: callback,
                    isMute: isMute,
                    useToggleSound: useToggleSound,
                });
                return;
            }
            this.btnMap.set(checkNode, {
                callback: callback,
                isMute: isMute,
                useToggleSound: useToggleSound,
            });
            checkNode.on("toggle", this.clickHandler);
        } else {
            this.btnMap.remove(checkNode);
            checkNode.off("toggle", this.clickHandler);
        }
    },

    onClickEvent(button) {
        if (this.isOpened != null && !this.isOpened) {
            GameTool.warn("View will be closed!");
            return;
        }
        
        GameData.SoundProxy.playClickSound();
        this.willEmitClick = false;

        let btnNode = button.node;
        
        var btnData = this.btnMap.get(btnNode);
        if (btnData) {
            if (btnData.isBanDoubleHit) {
                if (btnData.isClicked)
                    return;
                if (!btnData.isMute) {
                    var isButtonSound = !btnData.useToggleSound;
                    // if (button instanceof cc.Toggle) {
                    //     if (!button.getComponent("HoverToggle")) {
                    //         isButtonSound = false;
                    //     }
                    // }
                    // if (isButtonSound) {
                    //     GameData.SoundProxy.playClickSound();
                    // } else {
                    //     GameData.SoundProxy.playToggleSound();
                    // }
                }
                btnData.callback && btnData.callback(btnNode, button);
                btnData.isClicked = true;
                button.scheduleOnce(function() {
                    btnData.isClicked = false
                }, btnData.doubleHitTime);
            } else {
                if (!btnData.isMute) {
                    var isButtonSound = !btnData.useToggleSound;
                    // if (button instanceof cc.Toggle) {
                    //     if (!button.getComponent("HoverToggle")) {
                    //         isButtonSound = false;
                    //     }
                    // }
                    // if (isButtonSound) {
                    //     GameData.SoundProxy.playClickSound();
                    // } else {
                    //     GameData.SoundProxy.playToggleSound();
                    // }
                }
                btnData.callback && btnData.callback(btnNode, button);
            }
        }

    },

    loadBtnLockCfgs() {
        if (this.getUIID() == 1000) {
            return;
        }
    },

    //刷新按钮锁定逻辑
    reloadBtnStates(params, openLvStyle) {
        if (this.uiid == 0 || this.uiid == 1000) {
            return;
        }
        let mMainScneJs = gUICtrl.getMainScene();
        if (!mMainScneJs) {
            return;
        }
        this.mRpBtnCaches = [];
        mMainScneJs.getComponent("ButtonCtrl").updateViewBtnStates(this, params, openLvStyle);
    },

    //刷新红点
    reloadRedPoints() {
        if (this.uiid == 0 || this.uiid == 1000) {
            return;
        }
        let mMainScneJs = gUICtrl.getMainScene();
        if (!mMainScneJs) {
            return;
        }
        this.mRedPointJs = mMainScneJs.getComponent("RedPointCtrl");
        this.mRedPointJs.updateViewRedPointStates(this);
    },

    //红点未找到的按钮缓存
    addCacheRedPointBtn(rpCfg, datas) {
        if (!this.mRpBtnCaches) {
            this.mRpBtnCaches = [];
        }
        let isIn = false;
        for (var i = this.mRpBtnCaches.length - 1; i >= 0; i--) {
            if (this.mRpBtnCaches[i]["cfg"] == rpCfg && this.mRedPointJs.checkData(this.mRpBtnCaches[i]["datas"], datas)) {
                isIn = true;
            }
        }
        if (isIn) {
            return;
        }
        this.mRpBtnCaches.push({
            "cfg": rpCfg,
            "datas": datas
        });
    },
    //移除红点缓存
    removeCahceRedPointBtn(rpCfg, datas) {
        if (!this.mRpBtnCaches) {
            return;
        }
        for (var i = this.mRpBtnCaches.length - 1; i >= 0; i--) {
            if (this.mRpBtnCaches[i]["cfg"] == rpCfg && this.mRedPointJs.checkData(this.mRpBtnCaches[i]["datas"], datas)) {
                this.mRpBtnCaches.splice(i);
            }
        }
    },
    //获取红点缓存
    getRPBtnCache() {
        return this.mRpBtnCaches;
    },

    setUIString: function(labelname, node, str) {
        let label = this._cacheCompones[labelname + "_" + node.uuid];
        if (label) {
            label.string = str;
            return label;
        }
        let labelnode = cc.find(labelname, node);
        if (labelnode != null) {
            label = labelnode.getComponent("cc.Label");
            if (label) {
                label.string = str;
                this._cacheCompones[labelname + "_" + node.uuid] = label;
            }
        }
        return label;

    },

    setUIRichText: function(labelname, node, str) {
        str = str + "";
        let label = this._cacheCompones[labelname + "_" + node.uuid];
        if (label) {
            label.string = str;
            return label;
        }
        let labelnode = cc.find(labelname, node);
        if (labelnode != null) {
            label = labelnode.getComponent("cc.RichText");
            if (label) {
                label.string = str;
                this._cacheCompones[labelname + "_" + node.uuid] = label;
            }
        }
        return label;
    },

    setBtnEnable(btnNode, isEnabled, labelName) {
        if (!btnNode) {
            return;
        }
        let btn = btnNode.getComponent(cc.Button);
        if (!btn) {
            btn = btnNode.getComponent(cc.Toggle);
        }
        if (!btn) {
            return;
        }
        btn.interactable = isEnabled;
        if (!labelName) {
            return;
        }
        let labelNode = cc.find(labelName, btnNode);
        if (!labelNode) {
            return;
        }
        let labelOutline = labelNode.getComponent(cc.LabelOutline);
        if (labelOutline && !labelNode.initialOutLine) {
            labelNode.initialOutLine = labelOutline.color.clone();
        }
        if (!labelNode.initialColor) {
            labelNode.initialColor = labelNode.color.clone();
        }
        if (labelOutline) {
            var color = new cc.Color();
            labelOutline.color = isEnabled ? labelNode.initialOutLine : color.fromHEX("#54595e");
        }
        var color1 = new cc.Color();
        labelNode.color = isEnabled ? labelNode.initialColor : color1.fromHEX("#FFFFFF");
    },

    setUIImage: function(spname, node, img) {
        let sprite = this._cacheCompones[spname + "_" + node.uuid];
        if (sprite) {
            window.gFuncs.setSpFrame(sprite, img);
            return sprite;
        }
        sprite = cc.find(spname, node);
        if (sprite) {
            window.gFuncs.setSpFrame(sprite, img);
            this._cacheCompones[spname + "_" + node.uuid] = sprite;
        }
        return sprite;
    },

    getUINode(nodeName, node) {
        let tempNode = this._cacheCompones[nodeName + "_" + node.uuid];
        if (tempNode) {
            return tempNode;
        }
        let tempNodenode = cc.find(nodeName, node);
        if (tempNodenode != null) {
            this._cacheCompones[nodeName + "_" + node.uuid] = tempNode;
        }
        return tempNode;
    },

    setDataCom(node, params) {
        var dataCom = node.getComponent("DataCom");
        if (!dataCom) {
            dataCom = node.addComponent("DataCom");
        }
        dataCom.setParams(params);
    },

    getDataCom(node) {
        return node.getComponent("DataCom").getParams();
    },
    onAnimationStopped(eventName, state) {
        var animation = state.animation;
        if (!animation) {
            return;
        }
        var handler = this.animationCbMap.get(state.name);
        if (handler) {
            handler(state.name);
        }
    },
    //播放动画
    play(aniName, isLoop, callback, isAdditive, node, isReverse) {
        var animation = (node || this.node).getComponent(cc.Animation);
        if (!animation) {
            callback && callback();
            return;
        }
        var handler = this.animationCbMap.get(animation);
        if (!handler) {
            this.animationCbMap.set(aniName, callback);
            this.animationStoppedHanlder = this.animationStoppedHanlder || this.onAnimationStopped.bind(this);
            animation.on("finished", this.animationStoppedHanlder);
        } else {
            this.animationCbMap.set(aniName, callback);
        }
        let animState;
        if (isAdditive) {
            animState = animation.playAdditive(aniName);
        } else {
            animState = animation.play(aniName);
        }
        if (!animState) {
            callback && callback(this);
            GameTool.error("get animState aniName = {0} play faild", aniName);
            return;
        }
        animState.animation = animation;
        animState.wrapMode = isLoop ? isReverse ? cc.WrapMode.LoopReverse : cc.WrapMode.Loop : isReverse ? cc.WrapMode.Reverse : cc.WrapMode.Normal;
        animState.repeatCount = isLoop ? Infinity : 1;
        return animState;
    },

    //停止动画
    stop(aniName, node) {
        var animation = (node || this.node).getComponent(cc.Animation);
        if (!animation) {
            GameTool.error("aniName = {0} stop faild", aniName);
            return;
        }
        if (!animation) {
            GameTool.error("aniName = {0} stop faild", aniName);
            return;
        }
        animation.stop(aniName);
    },

    //暂停
    pause(aniName, node) {
        var animation = (node || this.node).getComponent(cc.Animation);
        if (!animation) {
            GameTool.error("aniName = {0} pause faild", aniName);
            return;
        }
        if (!animation) {
            GameTool.error("aniName = {0} pause faild", aniName);
            return;
        }
        animation.pause(aniName);
    },

    //重新播放
    resume(aniName, node) {
        var animation = (node || this.node).getComponent(cc.Animation);
        if (!animation) {
            GameTool.error("aniName = {0} resume faild", aniName);
            return;
        }
        if (!animation) {
            GameTool.error("aniName = {0} resume faild", aniName);
            return;
        }
        animation.resume(aniName);
    },

    //播放动画
    stopAni(aniName, node) {
        var animation = (node || this.node).getComponent(cc.Animation);
        if (!animation) {
            //GameTool.log("aniName = {0} play faild", aniName);
            return;
        }
        animation.play(aniName);
    },
    playSound(audioIDOrURL, onBegin, onEnd, manualRemove) {
        GameData.SoundProxy.playSound(audioIDOrURL, function(audioID) {
            onBegin && onBegin(audioID);
            if (!manualRemove) {
                this.soundMap && this.soundMap.set(audioID, true);
            }
        }.bind(this), function(audioID) {
            onEnd && onEnd(audioID);
            if (!manualRemove) {
                this.soundMap && this.soundMap.remove(audioID);
            }
        }.bind(this));
    },
    showFlyItems(itemInfos, posOrTarget, isMute, parent, offset) {
        GameTool.showFlyItems(itemInfos, posOrTarget, isMute, parent || this.node.getChildByName("wrapper") || this.node, offset);
    },
    showFlyTexts(contents, posOrTarget, isMute, parent, color, offset, time, distance, isChild) {
        if (!isChild) {
            GameTool.showFlyTexts(contents, posOrTarget, isMute, parent || this.node.getChildByName("wrapper") || this.node, color, offset, time, distance);
        } else {
            GameData.ChildProxy.showFlyTexts(contents, posOrTarget, isMute, parent || this.node.getChildByName("wrapper") || this.node, color, offset, time, distance);
        }
    },
    showItemReward(itemInfos, backHandler) {
        GameTool.showItemReward(itemInfos, backHandler);
    },
    _handleNotification: function(key, data) {
        switch (key) {
            case AppNotify.LocaleChange:
                this.updateLocaleAlign();
                break;
        }
        if (this.handleNotification) {
            this.handleNotification.apply(this, arguments);
        }
    },
    _listNotificationInterests: function() {
        return [
            AppNotify.LocaleChange,
            AppNotify.ConnectClosed,
            AppNotify.ConnectSuccess,
        ].concat(
            this.listNotificationInterests()
        );
    },
    listNotificationInterests: function() {
        return [];
    },
    getContainer: function() {
        return this.node.getChildByName("wrapper") || this.node;
    },

    registerReminder(reminderType, handler) {
        //GameData.ReminderProxy.registerReminder(this, reminderType, handler);
    },
    callLater(handler) {
        this.callLaterHandlers.push(handler);
    },
    showToast: function(content) {
        GameTool.showToast(content, this);
    },
    /** 添加资源依赖，界面被删除时会将指定资源清理 */
    addDependentRes: function(res) {
        if (!this.dependentRes) {
            this.dependentRes = [];
        }
        if (res instanceof Array) {
            for (var i = 0, len = res.length; i < len; ++i) {
                this.addDependentRes(res[i]);
            }
        } else {
            if (this.dependentRes.indexOf(res) == -1) {
                gUICtrl.addResRecord(res);
                this.dependentRes.push(res);
            }
        }
    },
    clearDependentRes() {
        if (this.reserveDependentRes || !this.dependentRes) {
            return;
        }
        gUICtrl.delResRecord(this.dependentRes);
        this.dependentRes.length = 0;
    },
    setSpFrame(sprite, resurl, callback, notEmpty) {
        if (resurl == "") {
            GameTool.warn("resurl = ");
            return;
        }
        if (!resurl) {
            GameTool.error("resurl = undefine");
            return;
        }
        if (sprite == null) {
            if (callback) {
                callback(false);
                callback = null;
            }
            return;
        }
        if (!(sprite instanceof cc.Sprite)) {
            let tmpSp = sprite.getComponent(cc.Sprite);
            if (tmpSp == null) {
                sprite = sprite.addComponent(cc.Sprite);
                sprite.sizeMode = 0;
            } else {
                sprite = tmpSp;
            }
        }
        // if (sprite.realurl == resurl) {
        //     return;
        // }
        sprite.realurl = resurl;
        if (!notEmpty) {
            sprite.spriteFrame = null;
        }
        this.createSpFrame(resurl, function(spriteFrame, err) {
            if (!cc.isValid(sprite.node)) {
                return;
            }
            if (sprite.spriteFrame != spriteFrame && sprite.realurl == resurl) {
                sprite.spriteFrame = spriteFrame;
            }
            if (callback) {
                callback(spriteFrame);
                callback = null;
            }
        });
    },
    //获得一个精灵纹理
    createSpFrame(resurl, callback, isCachedDelay) {
        if (!this.__SpFrameCaches) {
            this.__SpFrameCaches = {};
        }
        if (this.__SpFrameCaches[resurl]) {
            if (callback) {
                if (isCachedDelay) {
                    setTimeout(function() {
                        callback(this.__SpFrameCaches[resurl]);
                        callback = null;
                    }, 1);
                } else {
                    callback(this.__SpFrameCaches[resurl]);
                    callback = null;
                }
            }
            return;
        };
        cc.resources.load(resurl, cc.SpriteFrame, function(err, spriteFrame) {
            if (err) {
                GameTool.error('load error ,' + err);
                // this.createSpFrame("img/100838", callback);
                return;
            }
            if (!(spriteFrame instanceof cc.SpriteFrame)) {
                GameTool.error('load file not a spriteFrame');
                // this.createSpFrame("img/100838", callback);
                return;
                return;
            }
            if (callback != null && callback != undefined) {
                callback(spriteFrame);
                callback = null;
            }
            // this.addDependentRes(cc.loader.getDependsRecursively(spriteFrame));
            this.__SpFrameCaches[resurl] = spriteFrame;
        }.bind(this));
    },
    needAutoAlign() {
        var result = true;
        if (this.isAutoAlign != null && this.isAutoAlign == false) {
            result = false;
        }
        if (!this.uiid && !this.isAutoAlign) {
            result = false;
        }
        return result;
    },

    updateLocaleAlign(isUpdate) {
        var uiCfg = gUICfgs[this.uiid];
    },

    toggleWrapperActive(isActive) {
        if (this.wrapperNode) {
            // this.wrapperNode.opacity = isActive ? 255 : 0;
            if (!isActive) {
                if (!this.wrapperNode.oldOpacity) {
                    this.wrapperNode.oldOpacity = this.wrapperNode.opacity;
                    this.wrapperNode.opacity = 0;
                }
            } else {
                if (this.wrapperNode.oldOpacity) {
                    this.wrapperNode.opacity = this.wrapperNode.oldOpacity
                    this.wrapperNode.oldOpacity = null;
                }
            }
        }
    },

    //创建一个蒙板隔绝点击
    createNodeShade(parent, callFunction) {
        let maskNode = parent.getChildByName("maskNode");
        if (!maskNode) {
            maskNode = new cc.Node();
            maskNode.width = parent.width;
            maskNode.height = parent.height;
            maskNode.setName("maskNode");
            maskNode.parent = parent;
            maskNode.zIndex = 999999;
            maskNode.addComponent(cc.Button);
        }
        if (callFunction) {
            this.setClickEvent(maskNode, callFunction);
        }
        maskNode.active = true;
        this.maskNode = maskNode;
    },

    hideNodeShade() {
        if (cc.isValid(this.maskNode)) {
            this.maskNode.active = false;
        }
    },
});
