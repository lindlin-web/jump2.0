/******  这个是宝箱信息 */
var TreasureBigType = window.TreasureBigType = {PT:1, TON: 2};               // 1. 普通宝箱， 2： ton宝箱
var TreasureSecondType = window.TreasureSecondType = {NONE:0,GOLD:1, TIME: 2, REVIVETICKET: 3};         // 0. 啥也不是,  1. 是金币,  2: 是金币时间 3. 复活卷
var TIMELAST = window.TIMELAST = 30;                                  // 时间暂时定为30秒钟的时间.
var TreasureInfo = (function() {
    function TreasureInfo() {
        this.base = 1;                  // 宝箱的基础类型  1 普通 , 2: ton宝箱
        this.type = 0;                  // 宝箱的类型    1   1. 金币, 2. 金币时间,
        this.value = 0;                 // 金币的值
        this.level = 0;
        this.newGuideStep = undefined;         // 是否是新手引导的部分内容存在的....
    }

    TreasureInfo.prototype.init = function(data) {
        this.base = data.baseType;
        this.level = parseInt(data.box_level);
        this.newGuideStep = data.newGuideStep;
        if(this.base == TreasureBigType.PT) {
            this.type = data.type;
            if(this.type == TreasureSecondType.GOLD) {
                this.value = data.money;
            } else {
                this.value = TIMELAST;
            }
        } else {
            this.type = 0;
            this.value = data.reward_num;
        }
    }

    /**** 是否是新手引导的部分内容，或则东西... */
    TreasureInfo.prototype.getNewGuideStep = function() {
        return this.newGuideStep;
    }

    TreasureInfo.prototype.getBase = function() {
        return this.base;
    }

    TreasureInfo.prototype.getLevel = function() {
        return this.level;
    }

    TreasureInfo.prototype.getType = function() {
        return this.type;
    }
    
    TreasureInfo.prototype.getValue = function() {
        return this.value;
    }
    return TreasureInfo;
})();
window.TreasureInfo = TreasureInfo;