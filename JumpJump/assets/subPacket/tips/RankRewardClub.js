
var RankRewardClub = cc.Class({
    extends: require("BaseDialog"),

    properties: {
        
    },

    statics:{
        instance:null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        RankRewardClub.instance = this;
        this._super();
        this.setUIID(gUIIDs.UI_RANK_REWARD_CLUB);
    },
    destroy() {
        this._super();
        RankRewardClub.instance = null;
    },

    start() {

    },

    // update (dt) {},
});
