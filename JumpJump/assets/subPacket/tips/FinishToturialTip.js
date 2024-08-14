
var FinishToturialTip = cc.Class({
    extends: require("BaseDialog"),

    properties: {
        startBtn:cc.Button,
    },
    statics: {
        instance:null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        FinishToturialTip.instance = this;
        this._super();
        this.setUIID(gUIIDs.FINISH_TOTURIAL_TIP);
        this.setClickEvent(this.startBtn, this.onStartBtnClick.bind(this));
    },
    destroy() {
        this._super();
        FinishToturialTip.instance = null;
    },

    onStartBtnClick() {
        console.log("开始我的游戏");
        GameData.UsersProxy.askForServerUpdateStep(1);
        cc.director.loadScene("JJUIMain", function(error) {
            if (error) {
                return;
            }
            GameTool.sendPointToServer("Guide_to_game");
        }.bind(this));
    },

    onBtnEscClick() {
        this.removeSelf();
    },

    // update (dt) {},
});
