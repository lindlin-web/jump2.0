//type`  '1:邀请好友 ，2:赚钱任务，3:加入频道，4：加入群，5：tg内跳别的app，6:tg外跳别的连接，7:绑定钱包，8:购买会员，9:加入内部组，10:组合任务， 11:当日累计得分，',
var TASKTYPE = {INVITE:1, MAKEMONEY:2, JOINCHANNEL:3, JOINGROUP:4, ACCURATE:11}
var TYPETOICON = [TASKTYPE.INVITE, 3,4,6,11,12,5];
cc.Class({
    extends: cc.Component,

    properties: {
        icon:cc.Sprite,        // 有四个icon
        desc:cc.Label,
        btnJoin:cc.Button,
        tick:cc.Node,
        btnTxt:cc.Label,        // 按钮的描述文字
        iconFrames:[cc.SpriteFrame],       // 有四个
        rewardIcons:[cc.SpriteFrame],       // 两个奖励的icon  可玩次数   和  券...
        rewardNum: cc.Label,                //  奖励的数量.
        rewardSprite: cc.Sprite,            // 奖励的sprite
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.seeTheAdv = false;
        this.hasClicked = false;
    },

    /**  点击按钮之后   */
    onClickBtn() {
        if(this.hasClicked) {
            console.log("无法重复点击");
            return;
        }
        if(!this.hasClicked) {
            this.hasClicked = true;
            var self = this;
            this.scheduleOnce(function() {
                self.hasClicked = false
            }, 3);
        }
        let id = this.info.getId();
        // let taskType = this.info.getType();
        // if(taskType === TASKTYPE.INVITE) {
        //     gUICtrl.openUI(gUIIDs.UI_FRIEND_PAGE);
        // } else if(taskType === TASKTYPE.ACCURATE) {
        //     NotifyMgr.send(AppNotify.TASK_ACCURATE);            // 发送累计任务，父界面需要关闭掉.
        // } 
        // else {
        //     GameData.TaskProxy.askForDoTask(id);
        // }
        
        // 如果这个是组合任务的子任务，并且这个任务，还没完成.那么点击之后，需要变成 "check"的字样

        let type = this.info.getType();
        if(type == 15 && !this.seeTheAdv) {        // 这个类型是看广告的类型。
            let telegramUtil = require('../../Script/Common/TelegramUtils');
            telegramUtil.ShowAdv(()=>{
                this.btnTxt.string = "check";
                this.seeTheAdv = true;
                GameData.TaskProxy.askForADV();
            });
            return;
        }

        let pid = this.info.getPid();
        GameData.TaskProxy.askForDoTask(id);
        if(pid) {
            this.btnTxt.string = "check";
            let isCompleted = this.info.isCompleted();
            let hasJoin = this.info.getJoin();
            if(isCompleted == 0 && hasJoin) {
                let taskId = this.info.getId();
                let jumpUrl = this.info.getJumpUrl();
                let telegramUtil = require('../../Script/Common/TelegramUtils');
                if(taskId == 7) {
                    telegramUtil.onOpenUrl(jumpUrl);
                } else {
                    telegramUtil.openTelegramLinkByUrl(jumpUrl);
                }
            }
        }
    },

    getIndex() {
        return this.theIndex;
    },

    onClickMainNode() {
        let jumpUrl = this.info.getJumpUrl();
        let telegramUtil = require('../../Script/Common/TelegramUtils');
        let taskId = this.info.getId();
        if(taskId == 7) {
            telegramUtil.onOpenUrl(jumpUrl);
        } else {
            telegramUtil.openTelegramLinkByUrl(jumpUrl);
        }
    },

    /** TaskInfo info */
    setInfo(info) {
        this.info = info;
        this.theIndex = info.index;
        this.desc.string = info.getName();
        let isCompleted = info.isCompleted();
        this.btnTxt.string = info.getBtnTxt();
        let reward = info.getReward();          // 获得奖励 数据结构  {num: 1, type: 1  | 2}
        let index = info.getId();
        let pid = info.getPid();
       
        let myIconIndex = TYPETOICON.indexOf(info.getType());
        if(myIconIndex >= 0) {
            let spriteframe = this.iconFrames[myIconIndex];
            if(spriteframe) {
                this.icon.spriteFrame = spriteframe;
            }
        }
        
        if(reward.num > 0 || reward.num == GameTool.getInfinite()) {
            this.rewardNum.node.active = true;
            this.rewardSprite.node.active = true;
            this.rewardNum.string = "+" + reward.num;
            let type = reward.type - 1;
            this.rewardSprite.spriteFrame = this.rewardIcons[type];
        } else {
            this.rewardNum.node.active = false;
            this.rewardSprite.node.active = false;
        }
        if(isCompleted == 1) {
            this.btnJoin.node.active = false;
            this.tick.active = true;
        } else if(isCompleted == 2) {
            this.btnJoin.node.active = true;
            this.tick.active = false;
            this.btnTxt.string = "claim";
        }
         else {
            this.btnJoin.node.active = true;

            this.tick.active = false;
        }
    }

    // update (dt) {},
});
