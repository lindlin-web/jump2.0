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
        GameData.WalletProxy.disConnectWallet();
        this.refresh();
    },

    onConnect(cb) {
        if(true) {
            if(window.Telegram) {
                window.TonPay.connect((address)=>{
                    GameData.WalletProxy.askForCollectWallet(address);
                    this.refresh();
                    cb();
                });
            }
        }
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
            AppNotify.WALLET_LOG
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
        }
    },

});
