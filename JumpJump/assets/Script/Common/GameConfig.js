require("GameTool");
let gameAppID = {
	GAME_POKEMON: 1,
}

// 这个是测试服务器的配置...
let TEST_PLATFORM = {
	robotUrl: "https://t.me/myNewJumpBot/newJumpJump",
	server:"https://jump.wxtest.vip/api",//"https://ikvmoneysocial.buzz/api",
	inviteUrl: "https://t.me/jumpdevbot?start=team",			// 这个是跟 组队有关的接口，需要问服务器要这个数据
	payAddress:"https://leaphop.jiuba.icu",
	payManiAddress:"https://leaphop.jiuba.icu/tonconnect-manifest.df297.json"
}
//https://t.me/LeapCoinBot
// 这个是正式服的配置
let REAL_PLATFORM = {
	robotUrl:"https://t.me/LeapCoinBot/leapcoin",
	server: "https://api.leapcoin.cc/api",
	inviteUrl: "https://t.me/LeapCoinBot?start=team",
	payAddress:"https://webapp.leapcoin.cc",
	payManiAddress:"https://webapp.leapcoin.cc/tonconnect-manifest.df297.json"
}

// 这个是本地的配置...
let LOCAL_PLATFORM = {
	robotUrl: "t.me/aabbcc_test_bot/tiaotiao_test",
	server:"http://192.168.5.11:8789/api",
	inviteUrl: "https://t.me/cccccccscss_bot?start=team",
	payAddress:"https://leaphop.jiuba.icu",
	payManiAddress:"https://leaphop.jiuba.icu/tonconnect-manifest.df297.json"
}

var finalSetting = REAL_PLATFORM;							/////xxxxxxxxxxxxxxxxxxxxxxxxxx 在这个地方进行配置...
var GameConfig = window.GameConfig = {
	debugLevel: 3,
	
	
	//gateHttpAddr: "https://bidmoneysocial.buzz/api",			// 可以使用.
	//gateHttpAddr: "https://ikvmoneysocial.buzz",				// 貌似坏了

	//gateHttpAddr:"http://192.168.5.49:8788/api",
    
	
	//logHttpAddr: "http://192.168.1.201:9910",

	gateHttpAddr: finalSetting.server,			// 服务器地址.....
	//游戏id
	gameAppID: gameAppID.GAME_POKEMON,
	//是否已经有过闪屏
	isSplashShowed: false,
	//客户端版本号
	clinetVersion: 1,
	//审核版本号
	reviewVersion: 1,
	//资源版本号
	resVersion: 1,
	//消息派送事件
	RECV_CMD_NOTIFY_DATA_MGR: "RECV_CMD_NOTIFY_DATA_MGR",
	RECV_CMD_NOTIFY_UI: "RECV_CMD_NOTIFY_UI",

	designW: 2250,
	designH: 1280,
	maxH: 1280,
	marginTop: 0,
	marginBottom: 0,
	needScreenAdaptor: false,
	hasStarted: false,
	guideFlag: 1,
	morseFlag: 0,
	/** 启用充值 */
	EnableRecharge: true,
	/** 是否有更新通知 */
	hasUpdateNotice: false,
	// 是否提申包,
	isCheck: false,
	/**屏蔽分享 */
	banShare: true,
	EnableAccountLogin: false,
	/**开启问卷调查 */
	openClientQuestion: false,
	clientQuestionUrl: "https://forms.gle/H4Sf79Jr7hU7qZHL9",
	cfgDebug: false,//是否使用本地配置调试
	isTest:true,		// 是否是在调试阶段.
};

GameConfig.isTest = window.Telegram ? false: true;

GameConfig.getInviteRobotUrl = function() {
	return finalSetting.inviteUrl;
}



GameConfig.getPayAddress = function() {
	return finalSetting.payAddress
}
GameConfig.getPayManiAddress = function() {
	return finalSetting.payManiAddress;
}

var entryParams = GameTool.getEntryParams();
if (entryParams.gateHttpAddr) {
	GameConfig.gateHttpAddr = entryParams.gateHttpAddr;
}
if (entryParams.guideFlag != null) {
	GameConfig.guideFlag = parseInt(entryParams.guideFlag);
}
if (entryParams.cfgDebug != null) {
	GameConfig.cfgDebug = true;
}
window.serverArea2GateHttpAddr = {
	Asia: GameConfig.gateHttpAddr,
	Europe: GameConfig.gateHttpAddr,
	America: GameConfig.gateHttpAddr,
}

/** 获得机器人的地址 */
GameConfig.getRobotURL = function() {
	return finalSetting.robotUrl;
}

GameTool.getset(true, GameConfig, "needScreenAdaptor", function() {
	// return this.winSize.width / this.winSize.height <= 1125 / 2436;
	// return this.winSize.width / this.winSize.height <= GameConfig.designW / GameConfig.maxH;
	return false
});
GameTool.getset(true, GameConfig, "useJsonAssets", function() {
	var version = cc.ENGINE_VERSION.split(".");
	return version[0] >= 2 || version[1] >= 10;
});
GameConfig.checkWinsize = function() {
	return;
	if (GameConfig.winSize && GameConfig.winSize.width && GameConfig.winSize.height) {
		return;
	}
	GameConfig.winSize = {
		width: cc.view.getFrameSize().width,
		height: cc.view.getFrameSize().height
	};
	if (cc.sys.isBrowser) {
		try {
			GameConfig.winSize.width = window.document.body.clientWidth;
			GameConfig.winSize.height = window.document.body.clientHeight;
			cc.view.setFrameSize(window.document.body.clientWidth, window.document.body.clientHeight)
		} catch (error) {
			GameTool.warn("Not browser environment");
		}
	}
	if (!CC_EDITOR) {
		GameTool.log("cc.view.getFrameSize", cc.view.getFrameSize().width, cc.view.getFrameSize().height);
		GameTool.log("cc.view.getDesignResolutionSize", cc.view.getDesignResolutionSize().width, cc.view.getDesignResolutionSize().height);

		GameTool.log("GameConfig.winSize", GameConfig.winSize.width, GameConfig.winSize.height);
	}
	if (GameConfig.winSize.width && GameConfig.winSize.height) {
		// 等比例拉伸到designW
		GameConfig.winSize.height = GameConfig.winSize.height * (GameConfig.designW / GameConfig.winSize.width);
		GameConfig.winSize.width = GameConfig.designW;

		if (GameConfig.winSize.width / GameConfig.winSize.height > GameConfig.designW / GameConfig.designH) {
			cc.view.setDesignResolutionSize(GameConfig.designW, GameConfig.designH);
		} else {
			cc.view.setDesignResolutionSize(GameConfig.designW, GameConfig.designH, cc.ResolutionPolicy.FIXED_WIDTH);
		}
	}
}
// GameConfig.checkWinsize();


var game = window.game = {
	config: GameConfig
};
