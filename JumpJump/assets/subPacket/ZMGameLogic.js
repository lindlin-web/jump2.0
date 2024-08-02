const Box = require('./box/Box');
const HeroCtrl = require('./hero/HeroCtrl');
let BOXTYPE = {NormalBox:1, BigBox:2, HugeBox:3, GiantBox:4};       // 箱子的类型
const BOXLENGTH = 21;

var ZMGameLogic =cc.Class({
    extends: require('BaseView'),

    properties: {

        lightHouse:cc.Node,             // 灯塔
        theScore:cc.Label,              // 分值的东西是什么....

        plusAdd:cc.Label,              // 跳跃的额外加成是什么....

        moneyPanel:cc.Node,             // 跟钱有关系的那个面板.
        moneyLabel:cc.Label,            // 钱的数量是多少的呢.
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.isOnLoaded = true;
        //this.originalX = this.theScore.node.x;
        
        this.originalMoneyX = this.moneyPanel.x;
        this.originalScoreX = this.theScore.node.parent.x;
        this.theScore.node.active = false;
        this.moneyPanel.active = false;
        let money = GameData.GameProxy.getTotalMoney() + "";
        let val = GameTool.convertNumberToString(money);
        this.moneyLabel.string = val;
        this.isUpdateStart = false;
        this.boxArr = [];       // 产生的box 的Box组件的一个数组
        this.gameState = GameState.StateOfWatch;            // 初始化的时候，试看的状态.
        this.heroComponent = null;

        GameData.GameProxy.setGameState(GameState.StateOfWatch);        // 观看形式

        if (CC_EDITOR && cc.engine) {
            cc.engine.on('design-resolution-changed', this.onResized.bind(this));
        }
        else {
            let thisOnResized = this.onResized.bind(this);
            window.addEventListener('resize', thisOnResized);
            window.addEventListener('orientationchange', thisOnResized);
        }
        this.onResized();
    },

    onResized() {
        let gap = GameTool.getTheWidthGap();
        //this.theScore.node.x = this.originalX - gap;
        this.moneyPanel.x =  this.originalMoneyX + gap;

        this.initialMoneyPanel = this.moneyPanel.x;                 // 初始化 moneypanel的位置...

        this.node.scale = 1 * GameTool.getGameLogicScaleSize();
        this.theScore.node.parent.x = this.originalScoreX - gap;
    },

    

    start() {
        
        let mainHome = cc.director.getScene().getChildByName("Canvas").getComponent("ZMMainHome");
        if(!mainHome) {
            return;
        }
        let panels = mainHome.getPanelsNode();
        console.log(panels, "===========panels");
        this.boxesNode = panels;

        let isNewer = GameData.UsersProxy.getMyIsNewer();
        if(!isNewer) {
            this.runTheGame();
        }
    },

    /** 目前有两种状态来进行这个游戏，一个是 watch 形式， 一个是 real 形式 */
    /** watch 形式不能 操作， real形式可以 */
    runTheGame() {
        GameData.GameProxy.setGameState(GameState.StateOfInitHero);
        this.node.setPosition(0, 0);
        this.theScore.string = "" + 0;
        this.plusAdd.string = "";
        this.clearAll();
        let isPlaying = GameData.GameProxy.isGameOnPlaying();
        if(isPlaying) {
            this.theScore.node.active = true;
        }
        

        // 创建两个箱子
        this.createBoxInPosition(cc.v2(-133, -207));
        this.createBoxInPosition(cc.v2(169, -44));

        // create hero
        this.heroComponent = cc.instantiate(this.boxesNode.getChildByName("pre_hero")).getComponent(HeroCtrl);
        this.heroComponent.initHero(this.node, this.boxArr[0].getJumpPosition());

        // 移动一下屏幕，根据箱子和参考点
        this.moveScreen();
    },

    /**  开始做开始机器的动作 */
    doTheHoldBreathAction() {
        let isCanJump = GameData.GameProxy.isCanJump();
        if(isCanJump){
            GameData.SoundProxy.playHoldBreath();
            this.isUpdateStart = true;
        }
    },

    /**  停止动作 */
    endOfHoldBreathAction(breath) {
        this.isUpdateStart = false;
        // 合法性判断
        let isPlaying = GameData.GameProxy.isGameOnPlaying();
        if(!isPlaying){
            return;
        }
        let isCanJump = GameData.GameProxy.isCanJump();
        if(!isCanJump) {
            return;
        }
        if(breath < 2) {
            return;
        }
        GameData.SoundProxy.stopHoldBreath();
        // 回复英雄的身高
        this.heroComponent.touchEnd();
        // 箱子弹起
        this.boxArr[this.boxArr.length - 2].touch_end();
        // 设置英雄显示层级为最上层.
        this.heroComponent.setSibling(this.node.children.length);
        // 重置英雄旋转的欧拉角
        this.heroComponent.resetAngle();
        GameData.GameProxy.setGameState(GameState.StateOfJump);
        // 根据目标箱子实现跳跃
        this.heroComponent.jumpByBox(this.boxArr[this.boxArr.length -1], breath,
            (score, colliderNode)=>{
                // 取消 跳高 的状态 ....
                GameData.GameProxy.clearGameState(GameState.StateOfJump);
                GameData.GameProxy.clearGameState(GameState.StateOfInput);
                // 判断是否发生碰撞
                if(colliderNode) {
                    //
                    if(this.boxArr[this.boxArr.length - 1].node != colliderNode) {
                        // 脚下的箱子 ，所以不用处理
                    } else {
                        switch(score) {
                            case -1:
                                this.heroComponent.slip(()=>{
                                    this.theScore.node.active = false;
                                    // 这个地方，如果有复活券，就直接复活，如果没有复活券，就去 结算面板.
                                    let bo = GameData.GameProxy.isGotRoundReviveTicket();
                                    if(bo) {
                                        GameData.GameProxy.setRouondReviveTicket(false);
                                        
                                        gUICtrl.openUI(gUIIDs.UI_REVIVE_TIP);
                                    } else {
                                        NotifyMgr.send(AppNotify.ON_TIME_OUT);
                                        GameData.GameProxy.justReportTheResult(); 
                                        gUICtrl.openUI(gUIIDs.UI_RESULT_PAGE);
                                    }
                                    
                                });
                                score = 0;
                                break;
                            case 0: 
                                this.heroComponent.miss(this.boxArr[this.boxArr.length - 1].node,
                                    this.boxArr[this.boxArr.length - 1].node,
                                    ()=>{
                                        // 游戏结束了。调用 over_page 面板
                                        this.theScore.node.active = false;
                                        // 这个地方，如果有复活券，就直接复活，如果没有复活券，就去 结算面板.
                                        let bo = GameData.GameProxy.isGotRoundReviveTicket();
                                        if(bo) {
                                            GameData.GameProxy.setRouondReviveTicket(false);
                                            gUICtrl.openUI(gUIIDs.UI_REVIVE_TIP);
                                        } else {
                                            NotifyMgr.send(AppNotify.ON_TIME_OUT);

                                            GameData.GameProxy.justReportTheResult();       // 就是上报，结束的数据。。。
                                            gUICtrl.openUI(gUIIDs.UI_RESULT_PAGE);
                                        }
                                    }
                                );
                                break;
                        }
                        GameData.GameProxy.addStepScoreToToalScore(score);
                        this.theScore.node.active = true;
                        let singleRoundTotalScore = GameData.GameProxy.getTotalScore();             // 跳跃了多少的分数是多少的呢。
                        let plusValue = GameTool.getJumpAdditionByCombo(singleRoundTotalScore);     // 那什么....
                        this.theScore.string = singleRoundTotalScore + "";
                        if(plusValue > 0) {
                            this.plusAdd.string = "+" + plusValue + "%";
                        } else {
                            this.plusAdd.string = "";
                        }


                        
                        // 分数大于0，可以继续游戏
                        if(score > 0) {

                            let earnMoney = GameTool.getEarnMoneyByStep(score);
                            GameData.GameProxy.addMoneyToTotal(earnMoney);              // 把金币先加入到我的信息中来.
                            GameData.UsersProxy.addGoldToMe(earnMoney);                 // 把赚取的金币 设置成单局的收益.


                            // 开启宝箱
                            GameData.SoundProxy.playScore(score);
                            let box = this.boxArr[this.boxArr.length - 1].node;
                            let treatureBox = box.getChildByName("treature_box");
                            if(treatureBox) {
                                let treatureComponent = treatureBox.getComponent("Treasure");
                                treatureComponent.openBox(this.heroComponent.node);
                                // openBox 这个时候已经是可以显示 money 的面板了.
                                this.startMoveInMoneyPanel();
                            }
                            // 英雄身上嫖分
                            this.heroComponent.showScore(score);
                            // 播放英雄落地小球飞溅特效
                            this.heroComponent.endJumpEffect();
                            
                            this.generateNewBox();
                            this.moveScreen();
                        } else {
                            GameData.GameProxy.setGameState(GameState.StateOfEnd);
                            GameData.SoundProxy.playFail();
                            this.theScore.node.active = false;
                            this.startMoveOutMoneyPanel();
                        }
                    }
                } else {
                    GameData.GameProxy.setGameState(GameState.StateOfEnd);
                    GameData.SoundProxy.playFail();
                    this.heroComponent.miss(this.boxArr[this.boxArr.length - 1].node,
                        this.boxArr[this.boxArr.length - 2].node,
                        ()=>{
                            this.theScore.node.active = false;
                            this.startMoveOutMoneyPanel();
                            // 这个地方，如果有复活券，就直接复活，如果没有复活券，就去 结算面板.
                            let bo = GameData.GameProxy.isGotRoundReviveTicket();
                            if(bo) {
                                GameData.GameProxy.setRouondReviveTicket(false);
                                
                                gUICtrl.openUI(gUIIDs.UI_REVIVE_TIP);
                            } else {
                                NotifyMgr.send(AppNotify.ON_TIME_OUT);
                                GameData.GameProxy.justReportTheResult(); 
                                gUICtrl.openUI(gUIIDs.UI_RESULT_PAGE);
                            }
                        }
                    )
                }
            }
        )
    },

    continueTheGame() {
        // 开始游戏。
        this.theScore.node.active = true;
        GameData.GameProxy.resetGameState();
        GameData.GameProxy.setGameState(GameState.StateOfInit);
        this.heroComponent.resetAngle();
        this.heroComponent.initHero(this.node, this.boxArr[this.boxArr.length - 2].getJumpPosition());
        this.moveScreen();
        this.heroComponent.setSibling(this.node.children.length);
    },

    clearAll() {
        this.node.removeAllChildren();
        this.boxArr.splice(0, this.boxArr.length);
        this.boxArr = [];
        this.theScore.node.active = false;
    },

    moveScreen() {
        // 获取倒数第一箱子坐标
        let last = this.boxArr[this.boxArr.length - 1].node.getPosition();
        let secondToLast = this.boxArr[this.boxArr.length - 2].node.getPosition();
        // 向量计算
        last = last.clone();
        let midPosition = last.subtract(secondToLast);
        midPosition.x = midPosition.x / 2 + secondToLast.x;
        midPosition.y = midPosition.y / 2 + secondToLast.y;
        // 对应世界坐标
        let worldPos = this.node.convertToWorldSpaceAR(midPosition);
        let canvasPosition = this.node.parent.convertToNodeSpaceAR(worldPos);
        let tempPostion = this.lightHouse.getPosition().clone();
        let pos = tempPostion.subtract(canvasPosition);
        cc.tween(this.node).by(0.5, {position:cc.v2(pos.x, pos.y)}).start();
        this.heroComponent.setSibling(this.node.children.length);
    },

    /**
     *  产生一个新的箱子
     */
    generateNewBox() {
        this.stepClear();
        // 获取当前最后一个箱子坐标
        let lastBoxPosition = this.boxArr[this.boxArr.length - 1].node.getPosition();
        // 计算获取向量
        let secondToLastBoxPosition = this.boxArr[this.boxArr.length - 2].node.getPosition();
        let lastBoxPositionDouble = lastBoxPosition.clone();
        let theVecNor = lastBoxPositionDouble.subtract(secondToLastBoxPosition).normalize();
        // 随机x,y
        let randomXY = Math.random() * 150 + 300;
        // 随机箱子位置
        if(Math.random() < 0.5) {
            theVecNor.x = theVecNor.x * (-1);
        }
        // 根据以上数据，获取新箱子坐标
        let newPosition = cc.v2(lastBoxPosition.x + theVecNor.x * randomXY, lastBoxPosition.y + theVecNor.y * randomXY);
        // 创建一个箱子，并且执行箱子初始动画
        let isPlaying = GameData.GameProxy.isGameOnPlaying();
        if(isPlaying) {
            this.createBoxInPosition(newPosition).action_tween();
        } else {
            this.createBoxInPosition(newPosition);
        }
        
    },

    /** 用一个预制体生成一个箱子 */
    createBoxInPosition(newPosition) {
        GameData.GameProxy.createNumBox(1);
        let randomIndex = Math.floor(Math.random() * BOXLENGTH);
        if(randomIndex == 0) {
            randomIndex = 1;
        }
        //let boxPrefab = this.theBoxs[randomIndex];
        let boxNode = cc.instantiate(this.boxesNode.getChildByName("pre_box_" +randomIndex));//cc.instantiate(boxPrefab);
        
        let boxCom = boxNode.getComponent(Box);
        let index = GameData.GameProxy.getBoxCreated();
        boxCom.random_box(this.node, newPosition,index);
        this.boxArr.push(boxCom);

        // 创建宝箱, 不是试看的状态就可以在产生凳子的时候产生一个宝箱
        let isPlaying = GameData.GameProxy.isGameOnPlaying();
        if(isPlaying) {
            this.createTreasuresBox(boxNode,index);
        }
        return boxCom;
    },

    /** 在一个箱子 头上产生一个宝箱 */
    createTreasuresBox(box, index) {
        let data = GameData.GameProxy.checkIsMoneyBox(index);
        if(data) {
            let treatureBox = cc.instantiate(this.boxesNode.getChildByName("treasureBox"));
            let treatureCom = treatureBox.getComponent("Treasure");
            treatureBox.parent = box;
            treatureCom.setMoney(data);
            let boxComponent = box.getComponent(Box);
            let position = this.node.convertToWorldSpaceAR(boxComponent.getJumpPosition());
            treatureBox.setPosition(box.convertToNodeSpaceAR(position));
            treatureBox.y += 7;
            treatureBox.active = true;
            treatureBox.name = "treature_box";
        }
    },

    autoJump() {
        if(this.gameState != GameState.StateOfWatch) {
            return;         // 不是观看的模式,会直接返回
        }
        this.heroComponent.resetAngle();
        let posHero = this.heroComponent.node.getPosition();
        let posBox = this.boxArr[this.boxArr.length - 1].getJumpPosition().subtract(posHero).normalize();
        let targetPos = this.boxArr[this.boxArr.length - 1].getJumpPosition();
        // 执行跳跃
        this.heroComponent.node.getChildByName("tail").active = true;
        this.heroComponent.jumpByPosition(
            targetPos,
            posBox.x, 
            ()=>{
                if(this.gameState != GameState.StateOfWatch) {
                    return;         // 不是观看的模式,会直接返回
                }
                this.generateNewBox();
                this.moveScreen();
                this.heroComponent.setSibling(this.node.children.length);

            }
        )
    },


    /** 检查这个箱子是否有宝箱 , 开启游戏的时候，就已经有了这些宝箱数据了，所以可以直接获取这个值*/
    checkIsMoneyBox()
    {

    },

    /**
     * 清理不需要渲染的箱子,用于提高性能(draw call)
     */    
    stepClear(){
        //默认只留5个箱子,其他的都remove掉
        while(this.boxArr.length>5){
            //从数组前面弹出来一个
            let box = this.boxArr.shift();
            if(box){
                box.node.removeFromParent();
            }
        }
    },

    /** 把moneypanel面板 移动进入 界面之中来 */
    startMoveInMoneyPanel() {
        this.moneyPanel.active = false;
        let width = this.moneyPanel.width;
        // 还需要设置一下，金币的数量...
        let myOwnGold = (parseInt)(GameData.UsersProxy.getMyGold());        // 我所拥有的金币
        let myFetchGold = (parseInt)(GameData.GameProxy.getTotalMoney());       // 我所赚取的金币
        this.moneyLabel.string = (myFetchGold) + "";

        this.moneyPanel.x = this.initialMoneyPanel + width;
        var moveBy = cc.moveBy(0.2, cc.v2(-width, 0));
        this.moneyPanel.runAction(moveBy);
        //this.schedule(this.startMoveOutMoneyPanel, 1, 0, 1);
    },

    /** 把moneypanel面板，移动出去 界面 */
    startMoveOutMoneyPanel() {
        if(this.moneyPanel.active == true) {
            this.moneyPanel.active = false;
            let width = this.moneyPanel.width;
            let target = this.moneyPanel.x + width;
            cc.tween(this.moneyPanel).to(0.3, {x:target},{ easing: 'cubicInOut' }).call(()=>{
                this.moneyPanel.active = false;
            }).start();
        }
        
    },

    update (dt) {
        let isPlaying = GameData.GameProxy.isGameOnPlaying();
        if(this.isUpdateStart && isPlaying) {
            // 让英雄执行变矮胖子动画
            this.heroComponent.touchStart(dt, this.boxArr[this.boxArr.length - 2].get_height());
            // 让箱子压扁
            this.boxArr[this.boxArr.length - 2].touch_start(dt);
        }
    },
});

module.exports = ZMGameLogic;