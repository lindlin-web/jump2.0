var AppNotify = window.AppNotify = {
    /** 主场景加载完成，一般性数值已经预备好 */
    MainSceneLoaded: "MainSceneLoaded",
    /** 新的一天到来了 */
    NEW_DAY_COME: "NEW_DAY_COME",
    LocaleChange: "LocaleChange",
    /** 进入游戏，可以用于更新自身的数据或者断线重连后的数据确认 */
    EnterGameForHasRole: "EnterGameForHasRole",
    EnterGame: "EnterGame",
    /** 连接断开，特殊界面要处理自身，比如关闭界面 */
    ConnectClosed: "ConnectClosed",
    ConnectError: "ConnectError",
    Reconnect: "Reconnect",
    /**
     * 热更新进度
     * @param loadedBytes
     * @param totalBytes
     * @param loadedFiles
     * @param totalFiles
     * @param progressMsg
     */
    HotUpdateProgress: "HotUpdateProgress",
    HotUpdateFoundNewVersion: "HotUpdateFoundNewVersion",
    HotUpdateAlreadyUpToDate: "HotUpdateAlreadyUpToDate",
    HotUpdateSkip: "HotUpdateSkip",

    /**
     * 副本战斗开始
     * @param chapter_id
     * @param checkpoint_id
     * @param section_index
     */
    CheckpointBegin: "CheckpointBegin",
    /**
     * 副本战斗结束
     * @param chapter_id
     * @param checkpoint_id
     * @param section_index
     */
    CheckpointEnd: "CheckpointEnd",
    CheckpointInit: "CheckpointInit",
    /**
     * 关卡战斗结束
     * @param chapter_id
     * @param checkpoint_id
     * @param section_index
     * @param isWin
     */
    ChapterPlayEnd: "ChapterPlayEnd",
    /**
     * 道具变动
     * @param itemID
     * @param prevCnt
     * @param curCnt
     * @param type
     */
    ItemChange: "ItemChange",


    /** 功能已解锁 */
    FeatureHasUnlocked: "FeatureHasUnlocked",
    /** 功能解锁 */
    FeatureUnlock: "FeatureUnlock",
    /** 下一个要解锁的功能改变了 */
    FeatureNextIDChange: "FeatureNextIDChange",

    /**活动变动 */
    ActivityValueChange: "ActivityValueChange",
    /**限时奖励红点变动 */
    TimeRewardReminderChange: "TimeRewardReminderChange",
    /**活动红点变动 */
    ActivityReminderChange: "ActivityReminderChange",
    /**跨服活动红点变动 */
    ActivityServerReminderChange: "ActivityServerReminderChange",
    /**经营资产变动 */
    ManageChange: "ManageChange",
    /** 功能解锁开始 */
    FeatureUnlockGuideStart: "FeatureUnlockGuideStart",
    /** 功能解锁结束 */
    FeatureUnlockGuideFinish: "FeatureUnlockFinish",
    /** 回到主城 */
    BackToMainCity: "BackToMainCity",
    BackToMainHome: "BackToMainHome",
    BackToMainScene: "BackToMainScene",
    /** 英雄初始化 */
    HeroInit: "HeroInit",
    /* 获得新英雄 */
    HeroNumChange: "HeroNumChange",
    BeautyInit: "BeautyInit",
    BeautyNumChange: "BeautyNumChange",
    /** 子嗣初始化 */
    ChildInit: "ChildInit",
    /** 子嗣数量变化 */
    ChildNumChange: "ChildNumChange",
    /** 成年子嗣初始化 */
    ChildAdultInit: "ChildAdultInit",
    /** 成年子嗣数量变化 */
    ChildAdultNumChange: "ChildAdultNumChange",
    /** 角色等级初始 */
    UserLvInit: "UserLvInit",
    /** 角色等级变化
     * @param currUserLevel 当前新的角色等级
     * @param prevUserLevel 之前的角色等级
    */
    UserLvChange: "UserLvChange",

    /** 界面打开 uiid*/
    OnViewOpened: "OnViewOpened",
    /** 界面关闭 uiid*/
    OnViewClosed: "OnViewClosed",

    /** 引导状态改变了 */
    GuideStatusChange: "GuideStatusChange",
    /**
     * VIP状态改变(经验变化了，可能等级未变化，等级变化与否需要判断 currVIPLevel 与 prevVIPLevel 的差值)
     * @param currVIPLevel 当前新的VIP等级
     * @param prevVIPLevel 之前的VIP等级
     */
    VipChange: "VipChange",

    /** 开始学习 */
    AcademyStartStudy: "AcademyStartStudy",
    /** 功能预览显示 feature_id */
    FeatureDetailShow: "FeatureDetailShow",
    /** 功能预览关闭 feature_id */
    FeatureDetailHide: "FeatureDetailHide",
    /** 通知英雄模块，有新的英雄可获得
     * @param {*} hero_id 新的英雄ID
     * @param {*} data null
     * @param {*} backHandler 回调函数
     * @param {*} showNow 是否立刻展示
     * @param {*} type 获得门客方式
     * */
    GetNewHero: "GetNewHero",
    /** 通知红颜模块，有新的红颜可获得
     * @param {*} beauty_id 新的红颜ID
     * @param {*} data null
     * @param {*} backHandler 回调函数
     * @param {*} type 获得红颜方式
     * */
    GetNewBeauty: "GetNewBeauty",
    /** 战斗力变化
     * @param currValue 改后值
     * @param prevValue 改前值
     */
    BattleValueChange: "BattleValueChange",


    /** 子嗣等级更新
     * @param childInfo 子嗣信息
     * @param currLv 当前等级
     * @param prevLv 之前等级
     */
    ChildLvChange: "ChildLvChange",
    /**
     * 子嗣联姻
     * @param childInfo 子嗣信息
     */
    ChildBecomeMarried: "ChildBecomeMarried",
    /** 改名 */
    UserRename: "UserRename",
    /** 门客等级
     * @param id 门客ID
     * @param lv 升级等级
    */
    HeroLevelUp: "HeroLevelUp",
    /**
     * 引导模块开始
     * @param module_id
     * @param submodule_id
     */
    GuideModuleStart: "GuideModuleStart",
    /**
     * 引导模块结束
     * @param module_id
     * @param submodule_id
     */
    GuideModuleFinish: "GuideModuleFinish",
    /** 书籍升级 */
    BookLevelUp: "BookLevelUp",
    /** 红颜技能升级 */
    BeautySkillUp: "BeautySkillUp",
    /** 门客丹药 */
    UseMedicine: "UseMedicine",

    /** 创建角色 */
    CreateRole: "CreateRole",
    /** 开场剧情 */
    FirstDrama: "FirstDrama",
    /** 修改形象 */
    ChangeRole: "ChangeRole",
    /** 门客属性变化 */
    HeroAttributeChange: "HeroAttributeChange",
    /** 在门客获得展示时
     * @param hero_id
     */
    OnGetHeroShow: "OnGetHeroShow",


    GameLoginFailed: "GameLoginFailed",
    /** 账号绑定信息变更 */
    AccountBindChange: "AccountBindChange",
    EnterBackground: "EnterBackground",
    EnterForeground: "EnterForeground",
    /**
     * 充值成功
     * @param product_id
     */
    RechargeSuccess: "RechargeSuccess",

    /**
     * 同步资源主城刷新
     */
    SyncResourcesNnmber: "SyncResourcesNnmber",

    /** 每日活动红点 */
    ActivityDailyRed: "ActivityDailyRed",

    /** 光环升级 */
    HeroHaloLvUp: "HeroHaloLvUp",

    /** 副本结束 */
    DungeonEnd: "DungeonEnd",
    /** 副本开始 */
    DungeonStart: "DungeonStart",
    /** 获得神器 */
    ArtifactNumber: "ArtifactNumber",
    /** 引导结束 */
    SaveGuide: "SaveGuide",
    /** 手机剧情引导变化 */
    SaveGuidePhone: "SaveGuidePhone",
    /** 玩家战力变化 */
    PlayerBattleValueChange: "PlayerBattleValueChange",
    /** UI构建完成 */
    FinishUI: "FinishUI",

    /**  玩家选择了卡牌的东西 */
    OnCardSelected: "OnCardSelected",

    UserInfoChange: "UserInfoChange",

    StartTheGame: "StartTheGame",

    ContinueTheGame: "ContinueTheGame",

    RankToday: "RankToday",           // 当日分数排行榜...
    RankHistory: "RankHistory",         //  历史的分数排行榜...

    RankClub: "RankClub",                       // 群数据....
    RankCoin: "RankCoin",                       // 金币数据....

    ClubMemberMes: "ClubMemberMes",                         // 群信息....
    LEAVE_GROUP: "LEAVE_GROUP",                 // 离开某个群..
    JOIN_GROUP: "JOIN_GROUP",                   // 加入某个群..
    SHOW_FRIENDS:"SHOW_FRIENDS",                // 显示我的朋友...
    BackToMainHome: "BackToMainHome",                   // 重返主页... 
    USER_LOGIN:"USER_LOGIN",                    // 玩家登录的信息传递
    FETCH_TASKS: "FETCH_TASKS",                 // 获取任务列表.. 
    TASK_ACCURATE: "TASK_ACCURATE",             // 任务 累计.
    TASK_REFRESH:"TASK_REFRESH",                // 任务面板刷新.
    RANK_REWARD: "RANK_REWARD",                 // 排行榜的奖励..

    FETCH_TIME: "FETCH_TIME",                   // 获得了时间....
    FETCH_REVIVETICKET: "FETCH_REVIVETICKET",       // 获得了复活券...
    UPGRADE_DONE: "UPGRADE_DONE",               // 完成了升级有回包的时候。
    OFFLINE_BENEFIT: "OFFLINE_BENEFIT",         // 离线的收益是多少.....
    UPDATE_WALLET_DONE:"UPDATE_WALLET_DONE",    // 通知服务器钱包地址结束...
    WALLET_LOG:"WALLET_LOG",
    ON_TIME_OUT:"ON_TIME_OUT",                  // 时间结束的时候，出发一个时间.
    BONUS_TIP_CLOSE:"BONUS_TIP_CLOSE",                    // 
};
