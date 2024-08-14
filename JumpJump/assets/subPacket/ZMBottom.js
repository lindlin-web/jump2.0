var MYBOTTOMTYPE = {JUMP:gUIIDs.UI_HOME, FRIEND:gUIIDs.UI_FRIEND_PAGE, TASK:gUIIDs.UI_TASKS, WALLET:gUIIDs.UI_WALLET_PAGE, BOOSTS: gUIIDs.UI_BOOSTS_PAGE};
cc.Class({
    extends: require('BaseView'),

    properties: {
        jump:cc.Button,     // 跳跃按钮
        friend:cc.Button,   // 好友按钮
        task:cc.Button,     // 任务按钮
        rank:cc.Button,      // 排行榜按钮
        boosts:cc.Button,       // 升级按钮

        theLayout:cc.Layout,        // 就是那个容器 .

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

        if (CC_EDITOR && cc.engine) {
            cc.engine.on('design-resolution-changed', this.onResized.bind(this));
        }
        else {
            let thisOnResized = this.onResized.bind(this);
            window.addEventListener('resize', thisOnResized);
            window.addEventListener('orientationchange', thisOnResized);
        }

        this.onResized()
    },

    onDestroy() {
        this._super();
        if (CC_EDITOR && cc.engine) {
            cc.engine.off('design-resolution-changed', this.onResized.bind(this));
        }
        else {
            let thisOnResized = this.onResized.bind(this);
            window.removeEventListener('resize', thisOnResized);
            window.removeEventListener('orientationchange', thisOnResized);
        }
    },

    onResized() {
        let gap = GameTool.getTheWidthGap();
        if(this.node && this.node.isValid) {
            let spaceX = this.theLayout.spacingX;
            spaceX = 30 + gap / 4;
            this.theLayout.spacingX = spaceX;
        }
    },

    onBoostsBtnClick() {
        gUICtrl.openUI(gUIIDs.UI_BOOSTS_PAGE);
    },

    setCurrent(type) {
        if(type == MYBOTTOMTYPE.JUMP) {
            this.setClickEvent(this.jump, null);
            this.jump.node.removeComponent(cc.Button);
            this.jump.node.getChildByName("mainBtn").getComponent(cc.Sprite).spriteFrame = this.disJump;
        }
        else if(type == MYBOTTOMTYPE.FRIEND) {
            this.setClickEvent(this.friend, null);
            this.friend.node.removeComponent(cc.Button);
            this.friend.node.getChildByName("friendBtn").getComponent(cc.Sprite).spriteFrame = this.disFriend;
        }
        else if(type == MYBOTTOMTYPE.TASK) {
            this.setClickEvent(this.task, null);
            this.task.node.removeComponent(cc.Button);
            this.task.node.getChildByName("taskBtn").getComponent(cc.Sprite).spriteFrame = this.disTask;
        }
        else if(type == MYBOTTOMTYPE.WALLET) {
            this.setClickEvent(this.rank, null);
            this.rank.node.removeComponent(cc.Button);
            this.rank.node.getChildByName("walletBtn").getComponent(cc.Sprite).spriteFrame = this.disRank;
        } else if(type == MYBOTTOMTYPE.BOOSTS) {
            this.setClickEvent(this.boosts,null);
            this.boosts.node.removeComponent(cc.Button);
            this.boosts.node.getChildByName("boostsBtn").getComponent(cc.Sprite).spriteFrame = this.disBoosts;
        }
    },

    getWalletBtnPoint() {
        let wallet = this.rank.node.getChildByName("walletBtn");
        let worldPos = this.rank.node.convertToWorldSpaceAR(wallet.position);
        return worldPos;
    },

    getJumpBtnPoint() {
        let wallet = this.jump.node.getChildByName("mainBtn");
        let worldPos = this.jump.node.convertToWorldSpaceAR(wallet.position);
        return worldPos;
    },

    onJumpBtnClick() {

        let walletStep = GameData.GameProxy.getWalletStep();
        let isNewer = GameData.UsersProxy.getMyIsNewer();
        if(walletStep == WALLETSTEP.WALLETJUMP) {
            GameData.GameProxy.addWalletStep();             // 增进一步...
        }
        let telegramUtil = require('../Script/Common/TelegramUtils');
        telegramUtil.onHideBackBtn();
        gUICtrl.closeOneLevelPanel();
        telegramUtil.onSetBgColor(HEAD_COLORS.PREFAB);
        telegramUtil.onSetHeaderColor(HEAD_COLORS.PREFAB);

        GameTool.sendPointToServer("home");
    },

    onTaskBtnClick() {
        gUICtrl.openUI(gUIIDs.UI_TASKS);
    },

    onRankClick() {
        let walletStep = GameData.GameProxy.getWalletStep();
        let isNewer = GameData.UsersProxy.getMyIsNewer();
        if(walletStep == WALLETSTEP.INIT) {
            GameData.GameProxy.addWalletStep();
        }

        gUICtrl.openUI(gUIIDs.UI_WALLET_PAGE);
    },

    onFriendClick() {
        gUICtrl.openUI(gUIIDs.UI_FRIEND_PAGE);
    },

    start() {

    },

});
