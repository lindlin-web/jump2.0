let telegramUtil = require('../../Script/Common/TelegramUtils');
cc.Class({
    extends: cc.Component,

    properties: {
        head:cc.Sprite,
        playName:cc.Label,
        address:cc.Label,
        score:cc.Label,
        chatBtn:cc.Button,
        theIndex:0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    onChat() {
        let username = this.info.getUserName();
        telegramUtil.onChat(username);
        
    },

    getIndex() {
        return this.theIndex;
    },

    updateItem(info) {
        this.setInfo(info);
    },

    start() {

    },
    setInfo(info) {
        this.theIndex = info.index;
        this.info = info;
        this.playName.string = GameTool.convertUserName15(info.getNickName());
        this.score.string = info.getHistoryMaxMoney() + "";
        //this.address.string = GameTool.converWalletAddress(info.getWallet());
        // 获得头像的url 
        let tgid = info.getTgid();
        let url = gFuncs.getAvatarUrlByTgid(tgid);
        GameTool.getRemoteSprite(this.head,url);
    }

    // update (dt) {},
});
