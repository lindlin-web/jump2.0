var gE = window.gE = {
    NETERROR: {
        ERROR: -1,
        CLOSED: -2,
    },
    NT: {
        GOLD: 1, // 金币
        DIAMOND: 2, // 代币
        ROLE_LV: 3, // 角色等级
        ROLE_EXP: 4, // 角色经验
        VIP_LV: 5, // VIP等级
        VIP_EXP: 6, // VIP经验
        STAMINA: 7, // 角色体力
        SPIRIT: 8, // 角色元气值
        CE: 9, // 战力
        DAY_TIMES_STAMINA: 201,
        OrdinaryDayOneTimes: 202, // 每日次数-普通-今日已使用单抽次数
        OrdinaryDayTenTimes: 203, // 每日次数-普通-今日已使用十连次数
        OrdinaryDayFreeTimes: 204, // 每日次数-普通-今日已使用免费次数
        LegendDayOneTimes: 205, // 每日次数-传奇-今日已使用单抽次数
        LegendDayTenTimes: 206, // 每日次数-传奇-今日已使用十连次数
        LegendDayFreeTimes: 207, // 每日次数-传奇-今日已使用免费次数
        EventChestTimes: 208, // 每日次数-今日已完成的度假村宝箱事件次数
        EventFightTimes: 209, // 每日次数-今日已完成的度假村战斗事件次数
        EventPromiseTimes: 210, // 每日次数-今日已完成的度假村许愿事件次数
        GetFriendsStaminaTimes: 211, // 每日次数-今日领取好友发送的体力次数
        SendFriendsStaminaTimes: 212, // 每日次数-今日赠送好友体力次数
        OrchardHelpTimes: 213, // 每日次数-今日种植园帮助次数
        OrchardVgetealTimes: 214, // 每日次数-今日种植园偷菜次数
        DirectTimes: 215, // 每日次数-今日训练场指点次数
        DirectAcceptTimes: 216, // 每日次数-今日训练场接受指点次数
        DayVTypeVitalityBuyTimes: 222,
    },
    BT: {
        CHAPTER: 1,
        LORDPET: 2,
        DUEL: 3,
        CHAMPION: 4,
        TRAIL: 5,
    },
    NTITEMID: {
        GOLD: 104000, // 金币
        DIAMOND: 104001, // 代币
        PET_EXP: 104002, // 宠物经验
        ROLE_EXP: 119002, // 角色经验
        STAMINA: 119100, // 角色体力
        CARRYPROPDIAMOND: 1005, //便携道具代币
        CARRYPROPBREACH: 40000, //携带道具突破材料
    },
    VTYPE: {
        DIALOG: 0,
        SCENE: 1,
        VIEW: 2,
        FULLVIEW: 3 //铺满全屏的界面 打开后会隐藏6个主界面内容，如果主菜单按钮点击 那么会被移除
    },
    ORDER: {
        MAX: 9999,
        VIEWORDER: 0,
        HIGHORDER: 9000,
        TOPBARORDER: 9010,
        DIALOGORDER: 9020
    },
    ITEM: {
        //物品配置
        EQUIP: 5, //  装备
        GEMSTONE: 6, //  宝石
        PET: 1, //  宠物
        PETCHIP: 2, //  宠物碎片
        MONEY: 4, //  货币
        STAREQUIP: 11, //升星装备
        GIFTBAG: 13, //礼包
        ENCHATITEM: 50, //  点化符
        MOUNT: 60, //  坐骑
        SKILLPRINT: 70, //技能书
        BLUEPRINT: 80, //  套装图纸
        MATERIAL: 16, //  材料
        DRAGONSOUL: 100, //  龙魂
        TOKENCARD: 101, //   令牌
        EXP: 102, //   经验
        POKEMONBALL: 103, //   精灵球
        MEDICINAL: 104, //   丹药
        BOSSCHALANGEBOOK: 105, //   挑战书
        APPLE: 106, //   麒麟果
        VIPEXP: 107, //   VIP经验
        RECHARGE: 115, //充值卡
        PETEQUIP: 118, //携带道具（石板）
        MEGASTONE: 120, //mega碎片
        MAZEPROP: 121, //迷宫道具
        ZSKILL: 124, //Z技能
        MONEY_GOLD: 4001, //金币
        MONEY_TOKEN: 4002, //代币
        MONEY_GAS: 4004, //真气
        MONEY_SCORE: 4005, //星石
        MONEY_GUIDEGILD: 4006, //公会贡献度
        MONEY_EXPEDITION: 4007, //塔徽（远征币）
        MONEY_PVPCOIN: 4008, //竞技币
        MONEY_DRAWCARDS: 4009, //抽卡积分
        MONEY_ENDLESS: 4010, //古代金币
        MONEY_MAZEGOLD: 4011, //迷宫金币
        MATERIAL_ROUGH: 9001, //原石
        MATERIAL_MINE: 9002, //矿石
        MATERIAL_SOULMINE: 9003, //魂石
        ORCHARD_SEED: 18, //种植园种子
    },
    //商店类型
    SHOPTYPE: {
        SHOPVIP: 1001, //vip商店
        SHOPRESORT: 1002, //度假村商店
        SHOPPETSOUL: 2001, //精灵魂商店
        STAR: 2002, //星阶商店
        PROP: 2003, //特性商店
        GEMSTONE: 2004, //宝石商店
        VIPGIFT: 4001,
        DISCOUNTSALE: 4003 //活动折扣商店
    },
    //背包不同分页的枚举
    BACKPAG: {
        ITEM: 1, //道具
        STAREQUIP: 2, // 升星装备
        PET: 3, //宠物
        PETCHIP: 4, //宠物碎片
        GEMSTONE: 5, //宝石
    },
    //活动
    ACTIVITY: {
        HUNDREDDIAMONDS: 101, //十万钻石
        SIGNIN: 102, //每日签到
        VIPGIFT: 201, //vip礼包
        VIPWELFARE: 202, //vip福利
        MONTHLYCARD: 203, //月卡福利
        LIFECARD: 204, //终身福利，
        DISCOUNTSALE: 301, //折扣贩售
        LVREWARD: 402, //等级奖励
        HAVALUNCH: 401, //七星饭店
        INVFRIENT: 502, //邀请好友
    },
    //分页类型
    PAGETYPE: {
        SIGNIN: 101, //每日签到
        RECHARGE1: 102, //充值类达标，单笔充值
        RECHARGE2: 103, //充值类达标，累计充值
        ADDSTRENTH: 104, //补充体力
        LV: 105, //等级达标，达到当前等级可领取
        CONSUME: 106, //消耗达标
        HUMERNUM1: 107, //人数类达标，购买基金的可以领取
        HUMMERNUM2: 108, //人数类达标，购买基金总人数达到一定阶段，所有玩家可以领取
        PKNUM: 109, //对决次数达标
        HUNDERDDIAMONDS: 110, //累计天数达标，十万钻石
        VIPLV: 111, //vip等级达标
        SHOP: 201, //商店类
        RANK: 301, //排行类
        INVVIP: 401, //邀请类，受邀请的玩家达到VIP等级的人数数量
        INVACK: 402, //邀请类，受邀请的玩家达到战力的人数数量
        SHARE: 403, //分享
    },
    HELP: {
        BREED: 1,
        HARDTRAIN: 2,
    },
    PT: {
        Atk: 101, // 攻击
        PDef: 102, // 物防
        MDef: 103, // 魔防
        Hp: 104, // 生命
        Def: 105, // 防御
        TeamAtk: 121, // 全队攻击
        TeamPDef: 122, // 全队物防
        TeamMDef: 123, // 全队魔防
        TeamHp: 124, // 全队生命
        TeamDef: 125, // 全队防御
        Crit: 201, // 暴击值
        Toughness: 202, // 韧性值
        Hit: 203, // 命中值
        Dodge: 204, // 闪避值
        CritRatio: 211, // 暴击率
        ToughnessRatio: 212, // 韧性率
        HitRatio: 213, // 命中率
        DodgeRatio: 214, // 闪避率
        MoveSpeed: 301, // 移动速度
        AtkSpeed: 302, // 攻击速度
        AtkPro: 401, // 物攻百分比
        PDefPro: 402, // 物防百分比
        MDefPro: 403, // 魔防百分比
        HpPro: 404, // 生命百分比
        DefPro: 405, // 防御百分比
        DamageAdd: 406, // 伤害增加
        DamageReduction: 407, // 伤害减免
        TeamAtkPro: 408, // 全队物攻百分比
        TeamPDefPro: 409, // 全队物防百分比
        TeamMDefPro: 410, // 全队魔防百分比
        TeamHpPro: 411, // 全队生命百分比
        TeamDefPro: 412, // 全队防御百分比
        TeamDamageAdd: 413, // 全队伤害增加
        TeamDamageReduction: 414, // 全队伤害减免
        StunResistance: 501, //眩晕抗性
        RootResistance: 502, //定身抗性
        SilentResistance: 503, // 封印抗性
        Grass: 601, // 草/岩石
        Electric: 602, // 电/超能
        Water: 603, // 水/飞行
        Fire: 604, // 炎/格斗
        GrassBonus: 605, // 草系加深
        ElectricBonus: 606, // 电系加深
        WaterBonus: 607, // 水系加深
        FireBonus: 608, // 炎系加深
        GrassResistance: 609, // 草系抗性
        ElectricResistance: 610, // 电系抗性
        WaterResistance: 611, // 水系抗性
        FireResistance: 612 // 炎系抗性
    },
    GUIDE: {
        ROLE_LV: 1, // 条件=1时，角色等级
        CHAPTER_START: 2, // 条件=2，该字段=进入副本ID
        LEAVE_CHAPTER: 3, // 条件=3，该字段=关卡结束副本ID
        CHAPTER_SKILL_CD: 4, // 条件=4，该字段=进入副本ID，且第一个训练师技能CD结束
        RESORT_LV: 5, // 条件=5时，度假村等级
    },
    //品质文本颜色
    COLORQ: [
        ["2b0000", "fef6e7"],
        ["2b0000", "34e26d"],
        ["2b0000", "43c1fc"],
        ["2b0000", "f44dff"],
        ["2b0000", "ff9600"],
        ["2b0000", "ff0000"],
        ["2b0000", "fcff00"]
    ],
    COLOR: {
        C1: "45db4f", //浅绿色
        C2: "019601", //深绿色
        C3: "737373", //深灰色
        C4: "c0bfbe", //浅灰色
        C5: "fff43e", //黄色
        C6: "e2382a", //红色
        C7: "fff5f5", //文字白色
        C8: "30190c", //数字深褐
        C9: "60341b", //文字浅褐
        C10: "603600", //文字浅褐
        C11: "4c2c02", //褐色
        C12: "D36B24", //暗橙色
        C13: "FE6C00", //亮橙色
        C14: "843900", //中褐色
        C15: "00FF00", //绿色
        C16: "FF0000", //纯红色
    },
    SOUND: {
        LOGIN: 1000, //"登陆界面背景音乐"
        MAIN_CITY: 1001, //"主城界面背景音乐"
        ARENA: 1002, //"开拓区界面背景音乐"
        RESORT: 1003, //"度假村界面背景音乐"
        BATTLE: 1004, //"战斗背景音乐"
        CLICK: 1005, //"通用点击音效"
        PET_UP: 1006, //"精灵培养通用提升音效"
        EQUIP_UP: 1007, //"装备培养通用提升音效"
        ABILITY_UP: 1008, //"特性培养通用提升音效"
        TRAINER: 1013, //"解锁训练师、训练师技能音效"
    },
    //红点枚举
    RED_POINT: {
        RPT_PET_RSYS: 1, //登录时或者获得新精灵时，并有可自动添加分解的精灵    点击
        RPT_STONE_RSYS: 2, //登录时或者获得新特性石时，并有可自动添加分解的特性石  点击
        RPT_PET_SYN: 5, //有可合成精灵  全部合成
        RPT_MAIL: 13, //有新邮件    点击
        RPT_REWARD: 27, //有未领取的奖励 无可领取
        RPT_PET_FORMATION: 30, //可上阵精灵   无可上阵
        RPT_PET_LVUP: 31, //可升级 不可升级
        RPT_PET_THROUGH: 32, //可喂养 不可喂养
        RPT_PET_EVOLUTION: 33, //可进化 不可进化
        RPT_PET_WAKE: 34, //觉醒可解锁 不可解锁
        RPT_PET_STAR: 35, //可升阶、可升星 不可升阶、升星
        RPT_PET_SKIN: 36, //外观可解锁 不可解锁
        RPT_PET_ASSIT: 37, //可上阵助战精灵 无可上阵
        RPT_EQUIP_1: 38, //未装备任何特性 点击
        RPT_EQUIP_2: 39, //未装备任何特性 点击
        RPT_EQUIP_3: 40, //未装备任何特性 点击
        RPT_FRIEND_INVITE: 41, //有邀请 无邀请
        RPT_MAP_REWARD: 51, //章节内还有可领取宝箱  无可领取
        RPT_BADGE: 55, //获得新徽章   点击
    },

    USER_LOG: {
        GAME_INFO: 1, //获取游戏版本信息
        CHECK_UPDATE: 2, //检查更新
        UPDATE_END: 3, //更新完成 预加载开始
        PRELOAD_END: 4, //预加载 结束


        LOGIN_CLICK: 5, //点击登录
        SDK_LOGIN_END: 6, //SDK登录成功 开始账号登陆

        ACCOUNT_LOGIN_END: 7, //账号登陆成功 开始获取服务器列表

        CONNECT_SERVER: 8, //开始连接服务器

        CREATE_ROLE_START: 9, //开始创角
        CREATE_ROLE_END: 10, //创角结束

        LOADING_START: 11, //开始进去主城
        LOADING_END: 12, //进入到主城

        DRAMA_START: 13, //播放剧情
        DRAMA_END: 14, //剧情播放结束
        RECHARGE: 15, //充值
        INTO_RECHARGE : 16, //充值页面
        INTO_MONTH_CARD: 17, //月卡页面
        INTO_YEAR_CARD: 18, //年卡页面
        INTO_VIP_WELFARE: 19, //VIP福利页面
        INTO_TOTAL_RECHARGE: 20, //累计充值页面
        INTO_FIRST_RECHARGE: 21, //首冲页面
        INTO_RECHARGEREWARD: 22, //充值活动页面

        GROUP_ID: 23, //剧情【00000】播放次数
        TASK_ID: 24, //任务【00000】完成次数
        ACTIVITY_REWARD_GET: 25, //活动【00000】的【00000】奖励领取次数
        MANAGE_INTO: 26, //【异能开发】进入次数
        MANAGE_GET: 27, //【异能开发】征收
        MANAGE_UP: 28, //【异能开发】升级
        MANAGE_USE: 29, //【异能开发】恢复

        MARRIAGE_INTO: 30, //点击【灵器连携】
        MARRIAGE_SUCCESS: 31, //连携成功时记录

        AFFAIR_INTO: 32, //点击【危机处理】
        AFFAIR_GET: 33, //危机处理成功时记录次数

        GUIDE_BEGIN: 34, //引导开始
        GUIDE_END: 35, //引导结束

        BEAUTY_INTO: 36, //女神-进入
        BEAUTY_PRAY: 37, //女神-祈祷
        BEAUTY_REWARD: 38, //女神-赏赐
        BEAUTY_UP: 39, //女神-升级
        BEAUTY_DATE: 40, //女神-约会

        CHILD_INTO: 41, //灵器-进入
        CHILD_UP: 42, //灵器-锻造
        CHILD_USE: 43, //灵器-使用道具恢复

        UPGRADE_INTO: 44, //异能-进入
        UPGRADE_UP: 45, //异能-升级

        HERO_INTO: 46, //守护灵-进入
        HERO_UP: 47, //守护灵-升级
        HERO_PROMOTE: 48, //守护灵-提拔
        HERO_SKILLUP: 49, //守护灵-异能升级
        HERO_BOOKUP: 50, //守护灵-书籍升级

        ARTIFACT_INTO: 51, //神器-进入
        ARTIFACT_ACTIVE: 52, //神器-激活
        ARTIFACT_UP: 53, //神器-强化
        ARTIFACT_STAR: 54, //神器-升星
        ARTIFACT_REWARD: 55, //神器-回馈奖励领取
        ARTIFACT_BUY: 56, //神器-特惠礼包购买

        SHOP_INTO: 57, //商城-进入
        SHOP_LIMITBUY: 58, //商城-单品限购
        SHOP_GIFTBUY: 59, //商城-特惠礼包

        WELFARE_INTO: 60, //福利-进入
        WELFARE_SIGN: 61, //福利-签到

        BAG_INTO: 66, //背包-进入

        ACHIEVEMENT_INTO: 67, //伊甸任务

        CHAT_INTO: 69, //聊天-进入
        CHAT_SHARE: 70, //聊天-分享

        FEATURE_INTO: 71, //我要变强

        ACTIVITY_CLANRANK: 72, //协会冲榜
        ACTIVITY_PERSONALRANK: 73, //个人冲榜
        TIMEREWARD_INTO: 74, //限时奖励

        RECHAGEREWARD_DAILY: 76, //充值奖励-每日充值
        RECHAGEREWARD_TOTAL: 77, //充值奖励-累计充值
        RECHAGEREWARD_DAY: 78, //充值奖励-累天充值

        LOGIN:301,      // 登录
        LOGOUT:302,     // 登出
        QUEST_REWARD_GET: 303 ,     // 任务领取
        ITEM_CHANGE:304,            // 物品流水
        RECHARGE_FINISH:305,        // 充值完成.
        NEW_GUIDE:306,              // 新手引导.
        BATTLE_FIELD:307,           // 战斗篇章的加载情况.
    },

    BATTLE_TYPE: {
        DEVILS_TOWER: 2,
    },
};
gE;
