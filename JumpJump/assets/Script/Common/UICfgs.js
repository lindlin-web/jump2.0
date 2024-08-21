//// UI类型
let TYPE_DIALOG = gE.VTYPE.DIALOG;
let TYPE_SCENE = gE.VTYPE.SCENE;
let TYPE_VIEW = gE.VTYPE.VIEW;
let TYPE_FULLVIEW = gE.VTYPE.FULLVIEW;
//// 层级
let MAXORDER = gE.ORDER.MAX;
let VIEWORDER = gE.ORDER.VIEWORDER;
let HIGHORDER = gE.ORDER.HIGHORDER;
let TOPBARORDER = gE.ORDER.TOPBARORDER;
let DIALOGORDER = gE.ORDER.DIALOGORDER;
//// 界面属于哪个主页
let PAGE_MAINCITY = 0;
let PAGE_TEAM = 1;
let PAGE_TOWN = 2;
let PAGE_RESORT = 3;
let PAGE_INSTANCE = 4;
let PAGE_DRAW = 5;

let uiids = {};
let uiCfgs = {};

var layerIndex = 0;
var UIOrder = window.UIOrder = {
    /** 主场景层Canvas层 */
    Main: (++layerIndex) * 100,
    /** 默认层(不指定层级时，都会使用该层) */
    First: (++layerIndex) * 100,
    Default: null,
    /** 高于First的层(如果是弹窗，尽量使用Dialog) */
    Second: (++layerIndex) * 100,
    /** 弹窗层 */
    Dialog: (++layerIndex) * 100,
    /** 引导层 */
    Guide: (++layerIndex) * 100,
    /** 剧情层 */
    Drama: (++layerIndex) * 100,
    /** 警告层 */
    Alert: (++layerIndex) * 100,
    /** 提示层 */
    Toast: (++layerIndex) * 100,
    Loading: (++layerIndex) * 100,
    ScreenAdaptor: (++layerIndex) * 100,
    Block: (++layerIndex) * 100,
};
UIOrder.Default = UIOrder.First;

var identifiedID = 900000;
/** 获取自增ID */
function getAutoIncreaseID(layer) {
    return ++identifiedID;
}
/* {
    type:   用来区分场景还是弹窗
    res:    对应的预制资源路径
    js:     对应的js组件脚本
    order:  界面弹窗所在的层级
    dataMgr:    界面对应的数据管理模块
    mainPage:   是否为主界面主要分页
    page:   所属的主界面分页,设置后打开该界面前会先跳转到该主页
    parentUI:   所属的父界面，打开这个界面只会打开父界面(父界面的uiid定义必须放在子界面前面！很重要)
    defaultParams:  默认设置的透传参数，如果有父界面UI，那么透传参数给父界面
    isInstance:     是否单例，单例必须为弹窗类型，关闭后不销毁只是隐藏，下次打开直接显示不重新构造
    isTopBar: 是否显示顶栏
    isPersist: 是否为永久
 }*/

/** 载入界面 */
uiids.UI_HOME = getAutoIncreaseID();
uiCfgs[uiids.UI_HOME] = {
    type: TYPE_SCENE,
    order: UIOrder.Main,
    res: "Loading",
    js: "ZMMainHome",
},

uiids.UI_BOX_1 = getAutoIncreaseID();
uiCfgs[uiids.UI_BOX_1] = {
    order: UIOrder.Dialog,
    res: "ui/jpzmg/boxes/pre_box_1",
    js: "Box",
},

uiids.UI_RESULT_PAGE = getAutoIncreaseID();
uiCfgs[uiids.UI_RESULT_PAGE] = {
    order: UIOrder.Dialog,
    res: "ui/jpzmg/resultPage",
    js: "ZMResultPage",
},


uiids.UI_FRIEND_PAGE = getAutoIncreaseID();
uiCfgs[uiids.UI_FRIEND_PAGE] = {
    order: UIOrder.Dialog,
    res: "ui/jpzmg/friendsPage",
    js: "ZMFriendPage",
},

uiids.UI_RANK_PAGE = getAutoIncreaseID();
uiCfgs[uiids.UI_RANK_PAGE] = {
    order: UIOrder.Dialog,
    res: "ui/jpzmg/rankPage",
    js: "ZMRankPage",
},

uiids.UI_CLUB_PAGE = getAutoIncreaseID();
uiCfgs[uiids.UI_CLUB_PAGE] = {
    order: UIOrder.Dialog,
    res: "ui/jpzmg/clubPage",
    js: "ZMClubPage",
},

uiids.UI_DIALOGBG = getAutoIncreaseID();
uiCfgs[uiids.UI_DIALOGBG] = {
    order: UIOrder.Dialog,
    res: "ui/DialogBg",
    js: "DialogBg",
},


uiids.UI_RANK_REWARD_TIP = getAutoIncreaseID();
uiCfgs[uiids.UI_RANK_REWARD_TIP] = {
    order: UIOrder.Dialog,
    res: "ui/jpzmg/rankRewardTip",
    js: "RankRewardTip",
},

uiids.UI_RANK_REWARD_CLUB = getAutoIncreaseID();
uiCfgs[uiids.UI_RANK_REWARD_CLUB] = {
    order: UIOrder.Dialog,
    res: "ui/jpzmg/rankRewardClub",
    js: "RankRewardClub",
},

uiids.UI_LOADINGPROGRESS = getAutoIncreaseID();
uiCfgs[uiids.UI_LOADINGPROGRESS] = {
    order: UIOrder.Dialog,
    res: "ui/jpzmg/LoadingProgress",
    js: "LoadingProgress",
},

uiids.UI_RANK_JOIN_TIP = getAutoIncreaseID();
uiCfgs[uiids.UI_RANK_JOIN_TIP] = {
    order: UIOrder.Dialog,
    res: "ui/jpzmg/rankJoinTip",
    js: "RankJoinClubTip",
},

uiids.UI_RANK_EXIT_TIP = getAutoIncreaseID();
uiCfgs[uiids.UI_RANK_EXIT_TIP] = {
    order: UIOrder.Dialog,
    res: "ui/jpzmg/rankExitTip",
    js: "RankExitClubTip",
},

uiids.UI_GAME_TIP = getAutoIncreaseID();
uiCfgs[uiids.UI_GAME_TIP] = {
    order: UIOrder.Dialog,
    res: "ui/jpzmg/gameTip",
    js: "GameTip",
},

uiids.UI_TASKS = getAutoIncreaseID();
uiCfgs[uiids.UI_TASKS] = {
    order: UIOrder.Dialog,
    res: "ui/jpzmg/tasksPage",
    js: "ZMTaskPage",
},

/** 排名奖励面板 */
uiids.UI_RANK_REWARD_PANEL = getAutoIncreaseID();
uiCfgs[uiids.UI_RANK_REWARD_PANEL] = {
    order: UIOrder.Dialog,
    res: "ui/jpzmg/rankRewardPanel",
    js: "RankRewardPanel",
},

uiids.UI_INSUF_COUPONS = getAutoIncreaseID();
uiCfgs[uiids.UI_INSUF_COUPONS] = {
    order: UIOrder.Dialog,
    res: "ui/jpzmg/InSufCoupons",
    js: "InSufCouponsTip",
},

uiids.UI_INSUF_ENERGY = getAutoIncreaseID();
uiCfgs[uiids.UI_INSUF_ENERGY] = {
    order: UIOrder.Dialog,
    res: "ui/jpzmg/InSufEnergy",
    js: "InSufEnergyTip",
},

uiids.FINISH_TOTURIAL_TIP = getAutoIncreaseID();
uiCfgs[uiids.FINISH_TOTURIAL_TIP] = {
    order: UIOrder.Dialog,
    res: "ui/jpzmg/finishToturialTip",
    js: "FinishToturialTip",
},

uiids.SETTING_TIP = getAutoIncreaseID();
uiCfgs[uiids.SETTING_TIP] = {
    order: UIOrder.Dialog,
    res: "ui/jpzmg/settingTip",
    js: "ZMSettingPage",
},

uiids.UPGRADE_TIP = getAutoIncreaseID();
uiCfgs[uiids.UPGRADE_TIP] = {
    order: UIOrder.Dialog,
    res: "ui/jpzmg/upgradeTip",
    js: "UpgradeTip",
},

uiids.UI_BOOSTS_PAGE = getAutoIncreaseID();
uiCfgs[uiids.UI_BOOSTS_PAGE] = {
    order: UIOrder.Dialog,
    res: "ui/jpzmg/BoostsPage",
    js: "ZMBoostsPage",
},

uiids.UI_WALLET_PAGE = getAutoIncreaseID();
uiCfgs[uiids.UI_WALLET_PAGE] = {
    order: UIOrder.Dialog,
    res: "ui/jpzmg/walletsPage",
    js: "ZMWalletsPage",
},

uiids.UI_THE_GIFT_TIP = getAutoIncreaseID();
uiCfgs[uiids.UI_THE_GIFT_TIP] = {
    order: UIOrder.Dialog,
    res: "ui/jpzmg/theGiftPanel",
    js: "TheGiftTip",
},

uiids.UI_GIFT_TIP = getAutoIncreaseID();
uiCfgs[uiids.UI_GIFT_TIP] = {
    order: UIOrder.Dialog,
    res: "ui/jpzmg/GiftTip",
    js: "GiftTip",
},

uiids.UI_WITHDRAW_TIP = getAutoIncreaseID();
uiCfgs[uiids.UI_WITHDRAW_TIP] = {
    order: UIOrder.Dialog,
    res: "ui/jpzmg/withDrawTip",
    js: "WithDrawTip",
},

uiids.UI_REVIVE_TIP = getAutoIncreaseID();
uiCfgs[uiids.UI_REVIVE_TIP] = {
    order: UIOrder.Dialog,
    res: "ui/jpzmg/ReviveCoupon",
    js: "ReviveCoupon",
},
uiids.UI_WALLET_EXIT_TIP = getAutoIncreaseID();
uiCfgs[uiids.UI_WALLET_EXIT_TIP] = {
    order: UIOrder.Dialog,
    res: "ui/jpzmg/walletExitTip",
    js: "WalletExitTip",
},

uiids.UI_BONUS_TIP = getAutoIncreaseID();
uiCfgs[uiids.UI_BONUS_TIP] = {
    order: UIOrder.Dialog,
    res: "ui/jpzmg/BonusTip",
    js: "BonusTip",
},




window.gUIIDs = uiids;
var gUIIDs = window.gUIIDs = uiids;
gUIIDs;
var gUICfgs = window.gUICfgs = uiCfgs;

/**  给默认order */

for (var key in uiCfgs) {
    var cfg = uiCfgs[key];
    if (cfg && cfg.order == null) {
        cfg.order = UIOrder.Default;
    }
}
