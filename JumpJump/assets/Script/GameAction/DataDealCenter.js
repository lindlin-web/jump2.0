let allGMSDatas = {}
let allPBDatas = {}
let mE = window.gE;
let mFuncs = window.gFuncs;

let DataMgr = cc.Class({
    extends: cc.EventTarget,
    //解析
    analyzeGsmData: function(gsmKey, response) {
        let obj = JSON.parse(response);
        if (obj.code == 0 || obj.code == 1) {
            // var data = obj.data;

            // this.cacheGMSData(gsmKey, data);
            // // this._dispatchEvent(GameConfig.RECV_CMD_NOTIFY_UI, {
            // //     "key": gsmKey,
            // //     "data": data
            // // });
        }
        return obj;
    },
});


var gGSM = window.gGSM = {
    APP_GAME_INFO: "/package_info",
    APP_RES_DETAILS: "/get_app_res_details",
    /**
     * 获取服务器列表
     * @param package_type 1
     * @param login_type 2
     * @param account abc
     * @param token 64ae870f1f5de3823c49610a0d13a1e3
     * @param _time 1500000000
     */
    APP_SERV_LIST: "/server_list",
    APP_NOTICE_LIST: "/get_app_notice_list",
    REG_GAME_ACOUNT: "/register",
    /**
     * 第一步：登录账号
     * @param app_id 1
     * @param package_type 1
     * @param login_type 2
     * @param acount lpb
     * @param pwd 64ae870f1f5de3823c49610a0d13a1e3
     * @param token 64ae870f1f5de382
     * @return gameLoginToken
     */
    AccountLogin: "/login",
    /**
     * 游戏登录
     * @param app_id 1
     * @param package_type 1
     * @param login_type 2
     * @param acount lpb
     * @param token 64ae870f1f5de3823c49610a0d13a1e3
     * @param serv_id 1
     * @param _time 过期时间 1500000000
     */
    GAME_LOGIN: "/login",
    GET_NEW_ORDER: "/get_new_order",
    BindGameAccount: "/bind_game_account",
    /**
     * @param iapdata xxx
     * @param sign xxx
     * @param ext 订单号
     */
    RechargeGooglePlayCallback: "/recharge/googleplay/callback",
    RechargeIOSPlayCallback: "/recharge/iap/callback",
    LOG:"/check_point",
    PAYForWEChat: "/wechat/pay",


    LOGIN:"/user/login",                   //登录
    GET_USER:"/user/getuser",              //获取用户信息
    BEGIN_GAME:"/game/begingame",          //开始一场游戏
    CONTINUE_GAME:"/game/continuegame",    //继续一场游戏
    GAME_OVER:"/game/gameover",            //游戏结束提交分数
    USE_PROPS:"/game/useprops",            //道具使用
    TodayRANK:"/statistics/rank",               //当日排行榜
    HISRANK:'/statistics/his_rank',          // 历史排行榜
    COINRANK:'/statistics/coin_rank',          // 金币排行榜
    GET_TASKS:"/tasks/gettasks",           //获取任务列表
    DO_TASKS:"/tasks/dotask",              //任务接口
    FRIENDS:"/user/friends",               //好友接口
    GROUP_INFO:"/group/info",              //获取群组信息接口
    GROUP_LIST:"/group/list",              //群组列表
    GROUP_USERS:"/group/userlist",         //群组下的成员
    JOIN_GROUP:"/group/joingroup",         //加入群组接口
    LEAVE_GROUP:"/group/leavegroup",       //退出群组接口
    MSG_LIST:"/msg/list",                  //消息队列接口

    GET_NOTICE:"/user/getNotice",          //获得通知奖励的接口.
    READ_NOTICE:"/user/readNotice",         // 读取了一个奖励通知.
    UPGRADE_LEVEL:"/user/upUserLevel",         // 升级玩家类型...
    USERNEW_STEP:"/user/upUserNewStep",         // 新手引导获取道具汇报....
    OFFLINE_MONEY:"/user/getOffLineMoney",      // 获得离线收益.
    UPUSERWALLET:"/user/upUserWallet",          // 链接玩家的钱包.
    WITHDRAWLOG:"/user/getUserWithdLog",        // 取现记录......
    ADDUSERWITHDRAWLOG: "/user/addUserWithdLog",        // 取现记录....

    WATCHADV:"/user/upUserDayAdv",              // 观看广告...

};

var gDataMgr = window.gDataMgr = new DataMgr();
//一些通用型数据的管理类集合
window.gDataMgr.mMgrs = {};