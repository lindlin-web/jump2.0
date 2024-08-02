var WithdrawItem = cc.Class({
    extends: cc.Component,

    properties: {
        timeLabel:cc.Label,
        money:cc.Label,
        status:cc.Label,
    },
    onLoad () {
        this.info = null;
    },

    start() {

    },

    getIndex() {
        return this.theIndex;
    },

    updateItem(info) {
        this.setInfo(info);
    },
    
    setInfo(info) {
        this.info = info;
        this.theIndex = info.index;

        this.timeLabel.string = info.getCreateTime();

        this.money.string = info.getWithdrawMoney();
        this.status.string = "Status: " + info.getStatusStr();
    },
});

module.exports = WithdrawItem;