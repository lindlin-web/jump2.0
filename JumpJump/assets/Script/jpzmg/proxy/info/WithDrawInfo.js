const WithdrawItem = require("../../../../subPacket/walletPage/WithdrawItem");
//0=申请中，1=申请通过转账中，2=申请拒绝，3=已转账
const WITHDRAW_TYPE = {APPLICANT:0, PASSING:1, REJECT: 2, DONE: 3};
/******  这个是宝箱信息 */
var WithDrawInfo = (function() {
    function WithDrawInfo() {
        
    }
    WithDrawInfo.prototype.init = function(info) {
        this.adoptTime = info.adopt_time;
        this.createTime = info.create_time;
        this.id = info.id;
        this.realMoney = info.real_money;
        this.receTime = info.rece_time;
        this.status = info.status;
        this.tgId = info.tgid;
        this.tonMoney = info.ton_money;
        this.wallet = info.wallet;
        this.withdralNo = info.withdrawal_no;
    }

    WithDrawInfo.prototype.isAvailable = function() {
        return this.status != WITHDRAW_TYPE.REJECT;
    }

    WithDrawInfo.prototype.getCreateTime = function() {
        let time = this.createTime.split(" ")[0];
        return time;
    }

    WithDrawInfo.prototype.getWithdrawMoney = function() {
        return "Withdraw " + this.realMoney + " Ton";
    }

    WithDrawInfo.prototype.getId = function() {
        return this.id;
    }

    WithDrawInfo.prototype.getStatusStr = function() {
        switch(this.status) {
            case WITHDRAW_TYPE.APPLICANT:
                return "Transferring";
            case WITHDRAW_TYPE.PASSING:
                return "Transferring";
            case WITHDRAW_TYPE.REJECT:
                return "Rejected";
            case WITHDRAW_TYPE.DONE:
                return "Credited";
        }
    }

    return WithDrawInfo;
})();
window.WithDrawInfo = WithDrawInfo;