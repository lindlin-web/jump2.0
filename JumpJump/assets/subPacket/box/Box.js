
var Box = cc.Class({
    extends: require('BaseView'),

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    
    random_box(parent, pos, createNo) {
        this.createNo = createNo;
        this.cur_box = this.node.children[0];
        this.cur_box.active = true;
        this.node.setParent(parent);
        this.node.setPosition(pos);
        this.cur_box.getChildByName("jump_point").active = false;
        return 0;
    },

    touch_start(delta_time) {
        let y = this.node.scaleY - delta_time / 6;
        this.node.setScale(cc.v2(this.node.scaleX, y));
        if(this.node.scaleY <= 0.8) {
            this.node.setScale(cc.v2(this.node.scaleX, 0.8));
        }
    },

    /**
     * 触控结束后调用,手指松开立即调用,为了恢复箱子,并让箱子实现弹起效果
     */
    touch_end(){
        let scale_y = 1 - this.node.scaleY;
        cc.tween(this.node)
        .to(scale_y/5,{scaleX:this.node.scaleX, scaleY:1+scale_y/2})
        .to(scale_y/8,{scaleX:this.node.scaleX, scaleY:1-scale_y/5})
        .to(scale_y/5,{scaleX:this.node.scaleX, scaleY:1})
        .start();
    },

    /**
     *  获取箱子的高度
     */
    get_height() {
        return this.cur_box.getChildByName("box").height;
    },

    /**
     * 箱子初始化到场景的动画,一个简单的弹跳动画
     */
    action_tween(){
        let pos = this.node.getPosition();
        this.node.setPosition(pos.x,pos.y+100);
        cc.tween(this.node)
        .to(0.08,{position:cc.v2(this.node.getPosition().x,pos.y-10)})
        .to(0.06,{position:cc.v2(this.node.getPosition().x,pos.y+50)})
        .to(0.05,{position:cc.v2(this.node.getPosition().x,pos.y-5)})
        .to(0.04,{position:cc.v2(this.node.getPosition().x,pos.y+10)})
        .to(0.02,{position:cc.v2(this.node.getPosition().x,pos.y)})
        .start();
    },

    getJumpPosition() {
        let temp = cc.v2();
        let worldPos = this.cur_box.getChildByName('jump_point').getWorldPosition(temp);
        let pos = this.node.getParent().convertToNodeSpaceAR(worldPos);
        return pos;
    }
    // update (dt) {},
});
module.exports = Box;