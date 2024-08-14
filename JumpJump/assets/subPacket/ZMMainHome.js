var ZMGameLogic = require('./ZMGameLogic');
var ZMBottom = require('./ZMBottom');
//uiids.UI_FRIEND_PAGE,uiids.UI_RANK_PAGE,uiids.UI_CLUB_PAGE,uiids.UI_TASKS
var FUNCFROM = {NET:1, MOVE:2};

let telegramUtil = require('../Script/Common/TelegramUtils');
if(window.Telegram) {
    window.Telegram.WebApp.onEvent('backButtonClicked',() =>{
        gUICtrl.closeInstance();
        let isShouldClose = gUICtrl.isShouldClose();
        if(isShouldClose) {
            telegramUtil.onHideBackBtn();
        } else {
            telegramUtil.onShowBackBtn();
        }
    })
}
cc.Class({
    extends: require('BaseView'),

    properties: {
        homePage:cc.Node,

        leftTime:cc.Label,
        maxTime:cc.Label,
        gameLogic:ZMGameLogic,

        startBtn:cc.Button,

        theIcon:cc.Node,        // 就是一个闪电，飞到 start按钮上面去.
        info:cc.Node,           // 头顶的标签， 金币， 还有 券的东西
        wrapper:cc.Node,        //   
        rankBtn:cc.Button,          // 排行版的按钮

        addBtn:cc.Button,           // + 按钮，转向 taskPage

        soundBtn:cc.Button,         // 音效的按钮

        //------------------------------------------------begin--------
        haveClub:cc.Node,           // 有俱乐部的时候
        noClub: cc.Node,            // 没有俱乐部的时候
        myClubName:cc.Label,        // 我的俱乐部的名字
        myClubScore: cc.Label,      // 我的俱乐部的分值.
        myClubBtn:cc.Node,          // 我的俱乐部的响应按钮。
        myClubIcon: cc.Sprite,      // 我的俱乐部的icon图标.
        myClubLevel:cc.Sprite,      // 我的俱乐部的等级sprite.
        levelFrames:[cc.SpriteFrame],     // 等级的frame....
        //------------------------------------------------end--------

        reviveNode:cc.Node,         //  复活券，

        theTip: cc.Node,            // combo的tip

        inGameNode: cc.Node,        // inGame 在游戏中显示的那个node

        theGuide:cc.Node,           // 就是引导人..

        theComboTip:cc.Node,             // combo 的提示的小面板..

        theDrop:cc.Node,                // 雨滴...

        theMainPanel:cc.Prefab,     // 所有的预制体都在一个地方....


        theStartHand:cc.Node,           // 新手引导的 那个手势....
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 关闭多点触摸
        this.thePool = [];
        this.theComboTip.active = false;
        this.isGiftPanelOpened = false;
        cc.macro.ENABLE_MULTI_TOUCH = false;
        this.timeInterval = 0;
        this.originalTheTipX = this.theTip.x;
        this.originalInfoX = this.info.x;
        this.originalClubInfox = this.myClubBtn.x;
        this.soundBtnOriginalInfoX = this.soundBtn.node.x;              // 初始化音效的原始的x...
        this.originalComboTipX = this.theComboTip.x;
        this.fromType = 0;
        if (CC_EDITOR && cc.engine) {
            cc.engine.on('design-resolution-changed', this.onResized.bind(this));
        }
        else {
            let thisOnResized = this.onResized.bind(this);
            window.addEventListener('resize', thisOnResized);
            window.addEventListener('orientationchange', thisOnResized);
        }
        this.wrapper.on(cc.Node.EventType.TOUCH_START,this.onWrapperTouchStart, this);
        this.wrapper.on(cc.Node.EventType.TOUCH_END, this.onWrapperTouchEnd, this);
        this.wrapper.on(cc.Node.EventType.TOUCH_CANCEL, this.onWrapperTouchEnd, this);
        this.setUIID(gUIIDs.UI_HOME);
        this._super();
        this.setClickEvent(this.startBtn.node, this.onStartGame.bind(this));
        this.setClickEvent(this.rankBtn, this.onRankClick.bind(this));
        this.setClickEvent(this.addBtn, this.onAddedBtnClick.bind(this));
        this.setClickEvent(this.soundBtn, this.onSoundBtnClick.bind(this));
        this.setClickEvent(this.myClubBtn, this.onMyClubBtnClick.bind(this));
        this.onResized()

        this.onShowPrize();
        this.handleLogin();

        this.initSoundStatus();

        this.initClubThing();

        this.inGameNode.active = false;
        
        telegramUtil.onSetBgColor(HEAD_COLORS.PREFAB);
        telegramUtil.onSetHeaderColor(HEAD_COLORS.PREFAB);
        
        GameTool.sendPointToServer("home");
        this.reviveNode.active = false;         // 默认复活券，是隐藏的.
        GameData.UsersProxy.askForOffLineBenefit();         // 获得离线收益...

        this.createTheRain();

        this.thePanelsNode = cc.instantiate(this.theMainPanel);

        GameTool.copyBottomNode(gUIIDs.UI_HOME,this.node.getChildByName("wrapper").getChildByName("home_page"));

        this.theStartHand.active = false;
    },

    getWalletPosition() {
        let bottom = this.node.getChildByName("wrapper").getChildByName("home_page").getChildByName("bottom").getComponent(ZMBottom);
        let walletWorldPos = bottom.getWalletBtnPoint();
        let localPos = this.theGuide.parent.convertToNodeSpaceAR(walletWorldPos);
        this.theGuide.setPosition(localPos);
    },


    /** 所有的prefab的与之都在这个节点之中 */
    getPanelsNode() {
        return this.thePanelsNode;
    },

    onComboClick() {
        this.theComboTip.active = true;
    },

    onHideComoboTip() {
        this.theComboTip.active = false;
    },

    checkToOpenGiftPanel() {
        if(!this.isGiftPanelOpened) {
            let isGiftOk = GameData.UsersProxy.getMyGiftOk();
            if(isGiftOk) {
                let typeAndnum = GameData.UsersProxy.getMyGiftTypeAndNum();
                gUICtrl.openUI(gUIIDs.UI_THE_GIFT_TIP, null, typeAndnum);
            }

            let isGiftError = GameData.UsersProxy.getMyGiftError();
            if(isGiftError) {
                let msg = GameData.UsersProxy.getMyGiftErrorMsg();
                gUICtrl.openUI(gUIIDs.UI_GIFT_TIP, null, {msg:msg});
            }
            this.isGiftPanelOpened = true;
        }
    },

    onMyClubBtnClick() {
        let myTgGid = GameData.UsersProxy.getMyTgGid();
        if(myTgGid) {
            gUICtrl.openUI(gUIIDs.UI_CLUB_PAGE, null, {tgGid:myTgGid});
        } else {
            gUICtrl.openUI(gUIIDs.UI_RANK_PAGE,null, {index:3});
        }
        
    },

    initClubThing() {
        let myGid = GameData.UsersProxy.getMyTgGid();
        if(myGid) {
            this.haveClub.active = true;
            this.myClubIcon.node.active = true;
            this.noClub.active = false;
            this.myClubLevel.node.active = true;
            this.myClubName.string = GameTool.convertUserName10(GameData.RankProxy.getClubNameByTgGid(myGid));
            let url = gFuncs.getGroupUrlByTgGid(myGid);
            let clubScore = "" + GameData.RankProxy.getClubTotalScoreByTgGid(myGid);
            this.myClubScore.string = GameTool.convertNumberToString(clubScore);
            if(GameTool.isValidHttpUrl(url)) {
                GameTool.getRemoteSprite(this.myClubIcon,url);
            }
            let level = GameData.RankProxy.getClubLevelByTgGid(myGid);
            level = level - 1;
            this.myClubLevel.spriteFrame = this.levelFrames[level];
        }
        else {
            this.haveClub.active = false;
            this.noClub.active = true;
            this.myClubLevel.node.active = false;
            this.myClubIcon.node.active = false;
        }
    },

    showBottom() {

    },

    hideBottom() {

    },

    onSoundBtnClick() {
        // let sound = GameData.SoundProxy.getSoundOpen();
        // if(sound == MUSICT_STATUS.ON) {
        //     GameData.SoundProxy.setSoundOpen(MUSICT_STATUS.OFF);
        // } else {
        //     GameData.SoundProxy.setSoundOpen(MUSICT_STATUS.ON);
        // }
        // this.initSoundStatus();
        gUICtrl.openUI(gUIIDs.SETTING_TIP);
    },

    initSoundStatus() {
        // let sound = GameData.SoundProxy.getSoundOpen();
        // if(sound == MUSICT_STATUS.ON) {
        //     this.soundBtn.node.getChildByName("on").active = true;
        //     this.soundBtn.node.getChildByName("off").active = false;
        // } else {
        //     this.soundBtn.node.getChildByName("on").active = false;
        //     this.soundBtn.node.getChildByName("off").active = true;
        // }
    },

    /** 显示奖品面板 */
    onShowPrize() {
        let coin = GameData.GameProxy.getLoginPrizeCoin();
        let coinId = GameData.GameProxy.getLoginPrizeCoinId();
        if(coin > 0) {
            gUICtrl.openUI(gUIIDs.UI_RANK_REWARD_PANEL,null, {coin:coin, id:coinId});
        }
    },

    onAddedBtnClick() {
        gUICtrl.openUI(gUIIDs.UI_TASKS);
    },

    onResized() {
        let gap = GameTool.getTheWidthGap();
        this.info.x = this.originalInfoX - gap;
        this.soundBtn.node.x = this.soundBtnOriginalInfoX + gap;
        this.myClubBtn.x = this.originalClubInfox + gap;
        this.theTip.x = this.originalTheTipX - gap;
        this.theComboTip.x = this.originalComboTipX - gap;
    },

    onTaskBtnClick() {
        gUICtrl.openUI(gUIIDs.UI_TASKS);
    },

    onRankClick() {
        gUICtrl.openUI(gUIIDs.UI_RANK_PAGE);
    },

    onFriendClick() {
        gUICtrl.openUI(gUIIDs.UI_FRIEND_PAGE);
    },


    onWrapperTouchStart() {
        GameData.GameProxy.setGameState(GameState.StateOfInput);        // 设置成输入 input 的状态..
        let isCanJump = GameData.GameProxy.isCanJump();
        console.log("home iscanjump==", isCanJump);
        if(isCanJump) {
            GameData.GameProxy.startHoldBreath();
            this.gameLogic.doTheHoldBreathAction();
        }
    },

    onWrapperTouchEnd() {
        GameData.GameProxy.clearGameState(GameState.StateOfInput);        // 设置成输入 不要input 的状态..
        let breath = GameData.GameProxy.endOfHoldBreath();
        this.gameLogic.endOfHoldBreathAction(breath);
    },

    start() {
        let isNewer = GameData.UsersProxy.getMyIsNewer();
        if(isNewer) {
            this.homePage.active = false;
            this.inGameNode.active = true;
            this.info.getComponent("Info").onHideHomePage();
            this.onStartGame();
            telegramUtil.onSetBgColor(HEAD_COLORS.INGAME);
            telegramUtil.onSetHeaderColor(HEAD_COLORS.INGAME);
        } else {
            // 判断是否应该要显示 
            this.checkToOpenGiftPanel();
        }


        this.homePage.setPosition(0, 0);

        this.theGuide.active = false;
        if(isNewer) {
            
        } else {
            this.schedule(this.autoPlay, 2, cc.macro.REPEAT_FOREVER, 2);
            //this.login();
            NotifyMgr.send(AppNotify.UserInfoChange);
        }
        
    },

    autoPlay() {
        if(GameData.GameProxy.getGameState() == GameState.StateOfWatch){
            this.gameLogic.autoJump();
        }
    },

    /** 但一个面板打开的时候。看看是否要开启 倒退的按钮 */
    onViewOpened() {
        let isShouldClose = gUICtrl.isShouldClose();
        if(isShouldClose) {
            telegramUtil.onHideBackBtn();
        } else {
            telegramUtil.onShowBackBtn();
        }
    },

    listNotificationInterests() {
        return [
            gGSM.BEGIN_GAME,
            AppNotify.UserInfoChange,
            AppNotify.StartTheGame,
            AppNotify.ContinueTheGame,
            AppNotify.BackToMainHome,
            AppNotify.FinishUI,
            AppNotify.OnViewClosed,
            AppNotify.RANK_REWARD,
            AppNotify.LEAVE_GROUP,
            AppNotify.JOIN_GROUP,
            AppNotify.FETCH_TIME,               // 获取时间的道具的时候.
            AppNotify.FETCH_REVIVETICKET,
            AppNotify.OFFLINE_BENEFIT,
            AppNotify.ON_TIME_OUT,
            AppNotify.WALLET_LOG,
            AppNotify.ClubMemberMes
        ];
    },

    // OnViewOpened: "OnViewOpened",
    // /** 界面关闭 uiid*/
    // OnViewClosed: "OnViewClosed",

    handleNotification(key, data) {
        
        switch (key) {
            case gGSM.BEGIN_GAME:
                if(data.code == 1) {
                    this.handleBeginGame(null,FUNCFROM.NET);
                } else if(data.code == 2) {
                    gUICtrl.openUI(gUIIDs.UI_INSUF_ENERGY,null);
                }
                break;
            case AppNotify.UserInfoChange:
                this.handleLogin();
                break;
            case AppNotify.StartTheGame:
                this.reStartTheGame();
                break;
            case AppNotify.ContinueTheGame:
                this.continueGame();
                break;
            case AppNotify.BackToMainHome:
                this.backToMainPage();
                break;
            case AppNotify.FinishUI:
                this.onViewOpened();
                break;
            case AppNotify.OnViewClosed:
                this.checkRankPrize();
                break;
            case AppNotify.RANK_REWARD:
                this.onRankReward();
                break;
            case AppNotify.JOIN_GROUP:
            case AppNotify.LEAVE_GROUP:
            case AppNotify.ClubMemberMes:
                this.initClubThing();
                break;
            case AppNotify.FETCH_TIME:
                this.onFetchTime();
                break;
            case AppNotify.FETCH_REVIVETICKET:
                this.onFetchTicket();
                break;
            case AppNotify.OFFLINE_BENEFIT:
                this.onGetOffLineBenefit();
                break;
            case AppNotify.ON_TIME_OUT:
                this.onTimeOut();
                break;
            case AppNotify.WALLET_LOG:
                this.theGuide.active = false;
                break;
        }
    },

    onGetOffLineBenefit() {
        let coin = GameData.UsersProxy.getOfflineMoney();
        gUICtrl.openUI(gUIIDs.UI_RANK_REWARD_PANEL,null, {coin:coin, id:20});
    },

    onFetchTicket() {
        this.reviveNode.active = true;
    },

    /** 获得排行榜奖励 */
    onRankReward() {
       let coin = GameData.GameProxy.getPrizeCoin();
       let coinId = GameData.GameProxy.getPrizeCoinId();
       if(coin > 0) {
            gUICtrl.openUI(gUIIDs.UI_RANK_REWARD_PANEL,null, {coin:coin,id:coinId});
        }
    },

    /** 确认，是否有排行榜的奖励 */
    checkRankPrize() {
        //GameData.GameProxy.askForRankPrize();         // 因为没有了排行榜奖励了。所以这个地方，可以被屏蔽掉了。
        let walletStep = GameData.GameProxy.getWalletStep();
        let isNewer = GameData.UsersProxy.getMyIsNewer();
        if(isNewer && walletStep == WALLETSTEP.WALLETJUMP) {
            // 如果是新手，并且，新手引导到了 点击jump这个按钮.
            this.theStartHand.active = true;
        }
    },

    continueGame() {
        this.reviveNode.active = false;             //  因为复活单局只有一次，所以可以隐藏掉.
        this.fromType = 0;
        this.unschedule(this.autoPlay);
        this.info.active = true;
        this.info.getComponent("Info").onHideHomePage();
        // 重置一下数据
        this.homePage.active = false;
        this.inGameNode.active = true;
        telegramUtil.onSetBgColor(HEAD_COLORS.INGAME);
        telegramUtil.onSetHeaderColor(HEAD_COLORS.INGAME);
        
        this.gameLogic.continueTheGame();
    },

    handleLogin() {
        this.leftTime.string = GameData.UsersProxy.getTodayLeftTime() + "";
        this.maxTime.string = "/" + GameData.UsersProxy.getMaxGameTime();
    },
    onStartGame(btn) {

        this.reStartTheGame();
        this.fromType = 0;
        GameData.GameProxy.startTheGame();
        this.doTheFlyingAction();
        GameTool.sendPointToServer("start");

        let walletStep = GameData.GameProxy.getWalletStep();
        let isNewer = GameData.UsersProxy.getMyIsNewer();
        if(isNewer && walletStep == WALLETSTEP.WALLETJUMP) {
            // 如果是新手，并且，新手引导到了 点击jump这个按钮.
            this.theStartHand.active = false;
            GameData.GameProxy.addWalletStep(); 
        }
    },

    doTheFlyingAction() {
        let startBtnWorldPos = this.startBtn.node.parent.convertToWorldSpaceAR(this.startBtn.node.getPosition());
        let targetPos = this.theIcon.parent.convertToNodeSpaceAR(startBtnWorldPos);
        let  moveTo = cc.moveTo(0.0, targetPos);
        var finish = new cc.CallFunc(this.handleBeginGame, this, FUNCFROM.MOVE);
        let sequence = cc.sequence(moveTo, finish);
        let theIconDouble = cc.instantiate(this.theIcon);
        theIconDouble.parent = this.theIcon.parent;
        theIconDouble.opacity = 0;
        theIconDouble.runAction(sequence);
    },

    /** 用这种方式来开始游戏 */
    reStartTheGame() {
        let isOnPlaying = GameData.GameProxy.isGameOnPlaying();
        if(isOnPlaying) {
            return;
        }
        this.fromType = 0;      // 
        this.unschedule(this.autoPlay);
        this.info.active = true;
        // 重置一下数据.
        this.homePage.active = false;
        this.inGameNode.active = true;
        this.info.getComponent("Info").onHideHomePage();
        // 开始游戏。
        this.onTimeOut();
        GameData.GameProxy.resetGameState();
        GameData.GameProxy.setGameState(GameState.StateOfInit);
        GameData.GameProxy.clearGameData();
        this.gameLogic.clearAll();
        GameData.GameProxy.putNewerTreasureToBox();
        this.gameLogic.runTheGame();
        telegramUtil.onSetBgColor(HEAD_COLORS.INGAME);
        telegramUtil.onSetHeaderColor(HEAD_COLORS.INGAME);
    },

    backToMainPage() {
        let walletStep = GameData.GameProxy.getWalletStep();
        if(walletStep == WALLETSTEP.INIT) {
            let isNewer = GameData.UsersProxy.getMyIsNewer();
            this.theGuide.active = false;
            if(isNewer) {
                this.theGuide.active = true;
                this.getWalletPosition();
            }
        }
        this.homePage.active = true;
        this.checkToOpenGiftPanel();
        this.inGameNode.active = false;
        this.info.getComponent("Info").onShowHomePage();
        this.fromType = 0;      // 
        this.schedule(this.autoPlay, 2, cc.macro.REPEAT_FOREVER, 2);
        this.info.active = true;
        // 开始游戏。
        GameData.GameProxy.resetGameState();
        GameData.GameProxy.setGameState(GameState.StateOfWatch);
        this.gameLogic.clearAll();
        this.gameLogic.runTheGame();
    },

    onTimeOut() {
        this.stopTheRain();
        GameData.GameProxy.setTimeOut();
    },

    /** 当获取到时间的时候 */
    onFetchTime() {
        this.startTheRain();
    },

    handleBeginGame(target, type) {
        if(target) {
            target.destroy();
        }
        this.fromType |= type;
        if(this.fromType == 3) {
            this.reStartTheGame();
        }
        else {
        }
    },

    onRankClick() {
        gUICtrl.openUI(gUIIDs.UI_RANK_PAGE);
    },

    createTheRain() {
        for(let i = 0; i < 100; i++) {
            let random = Math.floor(Math.random() * 5) + 1;
            let drop = this.theDrop.getChildByName("fra" +random);
            let newNode = cc.instantiate(drop);
            newNode.parent = this.theDrop;
            this.thePool.push(newNode);
        }
    },

    stopTheRain() {
        for(let i = 0; i < 100; i++) {
            let drop = this.thePool[i];
            if(drop) {
                drop.y = 0;
                drop.stopAllActions();
            } else {
                console.log(i, "============i");
            }
            
        }
        this.theDrop.active = false;
    },

    startTheRain() {
        this.theDrop.active = true;
        for(let i = 0; i < 100; i++) {
            let drop = this.thePool[i];
            if(drop) {
                this.doTheAnimation(drop,i);
            } else {
                console.log(i, "============i");
            }
            
        }
    },

    doTheAnimation(node,i) {
        let ran_x = Math.random() * 1000 - 500;    // -400 - 400 之间
        let ran_y = Math.random() * 150 + 360;      //  300 - 500 之间
        let angle = (Math.random() *300 + 900);
        angle = Math.random() > 0.5 ? angle : -angle;
        node.stopAllActions();
        node.y = 0;
        node.x = ran_x;
        i = i / 100;
        let speed = Math.random() * 80 + 200;
        let moveTime = ran_y / speed;
        var delayTime = cc.delayTime(i);
        var moveTo = cc.moveTo(moveTime, cc.v2(ran_x, -ran_y));
        var rotateTo = cc.rotateTo(moveTime,angle);
        node.runAction(cc.sequence(delayTime,cc.spawn(moveTo, rotateTo),cc.callFunc(() => {
            this.doTheAnimation(node, i);
        })));
    },

    update (dt) {
        if(this.theGuide.active == true) {
            this.getWalletPosition();
        }
        // this.timeInterval += dt;
        // if(this.timeInterval >= 15) {
        //     this.timeInterval -= 15;
        //     GameData.GameProxy.askForRankPrize();
        //     if(GameData.GameProxy.isCanJump()) {
        //         GameData.GameProxy.reportToServerInGame();
        //     }
            
        // }
    },
});
