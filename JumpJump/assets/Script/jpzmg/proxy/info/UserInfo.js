var MAX_TODAY_GAME_TIME = 10000;
var UserInfo = (function() {
    function UserInfo() {
        this.avatarUrl = "";
        this.cfcountry = "";
        this.coupons = 0;
        this.createTime = "";
        this.device = "";
        this.email = "";
        this.gid = 0;
        this.id = 0;
        this.isPremium = 0;
        this.joinIp = "";
        this.joinTime = "";
        this.lan = "";
        this.lastIp = "";
        this.level = 0;
        this.maxGameTime = "";
        this.historyMoney = 0;
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
        this.tasks = null;
        this.tgGid = "";
        this.tgid = "";
        this.todayGameTime = "";
        this.todayTopScore = 0;
        this.token = "";
        this.topScore = 0;
        this.updatedAt = "";
        this.userName = "";
        this.wallet = null;
        this.walletAddress = "";
        this.isNewer = false;               // 是否是新手
    }

    UserInfo.prototype.getToken = function() {
        return this.token;
    }
    /**
     * 
     * @returns 获得telegram 的用户id
     */
    UserInfo.prototype.getTgGid = function() {
        return this.tgGid;
    }

    UserInfo.prototype.getWallet = function() {
        return this.wallet;
    }

    UserInfo.prototype.getNickname = function() {
        return this.nickName;
    }

    UserInfo.prototype.getUserName = function() {
        return this.userName;
    }
    /**
     * 
     * @returns 获得telegram 的用户id
     */
    UserInfo.prototype.getTgid = function() {
        return this.tgid;
    }

    UserInfo.prototype.getGid = function() {
        return this.gid;
    }

    /** 获得我今天还可以玩多少次 */
    UserInfo.prototype.getTodayGameTime = function() {
        let result = this.todayGameTime >= MAX_TODAY_GAME_TIME ? GameTool.getInfinite() : this.todayGameTime;
        return result;
    }

    /** 更新今天的可玩次数 */
    UserInfo.prototype.setTodayGameTime = function(time) {
        let result = time == GameTool.getInfinite()? MAX_TODAY_GAME_TIME : parseInt(time);
        this.todayGameTime = result;
        if(this.todayGameTime >= MAX_TODAY_GAME_TIME) {
            this.maxGameTime = MAX_TODAY_GAME_TIME;
        }
    }
    /** 把今天的可玩次数添加进去 */
    UserInfo.prototype.addTodayGameTime = function(time) {
        let result = time == GameTool.getInfinite()? MAX_TODAY_GAME_TIME : parseInt(time);
        this.todayGameTime += result;
        if(this.todayGameTime >= MAX_TODAY_GAME_TIME) {
            this.maxGameTime = MAX_TODAY_GAME_TIME;
        }
    }

    /** 把今天的复活券给添加进去 */
    UserInfo.prototype.addCoupons = function(cp) {
        this.coupons += cp;
    }

    /** 获得最高可以玩的次数 */
    UserInfo.prototype.getMaxGameTime = function() {
        let result = this.maxGameTime >= MAX_TODAY_GAME_TIME ? GameTool.getInfinite() : this.maxGameTime;
        return result;
    }

    UserInfo.prototype.addMaxGameTime = function(mt) {
        let result = mt == GameTool.getInfinite()? MAX_TODAY_GAME_TIME : parseInt(mt);
        this.maxGameTime += result;
        if(this.maxGameTime >= MAX_TODAY_GAME_TIME) {
            this.todayGameTime = MAX_TODAY_GAME_TIME;
        }
    }

    /** 在登录的时候，判断是否是新手... */
    UserInfo.prototype.setIsNewer = function(bo) {
        this.isNewer = bo;
    }

    /** 返回是否是新手 */
    UserInfo.prototype.getIsNewer = function() {
        return true;
    }

    UserInfo.prototype.getGold = function() {
        return parseInt(this.money);
    }

    UserInfo.prototype.setGold = function(gold) {
        this.money = gold;
    }

    UserInfo.prototype.addGold = function(num) {
        let originalMoney = parseInt(this.money);
        num = parseInt(num);
        this.money = (originalMoney + num) + "";
    }

    UserInfo.prototype.getTonMoney = function() {
        return this.tonMoney;
    }

    UserInfo.prototype.setTonMoney = function(ton) {
        this.tonMoney = parseInt(ton);
    }

    UserInfo.prototype.addTonMoney = function(num) {
        let originalTonMoney = parseInt(this.tonMoney);
        num = parseInt(num);
        this.tonMoney = (originalTonMoney + num) + "";
    }

    UserInfo.prototype.getCoupons = function() {
        return this.coupons;
    }

    /** 更新玩家信息 */
    UserInfo.prototype.update = function(data) {
        this.init(data);
    }

    /** 历史的最高分 */
    UserInfo.prototype.getTopScore = function() {
        return this.topScore;
    }

    /** 设置历史的最高峰 */
    UserInfo.prototype.setTopScore = function(score) {
        this.topScore = parseInt(score);
    }

    /** 今日的最高分 */
    UserInfo.prototype.getTodayTopScore = function() {
        return this.todayTopScore;
    }

    UserInfo.prototype.setReferrals = function(val) {
        this.referrals = parseInt(val);
    }

    /** 获取邀请的好友数 */
    UserInfo.prototype.getReferrals = function() {
        return this.referrals;
    }

    /** 获取是否应该要被引导 */
    UserInfo.prototype.getNeedToturial = function() {
        return this.newStep == 0;
    }

    /** 获取我领取了新手的那一个礼包le */
    UserInfo.prototype.getNewStep = function() {
        return 0;
    }

    UserInfo.prototype.setNewStep = function(step) {
        this.newStep = parseInt(step);
    }

    /** 获取历史上的金币 */
    UserInfo.prototype.getHistoryGold = function() {
        return this.historyMoney;
    }

    /** 初始化信息 */
    UserInfo.prototype.init = function(data) {
        this.avatarUrl =data.avatar;
        this.cfcountry = data.cfcountry;
        this.coupons = data.coupons;
        this.createTime = data.created_at;
        this.device = data.device;
        this.email = data.email;
        this.gid = data.gid;
        this.id = data.id;
        this.historyMoney = parseInt(data.history_money);
        this.isPremium = data.is_premium;
        this.joinIp = data.join_ip;
        this.joinTime = data.join_time;
        this.lan = data.lan;
        this.lastIp = data.last_ip;
        this.level = data.level;
        this.maxGameTime = data.max_game_time ==GameTool.getInfinite()? MAX_TODAY_GAME_TIME : parseInt(data.max_game_time);
        this.mobile = data.mobile;
        this.money = data.money;
        this.tonMoney = parseInt(data.ton_money);                 // ton金币的数量是多少.
        this.nickName = data.nickname;
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
        this.todayGameTime = data.today_game_time ==GameTool.getInfinite()? MAX_TODAY_GAME_TIME : parseInt(data.today_game_time);
        this.todayTopScore = data.today_top_score;
        this.token = data.token;
        this.topScore = data.top_score;
        this.updatedAt = data.updated_at;
        this.userName = data.username;
        this.wallet = data.wallet;
        this.walletAddress = data.walletaddress;

        
        this.newStep = parseInt(data.new_step);           // 0, 1,2,3,4,5,6.
        this.levelDetail = data.level_detail.split(",");

        // var giftDetail = {
        //     "id": 50,
        //     "ative_code": "ative04",
        //     "name": "cs04",
        //     "code": 1, //=1，领取成功，根据type和reward_num显示领取的详情，=其他的话就直接回显msg
        //     "type": 2, //1=金币，2=体力，3=复活券
        //     "reward_num": 100, //奖励数量
        //     "make_num": 1,
        //     "sum_num": 1,
        //     "validity_time": "2034-07-24 08:47:10",
        //     "create_time": "2024-07-26 08:47:10",
        //     "money": 400, //当code=1时，取这个字段渲染金币
        //     "coupons": 6, //当code=1时，取这个字段渲染复活券
        //     "msg": "Successfully"
        // } //礼品码详情，如果该字段不为空则需要弹窗
        // data.giftDetail = giftDetail;

        this.isGiftOk = data.giftDetail && data.giftDetail.code == 1;           // 有礼包码。却礼包码未1
        if(this.isGiftOk) {
            this.money = data.giftDetail.money;
            this.coupons = data.giftDetail.coupons;
            this.giftType = data.giftDetail.type;
            this.giftNum = data.giftDetail.reward_num;
        }
        this.isGiftError = data.giftDetail && data.giftDetail.code != 1;
        if(this.isGiftError) {
            this.giftErrorMsg = data.giftDetail.msg;
        }

        
    };

    /** 是否有需要弹框 */
    UserInfo.prototype.getIsGiftOk = function() {
        return this.isGiftOk;
    }
    /** 是否需要弹信息框 */
    UserInfo.prototype.getIsGiftError = function() {
        return this.isGiftError;
    }

    UserInfo.prototype.getGiftTypeAndNum = function() {
        return {type:this.giftType, num:this.giftNum};
    }

    UserInfo.prototype.getGiftErrorMsg = function() {
        return this.giftErrorMsg;
    }

    UserInfo.prototype.getLevelByType = function(type) {
        let level = this.levelDetail[type];
        return level;
    }

    return UserInfo;
})();
window.UserInfo = UserInfo;