require("UICfgs")
let uiids = window.gUIIDs;
let uiCfgs = window.gUICfgs;
//UI类型
let TYPE_DIALOG = gE.VTYPE.DIALOG;
let TYPE_SCENE = gE.VTYPE.SCENE;
let TYPE_VIEW = gE.VTYPE.VIEW;
let TYPE_FULLVIEW = gE.VTYPE.FULLVIEW;
//层级
let MAXORDER = gE.ORDER.MAX;
let HIGHORDER = gE.ORDER.HEIGHT;
let openedUIIDs = [];
let openUICallbackMap = {};
let recvCmdBindMap = {};
//特殊控件tag
let mLoadingProgressNode = null;

//新手引导(功能开放常驻节点)
let mIndicatorNode = null;
//界面管理
let allUIs = {};
let allDialogs = [];
let prefabCache = {};
let mBigNodes = [];
let winResizeCallbacks = [];

let savedUIID = [];
let savedParams = [];

var ZMClubPage = require("../../subPacket/ZMClubPage");
var ZMFriendPage = require('../../subPacket/ZMFriendPage');
var ZMRankPage = require('../../subPacket/ZMRankPage');
var ZMTaskPage = require('../../subPacket/ZMTaskPage');
var ZMBoostsPage = require('../../subPacket/ZMBoostsPage');
var ZMWalletsPage = require('../../subPacket/ZMWalletsPage');

var RankExitClubTip = require("../../subPacket/tips/RankExitClubTip");
var RankJoinClubTip = require('../../subPacket/tips/RankJoinClubTip');
var RankRewardClub = require('../../subPacket/tips/RankRewardClub');
var RankRewardTip = require('../../subPacket/tips/RankRewardTip');
var RankRewardPanel = require('../../subPacket/tips/RankRewardPanel');
var InSufCouponsTip = require('../../subPacket/tips/InSufCouponsTip');
var InSufEnergyTip = require('../../subPacket/tips/InSufEnergyTip');
var FinishToturialTip = require('../../subPacket/tips/FinishToturialTip');
var SettingTip = require('../../subPacket/ZMSettingPage');

var gUICtrl = window.gUICtrl = {
    init() {

    },

    closeOneLevelPanel: function() {
        let maskUIIDs = [uiids.UI_FRIEND_PAGE,uiids.UI_RANK_PAGE,uiids.UI_CLUB_PAGE,uiids.UI_TASKS,uiids.UI_BOOSTS_PAGE,uiids.UI_WALLET_PAGE];
        let instances = [ZMFriendPage,ZMRankPage,ZMClubPage,ZMTaskPage, ZMBoostsPage,ZMWalletsPage];
        for(let i = openedUIIDs.length -1; i >= 0; i--) {
            let tempUiid = openedUIIDs[i];
            let index = maskUIIDs.indexOf(tempUiid);            // 如果是打开了这个面板...
            if(index >= 0) {                // 如果打开了这个面板，并且这个面板还不是uiid面板...
                instances[index].instance.removeSelf();
                break;
            }
        }
    },

    closeOneLevelPanelByUIID: function(uiid,saved) {
        let maskUIIDs = [uiids.UI_FRIEND_PAGE,uiids.UI_RANK_PAGE,uiids.UI_CLUB_PAGE,uiids.UI_TASKS,uiids.UI_BOOSTS_PAGE,uiids.UI_WALLET_PAGE];
        let instances = [ZMFriendPage,ZMRankPage,ZMClubPage,ZMTaskPage, ZMBoostsPage,ZMWalletsPage];
        let isOneLevel = maskUIIDs.indexOf(uiid) >= 0;
        for(let i = openedUIIDs.length -1; i >= 0; i--) {
            let tempUiid = openedUIIDs[i];
            let index = maskUIIDs.indexOf(tempUiid);            // 如果是打开了这个面板...
            if(isOneLevel && index >= 0 && tempUiid != uiid) {                // 如果打开了这个面板，并且这个面板还不是uiid面板...
                instances[index].instance.removeSelf();
                if(saved) {
                    this.savePrePage(tempUiid);
                }
                break;
            }
        }
    },

    addDialog:function() {

    },

    isResultPageOpened:function() {
        let bo = openedUIIDs.indexOf(uiids.UI_RESULT_PAGE) >= 0;
        return bo;
    },

    closeInstance:function() {
        let maskUIIDs = [uiids.UI_FRIEND_PAGE,uiids.UI_RANK_PAGE,uiids.UI_CLUB_PAGE,uiids.UI_TASKS,
            uiids.UI_RANK_EXIT_TIP,uiids.UI_RANK_JOIN_TIP,uiids.UI_RANK_REWARD_CLUB,uiids.UI_RANK_REWARD_TIP,uiids.UI_RANK_REWARD_PANEL,
            uiids.UI_INSUF_COUPONS,uiids.UI_INSUF_ENERGY,uiids.FINISH_TOTURIAL_TIP,uiids.SETTING_TIP,uiids.UI_BOOSTS_PAGE,uiids.UI_WALLET_PAGE
        ];

        let instances = [ZMFriendPage,ZMRankPage,ZMClubPage,ZMTaskPage,RankExitClubTip,
            RankJoinClubTip,RankRewardClub,RankRewardTip,RankRewardPanel,
            InSufCouponsTip,InSufEnergyTip,FinishToturialTip,SettingTip, ZMBoostsPage,ZMWalletsPage
        ];
        for(let i = openedUIIDs.length -1; i >= 0; i--) {
            let uiid = openedUIIDs[i];
            let index = maskUIIDs.indexOf(uiid);
            if(index >= 0) {
                if(savedUIID.length > 0) {
                    let uiid = savedUIID.pop();
                    let params = savedParams.pop();
                    gUICtrl.openUI(uiid, null, params);
                } else {
                    instances[index].instance.removeSelf();
                }
                break;
            }
        }
    },

    /** 打开的面板是否是第一面板 */
    isOneLevelPanel: function(uiid) {
        let maskUIIDs = [uiids.UI_FRIEND_PAGE,uiids.UI_RANK_PAGE,uiids.UI_CLUB_PAGE,uiids.UI_TASKS,uiids.UI_BOOSTS_PAGE,uiids.UI_WALLET_PAGE];
        let bo = false;
        for(let i = 0; i < maskUIIDs.length; i++) {
            let theTempUiid = maskUIIDs[i];
            if(theTempUiid == uiid) {
                bo = true;
                break;
            }
        }
        return bo;
    },

    /** 是回退，还是关闭按钮呢 */
    isShouldClose: function() {
        let maskUIIDs = [uiids.UI_FRIEND_PAGE,uiids.UI_RANK_PAGE,uiids.UI_CLUB_PAGE,uiids.UI_TASKS,uiids.UI_BOOSTS_PAGE,uiids.UI_WALLET_PAGE];
        let openUIs = openedUIIDs;
        let shouldClose = true;
        for(let i = 0; i < maskUIIDs.length; i++) {
            let uiid = maskUIIDs[i];
            if(openUIs.indexOf(uiid) >= 0) {
                shouldClose = false;
                break;
            }
        }
        if(shouldClose && window.Telegram) {
            let bo = gUICtrl.isResultPageOpened()
            let telegramUtil = require('./TelegramUtils');
            if(bo) {
                telegramUtil.onSetBgColor(HEAD_COLORS.RESULT);
                telegramUtil.onSetHeaderColor(HEAD_COLORS.RESULT);
            } else {
                telegramUtil.onSetBgColor(HEAD_COLORS.PREFAB);
                telegramUtil.onSetHeaderColor(HEAD_COLORS.PREFAB);
            }
        }
        return shouldClose;
    },

    savePrePage(uiid) {
        savedUIID.push(uiid);

        let maskUIIDs = [uiids.UI_FRIEND_PAGE,uiids.UI_RANK_PAGE,uiids.UI_CLUB_PAGE,uiids.UI_TASKS,
            uiids.UI_RANK_EXIT_TIP,uiids.UI_RANK_JOIN_TIP,uiids.UI_RANK_REWARD_CLUB,uiids.UI_RANK_REWARD_TIP,uiids.UI_RANK_REWARD_PANEL,
            uiids.UI_INSUF_COUPONS,uiids.UI_INSUF_ENERGY,uiids.FINISH_TOTURIAL_TIP,uiids.SETTING_TIP,uiids.UI_BOOSTS_PAGE,uiids.UI_WALLET_PAGE
        ];

        let instances = [ZMFriendPage,ZMRankPage,ZMClubPage,ZMTaskPage,RankExitClubTip,
            RankJoinClubTip,RankRewardClub,RankRewardTip,RankRewardPanel,
            InSufCouponsTip,InSufEnergyTip,FinishToturialTip,SettingTip, ZMBoostsPage,ZMWalletsPage
        ];
        let index = maskUIIDs.indexOf(uiid);
        let params = instances[index].instance.getParams();
        savedParams.push(params);
    },

    /** 是否需要在关闭之后，打开之前被关闭的面板呢... */
    openUI: function(uiid, callback, params, saveOpened) {
        if(uiid == 1000) {
            return;
        }

        let uicfg = uiCfgs[uiid];
        if(uicfg == null || uicfg == undefined) {
            console.log("error uiid");
            return true;
        }

        // 如果是在主场景，判断这个ui是否是被锁定的一个状态
        var noLoading = uicfg.order == UIOrder.Toast || uicfg.noLoading;
        //如果没有透传参数，那么使用默认的透传参数
        params = params ? params : uicfg.defaultParams;
        //如果没有依附的父界面
        while (uicfg.parentUI) {
            uiid = uicfg.parentUI;
            uicfg = uiCfgs[uiid];
        }
        console.log("openUI", uicfg, params);

        setTimeout(()=>{
            this.closeOneLevelPanelByUIID(uiid,saveOpened);
        }, 100);
        

        // 加载一个场景
        if(this.isUICreateFinish(uiid, uicfg, params, callback)) {
            return;
        }
        var setUICfgHandler = this.setUICfg.bind(this);
        openUICallbackMap[uiid] = setUICfgHandler;
        openedUIIDs.push(uiid);

        var onDepResReady = (function() {
            this.createUIByRes(uicfg.res, function(prefab, err) {
                let notScale = [
                    gUIIDs.UI_CheckPoint,
                    gUIIDs.UI_Chapter,
                    gUIIDs.UI_ChapterBoss,
                    gUIIDs.UI_GameDrama,
                    // gUIIDs.UI_Bag,
                    // gUIIDs.UI_Prison,
                    gUIIDs.UI_Imperial,
                    gUIIDs.UI_FindRecover,
                ]
                if (notScale.indexOf(uiid) == -1) {
                    prefab.scaleX = prefab.scaleY = 1
                }
                if (openedUIIDs.indexOf(uiid) != -1 && openUICallbackMap[uiid]) {
                    openUICallbackMap[uiid](uiid, uicfg, prefab, params, callback);
                }
                var handler = openUICallbackMap
            }.bind(this), noLoading);
        }).bind(this);
        // 加载依赖资源
        this.loadDepRes(uicfg, onDepResReady, noLoading);
    },

    //设置打开的ui属性
    setUICfg(uiid, uicfg, prefab, params, callback) {
        let prefabNode = cc.instantiate(prefab);
        if (!prefabNode) {
            var isBattleField = uicfg.js == "ZMCheckPoint" ? true : false;
            if(isBattleField) 
            {
                var data = GameData.ChapterProxy.data;
                var plusData = {
                    "resource_id":data.chapterId,               // 这个可能需要服务器来下发...
                    "resource_name":"ZMCheckPoint",      
                    "resource_load_scene": data.chapterId + "_" + data.lvId,
                    "load_result":0,
                };
                gGameCmd.sendLog(gE.USER_LOG.BATTLE_FIELD,null, plusData);
            }
            return;
        }

        var isBattleField = uicfg.js == "ZMCheckPoint" ? true : false;
        if(isBattleField ) 
        {
            var data = GameData.ChapterProxy.data;
            var plusData = {
                "resource_id":data.chapterId,               // 这个可能需要服务器来下发...
                "resource_name":"ZMCheckPoint",      
                "resource_load_scene": data.chapterId + "_" + data.lvId,
                "load_result":1,           // 成功了....
            };
            gGameCmd.sendLog(gE.USER_LOG.BATTLE_FIELD,null, plusData);
        }


        if ((uicfg.type == TYPE_VIEW || uicfg.type == TYPE_FULLVIEW) && callback != null && callback != undefined) {
            callback(prefabNode);
            return;
        }
        //传递透传参数
        let jsComponent;
        if (uicfg.js) {
            if (prefabNode.getComponent) {
                jsComponent = prefabNode.getComponent(uicfg.js);
                if (jsComponent) {
                    jsComponent.enabled = true;
                    jsComponent.uiid = uiid;
                    if (params) {
                        jsComponent.setParams(params);
                    }
                    let tmpEnable = jsComponent.onEnable.bind(jsComponent);
                    jsComponent.onEnable = function() {
                        try {
                            tmpEnable();
                        } catch (e) {
                            // statements
                            cc.error(e);
                        }
                    };
                    let tmpOnLoad = jsComponent.onLoad.bind(jsComponent);
                    jsComponent.onLoad = function() {
                        try {
                            tmpOnLoad();
                        } catch (e) {
                            // statements
                            cc.error(e);
                        }
                    };
                }
            }
        }
        uicfg.prefab = prefab;
        prefabNode.zIndex = (uicfg.order || 0);
        // prefabNode.zIndex = (uicfg.order || 0);
        // prefabNode.setPosition(cc.v2(this.winWidth() / 2 - prefabNode.width * (0.5 - prefabNode.anchorX), this.winHeight() / 2 - prefabNode.height * (0.5 - prefabNode.anchorY)));
        // if (!uicfg.noMargin) {
        //     var widget = prefabNode.getComponent(cc.Widget);
        //     if (!widget) {
        //         widget = prefabNode.addComponent(cc.Widget);
        //         // widget.updateAlignment();
        //     }
        //     widget.top = widget.bottom = widget.left = widget.right = 0;
        //     widget.isAlignTop = widget.isAlignBottom = widget.isAlignLeft = widget.isAlignRight = true;
        // }

        //设置控件属性
        if (jsComponent) {
            jsComponent.setUIID(uiid);
            // var wrapNode = jsComponent.node.getChildByName("wrapper");
            // if (wrapNode && jsComponent.isShowAni) {
            //     // if (isFull == 1) {
            //     wrapNode.opacity = (0);
            // }
        }
        if (uicfg.isPersist) {
            cc.game.addPersistRootNode(prefabNode);
        }
        var parent = this.getScene();
        if (uicfg.parent) {
            var parentUI = this.getUIByUIID(uicfg.parent);
            if (parentUI && parentUI.getContainer) {
                parent = parentUI.getContainer() || parent;
            }
        }
        prefabNode.parent = parent;
        if (callback != null && callback != undefined) {
            callback(prefabNode);
        }
        NotifyMgr.send(AppNotify.FinishUI);
    },

    getScene: function() {
        return cc.director.getScene();
    },

    addUIID: function(uiid, node) {
        for (var id in allUIs) {
            var idNode = allUIs[id];
            if (idNode == node) {
                delete allUIs[id];
            }
        }
        allUIs[uiid] = node;
        if (openedUIIDs.indexOf(uiid) == -1) {
            openedUIIDs.push(uiid);
        }
    },
    removeDialog(dialog) {
        for (let i = allDialogs.length - 1; i >= 0; i--) {
            if (allDialogs[i] == dialog) {
                allDialogs.splice(i, 1);
            }
        }
    },
    unUseDialog(dialog) {
        let uiid = dialog.getUIID();
        if (dialog.node) {
            var dialogBgNode = dialog.node.getChildByName("DialogBgNode");
            var wrapNode = dialog.node.getChildByName("wrapper");
            var completeCallback = (function() {
                if (uiCfgs[uiid] && uiCfgs[uiid]["isInstance"]) {
                    dialog.node.active = false;
                } else {
                    dialog.node.destroy();
                }
            }).bind(this);
            // if (wrapNode) {
            //     if (dialogBgNode) {
            //         dialogBgNode.runAction(cc.fadeTo(0.2, 0));
            //     }
            //     wrapNode.runAction(cc.sequence(cc.fadeTo(0.2, 0), cc.callFunc(completeCallback)))
            // } else {
            completeCallback();
            // }
        }
    },

    //构造一个弹窗背景
    createDialogBg: function(component, closeself) {
        let uicfg = uiCfgs[uiids.UI_DIALOGBG];

        if (component.getIsCloseSelf) {
            closeself = component.getIsCloseSelf()
        }

        var wrapNode = component.node.getChildByName("wrapper");
        component.isOpened = false;
        var completeCallback = (function() {
            component.isOpened = true;
            component.__beforeOpened && component.__beforeOpened();
            component.onActiveAniEnd();
        }).bind(this);
        let oldScale = wrapNode.scale;
        let isFull = component ? component.isFullDialog : 1;
        if (wrapNode && component.isShowAni) {
            // if (isFull == 1) {
            wrapNode.opacity = (0);
            // } else {
            //     wrapNode.setScale(0.5, 0.5);
            // }
        } else {
            completeCallback();
        }

        component.bounding = component.node.getBoundingBox();
        component.bounding.x = component.bounding.x + component.bounding.width / 2;
        component.bounding.y = component.bounding.y + component.bounding.height / 2;
        this.createUIByRes(uicfg.res, function(prefab, err) {
            if (wrapNode && component.isShowAni) {
                let action;
                // if (isFull == 1) {
                wrapNode.opacity = 0;
                action = cc.fadeTo(0.1, 255);
                
                wrapNode.runAction(
                    cc.sequence(
                        action,
                        cc.callFunc(completeCallback)
                    ),
                );
            } else {
                completeCallback();
            }
            // completeCallback();
            let prefabNode = cc.instantiate(prefab);
            prefabNode.getComponent("DialogBg").setDialogComponent(component, closeself);
            prefabNode.name = "DialogBgNode";
            var opacity = prefabNode.opacity;
            prefabNode.opacity = 0;
            if (component && component.node) {
                component.node.addChild(prefabNode, -9999);
            }
            if (component.isDialogBg) {
                prefabNode.getComponent("DialogBg").fadeInAction();
            }
            // completeCallback();
        }.bind(this));
    },

    //移除一个控件
    removeNode: function(node) {
        if (node != null && node != undefined && node.isValid) {
            node.destroy();
            node.parent = null;
        }
    },
    

    createBlockLayer(target) {
        if (target instanceof cc.Component) {
            target = target.node;
        }
        if (target && target.isValid && !target.__blockLayer) {
            var blockLayer = target.__blockLayer = new cc.Node();
            var widget = blockLayer.getComponent(cc.Widget);
            if (!widget) {
                widget = blockLayer.addComponent(cc.Widget);
                // widget.updateAlignment();
            }
            widget.top = widget.bottom = widget.left = widget.right = 0;
            widget.isAlignTop = widget.isAlignBottom = widget.isAlignLeft = widget.isAlignRight = true;
            blockLayer.addComponent(cc.BlockInputEvents);
            blockLayer.zIndex = (UIOrder.Block);
            target.addChild(blockLayer);
        }
    },

    removeUIID: function(uiid) {
        if (allUIs[uiid]) {
            delete allUIs[uiid];
        }
        var index = openedUIIDs.indexOf(uiid);
        if (index >= 0) {
            openedUIIDs.splice(index, 1);

            if (!uiCfgs[uiid].isPersist) {
                LeakManager.closePrefab(uiCfgs[uiid].res);
            }
        }
    },

    getMainScene() {
        return this.getUIByUIID(window.gUIIDs.UI_MAINSCENE);
    },

    checkDepRes: function(depRes) {
        var loaded = depRes.every(function(dep) {
            return dep.__loaded;
        });
        return loaded;
    },


    loadDepRes(uicfg, onDepResReady, noLoading) {
        var depRes = uicfg.depRes ? uicfg.depRes.concat() : [];
        // if (uicfg.type == TYPE_DIALOG) {
        //     let dialogCfg = uiCfgs[uiids.UI_DIALOGBG];
        //     depRes.push({
        //         type: cc.Prefab,
        //         res: dialogCfg.res,
        //     });
        // }
        if (depRes.length == 0) {
            if (this.checkDepRes(depRes)) {
                onDepResReady && onDepResReady();
            }
            return;
        }
        for (var i = 0, len = depRes.length; i < len; ++i) {
            var dep = depRes[i];
            dep.__loaded = false;
            dep.__realRes = [];
            dep.__loadedCount = 0;
        }
        for (var i = 0, len = depRes.length; i < len; ++i) {
            var dep = depRes[i];
            // dep.__loaded = false;
            // dep.__realRes = [];
            // dep.__loadedCount = 0;
            try {
                if (dep.res instanceof Function) {
                    dep.__realRes = dep.res();
                } else if (dep.res instanceof Array) {
                    dep.__realRes = dep.res.concat();
                } else {
                    dep.__realRes = [dep.res];
                }
                if (!(dep.__realRes instanceof Array)) {
                    dep.__realRes = [dep.__realRes];
                }
            } catch (error) {
                GameTool.error(error);
            }
            var loadedCb = function(dep, ii) {
                ++dep.__loadedCount;
                dep.__loaded = dep.__realRes.length <= dep.__loadedCount;
                if (!noLoading) {
                    this.hideLoadingProgress(dep.__realRes[ii]);
                }
                if (this.checkDepRes(depRes)) {
                    onDepResReady && onDepResReady();
                }
            }.bind(this, dep);
            for (var ii = 0; ii < dep.__realRes.length; ++ii) {
                if (!noLoading) {
                    this.showLoadingProgress(dep.__realRes[ii]);
                }
                switch (dep.type) {
                    case cc.SpriteFrame:
                        gFuncs.createSpFrame(dep.__realRes[ii], loadedCb.bind(this, dep, ii));
                        break;
                    case cc.SpriteAtlas:
                        gFuncs.getSpriteAtlas(dep.__realRes[ii], loadedCb.bind(this, dep, ii));
                        break;
                    case cc.Prefab:
                        gFuncs.createPrefab(dep.__realRes[ii], loadedCb.bind(this, dep, ii));
                        break;
                    case cc.AudioClip:
                        gFuncs.getAudioClip(dep.__realRes[ii], loadedCb.bind(this, dep, ii));
                        break;
                    case cc.Asset:
                        gFuncs.getAsset(dep.__realRes[ii], loadedCb.bind(this, dep, ii));
                        break;
                    default:
                        var sendData = dep.__realRes[ii];
                        var bindCbs = recvCmdBindMap[sendData.rKey];
                        if (!bindCbs) {
                            bindCbs = [];
                            recvCmdBindMap[sendData.rKey] = bindCbs;
                        }
                        bindCbs.push(loadedCb.bind(this, dep, ii));
                        gGameCmd.sendCmd(sendData.key, sendData.parm, sendData.rKey);
                        break;
                }
            }
        }
    },


    

    //构造ui的通用方法
    createUIByRes: function(resurl, callback, noLoading) {
        // 缓存中获取
        // if (prefabCache[resurl] != undefined) {
        //     callback(prefabCache[resurl]);
        //     return;
        // }
        if (!noLoading) {
            this.showLoadingProgress(resurl);
        }

        let mainHome = cc.director.getScene().getChildByName("Canvas").getComponent("ZMMainHome");
        
        
        if(mainHome) {
            let panels = mainHome.getPanelsNode();
            if(panels) {
                let nameOfPrefab = resurl.substring(resurl.lastIndexOf("/")+1);

                let prefab = panels.getChildByName(nameOfPrefab);
                prefab.active = true;
                if (!noLoading) {
                    this.hideLoadingProgress(resurl);
                }
                if (prefab == null || prefab == undefined) {
                    if (callback != null && callback != undefined) {
                        callback(null, err);
                    }
                    return;
                }
                prefabCache[resurl] = prefab
        
                if (callback != null && callback != undefined) {
                    callback(prefab);
                }
            }
        } else {
            gFuncs.createPrefab(resurl, function(prefab, err) {
                if (!noLoading) {
                    this.hideLoadingProgress(resurl);
                }
                if (prefab == null || prefab == undefined) {
                    if (callback != null && callback != undefined) {
                        callback(null, err);
                    }
                    return;
                }
                prefabCache[resurl] = prefab

                if (callback != null && callback != undefined) {
                    callback(prefab);
                }
            }.bind(this));
        }

    },

    getUIByUIID(uiid) {
        if (allUIs[uiid]) {
            return allUIs[uiid];
        }
        return null;
    },

    //ui是否构造结束
    isUICreateFinish(uiid, uicfg, params, callback) {
        if (uicfg == null || uicfg == undefined) {
            return true;
        }
        if (!uicfg.allowMulti) {
            var index = openedUIIDs.indexOf(uiid);
            if (index >= 0) {
                return true;
            }
        }

        if (uicfg.type == TYPE_SCENE) {
            console.log('pre load scene start')
            cc.director.preloadScene(uicfg.res, function(completedCount, totalCount, item) {

            }, function() {
                console.log('pre load scene end')
                LeakManager.openScene(uicfg.res);
                console.log('load scene start')
                cc.director.loadScene(uicfg.res, function(error) {
                    console.log('load scene end')
                    if (error) {
                        GameTool.showAlert("Load timeout, please refresh the web page.", function() {
                            window.location.reload()
                        }, null, AlertButtonType.CONFIRM)
                    }
                    this.hideLoadingProgress(uicfg.res);
                    if (callback) {
                        callback();
                    }
                    NotifyMgr.send(AppNotify.FinishUI);
                }.bind(this));
            }.bind(this));
            return true;
        }
        return false;

    },

    initLoadingProgress() {
        this.openUI(uiids.UI_LOADINGPROGRESS, function(prefabNode) {
            cc.game.addPersistRootNode(prefabNode);
            mLoadingProgressNode = prefabNode;
        }.bind(this));
    },

    //显示等待转圈
    showLoadingProgress(cmdKey, tiemOutTime, isTrigger, needReconnect, noLoading) {
        if (mLoadingProgressNode) {
            let lpjs = mLoadingProgressNode.getComponent("LoadingProgress");
            lpjs.addWaitCmd(cmdKey, tiemOutTime, isTrigger, needReconnect, noLoading);
        } else {
            this.initLoadingProgress();
        }
    },
    triggerLoadingProgress(cmdKey) {
        if (mLoadingProgressNode) {
            let lpjs = mLoadingProgressNode.getComponent("LoadingProgress");
            lpjs.triggerCmd(cmdKey);
        } else {
            this.initLoadingProgress();
        }
    },
    //隐藏转圈等待
    hideLoadingProgress(cmdKey) {
        if (mLoadingProgressNode) {
            let lpjs = mLoadingProgressNode.getComponent("LoadingProgress");
            lpjs.removeWaitCmd(cmdKey);
            if (cmdKey == null) {
                lpjs.waitTimeout();
            }
        }
    },
}