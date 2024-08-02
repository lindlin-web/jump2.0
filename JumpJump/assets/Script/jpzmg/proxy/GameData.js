var GameData = {
    UsersProxy:null,
    GameProxy:null,
    RankProxy:null,
    ClubProxy:null,
    FriendsProxy:null,
    SoundProxy:null,            // 控制声音.
    TaskProxy:null,
    UpgradeProxy:null,
    WalletProxy:null,
}

var proxyNames = [];
for (var key in GameData) {
    proxyNames.push(key);
}
proxyNames.forEach(function(proxyName) {
    Object.defineProperty(GameData, proxyName, {
        get: function() {
            if (!GameData["__" + proxyName]) {
                GameData["__" + proxyName] = (new window[proxyName]);
            }
            return GameData["__" + proxyName];
        },
        set: function() {},
        enumerable: true,
        configurable: true
    });
});
GameData.reset = function() {
    proxyNames.forEach(function(proxyName) {
        var proxy = GameData["__" + proxyName];
        if (proxy) {
            GameTool.clearTimeout(null, proxy);
            NotifyMgr.offAll(proxy);
            proxy.onRemove && proxy.onRemove();
        }
        GameData["__" + proxyName] = null;
    });
};
window.GameData = GameData;