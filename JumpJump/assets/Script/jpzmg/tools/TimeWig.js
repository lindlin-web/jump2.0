cc.Class({
    extends: cc.Component,

    properties: {
        bg1:cc.Node,
        bg2:cc.Node,

        second: cc.Label,
        content: cc.Node,
    },
    start() {
        this.content.width = 0;
        NotifyMgr.on(AppNotify.FETCH_TIME, this.onFetchTime.bind(this));          // 启动一个事件
        this.node.active = false;
    },

    onFetchTime() {
        this.node.active = true;
    },

    update() {
        this.bg1.x += 0.5;
        this.bg2.x += 0.5;
        let leftTime = parseFloat(GameData.GameProxy.getLeftHappyTime());
        if(leftTime <= 0) {
            this.node.active = false;
            return;
        }
        this.content.setContentSize(((TIMELAST - leftTime) / TIMELAST) * 174, this.content.getContentSize().height);
        this.second.string = parseInt(leftTime +0.5) + "s";
        if(this.bg1.x >= 0) {
            this.bg1.x -= 356.154
        }
        if(this.bg2.x >= 0) {
            this.bg2.x -= 356.154
        }
    }
});
