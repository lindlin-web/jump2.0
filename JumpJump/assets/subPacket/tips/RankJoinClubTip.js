
var RankJoinClubTip = cc.Class({
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
        RankJoinClubTip.instance = this;
        this._super();
        this.setUIID(gUIIDs.UI_RANK_JOIN_TIP);
        this.setClickEvent(this.joinBtn.node, this.onBtnJoinClick.bind(this));
        this.setClickEvent(this.quitBtn.node, this.onBtnEscClick.bind(this));
    },
    destroy() {
        this._super();
        RankJoinClubTip.instance = null;
    },

    onBtnJoinClick() {
        GameData.ClubProxy.askForJoinClub(this.tgGid);            // ”我“ 请求加入某个俱乐部
    },

    onBtnEscClick() {
        this.removeSelf();
    },

    start() {
        this.tgGid = this.getParams()['tgGid'];
    },

    /**  加入某个社团 */
    handleJoinGroup() {
        this.removeSelf();
    },

    listNotificationInterests() {
        return [
            AppNotify.JOIN_GROUP,
        ];
    },

    handleNotification(key, data) {
        switch (key) {
            case AppNotify.JOIN_GROUP:
                this.handleJoinGroup();
                break;
        }
    },

    // update (dt) {},
});
