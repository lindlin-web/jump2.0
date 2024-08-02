
var TheGiftTip = cc.Class({
    extends: require("BaseDialog"),

    properties: {
        gold:cc.Node,               // 金币
        tonMoney:cc.Node,             // 体力券

        collectBtn:cc.Button,
    },

    statics:{
        instance:null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        TheGiftTip.instance = this;
        this._super();
        this.setUIID(gUIIDs.UI_THE_GIFT_TIP);
        this.setClickEvent(this.collectBtn, this.onRemoveSelf.bind(this));
        let type = this.getParams()["type"];
        let num = this.getParams()["num"];
        this.setType(type, num);
    },

    setType(type, num) {
        this.gold.active = false;
        this.tonMoney.active = false;
        if(type == 1) {
            this.gold.active = true;
            this.gold.getChildByName("num").getComponent(cc.Label).string = "+" + num;
        } else if(type == 2) {
            this.tonMoney.active = true;
            this.tonMoney.getChildByName("num").getComponent(cc.Label).string = "+" + num;
        }
    },

    onRemoveSelf() {
        this.removeSelf();
    },

    destroy() {
        this._super();
        TheGiftTip.instance = null;
    },

    start() {

    },

    // update (dt) {},
});
