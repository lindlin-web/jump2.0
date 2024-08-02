const ListViewCtrl = require('./utils/ListViewCtrl');
let telegramUtil = require('../Script/Common/TelegramUtils');
var ZMTaskPage = cc.Class({
    extends: require('BaseView'),

    properties: {
        togetherName: cc.Label,         // 组合任务的描述
        togetherReward: cc.Label,       // 组合任务的奖励
        togetherRewardIcon: cc.Sprite,  // 组合任务的icon
        togetherCurrentNum:cc.Label,    // 组合任务的当前进度
        togetherTotalNum: cc.Label,     // 组合任务的总体进度

        lightOrTic:[cc.SpriteFrame],    // 奖励次数还是可玩券...   

        togetherTaskListView: ListViewCtrl,     // ListViewCtrl的东西...
        inviteTaskListView: ListViewCtrl,       // 邀请任务的东西........
        dailyListView:ListViewCtrl,             // 每日任务的东西........

        togetherToggle:cc.Node,         // 组合任务的toggle.
        inviteToggle:cc.Node,           // 邀请任务的toggle..
        dailyToggle:cc.Node,            // 每日任务的toggle.

        together1:cc.Button,            //
        together2:cc.Button,            
        together3:cc.Button,

        invite1:cc.Button,
        invite2:cc.Button,
        invite3:cc.Button,

        daily1:cc.Button,
        daily2:cc.Button,
        daily3:cc.Button,

        mainNode:cc.Node,
        inviteNode:cc.Node,
        dailyNode:cc.Node,

        togetherTaskBtn:cc.Button,          // 组合任务的主要按钮...
        togetherTaskTick:cc.Node,           // 父任务，是否已经完成了...

        friendNum:cc.Label,                 // 好友数量是多少.

        shareBtn:cc.Button,

        info:cc.Node,                   // 信息的面板.
        coin:cc.Label,                  // 文字描述...
    },
    statics: {
        instance: null
    },

    onLoad() {
        this.setUIID(gUIIDs.UI_TASKS);
        this._super();
        //this.originalInfoX = this.info.x;
        ZMTaskPage.instance = this;
        telegramUtil.onSetBgColor(HEAD_COLORS.TITLE_COIN_MONEY);
        telegramUtil.onSetHeaderColor(HEAD_COLORS.TITLE_COIN_MONEY);
        if (CC_EDITOR && cc.engine) {
            cc.engine.on('design-resolution-changed', this.onResized.bind(this));
        }
        else {
            let thisOnResized = this.onResized.bind(this);
            window.addEventListener('resize', thisOnResized);
            window.addEventListener('orientationchange', thisOnResized);
        }
        this.onResized();

        GameTool.copyBottomNode(gUIIDs.UI_TASKS,this.node.getChildByName("wrapper"));
        if(window.Telegram){
            plausible('task');
        }
        //this.info.getComponent("Info").onHideHomePage();
    },

    onResized() {
        let gap = GameTool.getTheWidthGap();
        //this.info.x = this.originalInfoX - gap;
    },
    onDestroy() {
        this._super();
        ZMTaskPage.instance = null;
    },

    start() {
        GameData.TaskProxy.askForTasks();
        this.setClickEvent(this.together1, this.onTogether.bind(this));
        this.setClickEvent(this.together2, this.onTogether.bind(this));
        this.setClickEvent(this.together3, this.onTogether.bind(this));

        this.setClickEvent(this.invite1, this.onInvite.bind(this));
        this.setClickEvent(this.invite2, this.onInvite.bind(this));
        this.setClickEvent(this.invite3, this.onInvite.bind(this));

        this.setClickEvent(this.daily1, this.onDaily.bind(this));
        this.setClickEvent(this.daily2, this.onDaily.bind(this));
        this.setClickEvent(this.daily3, this.onDaily.bind(this));
        this.friendNum.string = GameData.UsersProxy.getMyReferrals() + "";
        this.setClickEvent(this.togetherTaskBtn, this.onTogetherTaskBtnClick.bind(this));
        NotifyMgr.send(AppNotify.UserInfoChange);

        this.togetherTaskTick.active = false;
        this.togetherTaskBtn.interactable = false;

        this.setClickEvent(this.shareBtn.node, this.onShareBtnClick.bind(this));

        let t1 = cc.tween(this.shareBtn.node).to(1, {scaleX:2.1, scaleY:2.1})
        let t2 = cc.tween(this.shareBtn.node).to(1, {scaleX:2.0, scaleY:2.0})
        // let t3 = tween(this.btn_invite).call(() => {console.log('This is a callback') })
        this.inviteTween = cc.tween(this.shareBtn.node).sequence(t1, t2).repeatForever().start();
        this.coin.string = GameData.UsersProxy.getMyMoney() + "";
    },

    onShareBtnClick() {
        telegramUtil.onInvite();
    },

    /*** 领取 组合任务的奖励 */
    onTogetherTaskBtnClick() {
        let pid = GameData.TaskProxy.getTogetherTaskPid();
        GameData.TaskProxy.askForDoTask(pid);
    },

    onInvite() {
        this.mainNode.active = false;
        this.togetherToggle.active = false;
        this.dailyNode.active = false;
        this.dailyToggle.active = false;
        this.inviteNode.active = true;
        this.inviteToggle.active = true;


        let inviteTaskArray = GameData.TaskProxy.getInviteTask();
        this.inviteTaskListView.reload(inviteTaskArray);
    },

    onTogether() {
        this.mainNode.active = true;
        this.togetherToggle.active = true;
        this.dailyNode.active = false;
        this.dailyToggle.active = false;
        this.inviteNode.active = false;
        this.inviteToggle.active = false;

        let array = GameData.TaskProxy.getTogetherTasks();
        this.togetherTaskListView.reload(array);

        //let inviteTaskArray = GameData.TaskProxy.getInviteTask();
        //this.inviteTaskListView.reload(inviteTaskArray);
    },

    onDaily() {
        this.mainNode.active = false;
        this.togetherToggle.active = false;
        this.dailyNode.active = true;
        this.dailyToggle.active = true;
        this.inviteNode.active = false;
        this.inviteToggle.active = false;
        let dailyTaskArray = GameData.TaskProxy.getDailyTask();
        this.dailyListView.reload(dailyTaskArray);
    },

    refreshPage() {
        if(this.mainNode.active == true) {
            this.togetherName.string = GameData.TaskProxy.getParentTaskName();
            this.togetherReward.string = "+" + GameData.TaskProxy.getParentRewardNumAndType().num;
            let type = GameData.TaskProxy.getParentRewardNumAndType().type - 1;
            //this.togetherRewardIcon.spriteFrame = this.lightOrTic[type];
            let finishNum = GameData.TaskProxy.getFinishedTogetherTaskCount();
            let totalNum = GameData.TaskProxy.getTogetherTaskCount();
            this.togetherCurrentNum.string = finishNum + "";
            this.togetherTotalNum.string = "/" + totalNum;
            let array = GameData.TaskProxy.getTogetherTasks();
            this.togetherTaskListView.reload(array);

            let isFatherFinish = GameData.TaskProxy.getTogetherTaskFinished();
            if(finishNum < totalNum) {
                //this.togetherTaskBtn.node.active = false;
                this.togetherTaskBtn.interactable = false;
            } else {
                //this.togetherTaskBtn.node.active = true;
                this.togetherTaskBtn.interactable = true;
                if(isFatherFinish) {
                    this.togetherTaskBtn.node.active = false;
                    //this.togetherTaskBtn.interactable = false;
                    this.togetherTaskTick.active = true;
                } else {
                    //this.togetherTaskBtn.node.active = true;
                    this.togetherTaskBtn.interactable = true;
                    this.togetherTaskTick.active = false;
                }
            }
            
        }
        else if(this.inviteNode.active == true) {
            let inviteTaskArray = GameData.TaskProxy.getInviteTask();
            this.inviteTaskListView.reload(inviteTaskArray);
        }
        else if(this.dailyNode.active == true) {
            let dailyTaskArray = GameData.TaskProxy.getDailyTask();
            this.dailyListView.reload(dailyTaskArray);
        }
        this.coin.string = GameData.UsersProxy.getMyMoney() + "";
    },

    listNotificationInterests() {
        return [
            AppNotify.FETCH_TASKS,
            AppNotify.TASK_ACCURATE,
            AppNotify.OnViewClosed,
            AppNotify.TASK_REFRESH,
        ];
    },

    handleFetchTasks() {
        this.togetherName.string = GameData.TaskProxy.getParentTaskName();
        this.togetherReward.string = "+" + GameData.TaskProxy.getParentRewardNumAndType().num;
        let type = GameData.TaskProxy.getParentRewardNumAndType().type - 1;
        //this.togetherRewardIcon.spriteFrame = this.lightOrTic[type];
        let array = GameData.TaskProxy.getTogetherTasks();
        if(array && array.length > 0) {
            for(let i =0; i < array.length; i++) {
                let info = array[i];
                info.index = i;
            }
        }
        this.togetherTaskListView.reload(array);

        let inviteTaskArray = GameData.TaskProxy.getInviteTask();

        if(inviteTaskArray && inviteTaskArray.length > 0) {
            for(let i =0; i < inviteTaskArray.length; i++) {
                let info = inviteTaskArray[i];
                info.index = i;
            }
        }

        this.inviteTaskListView.reload(inviteTaskArray);

        let dailyTaskArray = GameData.TaskProxy.getDailyTask();

        if(dailyTaskArray && dailyTaskArray.length > 0) {
            for(let i =0; i < dailyTaskArray.length; i++) {
                let info = dailyTaskArray[i];
                info.index = i;
            }
        }
        this.dailyListView.reload(dailyTaskArray);

        let finishNum = GameData.TaskProxy.getFinishedTogetherTaskCount();
        let totalNum = GameData.TaskProxy.getTogetherTaskCount();
        this.togetherCurrentNum.string = finishNum + "";
        this.togetherTotalNum.string = "/" + totalNum;

        let isFatherFinish = GameData.TaskProxy.getTogetherTaskFinished();
        if(finishNum < totalNum) {
            //this.togetherTaskBtn.node.active = false;
            this.togetherTaskBtn.interactable = false;
        } else {
            //this.togetherTaskBtn.node.active = true;
            this.togetherTaskBtn.interactable = true;
            if(isFatherFinish) {
                this.togetherTaskBtn.node.active = false;
                //this.togetherTaskBtn.interactable = false;
                this.togetherTaskTick.active = true;
            } else {
                //this.togetherTaskBtn.node.active = true;
                this.togetherTaskBtn.interactable = true;
                this.togetherTaskTick.active = false;
            }
        }

        let index = this.getParams()["index"];
        if(index == 3) {
            this.onDaily();
        }
    },

    onMainBtnClick() {
        this.removeSelf();
    },

    handleClosePanel() {
        this.node.zIndex = UIOrder.Dialog;
    },

    handleNotification(key, data) {
        switch (key) {
            case AppNotify.FETCH_TASKS:
                this.handleFetchTasks();
                break;
            case AppNotify.TASK_ACCURATE:
                this.onMainBtnClick();
                break;
            case AppNotify.OnViewClosed:
                this.handleClosePanel();
                break;
            case AppNotify.TASK_REFRESH:
                this.refreshPage();
                break;
        }
    },
});
