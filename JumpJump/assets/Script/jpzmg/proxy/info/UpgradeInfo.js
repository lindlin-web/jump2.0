/******  这个是宝箱信息 */
var UpgradeInfo = (function() {
    function UpgradeInfo() {
        
    }

    /****{type:UpgradeType.STRONGTHENBOX,level:0, id:UpgradeType.STRONGTHENBOX,cost:0, benifit:0.02},***/
    UpgradeInfo.prototype.init = function(info) {
        this.type = info.type;
        this.level = info.level;
        this.id = info.id;
        this.cost = info.cost;
        this.benifit = info.benifit;
        this.effect = info.effect;
    }

    UpgradeInfo.prototype.descFunc = function(info) {
        this.title = info.title;
        this.content = info.content;
        this.desc = info.desc;
    }

    UpgradeInfo.prototype.getTitle = function() {
        return this.title;
    }

    UpgradeInfo.prototype.getContent = function() {
        return this.content;
    }

    UpgradeInfo.prototype.getDesc = function() {
        return this.desc;
    }

    UpgradeInfo.prototype.getType = function() {
        return this.type;
    }
    UpgradeInfo.prototype.getLevel = function() {
        return this.level;
    }
    UpgradeInfo.prototype.getId = function() {
        return this.id;
    }
    UpgradeInfo.prototype.getCost = function() {
        return this.cost;
    }
    UpgradeInfo.prototype.getBenifit = function() {
        return this.benifit;
    }

    UpgradeInfo.prototype.getEffect = function() {
        return this.effect;
    }
    
    return UpgradeInfo;
})();
window.UpgradeInfo = UpgradeInfo;