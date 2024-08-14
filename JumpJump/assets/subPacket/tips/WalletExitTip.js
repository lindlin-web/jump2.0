
cc.Class({
    extends: require("BaseView"),

    properties: {
        joinBtn:cc.Button,
        quitBtn:cc.Button,

        tipStr:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._super();
        this.setUIID(gUIIDs.UI_WALLET_EXIT_TIP);
        this.setClickEvent(this.joinBtn, this.onBtnExitClick.bind(this));
        this.setClickEvent(this.quitBtn, this.onBtnEscClick.bind(this));
        let str = this.getParams()["tip"];
        this.tipStr.string = str;
        this.yesFun = this.getParams()["yesFun"];
        let showNo = this.getParams()["showNo"];
        if(showNo === false) {
            this.quitBtn.node.active = false;
        } else {
            this.quitBtn.node.active = true;
        }
    },
    destroy() {
        this._super();
    },

    onBtnExitClick() {
        if(this.yesFun) {
            this.yesFun();
        }
        this.removeSelf();
    },

    onBtnEscClick() {
        this.removeSelf();
    },

    start() {

    },

    /**  加入某个社团 */
    handleExitGroup() {
        this.removeSelf();
    },

    // update (dt) {},
});
