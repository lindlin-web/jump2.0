var ListViewCtrl = require('./utils/ListViewCtrl');
let telegramUtil = require('../Script/Common/TelegramUtils');
var ZMClubPage = cc.Class({
    extends: require('BaseView'),

    properties: {
        listView:ListViewCtrl,
        shareBtn:cc.Button,
        image: cc.Sprite,
        leaveBtn: cc.Button,
        totalScore: cc.Label,
        totalMember: cc.Label,
        clubName:cc.Label,
        joinBtn:cc.Button,
        inviteToJoin:cc.Button,
        gotoClub:cc.Button,
        plusAdd:cc.Label,

        inputBlock:cc.Node,

        questionMark:cc.Node,

        medial: cc.Sprite,
        theFrames:[cc.SpriteFrame],
    },
    statics: {
        instance: null
    },

    onLoad() {
        ZMClubPage.instance = this;
        this.setUIID(gUIIDs.UI_CLUB_PAGE);
        this._super();
        this.refresh();
        this.setClickEvent(this.leaveBtn, this.onLeave.bind(this));
        this.setClickEvent(this.joinBtn, this.onJoin.bind(this));           // 申请加入某个俱乐部
        

        GameTool.copyBottomNode(gUIIDs.UI_CLUB_PAGE,this.node.getChildByName("wrapper"));

        this.inputBlock.active = false;

        this.setClickEvent(this.inputBlock,this.onBlockClick.bind(this));
        this.setClickEvent(this.questionMark, this.onQuestionMark.bind(this));
    },

    onQuestionMark() {
        this.inputBlock.active = true;
    },

    onBlockClick() {
        this.inputBlock.active = false;
    },

    onDestroy() {
        this._super();
        ZMClubPage.instance = null;
    },

    onInviteToJoin() {
        telegramUtil.onInviteToJoinSquad();
        
        GameTool.sendPointToServer("inviteJoin");
    },

    refresh() {
        this.tgGid = this.getParams()['tgGid'];
        let score = GameData.RankProxy.getClubTotalScoreByTgGid(this.tgGid) + ""
        score = GameTool.convertNumberToString(score)
        this.totalScore.string = score;
        let member = GameData.RankProxy.getClubTotalMemberByTgGid(this.tgGid) + "";
        member = GameTool.convertNumberToString(member);
        this.totalMember.string = member;
        let clubName = GameData.RankProxy.getClubNameByTgGid(this.tgGid) + "";
        this.clubName.string = GameTool.convertUserName15(clubName);
        let headUrl = GameData.RankProxy.getClubUrlByTgGid(this.tgGid) + "";
        let url = gFuncs.getGroupUrlByTgGid(this.tgGid);

        let level = GameData.RankProxy.getClubLevelByTgGid(this.tgGid);

        level = level - 1;
        this.medial.spriteFrame = this.theFrames[level];


        if(GameTool.isValidHttpUrl(url)) {
            GameTool.getRemoteSprite(this.image, url);
        }

        this.plusAdd.string = "+" + GameData.RankProxy.getBenefitByTgGid(this.tgGid) * 100 + "%";
        // 看看我是否属于这个俱乐部
        let myGid = GameData.UsersProxy.getMyTgGid();
        if(myGid == this.tgGid) {
            this.leaveBtn.node.active = true;
            this.joinBtn.node.active = false;
            this.inviteToJoin.node.active = true;
        } else {
            this.leaveBtn.node.active = false;
            this.joinBtn.node.active = true;
            this.inviteToJoin.node.active = false;
        }
    },

    /** 离开这个俱乐部 */
    onLeave() {
        //  GameData.ClubProxy.askForLeaveClub(this.tgGid);            // ”我“ 请求离开某个俱乐部
        gUICtrl.openUI(gUIIDs.UI_RANK_EXIT_TIP,null, {tgGid:this.tgGid});
        GameTool.sendPointToServer("leavesquad");
    },

    onJoin() {
        //  GameData.ClubProxy.askForJoinClub(this.tgGid);            // ”我“ 请求加入某个俱乐部
        gUICtrl.openUI(gUIIDs.UI_RANK_JOIN_TIP,null, {tgGid:this.tgGid});
        GameTool.sendPointToServer("joinsquad");
    },

    onGotoSquad() {
        let tgGid = this.tgGid;
        let address = GameData.RankProxy.getClubUrlByTgGid(tgGid);
        if(address) {
            telegramUtil.openTelegramLinkByUrl(address);
        }
        GameTool.sendPointToServer("joinsquad");
        
    },

    start() {
        // this.setClickEvent(this.backBtn, this.onBackBtnClick.bind(this));
        GameData.ClubProxy.askForClubMember(this.tgGid);
    },

    onBackBtnClick() {
        this.removeSelf();
    },

    removeSelf() {
        this._super();
    },


    listNotificationInterests() {
        return [
            AppNotify.ClubMemberMes,
            AppNotify.LEAVE_GROUP,
            AppNotify.JOIN_GROUP
        ];
    },

    /** 服务端的数据已经来了。请从proxy 获取 */
    handleClubMemberMes() {
        let members = GameData.ClubProxy.getMembers();
        for(let i = 0; i < members.length; i++) {
            let mem = members[i];
            mem.index = i;
        }
        this.listView.reload(members);
        this.refresh();
    },

    handleLeaveGroup() {
        GameData.ClubProxy.askForClubMember(this.tgGid);
    },

    handleJoinGroup() {
        GameData.ClubProxy.askForClubMember(this.tgGid);
    },

    handleNotification(key, data) {
        switch (key) {
            case AppNotify.ClubMemberMes:
                this.handleClubMemberMes();
                break;
            case AppNotify.JOIN_GROUP:
                this.handleJoinGroup();
                break;
            case AppNotify.LEAVE_GROUP:
                this.handleLeaveGroup();
                break;
        }
    },

});
