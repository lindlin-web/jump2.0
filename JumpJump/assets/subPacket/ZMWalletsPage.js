let telegramUtil = require('../Script/Common/TelegramUtils');
var ListViewCtrl = require('./utils/ListViewCtrl');
var ZMWalletsPage = cc.Class({
    extends: require('BaseView'),

    properties: {
        ton:cc.Label,

        connectBtn:cc.Button,           // 链接按钮
        withDraw:cc.Button,             // 取钱按钮
        disCollectBtn:cc.Button,        // 失链按钮
        listView:ListViewCtrl,
        theTip:cc.Node,                 // 提示
        addVal:cc.Label,                // 钱包的地址.

        theGuide:cc.Node,               // 就是那个引导的遮罩.....
        theGuide2:cc.Node,              // 新手引导的第二步......
        theGuide3:cc.Node,              // 引导到jump 面板.......
    },
    statics: {
        instance: null
    },

    onLoad() {
        ZMWalletsPage.instance = this;
        this.setUIID(gUIIDs.UI_WALLET_PAGE);
        this._super();

        let bo = gUICtrl.isResultPageOpened()
        if(bo) {
            telegramUtil.onSetBgColor(HEAD_COLORS.RESULT);
            telegramUtil.onSetHeaderColor(HEAD_COLORS.RESULT);
        } else {
            telegramUtil.onSetBgColor(HEAD_COLORS.PREFAB);
            telegramUtil.onSetHeaderColor(HEAD_COLORS.PREFAB);
        }

        this.refresh();
        GameTool.copyBottomNode(gUIIDs.UI_WALLET_PAGE,this.node.getChildByName("wrapper"));

        this.isAskingReturnYet = true;

        this.theGuide.active = false;
        
        this.theGuide2.active = false;
        
        this.theGuide3.active = false;

        this.checkGuide();          // 看看， 新手引导的部分内容...
    },

    

    onEnable() {
        this._super();
        GameData.WalletProxy.askForWithdrawRecord();

        this.setClickEvent(this.disCollectBtn, this.onDisCollect.bind(this));
        this.setClickEvent(this.connectBtn, this.onConnect.bind(this));
        this.setClickEvent(this.withDraw, this.onWithDraw.bind(this));
    },


    onDestroy() {
        this._super();
        ZMWalletsPage.instance = null;
    },

    refresh() {
        let tonMoney = GameData.UsersProxy.getMyTonGold();
        this.ton.string = tonMoney + "";
        let isConnecting = false;
        if(window.Telegram) {
            isConnecting = GameData.WalletProxy.isConnectingFunc();
        }
        if(isConnecting) {
            this.disCollectBtn.node.active = true;
            let address = window.TonPay.getAddress();
            address = window.TonPay.changeAddress(address);
            this.addVal.string = GameTool.converWalletAddress(address);
            this.connectBtn.node.active = false;
        } else {
            this.disCollectBtn.node.active = false;
            this.connectBtn.node.active = true;
        }
    },

    onWithDraw() {
        let isConnecting = false;
        if(window.Telegram) {
            isConnecting = GameData.WalletProxy.isConnectingFunc();
        }

        if(!isConnecting) {
            this.onConnect(this.onWithDraw.bind(this));
            return;
        }

        if(!this.isAskingReturnYet) {
            console.log(" request is not return yet");
            return;
        }
        let availabelNum = GameData.WalletProxy.numOfWithDraw();
        if(availabelNum == 0) {
            // 说明了是第一次取现.
            let tonMoney = GameData.UsersProxy.getMyTonGold();
            let friendNum = GameData.UsersProxy.getMyReferrals();
            let isFatherFinish = GameData.TaskProxy.getTogetherTaskFinished();
            let tonMoneyEnough = tonMoney >= 100;
            let friendsEnough = friendNum >= 15;            // 这个是好友的数量 ...必须符合要求...
            if(!isFatherFinish) {
                // 如果组合任务还没完成，需要提示需要完成组合任务...
                gUICtrl.openUI(gUIIDs.UI_WITHDRAW_TIP,null, {type:1});
            }
            else if(!tonMoneyEnough) {
                gUICtrl.openUI(gUIIDs.UI_WITHDRAW_TIP,null, {type:2, value: 100});
            } 
            else if(!friendsEnough) {
                gUICtrl.openUI(gUIIDs.UI_WITHDRAW_TIP,null, {type:3,value:friendNum});
            } else {
                GameData.WalletProxy.askForWithDrawLog(100, 0.01);
                this.isAskingReturnYet = false;
            }
        }
        else if(availabelNum == 1) {
            // 说明是第二次体现
            let tonMoney = GameData.UsersProxy.getMyTonGold();
            if(tonMoney >= 1000) {
                GameData.WalletProxy.askForWithDrawLog(1000, 0.1);
                this.isAskingReturnYet = false;
            } else {
                gUICtrl.openUI(gUIIDs.UI_WITHDRAW_TIP,null, {type:2, value: 1000});
            }
        } else {
            // 说明是第三次体现了.
            let tonMoney = GameData.UsersProxy.getMyTonGold();
            if(tonMoney >= 10000) {
                GameData.WalletProxy.askForWithDrawLog(10000, 1);
                this.isAskingReturnYet = false;
            } else {
                gUICtrl.openUI(gUIIDs.UI_WITHDRAW_TIP,null, {type:2, value: 10000});
            }
        }
    },

    onDisCollect() {
        gUICtrl.openUI(gUIIDs.UI_WALLET_EXIT_TIP,null,{tip:"Do you want to disconnect wallet",yesFun:this.disconnectCallback});
    },

    disconnectCallback() {
        GameData.WalletProxy.disConnectWallet();
    },

    onConnect(cb) {
        this.theGuide.active = false;
        let walletStep = GameData.GameProxy.getWalletStep();
        let isNewer = GameData.UsersProxy.getMyIsNewer();
        
        if(walletStep == WALLETSTEP.WALLETBTN) {
            GameData.GameProxy.addWalletStep();             // 增进一步...
            this.theGuide2.active = true;
        }
        if(true) {
            if(window.Telegram) {
                window.TonPay.connect((address)=>{
                    //address = window.TonPay.changeAddress(address);
                    GameData.WalletProxy.askForCollectWallet(address);
                    this.refresh();
                    cb();
                });
            }
        }
    },

    checkGuide() {
        let walletStep = GameData.GameProxy.getWalletStep();

        if(walletStep == WALLETSTEP.WALLETBTN) {
            this.theGuide.active = true;
        }
        if(walletStep == WALLETSTEP.WALLETCONNECT) {
            this.theGuide2.active = true;
        }
    },

    onGuide2Click() {
        GameData.GameProxy.addWalletStep();
        this.theGuide2.active = false;
        let walletStep = GameData.GameProxy.getWalletStep();
        if(walletStep == WALLETSTEP.WALLETTIP) {
            GameData.GameProxy.addWalletStep();             // 增进一步...
            this.theGuide3.active = true;
            this.adjustGuide3();
        }
    },

    /** 调整guide的 位置... */
    adjustGuide3() {
        let bottom = this.node.getChildByName("wrapper").getChildByName("bottom").getComponent('ZMBottom');
        let walletWorldPos = bottom.getJumpBtnPoint();
        let localPos = this.theGuide3.parent.convertToNodeSpaceAR(walletWorldPos);
        this.theGuide3.setPosition(localPos);
    },


    start() {

    },

    onBackBtnClick() {
        this.removeSelf();
    },

    onRefresh() {
        let values = GameData.WalletProxy.getLogArray();
        this.listView.reload(values);
        if(!values || values.length == 0) {
            this.theTip.active = true;
        } else {
            this.theTip.active = false;
        }
    },

    removeSelf() {
        this._super();
    },

    onCollectWallet() {
        let isConnecting = false;
        if(window.Telegram) {
            isConnecting = GameData.WalletProxy.isConnectingFunc();
            this.refresh();
        }
    },


    listNotificationInterests() {
        return [
            AppNotify.UPDATE_WALLET_DONE,
            AppNotify.WALLET_LOG,
            AppNotify.OnViewClosed,
        ];
    },

    handleNotification(key, data) {
        switch (key) {
            case AppNotify.UPDATE_WALLET_DONE:
                this.isAskingReturnYet = true;
                this.onCollectWallet();
                break;
            case AppNotify.WALLET_LOG:
                this.onRefresh();
                break;
            case AppNotify.OnViewClosed:
                this.refresh();
                break;
        }
    },

});
