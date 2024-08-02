var MYBOTTOMTYPE = {JUMP:gUIIDs.UI_HOME, FRIEND:gUIIDs.UI_FRIEND_PAGE, TASK:gUIIDs.UI_TASKS, WALLET:gUIIDs.UI_WALLET_PAGE, BOOSTS: gUIIDs.UI_BOOSTS_PAGE};
cc.Class({
    extends: require('BaseView'),

    properties: {
        jump:cc.Button,     // 跳跃按钮
        friend:cc.Button,   // 好友按钮
        task:cc.Button,     // 任务按钮
        rank:cc.Button,      // 排行榜按钮
        boosts:cc.Button,       // 升级按钮

        disJump:cc.SpriteFrame,
        disFriend:cc.SpriteFrame,
        disTask:cc.SpriteFrame,
        disRank:cc.SpriteFrame,
        disBoosts:cc.SpriteFrame,
    },

    onLoad() {
        //this.setUIID(gUIIDs.UI_CLUB_PAGE);
        this._super();
        this.setClickEvent(this.friend, this.onFriendClick.bind(this));
        this.setClickEvent(this.rank, this.onRankClick.bind(this));
        this.setClickEvent(this.task, this.onTaskBtnClick.bind(this));
        this.setClickEvent(this.jump, this.onJumpBtnClick.bind(this));
        this.setClickEvent(this.boosts, this.onBoostsBtnClick.bind(this));
    },

    onBoostsBtnClick() {
        gUICtrl.openUI(gUIIDs.UI_BOOSTS_PAGE);
    },

    setCurrent(type) {
        if(type == MYBOTTOMTYPE.JUMP) {
            this.setClickEvent(this.jump, null);
            this.jump.node.removeComponent(cc.Button);
            this.jump.node.getComponent(cc.Sprite).spriteFrame = this.disJump;
        }
        else if(type == MYBOTTOMTYPE.FRIEND) {
            this.setClickEvent(this.friend, null);
            this.friend.node.removeComponent(cc.Button);
            this.friend.node.getComponent(cc.Sprite).spriteFrame = this.disFriend;
        }
        else if(type == MYBOTTOMTYPE.TASK) {
            this.setClickEvent(this.task, null);
            this.task.node.removeComponent(cc.Button);
            this.task.node.getComponent(cc.Sprite).spriteFrame = this.disTask;
        }
        else if(type == MYBOTTOMTYPE.WALLET) {
            this.setClickEvent(this.rank, null);
            this.rank.node.removeComponent(cc.Button);
            this.rank.node.getComponent(cc.Sprite).spriteFrame = this.disRank;
        } else if(type == MYBOTTOMTYPE.BOOSTS) {
            this.setClickEvent(this.boosts,null);
            this.boosts.node.removeComponent(cc.Button);
            this.boosts.node.getComponent(cc.Sprite).spriteFrame = this.disBoosts;
        }

    },

    onJumpBtnClick() {
        let telegramUtil = require('../Script/Common/TelegramUtils');
        telegramUtil.onHideBackBtn();
        gUICtrl.closeOneLevelPanel();
        telegramUtil.onSetBgColor(HEAD_COLORS.PREFAB);
        telegramUtil.onSetHeaderColor(HEAD_COLORS.PREFAB);
        if(window.Telegram){
            plausible('home');
        }
    },

    onTaskBtnClick() {
        gUICtrl.openUI(gUIIDs.UI_TASKS);
    },

    onRankClick() {
        gUICtrl.openUI(gUIIDs.UI_WALLET_PAGE);
    },

    onFriendClick() {
        gUICtrl.openUI(gUIIDs.UI_FRIEND_PAGE);
    },

    start() {

    },

});
