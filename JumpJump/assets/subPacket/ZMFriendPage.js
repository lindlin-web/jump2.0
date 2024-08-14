let telegramUtil = require('../Script/Common/TelegramUtils');
var ListViewCtrl = require('./utils/ListViewCtrl');
var ZMFriendPage = cc.Class({
    extends: require('BaseView'),

    properties: {
        tip:cc.Label,
        listView:ListViewCtrl,
        backBtn:cc.Button,
        friendNum:cc.Label,
        shareBtn:cc.Button,
    },
    statics: {
        instance: null
    },

    onLoad() {
        ZMFriendPage.instance = this;
        this.setUIID(gUIIDs.UI_FRIEND_PAGE);
        this._super();
        let bo = gUICtrl.isResultPageOpened()
        if(bo) {
            telegramUtil.onSetBgColor(HEAD_COLORS.RESULT);
            telegramUtil.onSetHeaderColor(HEAD_COLORS.RESULT);
        } else {
            telegramUtil.onSetBgColor(HEAD_COLORS.PREFAB);
            telegramUtil.onSetHeaderColor(HEAD_COLORS.PREFAB);
        }
        GameTool.copyBottomNode(gUIIDs.UI_FRIEND_PAGE,this.node.getChildByName("wrapper"));
        GameTool.sendPointToServer("friend");
    },

    onDestroy() {
        this._super();
        ZMFriendPage.instance = null;
    },
    start() {
        this.setClickEvent(this.backBtn, this.onBackBtnClick.bind(this));
        this.setClickEvent(this.shareBtn, this.onShareBtnClick.bind(this));
        GameData.FriendsProxy.askForFriends();
        this.tip.node.active = false;

        let t1 = cc.tween(this.shareBtn.node).to(1, {scaleX:2.1, scaleY:2.1})
        let t2 = cc.tween(this.shareBtn.node).to(1, {scaleX:2.0, scaleY:2.0})
        // let t3 = tween(this.btn_invite).call(() => {console.log('This is a callback') })
        this.inviteTween = cc.tween(this.shareBtn.node).sequence(t1, t2).repeatForever().start();
    },

    onShareBtnClick() {
        telegramUtil.onInvite();
        GameTool.sendPointToServer("invite");
    },

    onBackBtnClick() {
        let telegramUtil = require('../Script/Common/TelegramUtils');
        telegramUtil.onHideBackBtn();
        this.removeSelf();
    },

    removeSelf() {
        if(this.inviteTween) {
            this.inviteTween.stop()
        }
        this._super();
    },


    listNotificationInterests() {
        return [
            AppNotify.SHOW_FRIENDS,
            AppNotify.OnViewClosed
        ];
    },

    handleFriends() {
        let myFriendNum = GameData.UsersProxy.getMyReferrals();
        let friends = GameData.FriendsProxy.getFriends();
        this.friendNum.string = 0 + "";
        if(friends && friends.length > 0) {
            this.listView.reload(friends);
            this.friendNum.string = myFriendNum + "";
        } else {
            this.tip.node.active = true;
        }
    },
    handleClosePanel() {
        this.node.zIndex = UIOrder.Dialog;
    },

    handleNotification(key, data) {
        switch (key) {
            case AppNotify.SHOW_FRIENDS:
                this.handleFriends();
                break;
            case AppNotify.OnViewClosed:
                this.handleClosePanel();
                break;
        }
    },

});
