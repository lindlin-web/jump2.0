/******  这个是宝箱信息 */
var UpgradeDesc = (function() {
    function UpgradeDesc() {
        
    }

    /****{type:UpgradeType.STRONGTHENBOX,level:0, id:UpgradeType.STRONGTHENBOX,cost:0, benifit:0.02},***/
    UpgradeDesc.prototype.init = function(info) {
        this.title = info.title;
        this.content = info.content;
        this.desc = info.desc;
        this.type = info.type;
        this.icon = info.icon;
    }

    UpgradeDesc.prototype.getTitle = function() {
        return this.title;
    }

    UpgradeDesc.prototype.getIcon = function() {
        return this.icon;
    }

    UpgradeDesc.prototype.getType = function() {
        return this.type;
    }
    UpgradeDesc.prototype.getContent = function() {
        return this.content;
    }
    UpgradeDesc.prototype.getDesc = function() {
        return this.desc;
    }

    UpgradeDesc.prototype.getType = function() {
        return this.type;
    }
    return UpgradeDesc;
})();
window.UpgradeDesc = UpgradeDesc;