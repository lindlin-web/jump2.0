const HeroCollider = require("../utils/HeroCollider");
const Box = require('../box/Box');
var HeroCtrl = cc.Class({
    extends: cc.Component,

    properties: {
       collider:HeroCollider,
       heroScore:cc.Node,
       preBall:cc.Node,
       tail:cc.Node,
       light:cc.Node,                  // 英雄身上的光圈......
    },

    onLoad () {
        this.heroScore.active = false;
        this.light.active = false;
        this.nodePool = new cc.NodePool();
    },

    start() {

    },

    update() {
        if(this.node.jump_state == 0) {
            this.node.new_tween_postion.set(this.node.getPosition());
            this.node.new_tween_postion.y = this.node.startPosY+this.node.jump_y + this.node.offsetY * this.node.jump_offset_y;
            this.node.new_tween_postion.x = this.node.jump_x;
            this.node.position = this.node.new_tween_postion;
        } else if(this.node.jump_state == 1){
            this.node.new_tween_postion.set(this.node.getPosition());
            this.node.new_tween_postion.y = this.node.startPosY - this.node.jump_y + this.node.offsetY * this.node.jump_offset_y;
            this.node.new_tween_postion.x = this.node.jump_x;
            this.node.position = this.node.new_tween_postion;
        }
    },

    initHero(parent, pos) {
        this.node.parent = parent;
        this.node.setPosition(pos.x, pos.y + 200);
        cc.tween(this.node)
            .to(0.2,{position:cc.v2(this.node.getPosition().x,pos.y-10)})
            .to(0.08,{position:cc.v2(this.node.getPosition().x,pos.y+50)})
            .to(0.07,{position:cc.v2(this.node.getPosition().x,pos.y-5)})
            .to(0.06,{position:cc.v2(this.node.getPosition().x,pos.y+10)})
            .to(0.02,{position:cc.v2(this.node.getPosition().x,pos.y)})
            .call(()=>{
                GameData.GameProxy.clearGameState(GameState.StateOfInitHero);
            })
            .start();
    },

    touchStart(deltaTime, boxHeight) {
        let y = this.node.scaleY - deltaTime / 6;
        // 英雄的压缩效果
        this.node.setScale(this.node.scaleX, y);
        if(this.node.scaleY <= 0.8) {
            this.node.setScale(this.node.scaleX, 0.8);
        }
        let x = this.node.scaleX + deltaTime / 10;
        this.node.setScale(x, this.node.scaleY);
        if(this.node.scaleX >= 1.2) {
            this.node.setScale(cc.v2(1.2,this.node.scaleY));
        }

        //限制最大压缩比例
        if(this.node.scaleY>0.8){
            let pos = this.node.getPosition();
            this.node.setPosition(cc.v2(pos.x,pos.y-deltaTime/8*boxHeight));
         }


        // 尾巴
        this.tail.active = false;
        this.startJumpEffect();
    },

    touchEnd() {
        this.node.setScale(1, 1);
        this.node.getChildByName("ball_group").removeAllChildren();
    },

    jumpByBox(targetBox, touchTime, callback) {
        this.collider.resetData();
        // 获取小白点的位置
        let jumpPosition = targetBox.getJumpPosition();
        let heroPos =  this.node.getPosition();
        // 归一化
        let nor = jumpPosition.subtract(heroPos).normalize();
        touchTime *= 8;
        // 落点
        let targetPos = cc.v2(heroPos.x + nor.x * touchTime, heroPos.y + nor.y * touchTime);
        this.jumpByPosition(targetPos,nor.x,callback);
    },

    jumpByPosition(targetPos, angleX, callback) {
        // 执行跳跃
        //let jump = this.node.jumpTo(targetPos, 200, 0.4);
        // 旋转
        let jumpStart = cc.tween(this.node).call(()=>{
            this.tail.active = true;
            this.closeCollider();
            cc.tween(this.node.getChildByName("body")).to(0.4, {angle:angleX < 0 ? 360: -360}).start();
        });
        let jump = cc.tween(this.node).delay(0.4);
        let jumpEnd = cc.tween(this.node).call(()=>{
            this.tail.active = false;
            this.openCollider();
            this.scheduleOnce(()=>{
                this.closeCollider();
                if(callback) {
                    callback(this.collider.getStepScore(), this.collider.getColliderNode());
                }
            }, 0.03);
        });
        cc.tween(this.node).sequence(jumpStart, jump, jumpEnd).start();
        let  jumpTo = cc.jumpTo(0.4,targetPos.x,targetPos.y, 200, 1);
       this.node.runAction(jumpTo);
    },

    setSibling(index){
        this.node.setSiblingIndex(index);
    },

    resetAngle() {
        this.node.angle = 0;
        this.node.getChildByName("body").angle = 0;
    },

    openCollider() {
        this.node.getChildByName("hero_collider").active = true;
    },

    closeCollider() {
        this.node.getChildByName("hero_collider").active = false;
    },

    showScore(score) {
        this.heroScore.active = true;
        this.heroScore.getChildByName("score").getComponent(cc.Label).string = "";
        let earnMoney = parseInt(GameTool.getEarnMoneyByStep(score));
        this.heroScore.getChildByName("score").getChildByName("layout").getChildByName("realLabel").getComponent(cc.Label).string = "+" + earnMoney + "";
        cc.tween(this.heroScore)
        .to(0.7,{position:cc.v2(this.heroScore.getPosition().x,this.heroScore.getPosition().y+40)})
        .call(()=>{
            this.heroScore.setPosition(this.heroScore.getPosition().x, 120);
            this.heroScore.active = false;
        })
        .start();
        if(score<=1){
            return;
        }
        //打开光圈
        this.light.active = true;
        this.light.setScale(cc.v2(0.5,0.3));
        this.light.opacity = 255;
        cc.tween(this.light)
        .to(0.4,{scaleX:6.5,scaleY:4.2,opacity:40})
        .call(()=>{
            this.light.active =false;
        })
        .start();
    },

    slip(callback) {
        cc.tween(this.node).by(0.5, {angle:Math.random() > 0.5 ? 30: -30}).call(()=>{
            callback && callback();
        }).start();
    },

    miss(target,original, callback){
        let target_pos = target.getComponent(Box).getJumpPosition();
        if(this.node.getPosition().y>target_pos.y){
            target.setSiblingIndex(this.node.getSiblingIndex());
        }else{
            original.setSiblingIndex(this.node.getSiblingIndex());
        }
        cc.tween(this.node)
        .to(0.5,{position:cc.v2(this.node.getPosition().x,this.node.getPosition().y-80)}).call(()=>{
            callback && callback();
        }).start();
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
        ball.setParent(this.node.getChildByName("ball_group"));
        ball.setPosition(r_x,r_y);
        cc.tween(ball).to(Math.random()*(0.7-(0.2)+(0.2)),{position:cc.v2(Math.random()*(10-(-10)+(-10)),0)}).call(()=>{
            this.nodePool.put(ball);
        }).start();
    },

    endJumpEffect() {
        for(let i =0;i<30;i++){
            let ball = this.nodePool.get() || cc.instantiate(this.preBall);
            {
                 //颜色RGB随机,透明度随机
                let r = Math.floor(Math.random()*256);
                let g = Math.floor(Math.random()*256);
                let b = Math.floor(Math.random()*256);
                let a = Math.floor(Math.random()*256);
                if(Math.random()<0.5){
                    r = 255;
                    g = 255;
                    b = 255;
                }
                ball.color = new cc.Color(r, g, b, 255);
                ball.opacity = a;
            }
             //x,y位置随机
            let r_x = Math.random()*(150-(-110))+(-110);
            let r_y = Math.random()*(150-(-50))+(-50);
            ball.setContentSize(10,10);
            ball.setParent(this.node.getChildByName("ball_group"));
            ball.setPosition(0,0);
            cc.tween(ball).to(Math.random()*(0.5-(0.2)+(0.2)),
            {position:cc.v2(r_x,r_y)}).call(()=>{
                this.nodePool.put(ball);
            }).start();
        }  
    }

    // update (dt) {},
});

module.exports = HeroCtrl;