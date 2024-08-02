
cc.Class({
    extends: require("BaseView"),

    properties: {
        okBtn:cc.Button,
        msg:cc.Label,
    },
    statics: {
        instance:null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._super();
        this.setUIID(gUIIDs.UI_GIFT_TIP);
        this.setClickEvent(this.okBtn.node, this.onOkBtn.bind(this));
        let tip = this.getParams()["msg"];
        this.msg.string = tip;
    },
    destroy() {
        this._super();
    },


    onOkBtn() {
        this.removeSelf();
    },

    start() {
    },

    // update (dt) {},
});
