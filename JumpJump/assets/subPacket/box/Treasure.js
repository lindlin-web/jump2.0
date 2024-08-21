cc.Class({
    extends: cc.Component,

    properties: {
        onSprites:[cc.SpriteFrame],
        offSprites:[cc.SpriteFrame],
        on:cc.Node,
        off:cc.Node,
        theValue:cc.Label,
        flyMoney:cc.Node,
        myMoney:0,
        theIcon:cc.Sprite,          // 金币的icon 是什么...
        icons:[cc.SpriteFrame],     // icons 有两个， 第一个是金币， 第二个是ton 币
        colors:[cc.Color],          // 两种颜色...

        theTimeNode:cc.Node,        // 时间的icon
        theReviveTic: cc.Node,      // 复活券的icon....
    },

    onLoad() {
        this.myTreasureType = TreasureBigType.PT;
        this.myTreasureSecondType = TreasureSecondType.NONE,            // 宝箱的第二个类型， 0， 啥不是， 1， 金币， 2. 时间， 3， 复活券
        this.off.active = true;
        this.on.active = false;
        this.flyMoney.active = false;
    },

    setMoney(info) {
        let base = info.getBase();
        this.theTimeNode.active = false;
        this.theReviveTic.active = false;
        this.newGuideStep = info.getNewGuideStep();             // 是否是新手引导的部分内容的呢...........
        this.myTreasureType = base;
        if(base == TreasureBigType.PT) {
            this.myTreasureSecondType = info.getType();         // 第二个类型是什么..
            if(this.myTreasureSecondType == TreasureSecondType.GOLD) {
                this.theIcon.spriteFrame = this.icons[0];
                this.myMoney = info.getValue();
                this.theValue.string = "+" + this.myMoney;
                this.on.getComponent(cc.Sprite).spriteFrame = this.onSprites[info.getLevel()-1];
                this.off.getComponent(cc.Sprite).spriteFrame = this.offSprites[info.getLevel()-1];
                let plusScale = (info.getLevel()-1) * 0.2;
                this.node.setScale(1+plusScale);
            }
            else if(this.myTreasureSecondType == TreasureSecondType.TIME) {
                this.on.active = false;
                this.off.active = false;
                this.flyMoney.active = false;
                this.theTimeNode.active = true;
                this.theReviveTic.active = false;
            }
            else if(this.myTreasureSecondType == TreasureSecondType.REVIVETICKET) {
                this.on.active = false;
                this.off.active = false;
                this.flyMoney.active = false;
                this.theTimeNode.active = false;
                this.theReviveTic.active = true;
            }
        } 
        else {
            this.theIcon.spriteFrame = this.icons[1];
            this.myMoney = info.getValue();
            this.theValue.string = "+" + this.myMoney;
            this.theValue.node.color = this.colors[1];
            this.on.getComponent(cc.Sprite).spriteFrame = this.onSprites[info.getLevel()-1];
            this.off.getComponent(cc.Sprite).spriteFrame = this.offSprites[info.getLevel()-1];
            this.on.getComponent(cc.Sprite).spriteFrame = this.onSprites[info.getLevel()-1];
            this.off.getComponent(cc.Sprite).spriteFrame = this.offSprites[info.getLevel()-1];
            let plusScale = (info.getLevel()-1) * 0.2;
            this.node.setScale(1+plusScale);
        }
        
    },

    start() {

    },

    openBox(parent) {
        this.node.setParent(parent);
        let bigType = this.myTreasureType;
        let secondType = this.myTreasureSecondType;

        let step = this.newGuideStep;
        if(step) {
            let myStep = step - 1;
            let param = "Start_jump" + myStep;
            GameData.UsersProxy.askForServerUpdateStep(step);
            GameTool.sendPointToServer(param);
        }
        if(bigType == TreasureBigType.PT) {
            if(secondType == TreasureSecondType.GOLD) {

                let roundAlreadyEarnMoney = GameData.GameProxy.getGoldOfTodayPlusThisRound();
                let myDailyLimitLevel = GameData.UsersProxy.getMyUpgradeLevel(5);         // 获得happyTime的level是多少.
                let myLimit = GameData.UpgradeProxy.getDailyLimitByLevel(myDailyLimitLevel);
                let gap = myLimit - roundAlreadyEarnMoney;
                if(gap > this.myMoney) {

                    GameData.GameProxy.addMoneyToTotal(this.myMoney);
                    GameData.GameProxy.addMoneyToBox(this.myMoney);
                    GameData.UsersProxy.addGoldToMe(this.myMoney);
                    let showMoney = parseInt(this.myMoney);
                    this.theValue.string = "+" + showMoney;
                } else {
                    gap = gap < 0 ? 0 : gap;
                    GameData.GameProxy.addMoneyToTotal(gap);
                    GameData.GameProxy.addMoneyToBox(gap);
                    GameData.UsersProxy.addGoldToMe(gap);
                    gap = parseInt(gap);
                    this.theValue.string = "+" + gap;
                }
            }
            else if(secondType == TreasureSecondType.TIME) {
                GameData.GameProxy.fetChTheTime();
            }
            else if(secondType == TreasureSecondType.REVIVETICKET) {
                GameData.GameProxy.fetchTheReviveTicket();
            }
        } else {
            GameData.GameProxy.addTonToTotal(this.myMoney);
            GameData.UsersProxy.addTonToMe(this.myMoney);
            GameData.GameProxy.addTonMoneyToBox(this.myMoney);
        }
        cc.tween(this.node)
            .to(0.4, {position: cc.v2(0, 200)})
            .call(()=>{
                let bigType = this.myTreasureType;
                let secondType = this.myTreasureSecondType;
                let fly = this.flyMoney;
                if(bigType == TreasureBigType.PT && secondType != TreasureSecondType.GOLD) {

                } else {
                    this.node.opacity = 255;
                    this.on.active = true;
                    this.off.active = false;
                    fly.active = false;
                }
                

                cc.tween(this.node).delay(0.2).call(()=>{
                    if(bigType == TreasureBigType.PT && secondType != TreasureSecondType.GOLD) {

                    } else {
                        this.on.active = false;
                        fly.active = true;
                    }
                }).to(1,{position: cc.v2(0, 250),opacity:0}).start();
            })
            .delay(1.2)
            .call(()=>{
                this.node.destroy();
            })
            .start();
    }

});
