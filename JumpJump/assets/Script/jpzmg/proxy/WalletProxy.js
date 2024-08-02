/** 这个是描述了俱乐部旗下的 成员的信息列表 */
var WalletProxy = (function(){
    function WalletProxy() {
        this.withDrawDic = new Dictionary();
        this.isConnecting = false;
        NotifyMgr.on(gGSM.UPUSERWALLET, this.onUpdateWallet.bind(this), this);
        NotifyMgr.on(gGSM.WITHDRAWLOG, this.onWithDrawLog.bind(this), this);
        NotifyMgr.on(gGSM.ADDUSERWITHDRAWLOG, this.onWithDrawApplicant.bind(this), this);
    }

    WalletProxy.prototype.onWithDrawApplicant = function(data) {
        if(data.code == 1) {
            GameData.UsersProxy.updateMyInfo(data);
            NotifyMgr.send(AppNotify.UPDATE_WALLET_DONE, null);
            this.askForWithdrawRecord();
        } else {
            let type = data.type;
            if(type == 4) {
                let walletCount = data.need_wallet_count;
                gUICtrl.openUI(gUIIDs.UI_WITHDRAW_TIP,null, {type:4, value: walletCount});
            }
        }
    }


    
    
    WalletProxy.prototype.onWithDrawLog = function(data) {
        console.log(data);
        if(data.code == 1) {
            for(let i = 0; i < data.length; i++) {
                let info = data[i];
                let withdraw = new WithDrawInfo();
                withdraw.index = i;
                withdraw.init(info);
                let id = withdraw.getId();
                this.withDrawDic.set(id, withdraw);
            }
        }
        NotifyMgr.send(AppNotify.WALLET_LOG, null);
    }

    WalletProxy.prototype.getLogArray = function() {
        return this.withDrawDic.values;
    }

    WalletProxy.prototype.isConnectingFunc = function() {
        if(window.Telegram) {
            this.isConnecting = window.TonPay.isConnecting();
        }
        return this.isConnecting;
    }

    WalletProxy.prototype.onUpdateWallet = function(data) {
        if(data.code == 1) {
            GameData.UsersProxy.setUserInfo(data.data);
        }
        NotifyMgr.send(AppNotify.UPDATE_WALLET_DONE, null);
    }

    /** 与钱包断开链接 */
    WalletProxy.prototype.disConnectWallet = function() {
        if(window.Telegram) {
            window.TonPay.disconnect();
        }
    }

    WalletProxy.prototype.numOfWithDraw = function() {
        let availabelNum = 0;
        let logs = this.getLogArray();
        for(let i = 0; i < logs.length; i++) {
            let info = logs[i];
            let availabel = info.isAvailable();
            if(availabel) {
                availabelNum += 1;
            }
        }
        return availabelNum;
    }

    /** 请求发送给服务器钱包地址 */
    WalletProxy.prototype.askForCollectWallet = function(serialNo) {
        gGameCmd.postAction(gGSM.UPUSERWALLET, {wallet:serialNo});
    }

    WalletProxy.prototype.askForWithDrawLog = function(money, realMoney) {
        gGameCmd.postAction(gGSM.ADDUSERWITHDRAWLOG, {ton_money:money, real_money:realMoney});
    }
    

    /** 请求取钱的历史记录 */
    WalletProxy.prototype.askForWithdrawRecord = function() {
        gGameCmd.postAction(gGSM.WITHDRAWLOG, null);
        let length = this.getLogArray().length;
        if(length > 0) {
            NotifyMgr.send(AppNotify.WALLET_LOG, null);
        }
    }

    WalletProxy.prototype.connectWallet = function() {
        if(window.Telegram) {
            window.TonPay.connect();
        }
    }

    return WalletProxy;
})();
window.WalletProxy = WalletProxy;