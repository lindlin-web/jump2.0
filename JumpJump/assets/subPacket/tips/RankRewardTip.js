
var RankRewardTip = cc.Class({
    extends: require("BaseDialog"),

    properties: {
        escBttt:cc.Button,
    },

    statics:{
        instance:null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        RankRewardTip.instance = this;
        this._super();
        this.setUIID(gUIIDs.UI_RANK_REWARD_TIP);
    },
    destroy() {
        this._super();
        RankRewardTip.instance = null;
    },

    start() {

    },

    // update (dt) {},
});
