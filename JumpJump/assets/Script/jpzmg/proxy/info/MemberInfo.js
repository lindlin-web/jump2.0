var MemberInfo = (function() {
    function MemberInfo() {
        this.avatarUrl = "";
        this.cfcountry = "";
        this.coupons = 0;
        this.createTime = "";
        this.device = "";
        this.email = "";
        this.pid = 0;
        this.id = 0;
        this.isPremium = 0;
        this.joinIp = "";
        this.joinTime = "";
        this.lan = "";
        this.lastIp = "";
        this.lastTime = "";
        this.level = 0;
        this.maxGameTime = "";
        this.mobile = "";
        this.money = "";
        this.nickName = "";
        this.password = "";
        this.pid = 0;
        this.referrals = 0;
        this.score = 0;
        this.serialNo = "";
        this.sex = "0";
        this.status = 0;
        this.no = 0;
        this.tasks = null;
        this.tgGid = "";
        this.tgid = "";
        this.todayTopScore = 0;
        this.token = "";
        this.topScore = 0;
        this.updatedAt = "";
        this.userName = "";
        this.wallet = null;
        this.historyMoney = 0;
    }

    /** 获取 telegram id */
    MemberInfo.prototype.getTgGid = function() {
        return this.tgGid;
    }

    /** 获取历史money */
    MemberInfo.prototype.getHistoryMoney = function() {
        return this.historyMoney;
    }

    /** 获取 telegram id */
    MemberInfo.prototype.getTgId = function() {
        return this.tgid;
    }

    /** 获取 用户名称 */
    MemberInfo.prototype.getUsername = function() {
        return this.userName;
    }
    /** 获取 用户名称 */
    MemberInfo.prototype.getNickName = function() {
        return this.nickName;
    }
       
    /** 获取 最高的分数 */
    MemberInfo.prototype.getTopScore = function() {
        return this.topScore;
    }

    /** 获取头像的url */
    MemberInfo.prototype.getAvatarUrl = function() {
        return this.avatarUrl;
    }

    /** 获取钱包 */
    MemberInfo.prototype.getWallet = function() {
        return this.wallet;
    }

    /** 初始化信息 */
    MemberInfo.prototype.init = function(data) {
        this.avatarUrl =data.avatar;
        this.cfcountry = data.cfcountry;
        this.coupons = data.coupons;
        this.createTime = data.created_at;
        this.device = data.device;
        this.email = data.email;
        this.pid = data.pid;
        this.id = data.id;
        this.isPremium = data.is_premium;
        this.joinIp = data.join_ip;
        this.joinTime = data.join_time;
        this.lan = data.lan;
        this.lastIp = data.last_ip;
        this.lastTime = data.last_time;
        this.level = data.level;
        this.maxGameTime = data.max_game_time;
        this.mobile = data.mobile;
        this.money = data.money;
        this.nickName = data.nickname;
        this.no = data.no;
        this.password = data.password;
        this.pid = data.pid;
        this.referrals = data.referrals;
        this.score = data.score;
        this.serialNo = data.serial_no;
        this.sex = data.sex;
        this.status = data.status;
        this.tasks = data.tasks;
        this.tgGid = data.tg_gid;
        this.tgid = data.tgid;
        this.todayTopScore = data.today_top_score;
        this.token = data.token;
        this.topScore = data.top_score;
        this.updatedAt = data.updated_at;
        this.userName = data.username;
        this.wallet = data.wallet;
        this.historyMoney = data.history_money;
    };
    return MemberInfo;
})();
window.MemberInfo = MemberInfo;