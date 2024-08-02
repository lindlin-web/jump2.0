cc.Class({
    extends: require('BaseView'),

    properties: {
        cupous: cc.Node,
        gold:cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.updateMoney();
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
        goldLabel.string = GameData.UsersProxy.getMyGold();

        let cupousLabel = this.cupous.getChildByName("num").getComponent(cc.Label);
        cupousLabel.string = GameData.UsersProxy.getMyCoupons();

        this.scheduleOnce(()=>{
            let width = goldLabel.node.getContentSize().width;
            let height = goldLabel.node.getContentSize().height;
            this.gold.setContentSize(width + 80, height);
            goldLabel.node.setPosition((width + 80)/2+10, 0);

            width = cupousLabel.node.getContentSize().width;
            height = cupousLabel.node.getContentSize().height;
            this.cupous.setContentSize(width + 80, height);
            cupousLabel.node.setPosition((width + 80)/2+10, 0);

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
