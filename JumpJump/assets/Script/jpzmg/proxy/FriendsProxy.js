/** 这个是描述了俱乐部旗下的 成员的信息列表 */
var FriendsProxy = (function(){
    function FriendsProxy() {
        this.friendsDic = new Dictionary();
        NotifyMgr.on(gGSM.FRIENDS, this.onShowFriends.bind(this), this);
    }

    FriendsProxy.prototype.onShowFriends = function(data) {
        console.log(data);
        if(data.code == 1) {
            let friendNum = data.friends_count;
            GameData.UsersProxy.setMyReferrals(friendNum);
            let friends = data.data;
            GameData.UsersProxy.setTimesToMe(data.today_game_time);
            GameData.UsersProxy.setMyMoney(data.money);
            if(friends) {
                for(let i = 0; i < friends.length; i++) {
                    let friend = friends[i];
                    friend.index = i;
                    let info = new FriendInfo();
                    info.init(friend);
                    let tgId = info.getTgid();
                    this.friendsDic.set(tgId, info);
                }
            }
        }
        NotifyMgr.send(AppNotify.SHOW_FRIENDS);
    }

    FriendsProxy.prototype.getFriends = function() {
        return this.friendsDic.values;
    }

    FriendsProxy.prototype.askForFriends = function() {
        let length = this.friendsDic.values.length;
        if(length > 0) {
            gGameCmd.postAction(gGSM.FRIENDS);
            NotifyMgr.send(AppNotify.SHOW_FRIENDS);
        } else {
            gGameCmd.postAction(gGSM.FRIENDS);
        }
    }
    
    return FriendsProxy;
})();
window.FriendsProxy = FriendsProxy;