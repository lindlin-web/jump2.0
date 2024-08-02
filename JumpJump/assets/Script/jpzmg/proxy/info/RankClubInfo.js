

/******  这个是宝箱信息 */
var RankClubInfo = (function() {
    function RankClubInfo() {
        this.charge = "";
        this.cname = null;
        this.grade = 0;
        this.gscore = "";
        this.guserCount = null;
        this.id = 0;
        this.name = 0;
        this.no = 0;
        this.pic = "";
        this.tgGid = "";
        this.type = 0;
        this.url = "";
        this.level = 0;
    }
    /** 获得 id */
    RankClubInfo.prototype.getId = function() {
        return this.id;
    }

    /** 获得 id */
    RankClubInfo.prototype.getTgGid = function() {
        return this.tgGid;
    }


    /** 获得 俱乐部名称 */
    RankClubInfo.prototype.getName = function() {
        return this.name;
    }

    /** 获得 俱乐部url */
    RankClubInfo.prototype.getUrl = function() {
        return this.url;
    }

    /** 获得 member人数 */
    RankClubInfo.prototype.getMemberCount = function() {
        return this.guserCount;
    }

    /** 获得 总分数 */
    RankClubInfo.prototype.getTotalScore = function() {
        return this.gscore;
    }

    RankClubInfo.prototype.getLevel = function() {
        return this.level;
    }

    

    RankClubInfo.prototype.init = function(info) {
        this.charge = info.charge;
        this.cname = info.cname;
        this.grade = info.grade;
        this.gscore = info.gscore;
        this.guserCount = info.guser_count;
        this.id = info.id;
        this.name = info.name;
        this.no = info.no;
        this.pic = info.pic;
        this.tgGid = info.tg_gid;
        this.type = info.type;
        this.url = info.url;
        this.level = info.level;
    }
    
    return RankClubInfo;
})();
window.RankClubInfo = RankClubInfo;