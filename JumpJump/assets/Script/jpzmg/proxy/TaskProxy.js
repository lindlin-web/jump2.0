var TASKTYPE = {INVITE:1, MAKEMONEY:2, JOINCHANNEL:3, JOINGROUP:4, ACCURATE:11};
var INFINITE = '1000000';
var TaskProxy = (function(){
    function TaskProxy() {
        this.taskDictionary = new Dictionary();
        NotifyMgr.on(gGSM.GET_TASKS, this.onGetTasks.bind(this), this);
        NotifyMgr.on(gGSM.DO_TASKS, this.onDoTask.bind(this), this);

    }

    TaskProxy.prototype.onDoTask = function(data) {
        let url = data.url;
        data.earnTime == '∞' ? INFINITE : data.earnTime;
        let earnMaxTime = parseInt(data.earnTime);          // 这个是最高次数
        let earnCoupon = parseInt(data.earnCoupon);
        data.add_game_time == '∞' ? INFINITE : data.add_game_time;
        let earnTime = parseInt(data.add_game_time);
        let taskId = data.tasks_id;
        
        if(earnMaxTime || earnCoupon || earnTime) {
            if(earnMaxTime > 0) {
                GameData.UsersProxy.addMaxGameTimesToMe(earnMaxTime);
            }
            if(earnCoupon > 0) {
                GameData.UsersProxy.addCouponsToMe(earnCoupon);
            }
            if(earnTime) {
                GameData.UsersProxy.addTimesToMe(earnTime);
            }
            if(earnTime > 0) {
                gUICtrl.openUI(gUIIDs.UI_GAME_TIP,null, {type:1, value:earnTime});
                NotifyMgr.send(AppNotify.UserInfoChange);
            }else if(earnMaxTime > 0) {
                gUICtrl.openUI(gUIIDs.UI_GAME_TIP,null, {type:4, value:earnMaxTime});
                NotifyMgr.send(AppNotify.UserInfoChange);
            }else if(earnCoupon > 0) {
                gUICtrl.openUI(gUIIDs.UI_GAME_TIP,null, {type:2, value:earnCoupon});
                
                NotifyMgr.send(AppNotify.UserInfoChange);
            }
        }
        let telegramUtil = require('../../Common/TelegramUtils');
        if(url) {
            // let info = this.getTaskInfoById(taskId);
            // let join = info.getJoin();
            // if(!join) {
            //     if(taskId == 7) {
            //         telegramUtil.onOpenUrl(url);
            //     } else {
            //         telegramUtil.onOpenTelegramUrl(url);
            //     }
            // }
        } 
        if(data.code == 1) {
            // 这个时候是任务完成，但是未领奖励。这个情况一般都是在
            // 已经完成，但是还没领取奖励, 这个是 tg 的任务..... 比如加入某个channel，group等等.
            let taskInfo = this.getTaskInfoById(taskId);
            taskInfo.setCompleted(1);
            // 如果这个任务是，组合任务，就要设置未，完成，且已经领取奖励。 因为 组合任务的特殊性.
            if(taskInfo.getPid() >= 0) {
                taskInfo.setCompleted(1);
            }
            let userInfo = data.userList;
            GameData.UsersProxy.setUserInfo(userInfo);
            NotifyMgr.send(AppNotify.TASK_REFRESH);            // 发送累计任务，父界面需要关闭掉.
        } else if(data.code == 2) {
            let taskInfo = this.getTaskInfoById(taskId);
            let taskType = taskInfo.getType();
            if(taskType === TASKTYPE.INVITE) {
                // let friendsNode = gUICtrl.getUIByUIID(gUIIDs.UI_FRIEND_PAGE);
                // if(friendsNode) {
                //     friendsNode.node.zIndex = gUICtrl.getUIByUIID(gUIIDs.UI_TASKS).node.zIndex + 1;
                // } else {
                //     gUICtrl.openUI(gUIIDs.UI_FRIEND_PAGE);
                // }
                // 直接打开 ，邀请好友的功能.
                telegramUtil.onInvite();
            } else if(taskType === TASKTYPE.ACCURATE) {
                NotifyMgr.send(AppNotify.TASK_ACCURATE);            // 发送累计任务，父界面需要关闭掉.
            } 
            if(url) {
                let info = this.getTaskInfoById(taskId);
                let join = info.getJoin();
                if(!join) {
                    if(taskId == 7) {
                        telegramUtil.onOpenUrl(url);
                    } else {
                        telegramUtil.onOpenTelegramUrl(url);
                    }
                }
                info.setJoin(false);
            } 
        } else {
            if(url) {
                let info = this.getTaskInfoById(taskId);
                let join = info.getJoin();
                if(!join) {
                    if(taskId == 7) {
                        telegramUtil.onOpenUrl(url);
                    } else {
                        telegramUtil.onOpenTelegramUrl(url);
                    }
                }
                info.setJoin(false);
            } 
        }
    }


    TaskProxy.prototype.getTaskInfoById = function(id) {
        let task = this.taskDictionary.get(id);
        return task;
    }

    /** 根据 id来获取玩家的跳转链接地址 */
    TaskProxy.prototype.getTaskJumpUrlById = function(id) {
        let task = this.taskDictionary.get(id);
        let jumpUrl = task.getJumpUrl();
        return jumpUrl;
    }

    TaskProxy.prototype.onGetTasks = function(data) {
        let tasksInfo = data;
        for(let i = 0; i < tasksInfo.length; i++) {
            let info = tasksInfo[i];
            let task = new TaskInfo();
            task.init(info);
            let id = task.getId();          // 以id作为游戏的主序
            this.taskDictionary.set(id, task);
        }

        NotifyMgr.send(AppNotify.FETCH_TASKS);          // 已经获取了任务列表， 发送事件
    }

    /** 获得组合游戏, 这个是一个数组， */
    TaskProxy.prototype.getTogetherTasks = function() {
        let tasks = this.taskDictionary.values;
        let results = [];
        let findPid = -1;
        for(let i = 0; i < tasks.length; i++) {
            let info = tasks[i];
            if(info.getPid()) {
                findPid = info.getPid();
                break;
            }
        }
        if(findPid != -1) {
            let pidInfo = this.taskDictionary.get(findPid);
            for(let i = 0; i < tasks.length; i++) {     // 找到孩子...
                let info = tasks[i];
                if(info.getPid() == findPid) {
                    results.push(info);
                }
            }
        }
        return results;         // 把结果给返回..
    }

    /** 获得组合任务的父任务 */
    TaskProxy.prototype.getTogetherTaskPid = function() {
        let tasks = this.taskDictionary.values;
        let findPid = -1;
        for(let i = 0; i < tasks.length; i++) {
            let info = tasks[i];
            if(info.getPid()) {
                findPid = info.getPid();
                break;
            }
        }
        return findPid;
    }

    /** 获得组合任务父任务的奖励 */
    TaskProxy.prototype.getParentRewardNumAndType = function() {
        let pid = this.getTogetherTaskPid();
        let reward = null;      // {num:5, type: 1 | 2}     // 1 可玩次数  2  复活券
        if(pid > 0) {
            let info = this.taskDictionary.get(pid);
            reward = info.getReward();
        }
        return reward;
    }

    /** 获得组合任务父任务的名称 */
    TaskProxy.prototype.getParentTaskName = function() {
        let pid = this.getTogetherTaskPid();
        let parentName = "";
        if(pid > 0) {
            let info = this.taskDictionary.get(pid);
            parentName = info.getName();
        }
        return parentName;
    }

    /**  获得组合任务的数量 */
    TaskProxy.prototype.getFinishedTogetherTaskCount = function() {
        let tasks = this.taskDictionary.values;
        let result = 0;
        for(let i = 0; i < tasks.length; i++) {
            let info = tasks[i];
            if(info.getPid() && info.isCompleted()) {
                result++;
            }
        }
        return result;
    }

    /**  获得组合任务是否已经领取了 */
    TaskProxy.prototype.getTogetherTaskFinished = function() {
        let pid = this.getTogetherTaskPid();
        let bo = false;
        if(pid > 0) {
            let info = this.taskDictionary.get(pid);
            bo = info.isCompleted() == 1;
        }
        return bo;
    }

    /** 获得组合未完成的数量 */
    TaskProxy.prototype.getTogetherTaskCount = function() {
        let tasks = this.taskDictionary.values;
        let result = 0;
        for(let i = 0; i < tasks.length; i++) {
            let info = tasks[i];
            if(info.getPid()) {
                result++;
            }
        }
        return result;
    }
    /*** 获得邀请任务  */
    TaskProxy.prototype.getInviteTask = function() {
        let tasks = this.taskDictionary.values;
        let result = [];
        for(let i = 0; i < tasks.length; i++) {
            let info = tasks[i];
            if(info.isInviteTask()) {
                result.push(info);
            }
        }
        return result;
    }

    /** 获得每日任务列表 */
    TaskProxy.prototype.getDailyTask = function() {
        let tasks = this.taskDictionary.values;
        let result = [];
        for(let i = 0; i < tasks.length; i++) {
            let info = tasks[i];
            if(info.isDailyTask()) {
                result.push(info);
            }
        }
        return result;
    }

    TaskProxy.prototype.askForDoTask = function(id) {
        gGameCmd.postAction(gGSM.DO_TASKS, {taskid:id});
    }

    TaskProxy.prototype.askForADV = function() {
        gGameCmd.postAction(gGSM.WATCHADV, null);
    }

    /**  询问任务数据 */
    TaskProxy.prototype.askForTasks = function() {
        let dataLength = this.taskDictionary.values.length;
        // 如果大于 0  说明数据已经已经有了。
        if(dataLength > 0) {
            NotifyMgr.send(AppNotify.FETCH_TASKS);          // 已经获取了任务列表， 发送事件
            gGameCmd.postAction(gGSM.GET_TASKS, {page_no:1});           // 无论如何都要去获得 tasklist
        } else {
            gGameCmd.postAction(gGSM.GET_TASKS, {page_no:1});
        }
    }
    return TaskProxy;
})();

window.TaskProxy = TaskProxy; 