let telegramUtil = require('../Script/Common/TelegramUtils');
telegramUtil.registerExpandBehavior();
telegramUtil.registerCloseBehavior();
let ToturialState = {ToturialInit:0, ToturialHold:1, ToturialInterupt:2,ToturialRelease:3};            // 0 指导按住， 1 指导释放， 2 指导 点击屏幕
GameTool.sendPointToServer("Entry_game",true);
cc.Class({
    extends: require('BaseView'),

    properties: {

        
        precent: cc.Label,
        theBox: cc.Node,
        hero: cc.Node,
        preBall:cc.Node,
        ballGroup:cc.Node,
        olderNode:cc.Node,              // 老手的节点
        newerNode:cc.Node,              // 新手的节点


        jumpPostion:[cc.Vec2],            // 新手引导需要跳跃的几个点
        scaleVals:[cc.Float],
        theHeroNode:cc.Node,                //  英雄的节点...
        bg:cc.Node,                         // 背景，用来触发点击事件

        theAnimation:cc.Node,               // tip 的动画的节点....

        tip:cc.Label,                       // tip文字的描述..

        tagPosition:[cc.Float],             // 三角形的开始和结束位置.

        correctGap:[cc.Float],              // 可以跳的区间

        tag:cc.Node,                        // 就是那个三角形...

        treasure:cc.Node,                   // 就是那个宝贝...

    },

    onLoad() {

        GameTool.sendPointToServer("Entry_loading",true);
        // 把这几个proxy 都设置一下..
        this.hasEnter = false;          // 是否已经进入了。
        this.wigDoneCount = 0;
        this.sceneDone = false;
        GameData.reset();
        for (var key in GameData) {
            GameData[key];
        }

        window.MyInstance = this;

        this.theTempIndex = 0;
        this.precent.string = 0 + "%";
        this.nodePool = new cc.NodePool();
        this.BigStep = 0;
        this.BigPercent = [0 ,40, 70,100];         // 第一个是网络， 第二个是prefab, 第三个是音效.
        this.smallStep = -1;
        var netThing = [this.login];

        this.olderNode.active = true;
        this.newerNode.active = false;
        this.theResources = [netThing];
        this.onNext();
        telegramUtil.onSetBgColor(HEAD_COLORS.LOADING);
        telegramUtil.onSetHeaderColor(HEAD_COLORS.LOADING);

        this.SceneValue = Math.floor(Math.random() * 8) + 4;
        this.PerValue = Math.floor(100 - this.SceneValue) / 11;
    },

    onLoginFinished() {
        /** 获得我是否是新手 */
        let isNewer = GameData.UsersProxy.getMyNeedTutorial();
        isNewer = !isNewer;
        if(isNewer) {
            this.newerNode.active = true;
            this.doToturialInit();
        }
        else {
            this.olderNode.active = true;
        }
    },

    doToturialInit() {
        GameTool.sendPointToServer("Guide_entry");
        this.olderNode.active = false;
        this.newerNode.active = true;

        this.bg.on(cc.Node.EventType.TOUCH_START,this.onBgTouchStart, this);
        this.bg.on(cc.Node.EventType.TOUCH_END, this.onBgTouchEnd, this);
        this.bg.on(cc.Node.EventType.TOUCH_CANCEL, this.onBgTouchEnd, this);
        this.currentStep = 0;
        this.holdTime = 0;
        let pos = cc.v2(this.jumpPostion[0]);
        this.theHeroNode.scale = this.scaleVals[0];

        this.theHeroNode.setPosition(pos.x, pos.y + 200);
        cc.tween(this.theHeroNode)
            .to(0.2,{position:cc.v2(this.theHeroNode.getPosition().x,pos.y-10)})
            .to(0.08,{position:cc.v2(this.theHeroNode.getPosition().x,pos.y+50)})
            .to(0.07,{position:cc.v2(this.theHeroNode.getPosition().x,pos.y-5)})
            .to(0.06,{position:cc.v2(this.theHeroNode.getPosition().x,pos.y+10)})
            .to(0.02,{position:cc.v2(this.theHeroNode.getPosition().x,pos.y)})
            .start();
        this.doTheAnimationByState(ToturialState.ToturialInit);



        let info = {baseType:TreasureBigType.TON,type:0,reward_num:1,box_level:2, newGuideStep:1};
        let treaInfo = new TreasureInfo();
        treaInfo.init(info);

        let treatureCom = this.treasure.getComponent("Treasure");
        treatureCom.setMoney(treaInfo);
    },

    resetToturial() {
        this.tip.node.stopAllActions();
        this.tip.node.scale = 1.0;
        this.holdTime = 0;
        this.theHeroNode.position = cc.v2(this.jumpPostion[this.currentStep]);
        this.theHeroNode.scale = this.scaleVals[this.currentStep];
        this.theHeroNode.angle = 0;
        this.tag.x = this.tagPosition[0];
        this.doTheAnimationByState(ToturialState.ToturialInit);
    },

    onBgTouchStart() {
        GameData.SoundProxy.playHoldBreath();
        if(this.currentStep < 3) {
            this.doTheAnimationByState(ToturialState.ToturialHold);
            this.callback = this.onHold.bind(this);
            this.schedule(this.callback);
        }
    },

    onHold() {
        this.holdTime += 5;
        this.tag.x = (this.tagPosition[0] + this.holdTime);
        if(this.tag.x >= this.tagPosition[1]) {
            this.tag.x  = this.tagPosition[1];
        }
        // let gap = this.tag.x - this.tagPosition[0];


        // let y = 1.3 - gap / 600;
        // this.theHeroNode.setScale(1.3, y);
        // if(this.theHeroNode.scaleY <= 0.8) {
        //     this.theHeroNode.setScale(1.3, 0.8);
        // }
        // let x = 1.3 + gap / 1200;
        // this.theHeroNode.setScale(x, this.theHeroNode.scaleY);
        // if(x >= 1.7) {
        //     this.theHeroNode.setScale(cc.v2(1.7,this.theHeroNode.scaleY));
        // }
        let bo = this.isInCorrectGap();
        if(bo) {
            this.doTheAnimationByState(ToturialState.ToturialRelease);
        }
    },

    onBgTouchEnd() {
        GameData.SoundProxy.stopHoldBreath();
        if(this.currentStep < 3) {
            if(this.callback) {
                this.unschedule(this.callback);
                this.callback = null;
            }
    
            let bo = this.isInCorrectGap();
            if(bo) {
                this.theHeroNode.setScale(1.0);
                this.doToturialJump();
            } else {
                this.doTheAnimationByState(ToturialState.ToturialInterupt);
            }
        } else {
            gUICtrl.openUI(gUIIDs.FINISH_TOTURIAL_TIP);
        }
        
    },

    isInCorrectGap() {
        let positionX = this.tag.position.x;
        let bo = positionX >= this.correctGap[0] && positionX <= this.correctGap[1];
        return bo;
    },
    
    onNext() {
        this.smallStep++;
        let thing = this.theResources[this.BigStep];
        var self = this;
        if(this.smallStep < thing.length) {
            this.doNext();
        } else {
            this.smallStep = 0;
            this.BigStep++;
            if(this.BigStep < this.theResources.length) {
                this.doNext();
            } else {
                cc.director.preloadScene("JJUIMain", function(completedCount, totalCount, item) {

                }, function() {
                    self.shouldStartJump(false);
                }.bind(this));
            }
        }
    },

    doToturialJump() {
        this.currentStep++;
        if(this.currentStep == 1) {
            GameTool.sendPointToServer("Guide_jump1");
        }
        let jumpPosition = this.jumpPostion[this.currentStep];
        let jumpTo = cc.jumpTo(0.4,jumpPosition.x,jumpPosition.y, 200, 1);
        let angle = this.currentStep == 1 ? -360 : 360;
        var self = this;
        cc.tween(this.theHeroNode).to(0.4, {angle:angle}).call(()=>{
            self.resetToturial();
            GameData.SoundProxy.playScore(1);
            if(self.currentStep == 3) {
                let treatureComponent = this.treasure.getComponent("Treasure");
                treatureComponent.openBox(this.treasure.parent);
                gUICtrl.openUI(gUIIDs.FINISH_TOTURIAL_TIP);
                GameTool.sendPointToServer("Guide_over");
            } 
         }).start();
        this.theHeroNode.runAction(jumpTo)
    },

    doTheJump() {
        this.ballGroup.active = false;
       let jumpTo = cc.jumpTo(0.4,550,300, 200, 1);
       cc.tween(this.hero).to(0.4, {angle:-180}).delay(0.2).call(()=>{
            let isNewer = GameData.UsersProxy.getMyNeedTutorial();
            if(isNewer) {
                this.doToturialInit();
            } else {
                cc.director.loadScene("JJUIMain", function(error) {
                    if (error) {
                        return;
                    }
                }.bind(this));
            }
            
        }).start();
       this.hero.runAction(jumpTo)
    },

    doNext() {
        let thing = this.theResources[this.BigStep];
        let thisStep = this.BigPercent[this.BigStep];
        let nextStep = this.BigPercent[this.BigStep + 1];
        let perStep = (nextStep - thisStep) / thing.length;
        let target = thing[this.smallStep];
        if(typeof target == 'function') {
            target();
        } else {
            this.preloadResource(target);
        }
    },

    preloadResource(url) {
        let self = this;
        cc.resources.load(url, function(err) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            self.shouldStartJump(true);
        });
    },

    /** 是否是wig，还是完成了scenethis.tasks();
                    this.historyRank();
                    this.friend();
                    this.clubRank();
                    this.coinRank();

                    this.preloadResource("sound/fail");
                    this.preloadResource("sound/jump_loop");
                    this.preloadResource("sound/jump_start");
                    this.preloadResource("sound/score_1");
                    this.preloadResource("sound/score_more");
                    this.preloadResource("sound/button");
                    
                    */
    shouldStartJump(isWig) {

        if(!this.hasEnter) {
            if(isWig) {
                this.wigDoneCount += 1;
            } else {
                this.sceneDone = true;
            }
    
            
            var plus = 0;
            if(this.sceneDone) {
                plus = this.SceneValue;
            }
            this.theTempIndex = this.wigDoneCount * this.PerValue + plus;
            this.precent.string = parseInt(this.theTempIndex) + "%";
            this.touchStart(this.theTempIndex/100, 30);
    
            if(this.wigDoneCount >= 11 && this.sceneDone) {
                this.hasEnter = true;
                this.precent.string = "100%";
                this.doTheJump();
                GameTool.sendPointToServer("Loading_over",true);
            }
        }
    },


    /** 根据节点的状态来，播放对应的动作 */
    doTheAnimationByState(state) {
        if(this.state == state) {
            return;
        }
        this.state = state;
        this.theAnimation.active = true;
        this.theAnimation.stopAllActions();
        this.tip.node.stopAllActions();
        if(state == ToturialState.ToturialInit) {
            this.theAnimation.getComponent(cc.Animation).play("init");
            this.tip.string = "Hold the screen to charge up";
        }
        else if(state == ToturialState.ToturialHold) {
            this.theAnimation.getComponent(cc.Animation).play("hold");
            this.tip.string = "Hold the screen to charge up";
        } else if(state == ToturialState.ToturialInterupt) {
            this.theAnimation.getComponent(cc.Animation).play("init");
            this.tip.string = "Don't release your finger";
        } else if(state == ToturialState.ToturialRelease) {
            this.theAnimation.getComponent(cc.Animation).play("init");
            this.tip.string = "It's time to let go now";
            let breathAction = cc.sequence(
                cc.scaleTo(0.3, 0.95),
                cc.scaleTo(0.3, 1.05),
            ).repeatForever();
            this.tip.node.runAction(breathAction);
        }
    },  

    coinRank() {
        GameData.RankProxy.askForCoinRank();
    },

    clubRank() {
        GameData.RankProxy.askForSquadRank();
    },

    activityRank() {
        GameData.RankProxy.askForActivityRank();
    },

    historyRank() {
        GameData.RankProxy.askForHistoryRank();
    },

    tasks() {
        GameData.TaskProxy.askForTasks();
    },

    /** 朋友数据 */
    friend() {
        GameData.FriendsProxy.askForFriends();
    },

    /** 登录数据 */
    login() {
        // 登录
        let code = cc.sys.languageCode;
        let countryCode = code.substring(code.length - 1);
        let sp = GameTool.getEntryParams().start_param;
        let startParam = sp ? sp : "";
        let loginParam = {
            "cfcountry": countryCode,
            "lan": code,
            // "platform": retrieveLaunchParams().platform,
            "platform": "ios",
            "startapp":startParam
        };
        gGameCmd.postAction(gGSM.LOGIN, loginParam);
    },




    onDestroy() {
        this.nodePool.clear();
    },

    /*** 蓄力效果，很多小球飞向英雄 */
    startJumpEffect() {
        let ball = this.nodePool.get() || cc.instantiate(this.preBall);
        {
            // 颜色RGB随机，透明度随机
            let r = Math.floor(Math.random() * 255);
            let g = Math.floor(Math.random() * 255);
            let b = Math.floor(Math.random() * 255);
            let a = Math.floor(Math.random() * 255);
            if(Math.random() < 0.5) {
                r = 255;
                b = 255;
                g = 255;
            }
            ball.color = new cc.Color(r, g, b, 255);
            ball.opacity = a;
        }
        //x,y位置随机
        let r_x = Math.random()*(200-(-200))+(-200);
        let r_y = Math.random()*(250-(-50))+(-50);
        ball.setContentSize(10,10);
        ball.setParent(this.ballGroup);
        ball.setPosition(r_x,r_y);
        cc.tween(ball).to(Math.random()*(0.7-(0.2)+(0.2)),{position:cc.v2(Math.random()*(10-(-10)+(-10)),0)}).call(()=>{
            this.nodePool.put(ball);
        }).start();
    },


    start() {
        
    },  

    update(dt) {
        // if(this.theTempIndex >= 100) {
        //     this.theTempIndex = 100;
        // }
        // this.precent.string = parseInt(this.theTempIndex) + "%";
        // this.touchStart(this.theTempIndex/100, 30);


    },

    touchStart(deltaTime, boxHeight) {
        let y = 1.3 - deltaTime / 6;
        // 英雄的压缩效果
        this.hero.setScale(1.3, y);
        if(this.hero.scaleY <= 0.8) {
            this.hero.setScale(1.3, 0.8);
        }
        let x = 1.3 + deltaTime / 10;
        this.hero.setScale(x, this.hero.scaleY);
        if(x >= 1.7) {
            this.hero.setScale(cc.v2(1.7,this.hero.scaleY));
        }

        //限制最大压缩比例
        if(this.hero.scaleY>0.8){
            let pos = this.hero.getPosition();
            //this.hero.setPosition(cc.v2(pos.x,pos.y-deltaTime/8*boxHeight));
         }

         this.startJumpEffect();
    },

    listNotificationInterests() {
        return [
            gGSM.LOGIN,
            AppNotify.SHOW_FRIENDS,
            AppNotify.RankClub,
            AppNotify.RankToday,
            AppNotify.FETCH_TASKS,
            AppNotify.RankHistory,
            AppNotify.RankCoin,
        ];
    },

    handleNotification(key, data) {
        switch (key) {
            case gGSM.LOGIN:
                {
                    this.tasks();
                    //this.historyRank();
                    this.friend();
                    this.clubRank();
                    this.coinRank();

                    this.preloadResource("sound/fail");
                    this.preloadResource("sound/jump_loop");
                    this.preloadResource("sound/jump_start");
                    this.preloadResource("sound/score_1");
                    this.preloadResource("sound/score_more");
                    this.preloadResource("sound/button");
                    this.preloadResource("sound/levelup");

                }
                this.onNext();
                break;
            case AppNotify.SHOW_FRIENDS:
                this.shouldStartJump(true);
                break;
            case AppNotify.RankClub:
                this.shouldStartJump(true);
                break;
            case AppNotify.RankToday:
                this.shouldStartJump(true);
                break;
            case AppNotify.RankHistory:
                this.shouldStartJump(true);
                break;
            case AppNotify.FETCH_TASKS:
                this.shouldStartJump(true);
                break;
            case AppNotify.RankCoin:
                this.shouldStartJump(true);
                break;   

        }
    },


});
