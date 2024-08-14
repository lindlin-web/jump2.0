

/******  这个是宝箱信息 */
var RankPersonalInfo = (function() {
    function RankPersonalInfo() {
        this.avatarUrl = "";
        this.cfcountry = null;
        this.coupons = 0;
        this.createAt = "";
        this.device = null;
        this.email = null;
        this.gid = 0;
        this.id = 0;
        this.isPremium = 0;
        this.joinIp = "";
        this.joinTime = "";
        this.lan = null;
        this.lastIp = null;
        this.lastTime = null;
        this.level = 0;
        this.maxGameTime = "";
        this.mobile = null;
        this.money = "";
        this.historyMoney = "";
        this.nickname = "";
        this.password = "";
        this.pid = 0;
        this.referrals = 0;
        this.score = 0;
        this.serialNo = "";
        this.sex = "";
        this.status = 0;
        this.tasks = "";
        this.tgGid = "";
        this.tgid = "";
        this.todayTopScore = 0;
        this.token = "";
        this.topScore = 0;
        this.updateAt = "";
        this.username = "";
        this.wallet = "";
        this.isHistory = true;
    }

    /** 获得nickname */
    RankPersonalInfo.prototype.getNickname = function() {
        return this.nickname;
    }
    RankPersonalInfo.prototype.setNickname = function(nickName) {
        this.nickname = nickName;
    }

    /** 获得最高score */
    RankPersonalInfo.prototype.getTopScore = function() {
        return this.topScore;
    }

    RankPersonalInfo.prototype.setTopScore = function(top) {
        this.topScore = top;
    }

    /** 获得money */
    RankPersonalInfo.prototype.getMoney = function() {
        return this.money;
    }

    RankPersonalInfo.prototype.setMoney = function(money) {
        this.money = money;
    }

    /** 获得today top score */
    RankPersonalInfo.prototype.getTodayTopScore = function() {
        return this.todayTopScore;
    }

    RankPersonalInfo.prototype.setTodayTopScore = function(top) {
        this.todayTopScore = top;
    }

    RankPersonalInfo.prototype.getHistoryMoney = function() {
        return this.historyMoney;
    }

    RankPersonalInfo.prototype.setHistoryMoney = function(val) {
        this.historyMoney = val;
    }

    /** 获得头像图片 */
    RankPersonalInfo.prototype.getAvatarUrl = function() {
        return this.avatarUrl;
    }
    
    /** 获得score */
    RankPersonalInfo.prototype.getScore = function() {
        return this.score;
    }

    /** 获得wallet */
    RankPersonalInfo.prototype.getWallet = function() {
        return this.wallet;
    }

    /** 获得wallet */
    RankPersonalInfo.prototype.setWallet = function(wallet) {
        this.wallet = wallet;
    }

    /** 获得名字 */
    RankPersonalInfo.prototype.getUsername = function() {
        return this.username;
    }

    RankPersonalInfo.prototype.setUserName = function(username) {
        this.username = username;
    }


    /** 获得 tgid */
    RankPersonalInfo.prototype.getTgid = function() {
        return this.tgid;
    }
    RankPersonalInfo.prototype.setTgid = function(tgid) {
        this.tgid = tgid;
    }
    RankPersonalInfo.prototype.init = function(info) {
        this.avatarUrl = info.avatar;
        this.cfcountry = info.cfcountry;
        this.coupons = info.coupons;
        this.createAt = info.created_at;
        this.device = info.device;
        this.email = info.email;
        this.gid = info.gid;
        this.id = info.id;
        this.isPremium = info.is_premium;
        this.joinIp = info.join_ip;
        this.joinTime = info.join_time;
        this.lan = info.lan;
        this.lastIp = info.last_ip;
        this.lastTime = info.last_time;
        this.level = info.level;
        this.maxGameTime = info.max_game_time;
        this.mobile = info.mobile;
        this.money = info.money;
        this.historyMoney = info.history_money;
        this.nickname = info.nickname;
        this.password = info.password;
        this.pid = info.pid;
        this.referrals = info.referrals;
        this.score = info.score;
        this.serialNo = info.serial_no;
        this.sex = info.sex;
        this.status = info.status;
        this.tasks = info.tasks;
        this.tgGid = info.tg_gid;
        this.tgid = info.tgid;
        this.todayTopScore = info.today_top_score;
        this.token = info.token;
        this.topScore = info.top_score;
        this.updateAt = info.updated_at;
        this.username = info.username;
        this.wallet = info.wallet;
        this.isHistory = info.isHistory;            // 是否是历史
    }
    
    return RankPersonalInfo;
})();
window.RankPersonalInfo = RankPersonalInfo;