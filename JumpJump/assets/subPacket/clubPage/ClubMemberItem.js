
var RankPersonalItem = cc.Class({
    extends: cc.Component,

    properties: {
        head:cc.Sprite,
        playName:cc.Label,
        address:cc.Label,
        score:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    getIndex() {
        return this.theIndex;
    },

    updateItem(info) {
        this.setInfo(info);
    },
    
    setInfo(info) {
        this.theIndex = info.index;
        this.info = info;
        this.playName.string = GameTool.convertUserName15(info.getNickName());
        this.address.string = GameTool.converWalletAddress(info.getWallet());
        let score = info.getHistoryMoney() + "";
        score = GameTool.convertNumberToString(score)
        this.score.string = score;
        let url = gFuncs.getAvatarUrlByTgid(info.getTgId());

        if(GameTool.isValidHttpUrl(url)) {
            GameTool.getRemoteSprite(this.head, url);
        }
    }

    // update (dt) {},
});

module.exports = RankPersonalItem;