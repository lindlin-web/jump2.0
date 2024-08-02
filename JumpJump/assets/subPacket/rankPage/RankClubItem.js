
var RankClubItem = cc.Class({
    extends: cc.Component,

    properties: {
        head:cc.Sprite,
        clubName:cc.Label,
        members:cc.Label,
        score:cc.Label,
        rankFrames: [cc.SpriteFrame],
        rankLabel: cc.Label,
        rankSprite: cc.Sprite,
        theIndex:0,
        levelFrames:[cc.SpriteFrame],       // 等级的frames....
        levelSprite: cc.Sprite,             // 等级的sprite....
    },

    // LIFE-CYCLE CALLBACKS:

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
        if(info.index <= 2) {
            this.rankLabel.node.active = false;
            this.rankSprite.node.active = true;
            this.rankSprite.spriteFrame = this.rankFrames[info.index];
        } else {
            this.rankLabel.node.active = true;
            this.rankLabel.string = (info.index + 1) + "";
            this.rankSprite.node.active = false;
        }
        let level = info.getLevel();
        level = level - 1;
        this.levelSprite.spriteFrame = this.levelFrames[level];
        this.clubName.string = GameTool.convertUserName15(info.getName());
        this.members.string = info.getMemberCount();

        let money = GameTool.convertNumberToString(info.getTotalScore() + "");
        this.score.string = money;
        let url = gFuncs.getGroupUrlByTgGid(info.getTgGid());
        if(GameTool.isValidHttpUrl(url)) {
            GameTool.getRemoteSprite(this.head, url);
        }
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },

    onTouchEnd() {
        gUICtrl.openUI(gUIIDs.UI_CLUB_PAGE, null, {tgGid:this.info.getTgGid()}, true);
    }

    // update (dt) {},
});

module.exports = RankClubItem;