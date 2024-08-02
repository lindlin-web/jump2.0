let telegramUtil = require('../Script/Common/TelegramUtils');
var FUNCFROM = {NET:1, MOVE:2};

var CUPOUSFROM = {NET:1, MOVE:2};
cc.Class({
    extends: require("BaseView"),

    properties: {
        totalScoreLabel:cc.Label,
        totalMoneyLabel:cc.Label,
        head1:cc.Sprite,
        head2:cc.Sprite,
        head3:cc.Sprite,
        hightScore:cc.Node,                 // 是否是新记录的东西
        cupousBtn:cc.Button,                // 用券来体验游戏的按钮
        replayBtn:cc.Button,                // 重复玩的按钮...
        theIcon:cc.Node,                    // 就是哪个雷电的按钮.
        theCupon:cc.Node,                   // 那个券...
        leftTimes:cc.Label,                       // 今日还剩下多少.
        totalTimes:cc.Label,                // 总共有多少
        returnHome:cc.Button,               // 返回主页...
        rankBtn:cc.Button,                  // rank 按钮

        challengeBtn:cc.Button,             // 发起挑战的按钮...
        highestScore:cc.Label,              // 最高分数...

        belowTen: cc.Node,                  // 低于10分不扣除体力

        adImageSprite: cc.Sprite,           // 广告的sprite
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.fromType = 0;
        this.fromCuponType = 0;
        this.setUIID(gUIIDs.UI_RESULT_PAGE);
        this._super();
        this.init();
        // 这个时候应该把当下的结果给保存一下.
        GameData.GameProxy.overTheResult();

        telegramUtil.onSetBgColor(HEAD_COLORS.RESULT);
        telegramUtil.onSetHeaderColor(HEAD_COLORS.RESULT);
    },

    init() {
        // 前三名头像
        this.initRankHead();
        // 本局的分
        let perRoundScore = GameData.GameProxy.getTotalMoney();
        perRoundScore = parseInt(perRoundScore);
        perRoundScore = GameTool.convertNumberToString(perRoundScore);
        this.totalScoreLabel.string = perRoundScore + "";
        if(perRoundScore < 10) {
            this.belowTen.active = true;
        } else {
            this.belowTen.active = true;
        }
        // 本剧获得的金币
        let perRoundMoney = GameData.GameProxy.getTotalTon();
        this.totalMoneyLabel.string = perRoundMoney + "";
        // 是否是历史最高分
        let isNewRecord = GameData.GameProxy.getIsNewRecord();
        this.hightScore.active = true;
        if(isNewRecord) {
            this.hightScore.active = true;
        }

        let isUsedCoupons = GameData.GameProxy.isUsedCoupons();
        if(isUsedCoupons) {
            this.cupousBtn.node.active = false;
        } else {
            this.cupousBtn.node.active = true;
        }

        this.setClickEvent(this.cupousBtn, this.onCupousBtnClick.bind(this));
        this.setClickEvent(this.replayBtn, this.onReplayBtnClick.bind(this));
        this.setClickEvent(this.returnHome, this.onReturnHome.bind(this));
        this.setClickEvent(this.rankBtn, this.onRankBtn.bind(this));
        this.setClickEvent(this.challengeBtn, this.onChallenge.bind(this));
        this.setClickEvent(this.adImageSprite.node, this.onAdImageClick.bind(this));


        /** 是否有券 */
        // let cupousNum = GameData.UsersProxy.getMyCoupons();
        // if(cupousNum && cupousNum > 0) {
        //     this.setBtnEnable(this.cupousBtn, true);
        // } else {
        //     this.setBtnEnable(this.cupousBtn, false);
        // }

        /**** 是否还有玩游戏的机会 */
        // let playTimes = GameData.UsersProxy.getTodayLeftTime();
        // if(playTimes && playTimes > 0) {
        //     this.setBtnEnable(this.replayBtn, true);
        // } else {
        //     this.setBtnEnable(this.replayBtn, false);
        // }

        this.leftTimes.string = GameData.UsersProxy.getTodayLeftTime() + "";
        this.totalTimes.string = "/" + GameData.UsersProxy.getMaxGameTime();
        let myDailyLimitLevel = GameData.UsersProxy.getMyUpgradeLevel(5);         // 获得happyTime的level是多少.
        let benefit = GameData.UpgradeProxy.getDailyLimitByLevel(myDailyLimitLevel);
        let totalToday = GameData.GameProxy.getGoldOfTodayPlusThisRound();
        totalToday = parseInt(totalToday);
        totalToday = GameTool.convertNumberToString(totalToday);
        this.highestScore.string =totalToday + "/" + benefit;                 //   我的历史最高分

        let imageUrl = GameData.GameProxy.getAdImageUrl();
        GameTool.getRemoteSprite(this.adImageSprite,imageUrl);
    },

    onAdImageClick() {
        let address = GameData.GameProxy.getAdAddress();
        telegramUtil.openTelegramLinkByUrl(address);
    },

    onChallenge() {
        telegramUtil.onChallenge();
        if(window.Telegram){
            plausible('challenge');
        }
        
    },

    onRankBtn() {
        gUICtrl.openUI(gUIIDs.UI_RANK_PAGE);
    },

    onCupousBtnClick() {
        gGameCmd.postAction(gGSM.USE_PROPS, {type:1});
        this.doTheFlyingActionCupons();
        if(window.Telegram){
            plausible('revive');
        }
        
    },

    onReplayBtnClick() {
        GameData.GameProxy.startTheGame();
        GameData.GameProxy.resetGameState();
        GameData.GameProxy.setGameState(GameState.StateOfWatch);        // 观看形式
        NotifyMgr.send(AppNotify.StartTheGame);
        this.removeSelf();
        //this.doTheFlyingAction();
        if(window.Telegram){
            plausible('again');
        }
        
    },

    doTheFlyingActionCupons() {
        let startBtnWorldPos = this.cupousBtn.node.parent.convertToWorldSpaceAR(this.cupousBtn.node.getPosition());
        let targetPos = this.theCupon.parent.convertToNodeSpaceAR(startBtnWorldPos);
        let  moveTo = cc.moveTo(0.5, targetPos);
        var finish = new cc.CallFunc(this.onCuponHandlers, this, CUPOUSFROM.MOVE);
        let sequence = cc.sequence(moveTo, finish);
        let theIconDouble = cc.instantiate(this.theCupon);
        theIconDouble.parent = this.theCupon.parent;
        theIconDouble.runAction(sequence);
    },

    onCuponHandlers(target, type) {
        if(target) {
            target.destroy();
        }
        this.fromCuponType |= type;
        if(this.fromCuponType == 3) {
            this.fromCuponType = 0;
            this.removeSelf();
            NotifyMgr.send(AppNotify.ContinueTheGame);
        }
        else {
        }
    },



    /**  飞舞到某个物体上面  */
    doTheFlyingAction() {
        let startBtnWorldPos = this.replayBtn.node.parent.convertToWorldSpaceAR(this.replayBtn.node.getPosition());
        let targetPos = this.theIcon.parent.convertToNodeSpaceAR(startBtnWorldPos);
        let  moveTo = cc.moveTo(0.5, targetPos);
        var finish = new cc.CallFunc(this.handleBeginGame, this, FUNCFROM.MOVE);
        let sequence = cc.sequence(moveTo, finish);
        let theIconDouble = cc.instantiate(this.theIcon);
        theIconDouble.parent = this.theIcon.parent;
        theIconDouble.runAction(sequence);
    },


    handleBeginGame(target, type) {
        if(target) {
            target.destroy();
        }
        this.fromType |= type;
        if(this.fromType == 3) {
            this.fromType = 0;
            this.removeSelf();
            NotifyMgr.send(AppNotify.StartTheGame);
        }
        else {
        }
    },


    listNotificationInterests() {
        return [
            gGSM.BEGIN_GAME,
            gGSM.USE_PROPS,
        ];
    },

    handleNotification(key, data) {
        switch (key) {
            case gGSM.BEGIN_GAME:
                if(data.code == 1) {
                    this.handleBeginGame(null,FUNCFROM.NET);
                } else if(data.code == 2) {
                    gUICtrl.openUI(gUIIDs.UI_INSUF_ENERGY,null);
                }
                break;
            case gGSM.USE_PROPS:
                if(data.code == 1) {
                    this.onCuponHandlers(null, CUPOUSFROM.NET);
                } else if(data.code == 2) {
                    gUICtrl.openUI(gUIIDs.UI_INSUF_COUPONS,null);
                }
                break;
        }
    },

    /** 返回主页，就是关闭当前的node */
    onReturnHome() {
        this.removeSelf();
        NotifyMgr.send(AppNotify.BackToMainHome);
        telegramUtil.onSetBgColor(HEAD_COLORS.PREFAB);
        telegramUtil.onSetHeaderColor(HEAD_COLORS.PREFAB);
    },

    initRankHead() {
        //头像需要初始化一下...
        let tgids = GameData.RankProxy.getRankFirstThree();
        if(tgids && tgids[0]) {
            let tgid = tgids[0];
            let url = gFuncs.getAvatarUrlByTgid(tgid);
            GameTool.getRemoteSprite(this.head1,url);
        }

        if(tgids && tgids[1]) {
            let tgid = tgids[1];
            let url = gFuncs.getAvatarUrlByTgid(tgid);
            GameTool.getRemoteSprite(this.head2,url);
        }
        if(tgids && tgids[2]) {
            let tgid = tgids[2];
            let url = gFuncs.getAvatarUrlByTgid(tgid);
            GameTool.getRemoteSprite(this.head3,url);
        }
    },

    start() {

    },

    // update (dt) {},
});
