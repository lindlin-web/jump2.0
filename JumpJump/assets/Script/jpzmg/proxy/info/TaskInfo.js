/******  这个是宝箱信息 */
var TaskInfo = (function() {
    function TaskInfo() {
        this.botToken = null;
        this.btnTxt = "";
        this.completed = 0;
        this.desc = "";
        this.frequenct = 0;
        this.icon = "";
        this.id = 0;
        this.jumpUrl = null;
        this.name = "";
        this.passLine = 0;
        this.pid = 0;
        this.reward = "";
        this.rewardType = 0;
        this.type = 0;
        this.join = true;
    }

    TaskInfo.prototype.getJoin = function() {
        return this.join;
    }

    TaskInfo.prototype.setJoin = function(bo) {
        this.join = bo;
    }

    /** 获得任务信息的id */
    TaskInfo.prototype.getId = function() {
        return this.id;
    }

    /** 获得一个 pid */
    TaskInfo.prototype.getPid = function() {
        return this.pid;
    }

    /**  是否已经完成了 该任务 */
    TaskInfo.prototype.isCompleted = function() {
        return this.completed;              // 0 未完成, 1 完成已领取， 2 完成未 领取
    }

    /** 设置某个完成的状态... */
    TaskInfo.prototype.setCompleted = function(val) {
        this.completed = val;             // 0 未完成, 1 完成， 2 完成已 领取
    }


    TaskInfo.prototype.getName = function() {
        return this.name;
    }

    /** 是否是邀请好友的任务 */
    TaskInfo.prototype.isInviteTask = function() {
        return this.type === 1 && this.frequent == 1;
    }

    /** 是否是每日任务 */
    TaskInfo.prototype.isDailyTask = function() {
        return this.frequent === 2;
    }

    /**  获得奖励数量，和类型 */
    TaskInfo.prototype.getReward = function() {
        return {num:this.reward, type: this.rewardType};
    }

    /** 获得按钮的文字 */
    TaskInfo.prototype.getBtnTxt = function() {
        return this.btnTxt;
    }

    /** 获得我游戏的类型 */
    TaskInfo.prototype.getType = function() {
        return this.type;
    }

    /** 获得我的链接的跳转地址 */
    TaskInfo.prototype.getJumpUrl = function() {
        return this.jumpUrl;
    }

    TaskInfo.prototype.init = function(info) {
        this.botToken = info.bot_token;
        this.btnTxt = info.btn_txt;
        this.completed = info.completed;
        this.desc = info.desc;
        this.frequent = info.frequent;
        this.icon = info.icon;
        this.id = info.id;
        this.jumpUrl = info.jump_url;
        this.name = info.name;
        this.passLine = info.pass_line;
        this.pid = info.pid;
        this.reward = info.reward;
        this.rewardType = info.reward_type;
        this.type = info.type;
        this.join = true;
    }
    
    return TaskInfo;
})();
window.TaskInfo = TaskInfo;