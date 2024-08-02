
cc.Class({
    extends: require("BaseView"),

    properties: {
        okBtn:cc.Button,
    },
    statics: {
        instance:null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._super();
        this.setUIID(gUIIDs.UI_REVIVE_TIP);
        this.setClickEvent(this.okBtn.node, this.onOkBtn.bind(this));
    },
    destroy() {
        this._super();
    },

    onOkBtn() {
        this.removeSelf();
        NotifyMgr.send(AppNotify.ContinueTheGame);
    },

    start() {
    },

    // update (dt) {},
});
