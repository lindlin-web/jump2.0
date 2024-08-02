var UsersProxy = (function(){
    function UsersProxy() {
        this.users = new Dictionary();
        this.myTgId = "";                   // 用户的tgid 是多少..
        NotifyMgr.on(gGSM.LOGIN, this.onUserLogin.bind(this), this);
        NotifyMgr.on(gGSM.USERNEW_STEP, this.onUserNewStep.bind(this), this);
        NotifyMgr.on(gGSM.OFFLINE_MONEY, this.onOffLineMoney.bind(this), this);
        this.offLineMoney = 0;
    }

    UsersProxy.prototype.getOfflineMoney = function() {
        return this.offLineMoney;
    }
    UsersProxy.prototype.onOffLineMoney = function(data) {
        console.log(data, "============onOffLineMoney data");
        if(data.code == 1) {
            this.setUserInfo(data.user);
            if(data.offLineMoney > 0) {
                this.offLineMoney = data.offLineMoney;
                NotifyMgr.send(AppNotify.OFFLINE_BENEFIT,data.offLineMoney)
            }
        }
    }

    UsersProxy.prototype.setGoldForToday = function(val) {
        this.goldOfToday = val;
    }
    UsersProxy.prototype.getGoldForToday = function() {
        return this.goldOfToday;
    }
    UsersProxy.prototype.onUserNewStep = function(data) {
        console.log(data, "============data");
        if(data.code == 1) {
            // this.updateMyInfo(data);
        }
    }

    UsersProxy.prototype.RegisterGameOver = function() {
        this.theCallback = this.onGameOver.bind(this)
        NotifyMgr.on(gGSM.GAME_OVER, this.theCallback, this);
    }

    UsersProxy.prototype.onGameOver = function(data) {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo || data.code != 1) {
            return null;
        }
        /** 更新我的信息.. */
        myUserInfo.update(data);
        NotifyMgr.send(AppNotify.UserInfoChange);
        NotifyMgr.off(gGSM.GAME_OVER,this.theCallback,this);
    }

    UsersProxy.prototype.askForLogin = function() {
        if(this.myTgId) {
            let code = cc.sys.languageCode;
            let countryCode = code.substring(code.length - 1);

            let loginParam = {
                "cfcountry": countryCode,
                "lan": code,
                // "platform": retrieveLaunchParams().platform,
                "platform": "ios",
            };
            gGameCmd.postAction(gGSM.LOGIN, loginParam);
        } else 
        {
            NotifyMgr.send(AppNotify.UserInfoChange);
        }
    }


    UsersProxy.prototype.getMyGiftOk = function() {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo) {
            return null;
        }
        /** 获取我邀请的好友的数量是多少.. */
        let isOk = myUserInfo.getIsGiftOk();      
        return isOk;
    }

    UsersProxy.prototype.getMyGiftError = function() {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo) {
            return null;
        }
        /** 获取我邀请的好友的数量是多少.. */
        let isError = myUserInfo.getIsGiftError();      
        return isError;
    }

    UsersProxy.prototype.getMyGiftTypeAndNum = function() {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo) {
            return null;
        }
        /** 获取我邀请的好友的数量是多少.. */
        let typeAndNum = myUserInfo.getGiftTypeAndNum();      
        return typeAndNum;
    }

    UsersProxy.prototype.getMyGiftErrorMsg = function() {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo) {
            return null;
        }
        /** 获取我邀请的好友的数量是多少.. */
        let errorMsg = myUserInfo.getGiftErrorMsg();      
        return errorMsg;
    }

    UsersProxy.prototype.getMyToken = function() {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo) {
            return null;
        }
        /** 获取我邀请的好友的数量是多少.. */
        let token = myUserInfo.getToken();      
        return token;
    }

    UsersProxy.prototype.setMyReferrals = function(num) {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo) {
            return null;
        }
        /** 获取我邀请的好友的数量是多少.. */
        myUserInfo.setReferrals(num);      
    }

    UsersProxy.prototype.getMyReferrals = function() {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo) {
            return null;
        }
        /** 获取我邀请的好友的数量是多少.. */
        let referrals = myUserInfo.getReferrals();      
        return referrals;
    }

    UsersProxy.prototype.onUserLogin = function(data)  {
        
        let userInfo = this.setUserInfo(data);
        // 登录的话， 就是"我自己"
        this.myTgId = userInfo.getTgid();

        // 登录的时候，如果登录里面有noticeDetail信息，这个是排行榜的奖励
        let noticeDetail = data.noticeDetail;
        if(noticeDetail && noticeDetail.reward) {
            GameData.GameProxy.setLoginPrizeCoin(noticeDetail.reward,noticeDetail.id);          // 把排行榜奖励
        }
    }

    UsersProxy.prototype.getHistoryMoney = function() {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo) {
            return null;
        }
        /** 获取.. */
        let historyGold = myUserInfo.getHistoryGold();      
        return historyGold;
    }

    UsersProxy.prototype.setUserInfo = function(data) {
        let tempUserInfo = new UserInfo();
        tempUserInfo.init(data);

        let changedMoney = parseInt(tempUserInfo.getGold());
        let changedTonMoney = parseInt(tempUserInfo.getTonMoney());
        let userInfo = this.users.get(tempUserInfo.getTgid());
        
        if(!userInfo) {
            userInfo = tempUserInfo;
            this.users.set(userInfo.getTgid(), userInfo);
        } else {
            let beforeMoney =  parseInt(userInfo.getGold());
            let beforeTonMoney = parseInt(userInfo.getTonMoney());
            userInfo.update(data);
            if(tempUserInfo.getTgid() == this.myTgId) {

                let gapMoney = changedMoney - beforeMoney;
                let gapTon = changedTonMoney - beforeTonMoney;
                if(gapMoney > 0) {
                    gUICtrl.openUI(gUIIDs.UI_GAME_TIP,null, {type:1,value:gapMoney});
                } 
                else if(gapTon>0) {
                    gUICtrl.openUI(gUIIDs.UI_GAME_TIP,null, {type:2,value:gapTon});
                }
            }
        }

        // 如果是我自己本人，需要更新一下数据...
        if(tempUserInfo.getTgid() == this.myTgId) {
            NotifyMgr.send(AppNotify.UserInfoChange);
        }
        return userInfo;
    }

    /** 把今天的奖励给加上去, 设置今天的可玩次数*/
    UsersProxy.prototype.setTimesToMe = function(time) {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo) {
            return null;
        }
        myUserInfo.setTodayGameTime(time);
        NotifyMgr.send(AppNotify.UserInfoChange);
    }

    /** 把今天的奖励给加上去, 增加今天的可玩次数*/
    UsersProxy.prototype.addTimesToMe = function(time) {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo) {
            return null;
        }
        myUserInfo.addTodayGameTime(time);
    }

    /** 把玩家的新手引导步骤给更新一下xxxxxxxxxxxxxxxxxxxxxxxxxxxxx  */
    UsersProxy.prototype.askForServerUpdateStep = function(step) {
        gGameCmd.postAction(gGSM.USERNEW_STEP, {new_step: step});
    }

    UsersProxy.prototype.askForOffLineBenefit = function() {
        gGameCmd.postAction(gGSM.OFFLINE_MONEY, null);
    }

    //gGameCmd.postAction(gGSM.GET_NOTICE, null);

    /** 把这一局获得的ton币给累加起来 */
    UsersProxy.prototype.addTonToMe = function(num) {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo) {
            return null;
        }
        myUserInfo.addTonMoney(num);
        NotifyMgr.send(AppNotify.UserInfoChange);
    }


    /** 把金币给加上去*/
    UsersProxy.prototype.addGoldToMe = function(num) {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo) {
            return null;
        }

        myUserInfo.addGold(num);
        NotifyMgr.send(AppNotify.UserInfoChange);
    }

    /** 把我的上限次数，添加起来*/
    UsersProxy.prototype.addMaxGameTimesToMe = function(cp) {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo) {
            return null;
        }

        myUserInfo.addMaxGameTime(cp);
    }

    /** 把今天的奖励给加上去, 增加今天的可玩次数*/
    UsersProxy.prototype.addCouponsToMe = function(cp) {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo) {
            return null;
        }

        myUserInfo.addCoupons(cp);
    }

    /** 获得今天我还可以玩几次 */
    UsersProxy.prototype.getTodayLeftTime = function() {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo) {
            return null;
        }
        let myTodayLeftTime = myUserInfo.getTodayGameTime();
        return myTodayLeftTime;
    }

    /** 我的tgid 是多少 */
    UsersProxy.prototype.getMyTgid = function() {
        return this.myTgId;
    }

    /** 我的gid 是多少 */
    UsersProxy.prototype.getMyGid = function() {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo) {
            return null;
        }
        let myGid = myUserInfo.getGid();
        return myGid; 
    }

    /** 获得今天我最高玩几次 */
    UsersProxy.prototype.getMaxGameTime = function() {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo) {
            return null;
        }
        let myMaxGameTime = myUserInfo.getMaxGameTime();
        return myMaxGameTime; 
    }

    /** 我的tg_gid */
    UsersProxy.prototype.getMyTgGid = function() {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo) {
            return null;
        }
        let myTgGid = myUserInfo.getTgGid();
        return myTgGid;
    }

    

    /** 获得我是否是新手 */
    UsersProxy.prototype.getMyIsNewer = function() {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo) {
            return null;
        }
        let isNewer = myUserInfo.getIsNewer();
        return isNewer;
    }

    /** 获取我是否是一个newStep == 0 我是否需要被引导*/
    UsersProxy.prototype.getMyNeedTutorial = function() {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo) {
            return null;
        }
        let isNewer = myUserInfo.getNeedToturial();
        return isNewer;
    }

    /** 获取我已经领取了第几个礼物了 */
    UsersProxy.prototype.getMyNewStep = function() {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo) {
            return null;
        }
        let newStep = myUserInfo.getNewStep();
        return newStep;
    }

    UsersProxy.prototype.updateMyInfo = function(data) {
        let myUserInfo = this.users.get(this.myTgId);       // 获取我的个人信息.
        myUserInfo.update(data);
        NotifyMgr.send(AppNotify.UserInfoChange);
    }

    UsersProxy.prototype.getMyTodayTopScore = function() {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo) {
            return null;
        }
        let myTodayTopScore = myUserInfo.getTodayTopScore();
        return myTodayTopScore;
    }

    /** 我的历史最高分 */
    UsersProxy.prototype.getMyTopScore = function() {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo) {
            return null;
        }
        let myTopScore = myUserInfo.getTopScore();
        return myTopScore;
    }

    /** 我的money */
    UsersProxy.prototype.getMyMoney = function() {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo) {
            return null;
        }
        let money = myUserInfo.getGold();
        return money;
    }

    UsersProxy.prototype.setMyMoney = function(money) {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo) {
            return null;
        }
        myUserInfo.setGold(money);
        NotifyMgr.send(AppNotify.UserInfoChange);
    }

    /** 设置我的历史最高分 */
    UsersProxy.prototype.setMyTopScore = function(score) {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo) {
            return null;
        }
        myUserInfo.setTopScore(score);
    }

    /** 我的username */
    UsersProxy.prototype.getMyUserName = function() {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo) {
            return null;
        }
        let username = myUserInfo.getUserName();
        return username;
    }

    /** 我的username */
    UsersProxy.prototype.getMyNickName = function() {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo) {
            return null;
        }
        let username = myUserInfo.getNickname();
        return username;
    }

    /** 获得我所拥有的金币 */
    UsersProxy.prototype.getMyGold = function() {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo) {
            return null;
        }
        let myGold = myUserInfo.getGold();
        return myGold;
    }

    /** 获得我的升级选项 */
    UsersProxy.prototype.getMyUpgradeLevel = function(type) {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo) {
            return null;
        }
        let level = myUserInfo.getLevelByType(type);
        return level;
    }


    /** 获得我所拥有的Ton币*/
    UsersProxy.prototype.getMyTonGold = function() {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo) {
            return null;
        }
        let myTonMoney = myUserInfo.getTonMoney();
        return myTonMoney;
    }

    /** 获取我所拥有的奖券 */
    UsersProxy.prototype.getMyCoupons = function() {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo) {
            return null;
        }
        let coupons = myUserInfo.getCoupons();
        return coupons;
    }

    /** 获得跳跃的基数 */
    UsersProxy.prototype.getJumpBase = function() {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo) {
            return null;
        }
    }

    /** 获取我所拥有的奖券 */
    UsersProxy.prototype.getMyWallet = function() {
        let myUserInfo = this.users.get(this.myTgId);
        if(!myUserInfo) {
            return null;
        }
        let wallet = myUserInfo.getWallet();
        return wallet;
    }

    /**
     * 
     * @param {*} id 
     * @returns {SkillInfo}
     */
    UsersProxy.prototype.getSkillInfo = function (skillLV) {
        return this.skills.get(skillLV);
    }
    return UsersProxy;
})();

window.UsersProxy = UsersProxy;