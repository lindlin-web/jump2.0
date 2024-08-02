let telegramUtil = require('../Script/Common/TelegramUtils');
var ZMBoostsPage = cc.Class({
    extends: require('BaseView'),

    properties: {
        theItems:[cc.Node],
        coin:cc.Label,
    },
    statics: {
        instance: null
    },

    onLoad() {
        ZMBoostsPage.instance = this;
        this.setUIID(gUIIDs.UI_BOOSTS_PAGE);

        telegramUtil.onSetBgColor(HEAD_COLORS.TITLE_COIN_MONEY);
        telegramUtil.onSetHeaderColor(HEAD_COLORS.TITLE_COIN_MONEY);

        this._super();
        this.refresh();

        GameTool.copyBottomNode(gUIIDs.UI_BOOSTS_PAGE,this.node.getChildByName("wrapper"));
    },

    onDestroy() {
        this._super();
        ZMBoostsPage.instance = null;
    },

    refresh() {
        this.coin.string = GameData.UsersProxy.getMyMoney() + "";
        for(let i = 0; i < this.theItems.length; i++) {
            let item = this.theItems[i];
            // 在这里...获得我的等级.
            let levelLabel = item.getChildByName("lv").getComponent(cc.Label);
            let level = GameData.UsersProxy.getMyUpgradeLevel(i);
            let isMax = GameData.UpgradeProxy.isMaxLevel(i+1, parseInt(level));         // 判断当前是否是最高等级
            if(isMax) {
                item.getChildByName("noMax").active = false;
                item.getChildByName("New Label").active = true;
            } else {
                item.getChildByName("noMax").active = true;
                item.getChildByName("New Label").active = false;
                level = parseInt(level);
                let cost = GameData.UpgradeProxy.getCostByTypeAndLevel((i+1),parseInt(level)+1);
                item.getChildByName("noMax").getChildByName("cost").getComponent(cc.Label).string = cost + "";
            }
            level = parseInt(level);
            levelLabel.string = "Lv " + level;
            this.setClickEvent(item, this.onItemClick.bind(this,i, level));
        }
    },

    onItemClick(type, level) {
        gUICtrl.openUI(gUIIDs.UPGRADE_TIP,null, {type:type+1, level: level});
    },


    start() {

    },

    onBackBtnClick() {
        this.removeSelf();
    },

    removeSelf() {
        this._super();
    },


    listNotificationInterests() {
        return [
            AppNotify.ClubMemberMes,
            AppNotify.UPGRADE_DONE
        ];
    },

    handleNotification(key, data) {
        switch (key) {
            case AppNotify.ClubMemberMes:
                this.handleClubMemberMes();
                break;
            case AppNotify.UPGRADE_DONE:
                this.refresh();
                break;

        }
    },

});
