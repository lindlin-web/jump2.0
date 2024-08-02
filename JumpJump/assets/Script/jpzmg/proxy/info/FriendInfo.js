var FriendInfo = (function() {
    function FriendInfo() {
        this.id = 0;
        this.userName = "";
        this.nickName = "";
        this.pid = 0;
        this.tgId = "";
        this.money = "";
        this.isPremium = 0;
        this.topScore = 0;
        this.wallet = "";
        this.index = 0;
    }

    FriendInfo.prototype.init = function(data) {
        this.index = data.index;
        this.id = data.id;
        this.userName = data.username;
        this.nickName = data.nickname;
        this.pid = data.pid;
        this.tgId = data.tgid;
        this.money = data.money;
        this.historyMaxMoney = data.history_money;
        this.isPremium = data.is_premium;
        this.topScore = data.top_score ? data.top_score : 0;
        this.wallet = data.wallet ? data.wallet : "";
    }

    FriendInfo.prototype.getTgid = function() {
        return this.tgId;
    }
    FriendInfo.prototype.getNickName = function() {
        return this.nickName;
    }

    FriendInfo.prototype.getUserName = function() {
        return this.userName;
    }

    FriendInfo.prototype.getHistoryMaxMoney = function() {
        return this.historyMaxMoney;
    }

    FriendInfo.prototype.getTopScore = function() {
        return this.topScore;
    }

    FriendInfo.prototype.getWallet = function() {
        return this.wallet;
    }


    return FriendInfo;
})();
window.FriendInfo = FriendInfo;