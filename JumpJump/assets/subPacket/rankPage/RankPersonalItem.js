
var RankPersonalItem = cc.Class({
    extends: cc.Component,

    properties: {
        head:cc.Sprite,
        playName:cc.Label,
        address:cc.Label,
        score:cc.Label,
        rankFrames: [cc.SpriteFrame],
        rankLabel: cc.Label,
        rankSprite: cc.Sprite,
        theIndex:0,

        thisScore: cc.Node,             // 那个比分的节点
        thisCoin: cc.Node,              // 那个金币的按钮
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
        if(info.index <= 2) {
            this.rankLabel.node.active = false;
            this.rankSprite.node.active = true;
            this.rankSprite.spriteFrame = this.rankFrames[info.index];
        } else {
            this.rankLabel.node.active = true;
            this.rankLabel.string = info.index == 10000 ? "100+" : (info.index + 1) + "";
            this.rankSprite.node.active = false;
        }
        this.playName.string = GameTool.convertUserName15(info.getNickname());
        this.address.string = GameTool.converWalletAddress(info.getWallet());
        if(info.isHistory) {
            let money = info.getHistoryMoney() + "";
            money = GameTool.convertNumberToString(money);
            this.score.string = money;
        }
        if(info.isCoin) {
            this.thisScore.active = false;
            this.thisCoin.active = true;
            let money = info.getHistoryMoney() + "";
            money = GameTool.convertNumberToString(money);
            this.score.string = money;
        } else {
            this.thisScore.active = true;
            this.thisCoin.active = false;
            let money = info.getHistoryMoney() + "";
            money = GameTool.convertNumberToString(money);
            this.score.string = money;
        }
        let tgid = info.getTgid();
        let url = gFuncs.getAvatarUrlByTgid(tgid);
        GameTool.getRemoteSprite(this.head, url);
    }

    // update (dt) {},
});

module.exports = RankPersonalItem;