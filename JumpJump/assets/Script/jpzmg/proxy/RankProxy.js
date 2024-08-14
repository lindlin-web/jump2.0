var RankProxy = (function(){
    function RankProxy() {
        this.rankHistoryDic;
        this.myHistoryRank = 0;

        this.rankTodayDic;
        this.myTodayRank = 0;


        this.rankClubDic;             // 俱乐部的词典
        this.mySquadRank = 0;       // 我的俱乐部的排名是几.


        this.rankCoinDic;               // 金币排行榜
        this.myCoinRank = 0;            // 我的金币排行

        this.myClubInfo;                // = new RankClubInfo();

        NotifyMgr.on(gGSM.HISRANK, this.onHistoryRank.bind(this), this);
        NotifyMgr.on(gGSM.TodayRANK, this.onTodayRank.bind(this), this);
        NotifyMgr.on(gGSM.GROUP_LIST, this.onClubRank.bind(this), this);
        NotifyMgr.on(gGSM.COINRANK, this.onCoinRank.bind(this), this);
    }

    /**  获得我的俱乐部信息 */
    RankProxy.prototype.getMyClubInfo = function() {
        return this.myClubInfo;
    }

    RankProxy.prototype.onClubRank = function(data) {
        this.mySquadRank = data.myrank;
        let clubData = data.groupList;
        let myGroupInfo = data.userGroupDetail;
        if(myGroupInfo && typeof myGroupInfo === 'object' && myGroupInfo.tg_gid) {
            this.myClubInfo = new RankClubInfo();
            this.myClubInfo.init(myGroupInfo);
        }
        this.rankClubDic = new Dictionary();
        if(clubData) {
            for(let i = 0; i < clubData.length ; i++) {
                let club = clubData[i];
                let clubRank = new RankClubInfo();
                clubRank.init(club);
                let tgGid = clubRank.getTgGid();
                this.rankClubDic.set(tgGid, clubRank);
            }
        }
        NotifyMgr.send(AppNotify.RankClub);
    }

    RankProxy.prototype.resetClubInfo = function(data) {
        let clubRank = new RankClubInfo();
        clubRank.init(data);
        let tgGid = clubRank.getTgGid();
        this.rankClubDic.set(tgGid, clubRank);
    }

    /** 靠tg_gid 来获取 俱乐部的最高分 */
    RankProxy.prototype.getClubTotalScoreByTgGid = function(tgGid) {
        let club = this.rankClubDic.get(tgGid);
        if(club) {  
            let totalScore = club.getTotalScore();
            return totalScore;
        } else {
            return 0;
        }
    }

    /** 靠tg_gid 来获取 俱乐部的所拥有的玩家数量 */
    RankProxy.prototype.getClubTotalMemberByTgGid = function(tgGid) {
        let club = this.rankClubDic.get(tgGid);
        if(club) {  
            let totalMember = club.getMemberCount();
            return totalMember;
        } else {
            return 0;
        }
    }

// 1	　	0
// 2	0.1	10000000
// 3	0.2	100000000
// 4	0.3	1000000000
// 5	0.4	10000000000
    RankProxy.prototype.getBenefitByTgGid = function(tgGid) {
        let level = this.getClubLevelByTgGid(tgGid);
        switch(level) {
            case 1:
                return 0;
            case 2:
                return 0.1;
            case 3:
                return 0.2;
            case 4:
                return 0.3;
            case 5:
                return 0.4;
            default:
                return 0;
        }
        
    }

    RankProxy.prototype.getClubNameByTgGid = function(tgGid) {
        let club = this.rankClubDic.get(tgGid);
        if(club) {  
            let clubName = club.getName();
            return clubName;
        } else {
            return "";
        }
    }

    RankProxy.prototype.getClubLevelByTgGid = function(tgGid) {
        let club = this.rankClubDic.get(tgGid);
        if(club) {  
            let level = club.getLevel();
            return level;
        } else {
            return 1;
        }
    }

    RankProxy.prototype.getClubUrlByTgGid = function(tgGid) {
        let club = this.rankClubDic.get(tgGid);
        if(club) {  
            let url = club.getUrl();
            return url;
        } else {
            return "";
        }
    }

    /** 获得前三名的tgids */
    RankProxy.prototype.getRankFirstThree = function() {
        let array = this.rankCoinDic.values;
        let tgids = [];
        for(let i = 0; i < array.length && i < 3; i++) {
            let info = array[i];
            let tgid = info.getTgid();
            tgids.push(tgid);
        }
        return tgids;
    }

    RankProxy.prototype.onTodayRank = function(data) {
        this.myTodayRank = data.myrank;
        let theList = data.list;
        this.rankTodayDic = new Dictionary();
        this.rankTodayDic.clear();
        for(let i = 0; i < theList.length; i++) {
            let theData = theList[i];
            let rank = new RankPersonalInfo();
            rank.init(theData);
            rank.isHistory = false;
            let tgid = rank.getTgid();
            this.rankTodayDic.set(tgid, rank);
        }
        NotifyMgr.send(AppNotify.RankToday);             // 已经获取到了。个人排名的数据了。可以取用.
    }

    RankProxy.prototype.getTodayRankList = function() {
        return this.rankTodayDic.values;
    }

    RankProxy.prototype.getMyTodayRank = function() {
        let myTgid = GameData.UsersProxy.getMyTgid();
        return this.rankTodayDic.get(myTgid);
    }

    /** 我的金币排行榜 */
    RankProxy.prototype.onCoinRank = function(data) {
        this.myCoinRank = data.myrank;
        let theList = data.list;
        this.rankCoinDic = new Dictionary();
        this.rankCoinDic.clear();
        for(let i = 0; i < theList.length; i++) {
            let theData = theList[i];
            let rank = new RankPersonalInfo();
            rank.init(theData);
            rank.isCoin = true;                             
            let tgid = rank.getTgid();
            this.rankCoinDic.set(tgid, rank);
        }
        NotifyMgr.send(AppNotify.RankCoin);             // 已经获取到了。个人排名的数据了。可以取用.
    }

    RankProxy.prototype.getCoinRankList = function() {
        return this.rankCoinDic.values;
    }

    RankProxy.prototype.getCoinRank = function() {
        let myTgid = GameData.UsersProxy.getMyTgid();
        return this.rankCoinDic.get(myTgid);
    }


    RankProxy.prototype.onHistoryRank = function(data) {
        this.myHistoryRank = data.myrank;
        let theList = data.list;
        this.rankHistoryDic = new Dictionary();
        this.rankHistoryDic.clear();
        for(let i = 0; i < theList.length; i++) {
            let theData = theList[i];
            let rank = new RankPersonalInfo();
            rank.init(theData);
            rank.isHistory = true;                             
            let tgid = rank.getTgid();
            this.rankHistoryDic.set(tgid, rank);
        }
        NotifyMgr.send(AppNotify.RankHistory);             // 已经获取到了。个人排名的数据了。可以取用.
    }

    RankProxy.prototype.getTotalMoney = function() {
        return this.totalMoney;
    }

    RankProxy.prototype.getHistoryRankList = function() {
        return this.rankHistoryDic.values;
    }
    RankProxy.prototype.getMyHistoryRank = function() {
        let myTgid = GameData.UsersProxy.getMyTgid();
        return this.rankHistoryDic.get(myTgid);
    }

    RankProxy.prototype.getClubRankList = function() {
        return this.rankClubDic.values;
    }



    /** 靠tgGid获取俱乐部信息 */
    RankProxy.prototype.getClubUrlByTgGid = function(tgGid) {
        let clubInfo = this.rankClubDic.get(tgGid);
        if(!clubInfo) {
            return null;
        }
        return clubInfo.getUrl();
    }


    RankProxy.prototype.getMySquadRank = function() {
        let myClub = GameData.UsersProxy.getMyTgGid();
        if(myClub) {
            return this.rankClubDic.get(myClub);
        }
        return null;
    }
    
    RankProxy.prototype.clearActivityRank = function() {
        this.myClubInfo = null;
        //this.rankTodayDic.clear();
        //this.rankTodayDic = null;
        // if(this.rankHistoryDic) {
        //     this.rankHistoryDic.clear();
        //     this.rankHistoryDic = null;
        // }
        
        // if(this.rankClubDic) {
        //     this.rankClubDic.clear();           // 俱乐部的词典
        //     this.rankClubDic = null;
        // }
        

        // if(this.rankCoinDic) {
        //     this.rankCoinDic.clear();               // 金币排行榜
        //     this.rankCoinDic = null;
        // }
    }

    RankProxy.prototype.refreshClubRank = function() {
        gGameCmd.postAction(gGSM.GROUP_LIST, {page_no:1});
    }

    /** 获得玩家的当日的分数 */
    RankProxy.prototype.askForActivityRank = function(useCache) {
        if(this.rankTodayDic) {
            NotifyMgr.send(AppNotify.RankToday);             // 已经获取到了。个人排名的数据了。可以取用.
            if(!useCache) {
                gGameCmd.postAction(gGSM.TodayRANK, null);
            }
        } else {
            gGameCmd.postAction(gGSM.TodayRANK, null);
        }
    }

    /** 获得俱乐部的Rank数据 */
    RankProxy.prototype.askForSquadRank = function(useCache) {
        if(this.rankClubDic) {
            NotifyMgr.send(AppNotify.RankClub);
            if(!useCache) {
                gGameCmd.postAction(gGSM.GROUP_LIST,{page_no:1});
            }
        } else {
            gGameCmd.postAction(gGSM.GROUP_LIST,{page_no:1});
        }
    }

    /** 获得coin的排行榜数据 */
    RankProxy.prototype.askForCoinRank = function(useCache) {
        if(this.rankCoinDic) {
            NotifyMgr.send(AppNotify.RankCoin);
            if(!useCache) {
                gGameCmd.postAction(gGSM.COINRANK,{page_no:1});
            }
        } else {
            gGameCmd.postAction(gGSM.COINRANK,{page_no:1});
        }
    }

    /** 获得玩家的历史的分数 */
    RankProxy.prototype.askForHistoryRank = function(useCache) {
        if(this.rankHistoryDic) {
            NotifyMgr.send(AppNotify.RankHistory);             // 已经获取到了。个人排名的数据了。可以取用.
            if(!useCache) {
                gGameCmd.postAction(gGSM.HISRANK, null);
            }
        } else {
            gGameCmd.postAction(gGSM.HISRANK, null);
        }
    }
    return RankProxy;
})();

window.RankProxy = RankProxy;