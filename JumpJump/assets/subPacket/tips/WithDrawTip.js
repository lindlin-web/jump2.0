let WITHDRAWTIP_TYPE = window.WITHDRAWTIP_TYPE = {GROUP_UN_QUA:1, TON_UN_QUA:2, FRIEND_UN_QUA:3, WALLET_UN_QUA:4};
var WithdrawTip = cc.Class({
    extends: require("BaseView"),

    properties: {
        confirmBtn:cc.Button,

        tip1:cc.Node,
        tip2:cc.Node,
        tip3:cc.Node,
        tip4:cc.Node,

        tip2Txt:cc.Label,
        tip3Txt:cc.Label,
        tip4Txt:cc.Label,
        btnText:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
        this._super();
        this.setUIID(gUIIDs.UI_WITHDRAW_TIP);
        this.type = this.getParams()["type"];
        this.value = this.getParams()["value"];
        this.setClickEvent(this.confirmBtn.node, this.onConfirmClick.bind(this));
        

    },
    destroy() {
        this._super();
    },

    onConfirmClick() {
        this.removeSelf();
        if(this.type == WITHDRAWTIP_TYPE.GROUP_UN_QUA) {
            gUICtrl.openUI(gUIIDs.UI_TASKS);
        } else if(this.type == WITHDRAWTIP_TYPE.TON_UN_QUA) {
            let telegramUtil = require('../Script/Common/TelegramUtils');
            telegramUtil.onHideBackBtn();
            gUICtrl.closeOneLevelPanel();
        } else if(this.type == WITHDRAWTIP_TYPE.FRIEND_UN_QUA) {
            gUICtrl.openUI(gUIIDs.UI_FRIEND_PAGE);
        } else if(this.type == WITHDRAWTIP_TYPE.WALLET_UN_QUA) {
            gUICtrl.openUI(gUIIDs.UI_FRIEND_PAGE);
        }
    },

    onBtnEscClick() {
        this.removeSelf();
    },

    start() {
        this._super();
        this.tip1.active = false;
        this.tip2.active = false;
        this.tip3.active = false;
        this.tip4.active = false;
        
        if(this.type == WITHDRAWTIP_TYPE.GROUP_UN_QUA) {
            this.tip1.active = true;
            this.btnText.string = "Task";
        } else if(this.type == WITHDRAWTIP_TYPE.TON_UN_QUA) {
            this.tip2.active = true;
            this.tip2Txt.string = "X" + this.value;
            this.btnText.string = "Play";
        } else if(this.type == WITHDRAWTIP_TYPE.FRIEND_UN_QUA) {
            this.tip3.active = true;
            this.tip3Txt.string = "Friend Num: "+ this.value +"/15";
            this.btnText.string = "Invite";
        } else if(this.type == WITHDRAWTIP_TYPE.WALLET_UN_QUA) {
            this.tip4.active = true;
            this.tip4Txt.string = "Achieve Num: "+ this.value +"/10";
            this.btnText.string = "Invite";
        }

    },

});
