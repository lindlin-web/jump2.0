
var RankExitClubTip = cc.Class({
    extends: require("BaseView"),

    properties: {
        joinBtn:cc.Button,
        quitBtn:cc.Button,
    },
    statics: {
        instance:null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        RankExitClubTip.instance = this;
        this._super();
        this.setUIID(gUIIDs.UI_RANK_EXIT_TIP);
        this.setClickEvent(this.joinBtn, this.onBtnExitClick.bind(this));
        this.setClickEvent(this.quitBtn, this.onBtnEscClick.bind(this));
    },
    destroy() {
        this._super();
        RankExitClubTip.instance = null;
    },

    onBtnExitClick() {
        GameData.ClubProxy.askForLeaveClub(this.tgGid);            // ”我“ 请求加入某个俱乐部
    },

    onBtnEscClick() {
        this.removeSelf();
    },

    start() {
        this.tgGid = this.getParams()['tgGid'];
    },

    /**  加入某个社团 */
    handleExitGroup() {
        this.removeSelf();
    },

    listNotificationInterests() {
        return [
            AppNotify.LEAVE_GROUP,
        ];
    },

    handleNotification(key, data) {
        switch (key) {
            case AppNotify.LEAVE_GROUP:
                this.handleExitGroup();
                break;
        }
    },

    // update (dt) {},
});
