
var ListViewCtrl = require('./utils/ListViewCtrl');
var RankPersonalItem = require('./rankPage/RankPersonalItem')
var RankClubItem = require('./rankPage/RankClubItem');
let telegramUtil = require('../Script/Common/TelegramUtils');
var ZMRankPage = cc.Class({
    extends: require('BaseView'),

    properties: {
        personalScrollView:ListViewCtrl,                // 历史的排名的情况
        myRankInfo:RankPersonalItem,                    // 我的历史的排名
        hisContent:cc.Node,                             // 历史内容的节点

        coinScrollView:ListViewCtrl,                // 金币排行榜的情况
        myCoinInfo:RankPersonalItem,                // 我的金币排行榜情况
        coinContent:cc.Node,                        // 金币的内容节点


        /***************begin of squad****************** */
        squadScrollView:ListViewCtrl,                // 金币排行榜的情况
        mySquadInfo:RankClubItem,                // 我的金币排行榜情况
        squadContent:cc.Node,                        // 金币的内容节点
        /***************end of squad****************** */

        coin1: cc.Button,                        // 金币排行榜按钮
        coin2: cc.Button,                        // 金币排行榜按钮
        coin3: cc.Button,                        // 金币排行榜按钮

        player1: cc.Button,                        // 玩家历史记录排行榜
        player2: cc.Button,                        // 玩家历史记录排行榜
        player3: cc.Button,                         // 玩家历史记录排行榜

        squad1: cc.Button,                      // 俱乐部排行榜
        squad2: cc.Button,                      // 俱乐部排行榜
        squad3: cc.Button,                      // 俱乐部排行榜

        coinNode:cc.Node,               // 金币的toggle
        playerNode: cc.Node,          // 玩家历史toggle
        squadNode: cc.Node,             // 俱乐部的toggle


        clubPrefab:cc.Node,
        clubComponent: "RankClubItem",

        PersonalPrefab:cc.Node,
        personalComponent: "RankPersonalItem",


        backBtn: cc.Button,             // 跳出的button

        myTgidLabel:cc.Label,           // 我的tgid 是多少.

        copyBtn:cc.Button,              // 复制我的tgid

        withSquad:cc.Node,              // 有团队
        noSquad:cc.Node,                // 没有团队

    },
    statics: {
        instance: null
    },

    onLoad () {
        ZMRankPage.instance = this;
        this.hasClickActivity = false;
        this.setUIID(gUIIDs.UI_RANK_PAGE);
        this._super();
        this.index = 0;


        let bo = gUICtrl.isResultPageOpened()
        if(bo) {
            telegramUtil.onSetBgColor(HEAD_COLORS.RESULT);
            telegramUtil.onSetHeaderColor(HEAD_COLORS.RESULT);
        } else {
            telegramUtil.onSetBgColor(HEAD_COLORS.PREFAB);
            telegramUtil.onSetHeaderColor(HEAD_COLORS.PREFAB);
        }

        this.coinNode.active = true;
        this.playerNode.active = false;
        this.squadNode.active = false;

        this.coinContent.active = true;
        this.hisContent.active = false;
        this.squadContent.active = false;

        GameTool.copyBottomNode(gUIIDs.UI_RANK_PAGE,this.node.getChildByName("wrapper"));
        GameTool.sendPointToServer("rank");
    },

    onDestroy() {
        this._super();
        ZMRankPage.instance = null;

        GameData.RankProxy.clearActivityRank();
    },

    start() {
        
        this.setClickEvent(this.player1, this.onPersonalRank.bind(this));
        this.setClickEvent(this.player2, this.onPersonalRank.bind(this));
        this.setClickEvent(this.player3, this.onPersonalRank.bind(this));

        this.setClickEvent(this.coin1, this.onCoinRank.bind(this));
        this.setClickEvent(this.coin2, this.onCoinRank.bind(this));
        this.setClickEvent(this.coin3, this.onCoinRank.bind(this));

        this.setClickEvent(this.squad1, this.onSquadRank.bind(this));
        this.setClickEvent(this.squad2, this.onSquadRank.bind(this));
        this.setClickEvent(this.squad3, this.onSquadRank.bind(this));


        this.setClickEvent(this.copyBtn, this.onCopyBtn.bind(this));
        this.myTgidLabel.string = GameTool.convertUserName15(GameData.UsersProxy.getMyToken());                      //   获得我的tg id .
        let index = this.getParams()["index"];
        if(index == 3) {
            this.onSquadRank();
        } else {
            //this.onPersonalRank();
            GameData.RankProxy.askForCoinRank();
        }
        

    },

    onMainBtn() {
        let telegramUtil = require('../Script/Common/TelegramUtils');
        telegramUtil.onHideBackBtn();
        this.onBackBtn();
        GameTool.showBottom();
    },

    onCopyBtn() {
        let myTgid = GameData.UsersProxy.getMyTgGid();
        GameData.GameProxy.webCopyString(myTgid, ()=>{
            gUICtrl.openUI(gUIIDs.UI_GAME_TIP,null, {type:3,value:"COPIED"});
        });
    },

    onSquadRank() {
        this.coinNode.active = false;
        this.playerNode.active = false;
        this.squadNode.active = true;

        this.coinContent.active = false;
        this.hisContent.active = false;
        this.squadContent.active = true;


        let hasTeam = GameData.UsersProxy.getMyTgGid();
        if(hasTeam) {
            this.withSquad.active = true;
            this.noSquad.active = false;
        } else {
            this.noSquad.active = true;
            this.withSquad.active = false;
        }

        GameData.RankProxy.askForSquadRank();

        this.setParams({"index":3});
    },

    /** 金币排名 */
    onCoinRank() {
        this.coinNode.active = true;
        this.playerNode.active = false;
        this.squadNode.active = false;

        this.coinContent.active = true;
        this.hisContent.active = false;
        this.squadContent.active = false;
        GameData.RankProxy.askForCoinRank();
        this.setParams({});
    },

    /** 历史排名 */
    onPersonalRank() {
        this.coinNode.active = false;
        this.playerNode.active = true;
        this.squadNode.active = false;

        this.coinContent.active = false;
        this.hisContent.active = true;
        this.squadContent.active = false;

        GameData.RankProxy.askForHistoryRank();
        this.setParams({});
    },

    listNotificationInterests() {
        return [
            AppNotify.RankHistory, 
            AppNotify.RankCoin,
            AppNotify.RankClub
        ];
    },

    handleNotification(key, data) {
        switch (key) {
            case AppNotify.RankHistory:
                this.handleHistoryRank();
                break;
            case AppNotify.RankCoin:
                this.handleCoinRank();
                break;
            case AppNotify.RankClub:
                this.handleClubRank();
                break;
        }
    },

    handleClubRank() {
        let clubList = GameData.RankProxy.getClubRankList();
        if(clubList && clubList.length > 0) {
            for(let i =0; i < clubList.length; i++) {
                let info = clubList[i];
                info.index = i;
            }
        }

        this.squadScrollView.reload(clubList, this.clubPrefab, this.clubComponent);
        let myHistoryRank = GameData.RankProxy.getMySquadRank();
        if(myHistoryRank) {
            this.mySquadInfo.setInfo(myHistoryRank);
        } else {
            let hasTeam = GameData.UsersProxy.getMyTgGid();
            if(hasTeam) {
                let rankInfo = GameData.RankProxy.getMyClubInfo();
                this.mySquadInfo.setInfo(rankInfo);
            } else {

            }
        }
    },

    onJoinSquad() {
        telegramUtil.openTelegramLinkByUrl(GameConfig.getInviteRobotUrl());
        telegramUtil.onCloseApp();
        GameTool.sendPointToServer("createsquad");
    },

    handleCoinRank() {
        let coinList = GameData.RankProxy.getCoinRankList();
        if(coinList && coinList.length > 0) {
            for(let i =0; i < coinList.length; i++) {
                let info = coinList[i];
                info.index = i;
            }
        }

        this.coinScrollView.reload(coinList, this.PersonalPrefab, this.personalComponent);
        let myHistoryRank = GameData.RankProxy.getCoinRank();
        if(myHistoryRank) {
            this.myCoinInfo.setInfo(myHistoryRank);
        } else {
            myHistoryRank = new RankPersonalInfo();
            myHistoryRank.index = 10000;
            let myTopScore = GameData.UsersProxy.getHistoryMoney();
            let nickName = GameData.UsersProxy.getMyNickName();
            let money = GameData.UsersProxy.getMyMoney();
            myHistoryRank.setTopScore(myTopScore);
            myHistoryRank.setHistoryMoney(myTopScore);
            myHistoryRank.setNickname(nickName);
            myHistoryRank.setMoney(money);
            myHistoryRank.isCoin = true;
            let myTgid = GameData.UsersProxy.getMyTgid();
            myHistoryRank.setTgid(myTgid);
            let wallet = GameData.UsersProxy.getMyWallet();
            myHistoryRank.setWallet(wallet);
            this.myCoinInfo.setInfo(myHistoryRank);
        }
    },

    /** 没有数据，需要自己去获取 */
    handleHistoryRank() {
        let historyList = GameData.RankProxy.getHistoryRankList();
        if(historyList && historyList.length > 0) {
            for(let i =0; i < historyList.length; i++) {
                let info = historyList[i];
                info.index = i;
            }
        }
        this.personalScrollView.reload(historyList, this.PersonalPrefab, this.personalComponent);
        let myHistoryRank = GameData.RankProxy.getMyHistoryRank();
        if(myHistoryRank) {
            this.myRankInfo.setInfo(myHistoryRank);
        } else {
            myHistoryRank = new RankPersonalInfo();
            myHistoryRank.index = 10000;
            let myTopScore = GameData.UsersProxy.getMyTopScore();
            let nickName = GameData.UsersProxy.getMyNickName();
            myHistoryRank.setTopScore(myTopScore);
            myHistoryRank.setNickname(nickName);
            myHistoryRank.isHistory = true;
            let myTgid = GameData.UsersProxy.getMyTgid();
            myHistoryRank.setTgid(myTgid);
            let wallet = GameData.UsersProxy.getMyWallet();
            myHistoryRank.setWallet(wallet);
            this.myRankInfo.setInfo(myHistoryRank);
        }
        
    }

    // update (dt) {},
});
