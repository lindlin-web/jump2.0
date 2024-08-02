
var InSufEnergyTip = cc.Class({
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
        InSufEnergyTip.instance = this;
        this._super();
        this.setUIID(gUIIDs.UI_INSUF_ENERGY);
        this.setClickEvent(this.joinBtn, this.onBtnTaskClick.bind(this));
        this.setClickEvent(this.quitBtn, this.onBtnEscClick.bind(this));
    },
    destroy() {
        this._super();
        InSufEnergyTip.instance = null;
    },

    onBtnTaskClick() {
        this.removeSelf();
        gUICtrl.openUI(gUIIDs.UI_TASKS,null);
    },

    onBtnEscClick() {
        this.removeSelf();
    },

    start() {

    },
    // update (dt) {},
});
