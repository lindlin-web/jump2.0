
var HeroCollider = cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getCollisionManager().enabled = true;
        this.touchingNumber = 0;
        this.stepScore = 0;
        this.colliderNode = null;
    },

    onCollisionEnter: function(other, hero) {
        if(hero.tag == 1 && other.tag == 11) {
            this.stepScore = 2;
        } else if(hero.tag == 1 && other.tag == 12) {
            if(this.stepScore < 1) {
                this.stepScore = 1;
            }
        } else if(hero.tag == 2 && other.tag == 12) {
            if(this.stepScore == 0) {
                this.stepScore = -1;
            }
        }
        this.colliderNode = other.node.parent;
    },
    
    resetData() {
        this.stepScore = 0;
        this.colliderNode = null;
    },

    getStepScore() 
    {
        return this.stepScore;
    },
    getColliderNode() {
        return this.colliderNode;
    }

    // update (dt) {},
});

module.exports = HeroCollider;