
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
        NotifyMgr.send(AppNotify.BONUS_TIP_CLOSE);      // 可以发送一些别的事件.
    },

    start() {
    },

    // update (dt) {},
});
