
var InSufCouponsTip = cc.Class({
    extends: require("BaseDialog"),

    properties: {
        joinBtn:cc.Button,
        quitBtn:cc.Button,
    },
    statics: {
        instance:null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        InSufCouponsTip.instance = this;
        this._super();
        this.setUIID(gUIIDs.UI_INSUF_COUPONS);
        this.setClickEvent(this.joinBtn, this.onBtnTaskClick.bind(this));
        this.setClickEvent(this.quitBtn, this.onBtnEscClick.bind(this));
    },
    destroy() {
        this._super();
        InSufCouponsTip.instance = null;
    },

    onBtnTaskClick() {
        this.removeSelf();
        gUICtrl.openUI(gUIIDs.UI_TASKS,null, {index:3});
    },

    onBtnEscClick() {
        this.removeSelf();
    },

    start() {

    },
    // update (dt) {},
});
