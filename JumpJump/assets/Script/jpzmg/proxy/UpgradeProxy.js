/** 这个是描述了俱乐部旗下的 成员的信息列表 */
/**1=跳跃收益，2=宝箱金币，3=黄金时间，4=宝箱强化，5=离线收益，6=每日上限 **/
var UpgradeType = {JUMP:1, GOLDBOX:2, GOLDTIME: 3, STRONGTHENBOX:4, OFFLINE:5, DAILYLIMIT:6};
var UpgradeProxy = (function(){
    function UpgradeProxy() {
        this.upgradeDic = new Dictionary();
        this.upgradeDesc = new Dictionary();
        NotifyMgr.on(gGSM.UPGRADE_LEVEL, this.onUpgradeDone.bind(this), this);
        this.init();
    }

    UpgradeProxy.prototype.onUpgradeDone = function(data) {
        if(data.code == 2) {
            gUICtrl.openUI(gUIIDs.UI_GAME_TIP,null, {type:3,value:"Not enough coins"});
            NotifyMgr.send(AppNotify.UPGRADE_DONE);    
            return;
        }
        GameData.UsersProxy.setUserInfo(data);
        NotifyMgr.send(AppNotify.UPGRADE_DONE);                // 完成了升级
    }

    UpgradeProxy.prototype.isMaxLevel = function(type, level) {
        let typeDic =  this.upgradeDic.get(type);
        level = level+1;
        let info = typeDic.get(level);
        return info == null;
    }

    /** 通过升级的类型来获得 升级的内容 */
    UpgradeProxy.prototype.getContentByType = function(type) {
        let upgradeDesc = this.upgradeDesc.get(type);
        return upgradeDesc.getContent();
    }

    UpgradeProxy.prototype.askForUpgrade = function(type, level) {
        gGameCmd.postAction(gGSM.UPGRADE_LEVEL, {type:type, level:level});
    }

    /** 通过类型来获得，升级的标题 */
    UpgradeProxy.prototype.getTitleByType = function(type) {
        let upgradeDesc = this.upgradeDesc.get(type);
        return upgradeDesc.getTitle();
    }
    UpgradeProxy.prototype.getDescByType = function(type) {
        let upgradeDesc = this.upgradeDesc.get(type);
        return upgradeDesc.getDesc();
    }

    /** 获得icon 的url */
    UpgradeProxy.prototype.getIconByType = function(type) {
        let upgradeDesc = this.upgradeDesc.get(type);
        return upgradeDesc.getIcon();
    }

    UpgradeProxy.prototype.getEffectByTypeAndLevel = function(type, level) {
        let typeDic =  this.upgradeDic.get(type);
        level = level;
        let info = typeDic.get(level);
        return info.getEffect();
    }

    UpgradeProxy.prototype.getCostByTypeAndLevel = function(type, level) {
        let typeDic = this.upgradeDic.get(type);
        level = level;
        let info = typeDic.get(level);
        return info.getCost();
    }

    UpgradeProxy.prototype.getBaseCoinByLevel = function(level) {
        let typeDic = this.upgradeDic.get(UpgradeType.JUMP);
        let info = typeDic.get(level);
        return info.getBenifit();
    }

    UpgradeProxy.prototype.getHappyTimeByLevel = function(level) {
        let typeDic = this.upgradeDic.get(UpgradeType.GOLDTIME);
        let info = typeDic.get(level);
        return info.getBenifit();
    }

    UpgradeProxy.prototype.getDailyLimitByLevel = function(level) {
        let typeDic = this.upgradeDic.get(UpgradeType.DAILYLIMIT);
        let info = typeDic.get(level);
        return info.getBenifit();
    }

    UpgradeProxy.prototype.init = function() {
        var data = [
            {type:UpgradeType.JUMP,level:0, id:UpgradeType.JUMP,cost:0, benifit:10,effect:"+10 coins"},
            {type:UpgradeType.JUMP,level:1, id:UpgradeType.JUMP,cost:3000, benifit:20,effect:"+20 coins"},
            {type:UpgradeType.JUMP,level:2, id:UpgradeType.JUMP,cost:15000, benifit:30,effect:"+30 coins"},
            {type:UpgradeType.JUMP,level:3, id:UpgradeType.JUMP,cost:60000, benifit:40,effect:"+40 coins"},
            {type:UpgradeType.JUMP,level:4, id:UpgradeType.JUMP,cost:200000, benifit:50,effect:"+50 coins"},
            {type:UpgradeType.JUMP,level:5, id:UpgradeType.JUMP,cost:800000, benifit:60,effect:"+60 coins"},
            {type:UpgradeType.JUMP,level:6, id:UpgradeType.JUMP,cost:2500000, benifit:70,effect:"+70 coins"},
            {type:UpgradeType.JUMP,level:7, id:UpgradeType.JUMP,cost:8000000, benifit:80,effect:"+80 coins"},
            {type:UpgradeType.JUMP,level:8, id:UpgradeType.JUMP,cost:22000000, benifit:90,effect:"+90 coins"},
            {type:UpgradeType.JUMP,level:9, id:UpgradeType.JUMP,cost:70000000, benifit:100,effect:"+100 coins"},
            {type:UpgradeType.JUMP,level:10, id:UpgradeType.JUMP,cost:200000000, benifit:110,effect:"+110 coins"},

            {type:UpgradeType.GOLDBOX,level:0, id:UpgradeType.GOLDBOX,cost:0, benifit:1, effect: "+100%"},
            {type:UpgradeType.GOLDBOX,level:1, id:UpgradeType.GOLDBOX,cost:3000, benifit:2, effect: "+200%"},
            {type:UpgradeType.GOLDBOX,level:2, id:UpgradeType.GOLDBOX,cost:15000, benifit:3, effect: "+300%"},
            {type:UpgradeType.GOLDBOX,level:3, id:UpgradeType.GOLDBOX,cost:60000, benifit:4, effect: "+400%"},
            {type:UpgradeType.GOLDBOX,level:4, id:UpgradeType.GOLDBOX,cost:200000, benifit:5, effect: "+500%"},
            {type:UpgradeType.GOLDBOX,level:5, id:UpgradeType.GOLDBOX,cost:800000, benifit:6, effect: "+600%"},
            {type:UpgradeType.GOLDBOX,level:6, id:UpgradeType.GOLDBOX,cost:2500000, benifit:7, effect: "+700%"},
            {type:UpgradeType.GOLDBOX,level:7, id:UpgradeType.GOLDBOX,cost:8000000, benifit:8, effect: "+800%"},
            {type:UpgradeType.GOLDBOX,level:8, id:UpgradeType.GOLDBOX,cost:22000000, benifit:9, effect: "+900%"},
            {type:UpgradeType.GOLDBOX,level:9, id:UpgradeType.GOLDBOX,cost:70000000, benifit:10, effect: "+1000%"},
            {type:UpgradeType.GOLDBOX,level:10, id:UpgradeType.GOLDBOX,cost:200000000, benifit:11, effect: "+1100%"},

            {type:UpgradeType.GOLDTIME,level:0, id:UpgradeType.GOLDTIME,cost:0, benifit:2, effect: "x200%"},
            {type:UpgradeType.GOLDTIME,level:1, id:UpgradeType.GOLDTIME,cost:5000, benifit:2.5, effect: "x250%"},
            {type:UpgradeType.GOLDTIME,level:2, id:UpgradeType.GOLDTIME,cost:50000, benifit:3, effect: "x300%"},
            {type:UpgradeType.GOLDTIME,level:3, id:UpgradeType.GOLDTIME,cost:500000, benifit:3.5, effect: "x350%"},
            {type:UpgradeType.GOLDTIME,level:4, id:UpgradeType.GOLDTIME,cost:5000000, benifit:4, effect: "x400%"},
            {type:UpgradeType.GOLDTIME,level:5, id:UpgradeType.GOLDTIME,cost:50000000, benifit:4.5, effect: "x450%"},
            {type:UpgradeType.GOLDTIME,level:6, id:UpgradeType.GOLDTIME,cost:200000000, benifit:5, effect: "x500%"},

            {type:UpgradeType.STRONGTHENBOX,level:0, id:UpgradeType.STRONGTHENBOX,cost:0, benifit:0.02, effect: "+2%"},
            {type:UpgradeType.STRONGTHENBOX,level:1, id:UpgradeType.STRONGTHENBOX,cost:5000, benifit:0.025, effect: "+2.5%"},
            {type:UpgradeType.STRONGTHENBOX,level:2, id:UpgradeType.STRONGTHENBOX,cost:50000, benifit:0.03, effect: "+3%"},
            {type:UpgradeType.STRONGTHENBOX,level:3, id:UpgradeType.STRONGTHENBOX,cost:500000, benifit:0.035, effect: "+3.5%"},
            {type:UpgradeType.STRONGTHENBOX,level:4, id:UpgradeType.STRONGTHENBOX,cost:5000000, benifit:0.04, effect: "+4%"},
            {type:UpgradeType.STRONGTHENBOX,level:5, id:UpgradeType.STRONGTHENBOX,cost:50000000, benifit:0.045, effect: "+4.5%"},
            {type:UpgradeType.STRONGTHENBOX,level:6, id:UpgradeType.STRONGTHENBOX,cost:200000000, benifit:0.05, effect: "+5%"},

            {type:UpgradeType.OFFLINE,level:0, id:UpgradeType.OFFLINE,cost:0, benifit:0, effect: "+0 hours"},
            {type:UpgradeType.OFFLINE,level:1, id:UpgradeType.OFFLINE,cost:5000, benifit:4, effect: "+4 hours"},
            {type:UpgradeType.OFFLINE,level:2, id:UpgradeType.OFFLINE,cost:50000, benifit:8, effect: "+8 hours"},
            {type:UpgradeType.OFFLINE,level:3, id:UpgradeType.OFFLINE,cost:500000, benifit:12, effect: "+12 hours"},
            {type:UpgradeType.OFFLINE,level:4, id:UpgradeType.OFFLINE,cost:5000000, benifit:16, effect: "+16 hours"},
            {type:UpgradeType.OFFLINE,level:5, id:UpgradeType.OFFLINE,cost:50000000, benifit:20, effect: "+20 hours"},
            {type:UpgradeType.OFFLINE,level:6, id:UpgradeType.OFFLINE,cost:200000000, benifit:24, effect: "+24 hours"},

            {type:UpgradeType.DAILYLIMIT,level:0, id:UpgradeType.DAILYLIMIT,cost:0, benifit:100000, effect: "+100000 coins"},
            {type:UpgradeType.DAILYLIMIT,level:1, id:UpgradeType.DAILYLIMIT,cost:3000, benifit:200000, effect: "+200000 coins"},
            {type:UpgradeType.DAILYLIMIT,level:2, id:UpgradeType.DAILYLIMIT,cost:10000, benifit:300000, effect: "+300000 coins"},
            {type:UpgradeType.DAILYLIMIT,level:3, id:UpgradeType.DAILYLIMIT,cost:30000, benifit:400000, effect: "+400000 coins"},
            {type:UpgradeType.DAILYLIMIT,level:4, id:UpgradeType.DAILYLIMIT,cost:80000, benifit:500000, effect: "+500000 coins"},
            {type:UpgradeType.DAILYLIMIT,level:5, id:UpgradeType.DAILYLIMIT,cost:200000, benifit:600000, effect: "+600000 coins"},
            {type:UpgradeType.DAILYLIMIT,level:6, id:UpgradeType.DAILYLIMIT,cost:400000, benifit:700000, effect: "+700000 coins"},
            {type:UpgradeType.DAILYLIMIT,level:7, id:UpgradeType.DAILYLIMIT,cost:800000, benifit:800000, effect:"+800000 coins"},
            {type:UpgradeType.DAILYLIMIT,level:8, id:UpgradeType.DAILYLIMIT,cost:1500000, benifit:900000, effect: "+900000 coins"},
            {type:UpgradeType.DAILYLIMIT,level:9, id:UpgradeType.DAILYLIMIT,cost:2500000, benifit:1000000, effect: "+1000000 coins"},
            {type:UpgradeType.DAILYLIMIT,level:10, id:UpgradeType.DAILYLIMIT,cost:5000000, benifit:1100000, effect: "+1100000 coins"},
            {type:UpgradeType.DAILYLIMIT,level:11, id:UpgradeType.DAILYLIMIT,cost:9000000, benifit:1200000, effect: "+1200000 coins"},
            {type:UpgradeType.DAILYLIMIT,level:12, id:UpgradeType.DAILYLIMIT,cost:15000000, benifit:1300000, effect: "+1300000 coins"},
            {type:UpgradeType.DAILYLIMIT,level:13, id:UpgradeType.DAILYLIMIT,cost:23000000, benifit:1400000, effect: "+1400000 coins"},
            {type:UpgradeType.DAILYLIMIT,level:14, id:UpgradeType.DAILYLIMIT,cost:35000000, benifit:1500000, effect: "+1500000 coins"},
            {type:UpgradeType.DAILYLIMIT,level:15, id:UpgradeType.DAILYLIMIT,cost:50000000, benifit:1600000, effect: "+1600000 coins"},
            {type:UpgradeType.DAILYLIMIT,level:16, id:UpgradeType.DAILYLIMIT,cost:70000000, benifit:1700000, effect: "+1700000 coins"},
            {type:UpgradeType.DAILYLIMIT,level:17, id:UpgradeType.DAILYLIMIT,cost:100000000, benifit:1800000, effect: "+1800000 coins"},
            {type:UpgradeType.DAILYLIMIT,level:18, id:UpgradeType.DAILYLIMIT,cost:150000000, benifit:1900000, effect: "+1900000 coins"},
            {type:UpgradeType.DAILYLIMIT,level:19, id:UpgradeType.DAILYLIMIT,cost:220000000, benifit:2000000, effect:"+2000000 coins"},
            {type:UpgradeType.DAILYLIMIT,level:20, id:UpgradeType.DAILYLIMIT,cost:300000000, benifit:2100000, effect: "+2100000 coins"},
        ];
        for(let i = 0; i < data.length; i++) {
            let dd = data[i];
            let info = new UpgradeInfo();
            info.init(dd);
            let theType = info.getType();       // 获得我的类型
            let theLevel = info.getLevel();     // 升级的级别...
            let dic = this.upgradeDic.get(theType);
            if(!dic) {
                dic = new Dictionary();
                this.upgradeDic.set(theType, dic);
            }
            dic.set(theLevel, info);
        }

        var desc = [
            {type:UpgradeType.JUMP,icon: "images/jpzmg/home/boost_jump",title:"Jump Earnings", content:"Upgrading increases the coins earned per successful jump.", desc:"+10 coins per level"},
            {type:UpgradeType.GOLDBOX,icon: "images/jpzmg/home/boost_chest",title:"Coin Chest", content:"Upgrading increases the number of coins obtained from chests.", desc:"+100% earnings per level"},
            {type:UpgradeType.GOLDTIME,icon: "images/jpzmg/home/boost_golden",title:"Golden Hour", content:"Upgrading increases the multiplier for jump earnings during Golden Hour.", desc:"+50% multiplier per level"},
            {type:UpgradeType.STRONGTHENBOX,icon: "images/jpzmg/home/boost_chest1",title:"Chest Probability", content:"Upgrading increases the probability of chests appearing.", desc:"+0.5% chance per level"},
            {type:UpgradeType.OFFLINE,icon: "images/jpzmg/home/boost_offline",title:"Offline Earnings", content:"Upgrading increases the time for daily offline earnings. The higher the Jump Earnings level, the greater the offline earnings.", desc:"+4 hours per level"},
            {type:UpgradeType.DAILYLIMIT,icon: "images/jpzmg/home/boost_earn",title:"Earnings Cap", content:"Upgrading increases the daily coin earnings cap from jumping.", desc:"+100,000 coins per level"},
        ];
        for(let i = 0; i < desc.length; i++) {
            let dd = desc[i];
            let info = new UpgradeDesc();
            info.init(dd);
            let theType = info.getType();
            this.upgradeDesc.set(theType, info);
        }
    }
    return UpgradeProxy;
})();
window.UpgradeProxy = UpgradeProxy;