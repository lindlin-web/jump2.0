
cc.Class({
    extends: require("BaseView"),

    properties: {
        okBtn:cc.Button,
        theBack:cc.Node,
        theSpriteFrames:[cc.SpriteFrame],
        theSprite:cc.Sprite,
        theNum:cc.Label,        // 就是奖励的数值是多少...
    },
    statics: {
        instance:null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._super();
        this.setUIID(gUIIDs.UI_BONUS_TIP);
        this.setClickEvent(this.okBtn.node, this.onOkBtn.bind(this));
        let types = [ "Money1","Money2"];   // money1 是金币， money2 是ton 币
        let typeName = this.getParams()["ptype"];
        let index = types.indexOf(typeName);
        this.theSprite.spriteFrame = this.theSpriteFrames[index];
        let score = this.getParams()["score"];
        this.theNum.string = "+" + score;
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

    update (dt) {
        this.theBack.angle += 20 * dt;
        this.theBack.angle %= 360;
    },
});
