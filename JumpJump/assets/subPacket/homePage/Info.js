cc.Class({
    extends: require('BaseView'),

    properties: {
        cupous: cc.Node,
        gold:cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.cupous.active = true;
        this.gold.active = true;
        this.onShowHomePage();
    },

    start() {
        
    },

    /** 当homePage被显示的时候 */
    onShowHomePage() {
        this.cupous.x = -19.718;
        this.cupous.y = -66;
    },

    /** 当homePage被关闭的时候 */
    onHideHomePage() {
        this.cupous.x = 205;
        this.cupous.y = 5;
    },

    listNotificationInterests() {
        return [
            gGSM.BEGIN_GAME,
            AppNotify.UserInfoChange
        ];
    },

    updateMoney() {
        this.cupous.active = true;
        this.gold.active = true;

        let goldLabel = this.gold.getChildByName('num').getComponent(cc.Label);
        let gold = GameData.UsersProxy.getMyGold() + "";
        let val = GameTool.convertNumberToString(gold);
        goldLabel.string = val;

        let cupousLabel = this.cupous.getChildByName("num").getComponent(cc.Label);
        cupousLabel.string = GameData.UsersProxy.getMyTonGold();

        this.scheduleOnce(()=>{
            // let width = goldLabel.node.getContentSize().width;
            // let height = goldLabel.node.getContentSize().height;
            // this.gold.setContentSize(width + 80, height);
            // goldLabel.node.setPosition((width + 80)/2, 0);

            // width = cupousLabel.node.getContentSize().width;
            // height = cupousLabel.node.getContentSize().height;
            // this.cupous.setContentSize(width + 80, height);
            // cupousLabel.node.setPosition((width + 80)/2, 0);

        }, 0.0);
    },


    handleNotification(key, data) {
        switch (key) {
            case gGSM.BEGIN_GAME:
                this.updateMoney();
                break;
             case AppNotify.UserInfoChange:
                this.updateMoney();
                break;
        }
    },



    // update (dt) {},
});
