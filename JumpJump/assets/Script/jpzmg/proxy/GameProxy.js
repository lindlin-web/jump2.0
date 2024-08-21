require('./info/TreasureInfo')
const crypto = require('crypto');

console.log(crypto, "===========crypto");
var Length = 50;            // 每50个宝箱做一下设置.
var GameState = { StateOfInit:1, StateOfJump:2,StateOfWatch:4, StateOfSuccess:8,StateOfEnd:16, StateOfInput:32, StateOfInitHero:64};       // 游戏的几个状态
window.GameState = GameState;


var WALLETSTEP = {INIT:0, WALLETBTN:1, WALLETCONNECT:2, WALLETTIP:3, WALLETJUMP:4, WALLETSTART:5, WALLETOVER:6};
window.WALLETSTEP = WALLETSTEP;
// 新人的 宝箱的 信息...
var NewTreasureInfos = [{baseType:TreasureBigType.TON,type:0,reward_num:2,box_level:2, newGuideStep:1}, 
                    {baseType:TreasureBigType.TON,type:0,reward_num:2,box_level:3, newGuideStep:2}, 
                    {baseType: TreasureBigType.PT, type:TreasureSecondType.REVIVETICKET,box_level:1, newGuideStep:3}, 
                    {baseType:TreasureBigType.PT, type:TreasureSecondType.TIME,box_level:1, newGuideStep:4}, 
                    {baseType:TreasureBigType.PT, type:TreasureSecondType.GOLD,money:300,box_level:1, newGuideStep:5}, 
                    {baseType:TreasureBigType.TON,type:0,reward_num:5,box_level:4, newGuideStep:6}];

var GameProxy = (function(){
    function GameProxy() {
        this.gameState = GameState.StateOfWatch;            // 观看的外观....
        this.boxCreated = 0;                                // 创建了多少个箱子了。
        this.treasuresInfo = new Dictionary();              // 这个是宝箱信息
        this.treasureStart = 0                              // 0 - 49 个宝箱，  50 - 99， 以此类推
        this.totalScore = 0;                                // 单局游戏，获得了多少分.
        this.isSingleRouondUsedCoupons = false;             // 单局游戏，是否已经应用了复活的按钮...
        this.isNewRecord = false;                           // 是否是一个新的记录
        this.totalMoney = 0;                                // 单局游戏，获得了多少的金币.
        this.totalTon = 0;                                  // 单局游戏，获得了多少的ton币.
        this.holdBreath = 0;                                // 按钮按住了多久的时间了.
        this.boxMoney = 0;                                  // 在这五个格子期间，获得了多少的从宝箱里面获得的money
        this.boxTonMoney = 0;
        NotifyMgr.on(gGSM.BEGIN_GAME, this.onBeginGame.bind(this), this);
        NotifyMgr.on(gGSM.CONTINUE_GAME, this.onGameContinue.bind(this), this);
        NotifyMgr.on(gGSM.USE_PROPS, this.onUsePropsDone.bind(this), this);
        NotifyMgr.on(gGSM.GET_NOTICE, this.onMsgList.bind(this), this);
        

        this._globalScheduleObj = null;
        this.theCallback = null;
        this.hasAskForRankPrice = false;                // 要在0时区  五分钟的时候，请求一下奖励.



        //xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        this.leftHappyTime = 0;                         // 剩余还有多少快乐时间..
        this._happyTimeScheduleObj = null;              // 
        this.happyTimeCallback = null;                  // 快乐时间的 回调.
        //xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx


        this.prizeCoin = 0;                             // 奖励的金币.
        this.prizeCoinId = -1;                          // 对应的id.

        this.loginPrizeCoin = 0;                        // 登录的时候的奖励的金币....
        this.loginPrizeCoinId = -1;                     // 登录的时候的奖励的金币的id....

        this.adImageUrl = "";                           // 广告的 url地址是多少....
        this.adClickAddress = "";                       // 广告的跳转地址是多少....

        this.isThisRoundFetchTheTicket = false;         // 这个单局里面是否已经有了 复活券了。


        this.walletGuideStep = -1;            // 钱包引导，到了第几步了。 1 . 点击钱包 ，  2 . 点击钱包的connect , 3. 点击 钱包 tip 知道了。  4.  点击jump ..  5. 点击 start jump 按钮

        this.beginTouchTime = 0;                        // 开始触摸的时间
    }

    GameProxy.prototype.addWalletStep = function() {
        let userName = GameData.UsersProxy.getMyNickName();
        this.walletGuideStep++;
        if( this.walletGuideStep != WALLETSTEP.WALLETBTN && 
            this.walletGuideStep != WALLETSTEP.WALLETCONNECT && 
            this.walletGuideStep != WALLETSTEP.WALLETTIP && 
            this.walletGuideStep != WALLETSTEP.WALLETJUMP) {
                cc.sys.localStorage.setItem("wallet____"+userName,this.walletGuideStep);
            }
        GameTool.sendPointToServer("WALLET_" + this.walletGuideStep);
    }

    GameProxy.prototype.getWalletStep = function() {
        let userName = GameData.UsersProxy.getMyNickName();
        if(this.walletGuideStep >= 0) {
            return this.walletGuideStep;
        } else {
            let walletGuideStep = cc.sys.localStorage.getItem("wallet____"+userName);
            this.walletGuideStep = walletGuideStep ? parseInt(walletGuideStep) : 0;
            return this.walletGuideStep;
        }
    }

    GameProxy.prototype.onStartTheGame = function() {
        let timeStamp = new Date().getTime();
        gGameCmd.postAction(gGSM.BEGIN_GAME, {timestamp:timeStamp});
    }

    GameProxy.prototype.readNotice = function(id) {
        gGameCmd.postAction(gGSM.READ_NOTICE, {n_id:id});
    }

    GameProxy.prototype.setLoginPrizeCoin = function(val, id) {
        this.loginPrizeCoin = val;
        this.loginPrizeCoinId = id;
    }
    GameProxy.prototype.getLoginPrizeCoin = function() {
        return this.loginPrizeCoin;
    }
    GameProxy.prototype.getLoginPrizeCoinId = function() {
        return this.loginPrizeCoinId;
    }

    GameProxy.prototype.getPrizeCoin = function() {
        return this.prizeCoin;
    }

    GameProxy.prototype.getPrizeCoinId = function() {
        return this.prizeCoinId;
    }

    GameProxy.prototype.onMsgList = function(data) {
        if(!this.hasAskForRankPrice) {
            this.hasAskForRankPrice = true;
            this.prizeCoin = data.reward ? data.reward : 0;
            this.prizeCoinId = data.id;
            NotifyMgr.send(AppNotify.RANK_REWARD);
        }
    }

    GameProxy.prototype.askForRankPrize = function() {
        // 在每天 五分钟的时候。如果没有请求过，那么就去请求一下
        let zoneHour = GameTool.getUtcHour();
        let zoneMinute = GameTool.getUtcMinute();
        if(zoneHour == 0 && zoneMinute == 5 && !this.hasAskForRankPrice) {
            gGameCmd.postAction(gGSM.GET_NOTICE, null);
        }
    }

    GameProxy.prototype.clearGameData = function() {
        this.totalScore = 0;
        this.totalMoney = 0;
        this.holdBreath = 0;
        this.treasureStart = 0;
        this.boxCreated = 0;
        this.isNewRecord = false;
        this.isSingleRouondUsedCoupons = false;
        this.totalTon = 0;
        this.boxMoney = 0;
        this.boxTonMoney = 0;
        this.treasuresInfo = new Dictionary();

        this.leftHappyTime = 0;
        cc.director.getScheduler().unschedule(this.happyTimeCallback,this._happyTimeScheduleObj);       // 取消定时器...
        this._happyTimeScheduleObj = null;
    }

    GameProxy.prototype.setTimeOut = function() {
        this.leftHappyTime = 0;
        cc.director.getScheduler().unschedule(this.happyTimeCallback,this._happyTimeScheduleObj);       // 取消定时器...
        this._happyTimeScheduleObj = null;
    }

    GameProxy.prototype.getTotalMoney = function() {
        return this.totalMoney;
    }

    GameProxy.prototype.addMoneyToTotal = function(num) {
        this.totalMoney += num;
    }

    GameProxy.prototype.addMoneyToBox = function(num) {
        this.boxMoney += num;
    }

    GameProxy.prototype.addTonMoneyToBox = function(num) {
        this.boxTonMoney += num;
    }

    /** 单局获得的所有的ton币 */
    GameProxy.prototype.getTotalTon = function() {
        return this.totalTon;
    }

    /** 把获得的ton币累加起来 */
    GameProxy.prototype.addTonToTotal = function(num) {
        this.totalTon += num;
    }

    /** 游戏是否已经开始了呢 */
    GameProxy.prototype.isGameOnPlaying = function() {
        let isWatch = (this.gameState & GameState.StateOfWatch);
        let isInit = (this.gameState & GameState.StateOfInit);
        if(isWatch && !isInit) {
            return false;
        }
        return true;
    }

    /** 是否可以jump... */
    GameProxy.prototype.isCanJump = function() {
        let isGameOnPlaying = this.isGameOnPlaying();
        let isOnJumping = (this.gameState & GameState.StateOfJump);
        // 并且还没over
        let isOver = (this.gameState & GameState.StateOfEnd);
        let isInitHero = (this.gameState & GameState.StateOfInitHero);              // 英雄的位置在设置中.
        return isGameOnPlaying && !isOnJumping && !isOver && !isInitHero;
    }

    GameProxy.prototype.getTotalScore = function() {
        return this.totalScore;
    }

    /** 是否是历史的最高分 */
    GameProxy.prototype.getIsNewRecord = function() {
        return this.isNewRecord;
    }

    /** 把每一个步骤，加入到总的步伐分数中去 */
    GameProxy.prototype.addStepScoreToToalScore = function(score) {
        this.totalScore += score;
        let historyScore = GameData.UsersProxy.getMyTopScore();
        
        if(this.totalScore > historyScore) {
            if(historyScore < this.totalScore) {
                GameData.UsersProxy.setMyTopScore(this.totalScore);
                this.isNewRecord = true;
            }
        }
    }

    /** 获得这一局，是否已经获得了复活券. */
    GameProxy.prototype.isGotRoundReviveTicket = function() {
        return this.isThisRoundFetchTheTicket;
    }

    /** 设置这一局的复活券 */
    GameProxy.prototype.setRouondReviveTicket = function(bo) {
        this.isThisRoundFetchTheTicket = bo;
    }

    /** 获取复活券 */
    GameProxy.prototype.fetchTheReviveTicket = function() {
        this.isThisRoundFetchTheTicket = true;                  // 是的，这一局里面，已经有复活券了。
        NotifyMgr.send(AppNotify.FETCH_REVIVETICKET);          // 启动一个事件,获取了一个复活券..
    }

    /** 获取的剩余的快乐时间 */
    GameProxy.prototype.getLeftHappyTime = function() {
        return this.leftHappyTime;
    }

    GameProxy.prototype.onHappyTime = function(dt) {
        this.leftHappyTime -= dt;
         if(this.leftHappyTime <= 0) {
            this.leftHappyTime = 0;
            NotifyMgr.send(AppNotify.ON_TIME_OUT);          // 启动一个事件,获取了一个复活券..
            cc.director.getScheduler().unschedule(this.happyTimeCallback,this._happyTimeScheduleObj);       // 取消定时器...
        }
    }
    

    /** 当玩家 收集到了一个时间 道具的时候 */
    GameProxy.prototype.fetChTheTime = function() {
        this.leftHappyTime = TIMELAST;                // 设置 快乐时间为 30 秒....      TreasureInfo 里面所设置的时间，姑且说为全局变量.
        // let playing = this.isGameOnPlaying();
        // if(!playing) {
        //     return;
        // }
        if(!this._happyTimeScheduleObj) {
            this._happyTimeScheduleObj = {};
            this.happyTimeCallback = this.onHappyTime.bind(this);
            cc.director.getScheduler().enableForTarget(this._happyTimeScheduleObj);
        }
        let bo = cc.director.getScheduler().isScheduled(this.happyTimeCallback,this._happyTimeScheduleObj);
        if(bo) {
            cc.director.getScheduler().unschedule(this.happyTimeCallback,this._happyTimeScheduleObj);
        }
        cc.director.getScheduler().schedule(this.happyTimeCallback, this._happyTimeScheduleObj,0, false);

        NotifyMgr.send(AppNotify.FETCH_TIME);          // 启动一个事件
    }

    GameProxy.prototype.startHoldBreath = function() {
        let playing = this.isGameOnPlaying();
        if(!playing) {
            return;
        }
        if(!this._globalScheduleObj) {
            this._globalScheduleObj = {};
            cc.director.getScheduler().enableForTarget(this._globalScheduleObj);
        }
        this.theCallback = this.onBreath.bind(this)
        this.beginTouchTime = new Date().getTime();
        cc.director.getScheduler().schedule(this.theCallback, this._globalScheduleObj,0, false);
    }

    GameProxy.prototype.onBreath = function() {
        this.holdBreath++;
    }

    GameProxy.prototype.endOfHoldBreath = function() {
        let playing = this.isGameOnPlaying();
        if(!playing) {
            return 0;
        }
        
        cc.director.getScheduler().unschedule(this.theCallback, this._globalScheduleObj);
        let breath = this.holdBreath;
        this.holdBreath = 0;
        let endTime = new Date().getTime();
        if(this.beginTouchTime == 0) {
            return 0;
        }
        let gap = endTime - this.beginTouchTime;
        gap = gap / 1000;
        gap = Math.floor(gap * 60);
        this.beginTouchTime = 0;
        return gap;
    }

    GameProxy.prototype.resetGameState = function() {
        this.gameState = 0;
    }

    GameProxy.prototype.getGameState = function() {
        return this.gameState;
    }
    GameProxy.prototype.clearGameState = function(state) {
        this.gameState &= (~state);
    }
    GameProxy.prototype.setGameState = function(state) {
        this.gameState |= state;
    }

    GameProxy.prototype.onUsePropsDone = function(data) {
        this.isSingleRouondUsedCoupons = true;              // 单局，应用复活券...
        if(data.code == 1) {
            GameData.UsersProxy.setUserInfo(data);    
        }
    }

    /** 获取单局的时候，是否已经应用了复活券了. */
    GameProxy.prototype.isUsedCoupons = function() {
        return this.isSingleRouondUsedCoupons;
    }

    /** 获得广告的图片地址 */
    GameProxy.prototype.getAdImageUrl = function() {
        return this.adImageUrl;
    }

    /** 获得广告的跳转链接地址 */
    GameProxy.prototype.getAdAddress = function() {
        return this.adClickAddress;
    }

    /** 开始游戏的时候，需要把给初始玩家的奖励给放置上去 xxxxxxxxxxxxxxx*/
    GameProxy.prototype.putNewerTreasureToBox = function() {
        /** 这个地方是对 新手的特殊处理 */
        // 在这个地方获取玩家的new_step是多少.  0, 1, 2, 3,4,5, 
        let userStep = GameData.UsersProxy.getMyNewStep();
        userStep = userStep == 0 ? 1 : userStep;
        if(userStep <= 1) {
            let indexArray = [2, 6, 11,16,21];
            let j = 0;
            for(let i = userStep; i < NewTreasureInfos.length; i++) {
                let info = NewTreasureInfos[i];
                let treaInfo = new TreasureInfo();
                treaInfo.init(info);
                this.treasuresInfo.set(indexArray[j], treaInfo);
                j++;
            }
        } else if(userStep < 6) {
            let indexArray = [6, 11,16,21];
            let j = 0;
            for(let i = userStep; i < NewTreasureInfos.length; i++) {
                let info = NewTreasureInfos[i];
                let treaInfo = new TreasureInfo();
                treaInfo.init(info);
                this.treasuresInfo.set(indexArray[j], treaInfo);
                j++;
            }
        }
    }

    GameProxy.prototype.getGoldOfTodayPlusThisRound = function() {
        let result = this.totalMoney + GameData.UsersProxy.getGoldForToday();
        return result;
    }

    GameProxy.prototype.onBeginGame = function(data)  {
        // 当开始游戏的时候，还会更新一下自己的游戏信息...
        if(data.code == 1) {
            this.treasureStart = 0;
            GameData.UsersProxy.setUserInfo(data.user);
            let info = data.game;
            if(info) {
                info.pt_box_result = info.pt_box_result ? info.pt_box_result : [];

                let theStep = GameData.UsersProxy.getMyNewStep();
                if(theStep >= 3) {
                    info.pt_box_result.push({baseType: TreasureBigType.PT, type:TreasureSecondType.REVIVETICKET,box_level:1});
                }
                
            }
            this.createTreasuresInfo(info);
            let goldOfToday = parseInt(data.user_today_money);
            GameData.UsersProxy.setGoldForToday(goldOfToday);
            this.treasureStart++;

            // 这只这一句的广告推送地址是多少...
            this.adImageUrl = data.advertisement.img;
            this.adClickAddress = data.advertisement.jump_url;
            GameTool.getRemoteSprite(null,this.adImageUrl);
        } else if(data.code == 2) {

        }
        
    }


    // this.base = data.base;
    // if(this.base == TreasureBigType.PT) {
    //     this.type = data.type;
    //     if(this.type == TreasureSecondType.GOLD) {
    //         this.value = data.money;
    //     } else {
    //         this.value = TIMELAST;
    //     }
    // } else {
    //     this.type = data.type;
    //     this.value = data.reward_num;
    // }

    /** 生成宝箱信息，规则是 50个箱子，里面随机生成 宝箱 信息 */
    GameProxy.prototype.createTreasuresInfo = function(info) {

        let ptboxArr = info.pt_box_result;
        let tonboxArr = info.ton_box_result;
        info = [];
        if(ptboxArr && ptboxArr.length) {
            for(let i = 0; i < ptboxArr.length; i++) {
                let temp = ptboxArr[i];
                temp.baseType = TreasureBigType.PT;
            }
            info = info.concat(ptboxArr)
        }
        if(tonboxArr && tonboxArr.length) {
            for(let i = 0; i < tonboxArr.length; i++) {
                let temp = tonboxArr[i];
                temp.baseType = TreasureBigType.TON;
            }
            info = info.concat(tonboxArr);
        }
        var startIndex = this.treasureStart * Length;               // 0 - 49 , 50 - 99 这样.
        var endIndex = (this.treasureStart + 1) * Length;           //  0 - 49. 这样
        let step = 1;
        if(info.length == 0){
            step = 1;
        }
        else {
            step = Math.floor(Length / info.length);
        }
        // 在这个地方获取玩家的new_step是多少.  0, 1, 2, 3,4,5, 
        let userStep = GameData.UsersProxy.getMyNewStep();
        userStep = userStep == 0 ? 1 : userStep;

        /** 这个地方是对 新手的特殊处理 */
        if(startIndex == 0 && userStep <= 1) {
            let indexArray = [2, 6, 11,16,21];
            let j = 0;
            for(let i = userStep; i < NewTreasureInfos.length; i++) {
                let info = NewTreasureInfos[i];
                let treaInfo = new TreasureInfo();
                treaInfo.init(info);
                this.treasuresInfo.set(indexArray[j], treaInfo);
                j++;
            }
            j = j -1;
            let beginFrom = indexArray[j];
            startIndex = beginFrom + 1;
            if(info.length == 0){
                step = 1;
            }
            else {
                step = Math.floor((endIndex-startIndex) / info.length);
            }
        } else if(startIndex == 0 && userStep < 6) {
            let indexArray = [6, 11,16,21];
            let j = 0;
            for(let i = userStep; i < NewTreasureInfos.length; i++) {
                let info = NewTreasureInfos[i];
                let treaInfo = new TreasureInfo();
                treaInfo.init(info);
                this.treasuresInfo.set(indexArray[j], treaInfo);
                j++;
            }
            j = j -1;
            let beginFrom = indexArray[j];
            startIndex = beginFrom + 1;
            if(info.length == 0){
                step = 1;
            }
            else {
                step = Math.floor((endIndex-startIndex) / info.length);
            }
        }

        for(let s = startIndex, offset = 0; s < endIndex; s += step) {
            let isFetch = false;            // 区间中获取一个值。
            for(let index = s; index < (s + step); index++) {
                isFetch = Math.random() < (1 / step);
                if(index == 0 || index == 1 || index == 2) {
                    isFetch = false;            // 强制不让 宝箱设置在 0 这个index 的箱子上.
                }
                if(isFetch) {
                    let tempTreasure = info[offset];
                    if(tempTreasure) {
                        let treasureInfo = new TreasureInfo();
                        treasureInfo.init(tempTreasure);
                        this.treasuresInfo.set(index, treasureInfo);
                    }
                    break;
                }
            }
            if(!isFetch) {
                let index = s + step-1;
                let tempTreasure = info[offset];
                if(tempTreasure) {
                    let treasureInfo = new TreasureInfo();
                    treasureInfo.init(tempTreasure);
                    this.treasuresInfo.set(index, treasureInfo);
                }
            }
            offset++;
        }
    }

    /** 确认这个创建的箱子，是否有宝藏在里面 */
    GameProxy.prototype.checkIsMoneyBox = function(index) {
        let info = this.treasuresInfo.get(index);
        return info;
    }

    /** 创建了多少个箱子了 */
    GameProxy.prototype.getBoxCreated = function() {
        return this.boxCreated;     
    }


    /** 默认是创建一个 箱子  */
    GameProxy.prototype.createNumBox = function(value) {
        if(!value) {
            value = 1;
        }

        this.boxCreated += value;

        if(this.boxCreated % 5 == 0 && this.isGameOnPlaying()) {
            GameData.GameProxy.reportToServerInGame();
        }
        let theIndex = this.treasureStart - 1;
        if(theIndex <= 0) {
            theIndex = 0;
        }
        if(this.boxCreated > ((theIndex) * 50 + 40) && this.isGameOnPlaying()) {
            // 这个地方，需要加入一些参数...
            let params = this.getParams();
            params.type = 1;            // 1: 未结束 , 2: 完全结束
            let boxResult = this.getPreFiveBoxTonMoneyAndMoney();
            params.money_box = boxResult.pt;
            params.ton_box = boxResult.ton;
            gGameCmd.postAction(gGSM.CONTINUE_GAME, params);
        }
    }

    /** 在游戏中每个15秒就要汇报一次给服务端 */
    GameProxy.prototype.reportToServerInGame = function() {
        let params = this.getParams();
        params.type = 1;            // 1: 未结束 , 2: 完全结束
        let boxResult = this.getPreFiveBoxTonMoneyAndMoney();
        params.money_box = boxResult.pt;
        params.ton_box = boxResult.ton;
        console.log(params, "===========params");
        gGameCmd.postAction(gGSM.GAME_OVER, params);
    }

    GameProxy.prototype.getPreTotalBoxTonMoneyAndMoney = function() {
        let boxes = this.boxCreated;
        let treasureDic = this.treasuresInfo;
        let pt = TreasureBigType.PT;
        let ton = TreasureBigType.TON;
        let result = {pt:0, ton: 0};
        for(let index = boxes - 1; index > 0; index--) {
            let info = treasureDic.get(index);
            if(info) {
                let base = info.getBase();
                let value = info.getValue();
                if(base == TreasureBigType.PT) {
                    result.pt += value;
                }
                if(base == TreasureBigType.TON) {
                    result.ton += value;
                }
            }
        }
        return result;
    }


    GameProxy.prototype.getPreFiveBoxTonMoneyAndMoney = function() {
        let boxes = this.boxCreated;
        let treasureDic = this.treasuresInfo;
        let pt = TreasureBigType.PT;
        let ton = TreasureBigType.TON;
        let result = {pt:0, ton: 0};
        for(let index = boxes - 1; index > boxes - 6; index--) {
            let info = treasureDic.get(index);
            if(info) {
                let base = info.getBase();
                let value = info.getValue();
                if(base == TreasureBigType.PT) {
                    result.pt += value;
                }
                if(base == TreasureBigType.TON) {
                    result.ton += value;
                }
            }
        }
        return result;
    }

    GameProxy.prototype.getParams = function() {
        let params = {};
        params.combo = this.totalScore;
        params.money = this.totalMoney;
        params.ton_money = this.totalTon;
        params.game = "";
        params.type = 1;            // 1: 未结束 , 2: 完全结束
        let tgid = GameData.UsersProxy.getMyTgid();
        let timeStamp = new Date().getTime();
        let theString = tgid + "|"+params.combo + "|" + params.money + "|" + params.ton_money + "|" + timeStamp;
        params.game = theString;
        return params;
    }

    /** 继续游戏，就是跳到了40个box 上面去的时候，需要重新生成 宝箱的信息 */
    GameProxy.prototype.onGameContinue = function(data) {
        let info = data.game || data;
        this.createTreasuresInfo(info);
        this.treasureStart++;
    }

    /** 游戏结束 */
    GameProxy.prototype.overTheResult = function() {
        //localStorage.setItem("lastScore", this.totalScore);
        //localStorage.setItem("lastMoney", this.totalMoney);
    }
    /** 仅仅就是上报gameover数据 */
    GameProxy.prototype.justReportTheResult = function() {
        let totalScore = this.totalScore;
        let totalMoney = this.totalMoney;
        if(totalScore >= 0 && totalMoney >= 0) {
            let params = this.getParams(totalScore, totalMoney);
            params.type = 2;            // 1: 未结束 , 2: 完全结束
            let boxResult = this.getPreTotalBoxTonMoneyAndMoney();
            params.money_box = boxResult.pt;
            params.ton_box = boxResult.ton;
            params.jump_num = this.boxCreated-2;
            console.log(params, "===========params");
            gGameCmd.postAction(gGSM.GAME_OVER, params);
            GameData.UsersProxy.RegisterGameOver();
        }
    }


    /** 上报游戏结果并且监听 gameover*/
    GameProxy.prototype.startTheGame = function() {
        
        this.onStartTheGame();
    }

    // 加密
    GameProxy.prototype.encryptSymmetric = function(text, key,iv) {
        const cipher = crypto.createCipheriv('aes-256-cbc', key,iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    GameProxy.prototype.webCopyString = function(str, cb) {
        var input = str + '';
        const el = document.createElement('textarea');
        el.value = input;
        el.setAttribute('readonly', '');
        // el.style.contain = 'strict';
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        el.style.fontSize = '12pt'; // Prevent zooming on iOS
 
        const selection = getSelection();
        var originalRange = null;
        if (selection.rangeCount > 0) {
            originalRange = selection.getRangeAt(0);
        }
        document.body.appendChild(el);
        el.select();
        el.selectionStart = 0;
        el.selectionEnd = input.length;
 
        var success = false;
        try {
            success = document.execCommand('copy');
        }
        catch (err) {
 
        }
 
        document.body.removeChild(el);
 
        if (originalRange) {
            selection.removeAllRanges();
            selection.addRange(originalRange);
        }
 
        cb && cb(success);
        if (success) {
        }
        else {
        }
        return success;
    }

    return GameProxy;
})();

window.GameProxy = GameProxy;