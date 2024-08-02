
/** 需要提供两个参数 {coin:10, coupons:20}
 */
var RankRewardPanel = cc.Class({
    extends: require("BaseDialog"),

    properties: {
        coinNode:cc.Node,
        couponNode:cc.Node,
        coinLabel:cc.Label,
        couponLabel:cc.Label,
    },
    statics: {
        instance:null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        RankRewardPanel.instance = this;
        this._super();
        this.setUIID(gUIIDs.UI_RANK_REWARD_PANEL);
    },
    destroy() {
        this._super();
        RankRewardPanel.instance = null;
    },

    onCloseClick() {
        this._super();
        //GameData.GameProxy.readNotice(this.id);
    },
    
    start() {
        let coin = this.getParams()['coin'];
        let coupons = this.getParams()['coupons'];
        this.id = this.getParams()['id'];
        this.coinNode.active = false;
        this.couponNode.active = false;
        if(coin >= 0) {
            this.coinNode.active = true;
            this.coinLabel.string = coin + "";
        }
        if(coupons >= 0) {
            this.couponNode.active = true;
            this.couponLabel.string = coupons + "";
        }
    },

});
