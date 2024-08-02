/** 这个是描述了俱乐部旗下的 成员的信息列表 */
var ClubProxy = (function(){
    function ClubProxy() {
        this.clubMemberInfo = new Dictionary();              // 这个是俱乐部的成员信息的一个列表
        this.tgGid = -1;                // 在创作的 某个 tg_gid 是那个...
        NotifyMgr.on(gGSM.GROUP_USERS, this.onClubInfo.bind(this), this);
        NotifyMgr.on(gGSM.LEAVE_GROUP, this.onLeaveClub.bind(this), this);
        NotifyMgr.on(gGSM.JOIN_GROUP, this.onJoinClub.bind(this), this);
    }

    ClubProxy.prototype.askForClubMember = function(tgGid) {
        this.tgGid = tgGid;         // telegram 的组信息, 这个是临时访问服务器数据的 组id
        let members = this.clubMemberInfo.get(tgGid);           // 是否这个字典中有这个俱乐部的成员信息
        if(members) {
            // NotifyMgr.send(AppNotify.ClubMemberMes);         // 是否重新请求一次
            gGameCmd.postAction(gGSM.GROUP_USERS, {tg_gid:tgGid,page_no:1});
        }
        else {
            gGameCmd.postAction(gGSM.GROUP_USERS, {tg_gid:tgGid,page_no:1});
        }
    }
    /** 请求离开某个俱乐部 */
    ClubProxy.prototype.askForLeaveClub = function(tgGid) {
        gGameCmd.postAction(gGSM.LEAVE_GROUP, {tg_gid:tgGid});
    }

    /** 请求加入某个俱乐部 */
    ClubProxy.prototype.askForJoinClub = function(tgGid) {
        gGameCmd.postAction(gGSM.JOIN_GROUP, {tg_gid:tgGid});
    }
    /** 请求离开某个俱乐部 */
    ClubProxy.prototype.onLeaveClub = function(data) {
        // 这个时候需要更新用户的个人信息, 因为 tg_gid 已经被修改了。
        GameData.UsersProxy.updateMyInfo(data);
        this.clubMemberInfo.remove(this.tgGid);
        NotifyMgr.send(AppNotify.LEAVE_GROUP);
    }

    /** 请求加入某个俱乐部 */
    ClubProxy.prototype.onJoinClub = function(data) {
        // 这个时候需要更新用户的个人信息, 因为 tg_gid 已经被修改了。
        GameData.UsersProxy.updateMyInfo(data);
        this.clubMemberInfo.remove(this.tgGid);
        NotifyMgr.send(AppNotify.JOIN_GROUP);
    }

    ClubProxy.prototype.getMembers = function() {
        return this.clubMemberInfo.values;
    }

    ClubProxy.prototype.memberCount = function() {
        
        return this.clubMemberInfo.values.length;
    }

    /** 获取俱乐部信息 */
    ClubProxy.prototype.onClubInfo = function(data) {
        let membersInfo = data.userList;
        let clubInfo = data.group;
        GameData.RankProxy.resetClubInfo(clubInfo);
        this.clubMemberInfo = new Dictionary();
        for(let i = 0; i < membersInfo.length; i++) {
            let member = membersInfo[i];
            let memberInfo = new MemberInfo();
            memberInfo.init(member);
            this.clubMemberInfo.set(memberInfo.getTgId(), memberInfo);
        }
        
        NotifyMgr.send(AppNotify.ClubMemberMes);
    }
    return ClubProxy;
})();
window.ClubProxy = ClubProxy;