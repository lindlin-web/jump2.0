//通用枚举
let mE = window.gE;
//通用数据
let mCDatas = window.gCDatas;
//ui控制
let mUICtrl = window.gUICtrl;

//配置管理
let mCfgMgr = window.gCfgMgr;
let mCfgs = window.gCfgs;
//通用函数
let mFuncs = window.gFuncs;
//消息发送接收数据
let mGameCmd = window.gGameCmd;
let mDataMgr = window.gDataMgr;

cc.Class({
    extends: cc.Component,

    properties: {
        mBaseView: null,
    },

    onLoad() {

    },

    getBaseView(){
        return this.mBaseView;
    },
});
