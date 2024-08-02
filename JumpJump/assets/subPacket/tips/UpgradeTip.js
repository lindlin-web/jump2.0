var UpgradeTip = cc.Class({
    extends: require("BaseDialog"),
 
    properties: {
        closeBtn:cc.Button,
        icon:cc.Sprite,
        title: cc.Label,            // 标题
        content: cc.Label,          // 内容
        effect: cc.Label,           // 每一级效果
        current: cc.Label,          // 当前效果.
        upgradeBtn: cc.Button,      // 升级按钮
        lv:cc.Label,                // 当前等级
        currentEffect:cc.Label,            // 当前级别效果

        constGold:cc.Label,         // 需要消耗掉多少.
        costNode:cc.Node,           // 
        frames:[cc.SpriteFrame],    // 把精灵帧.

        theAnimate:cc.Node,         // 播放序列帧的节点...

        maxNode: cc.Node,           // max字样的文字节点...
        moneyNode: cc.Node,         // 需要花费掉多少钱...
    },
    statics: {
        instance:null,
    },
 
    // LIFE-CYCLE CALLBACKS:
 
    onLoad () {
        NotifyMgr.on(AppNotify.UPGRADE_DONE,this.onUpgradeDone.bind(this), this);                // 完成了升级
        UpgradeTip.instance = this;
        this._super();
        this.setUIID(gUIIDs.UPGRADE_TIP);
        this.setClickEvent(this.closeBtn, this.onBtnEscClick.bind(this));
        this.type = this.getParams()["type"];
        this.level = this.getParams()["level"];

        this.init();
    },

    init() {
        this.level = parseInt(this.level);
        let maxLvl = GameData.UpgradeProxy.isMaxLevel(this.type, this.level);
        if(maxLvl) {
            this.lv.string = "Lv:" + this.level;
            this.icon.spriteFrame = this.frames[this.type-1];
            let conStr = GameData.UpgradeProxy.getContentByType(this.type);
            this.content.string = conStr;
            let titStr = GameData.UpgradeProxy.getTitleByType(this.type);
            this.title.string = titStr;
            /** 设置每一级的效果  */
            let descStr = GameData.UpgradeProxy.getDescByType(this.type);
            this.effect.string = descStr;
            
            this.currentEffect.string = "Current Effect:"+GameData.UpgradeProxy.getEffectByTypeAndLevel(this.type, this.level);
            this.upgradeBtn.node.active = false;
            this.costNode.active = true;
            let cost = GameData.UpgradeProxy.getCostByTypeAndLevel(parseInt(this.type),parseInt(this.level))
            let myMoney = GameData.UsersProxy.getMyMoney();
            this.constGold.string = cost + "";

            this.canDoUpgrade = false;
            this.maxNode.active = true;
            this.moneyNode.active = false;

        } else {
            this.level += 1;
            this.lv.string = "Lv:" + this.level;
            this.icon.spriteFrame = this.frames[this.type-1];
            let conStr = GameData.UpgradeProxy.getContentByType(this.type);
            this.content.string = conStr;
            let titStr = GameData.UpgradeProxy.getTitleByType(this.type);
            this.title.string = titStr;
            /** 设置每一级的效果  */
            let descStr = GameData.UpgradeProxy.getDescByType(this.type);
            this.effect.string = descStr;
            
            this.currentEffect.string = "Current Effect:"+GameData.UpgradeProxy.getEffectByTypeAndLevel(this.type, this.level-1);
            this.upgradeBtn.node.active = true;
            this.costNode.active = true;
            let cost = GameData.UpgradeProxy.getCostByTypeAndLevel(parseInt(this.type),parseInt(this.level))
            let myMoney = GameData.UsersProxy.getMyMoney();
            this.constGold.string = cost + "";
            if(myMoney >= cost) {
                this.canDoUpgrade = true;
            } else {
                this.canDoUpgrade = false;
            }

            this.maxNode.active = false;
            this.moneyNode.active = true;
        }
        
    },

    onUpgradeDone() {
        GameData.SoundProxy.playUpgradeSound();
        this.theAnimate.getComponent(cc.Animation).play("light");
        this.canDoUpgrade = true;
        this.level = parseInt(GameData.UsersProxy.getMyUpgradeLevel((this.type - 1)));
        this.init();
    },

    onUpgrade() {
        if(this.canDoUpgrade) {
            GameData.UpgradeProxy.askForUpgrade(this.type, this.level);
        }
        else {
            // 这个时候可以给玩家一个提示.....
            gUICtrl.openUI(gUIIDs.UI_GAME_TIP,null, {type:3,value:"Not enough coins"});
        }
    },


    onDestroy() {
        this._super();
        UpgradeTip.instance = null;
        NotifyMgr.off(AppNotify.UPGRADE_DONE,this.onUpgradeDone.bind(this), this);
    },
 
    onBtnEscClick() {
        this.removeSelf();
    },
 
    // update (dt) {},
});
 