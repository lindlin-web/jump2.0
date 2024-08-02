
var GameTip = cc.Class({
    extends: require("BaseView"),

    properties: {
        tip1:cc.Node,
        tip2:cc.Node,
        tip3:cc.Node,
        tip4:cc.Node,
    },
    statics: {
        instance:null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        GameTip.instance = this;
        this._super();
        this.setUIID(gUIIDs.UI_GAME_TIP);
        // 入参应该是  {type: 1|2|3|4, value: "COPIED" | "Not enough coupons"}
        let type  = this.getParams()['type'];
        let moveNode = this.tip1;
        if(type == 1) {
            this.tip1.active = true;
            this.tip2.active = false;
            this.tip3.active = false;
            this.tip4.active = false;
            let value = this.getParams()["value"];
            this.tip1.getChildByName("label").getComponent(cc.Label).string = "+" + value;
        }
        else if(type == 2) {
            this.tip1.active = false;
            this.tip2.active = true;
            this.tip3.active = false;
            this.tip4.active = false;
            let value = this.getParams()["value"];
            this.tip2.getChildByName("label").getComponent(cc.Label).string = "+" + value;
            moveNode = this.tip2;
        } else if(type == 3) {
            let value = this.getParams()["value"];
            this.tip3.active = true;
            this.tip1.active = false;
            this.tip2.active = false;
            this.tip4.active = false;
            this.tip3.getChildByName("label").getComponent(cc.Label).string = "" + value;
            moveNode = this.tip3;
        } else if(type == 4) {
            this.tip1.active = false;
            this.tip2.active = false;
            this.tip3.active = false;
            this.tip4.active = true;
            let value = this.getParams()["value"];
            this.tip4.getChildByName("label").getComponent(cc.Label).string = "+" + value;
            moveNode = this.tip4;
        }
        let target = moveNode.y + 100;
        cc.tween(moveNode).to(0.3, {y:target}).delay(0.8).to(0.2, {opacity:0}).call(()=>{
            this.removeSelf();
        }).start();
    },
    destroy() {
        this._super();
        GameTip.instance = null;
    },

    // update (dt) {},
});
