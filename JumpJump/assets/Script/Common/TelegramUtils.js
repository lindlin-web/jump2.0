//t.me/LeapHop_bot/leaphop     for real
//t.me/aabbcc_test_bot/tiaotiao_test    for test

var HEAD_COLORS = {LOADING:"#B6CBDA",PREFAB:"#6D7983", INGAME:"#B6CBDA", RESULT:"#99ABB8", TITLE_COIN_MONEY:"#40505F"};

window.HEAD_COLORS = HEAD_COLORS;
function TelegramUtils() {
    this.inviteText = ["💎 Hey there! Join me in playing LeapHop and earn up to 10,000 $LeapCoin daily just by jumping!\n\n🎁 Plus, invite friends like I'm inviting you, and we both get special airdrop rewards!",
                        "💎 Hey there! Join me in playing LeapHop and earn up to 10,000 $LeapCoin daily just by jumping!\n\n🎁 Plus, invite friends like I'm inviting you, and we both get special airdrop rewards!"];
    this.challengeText = ["🏆 Challenge accepted! 🏆\n\n💪 This round, I scored {XX} points. Who dares to come and challenge me in a PK?\n\n🚀 If you're afraid of losing, then stop boasting here!",
        "🏆 Challenge accepted! 🏆\n\n🚀 Hmph! You rookies just love to boast. This round, I got {XX} points, showing you what true strength is!\n\n💪 Pathetic! Stop pretending, come on, let me knock you down in one go!",
        "🏆 Challenge accepted! 🏆\n\n🕹 You bunch of losers, always hiding and scared of losing, why even play the game!\n\n👑 I scored {XX} points this round, waiting to see who dares to challenge my dominance!",
        "🏆 Challenge accepted! 🏆\n\n🕹 Looks like you're all just trash talkers. I effortlessly scored {XX} points this round, who dares to challenge me?\n\n👇 If you don't have the guts, then stop pretending here and come out to accept the challenge!",
        "🏆 Challenge accepted! 🏆\n\n👑 I effortlessly scored {XX} points this round, challenging you to come and try to steal my throne!\n\n🕹 Stop with the talk and come out to accept the challenge!",
        "🏆 Challenge accepted! 🏆\n\n🚀 Looks like you're all just small fry. I easily surpassed {XX} points this round, who's up for a challenge?\n\n🕹 Stop boasting and come PK me, let's see who the real champion is!",
        "🏆 Challenge accepted! 🏆\n\n🚀 Don't give me excuses to hide, my score {XX} this round has surpassed all of you!\n\n🕹 If you're afraid of losing, then don't play the game, come out and let me teach you a lesson!",
        "🏆 Challenge accepted! 🏆\n\n🕹 What qualifications do you losers have to challenge me?\n\n👑 I effortlessly scored {XX} points this round, who dares to try and snatch my champion title?",
        "🏆 Challenge accepted! 🏆\n\n🚀 Scored {XX} points this round must have made you feel ashamed, right?\n\n🕹 If you want to challenge me, come on!"]    

    this.joinTeamtr="⬆️ Follow link above to join my squad in LeapHop⬆️\n💰Let's earn $LeapCoin together! By teaming up, we can climb the \nrankings and get special airdrop rewards.";
}
TelegramUtils.prototype.onShowBackBtn = function(){
    if((window).TelegramWebviewProxy){
        const data = JSON.stringify({ is_visible: true });
        (window).TelegramWebviewProxy.postEvent('web_app_setup_back_button', data);
    }

    GameTool.hideBottom();
}

TelegramUtils.prototype.onHideBackBtn = function(){
    if((window).TelegramWebviewProxy){
        const data = JSON.stringify({ is_visible: false });
        (window).TelegramWebviewProxy.postEvent('web_app_setup_back_button', data);
    }
    GameTool.showBottom();
}

TelegramUtils.prototype.onSetBgColor = function(val){
    if((window).TelegramWebviewProxy){
        const data = JSON.stringify({ color:val});
        (window).TelegramWebviewProxy.postEvent('web_app_set_background_color', data);
    }
}

/** 设置网页头的颜色接口 */
TelegramUtils.prototype.onSetHeaderColor = function(val){
    if((window).TelegramWebviewProxy){
        const data = JSON.stringify({ color_key: "bg_color ",color:val});
        (window).TelegramWebviewProxy.postEvent('web_app_set_header_color', data);
        const data1 = JSON.stringify({ color_key: "secondary_bg_color ",color:val});
        (window).TelegramWebviewProxy.postEvent('web_app_set_header_color', data1);
    }
}

TelegramUtils.prototype.registerCloseBehavior = function() {
    const data = JSON.stringify({ need_confirmation: true });
    if(window.TelegramWebviewProxy){
        window.TelegramWebviewProxy.postEvent('web_app_setup_closing_behavior', data);
    }
}

TelegramUtils.prototype.registerExpandBehavior = function() {
    if(window.TelegramWebviewProxy) {
        window.TelegramWebviewProxy.postEvent('web_app_expand', null);
    }
}

TelegramUtils.prototype.openLinkByUrl = function(url) {
    if(window.Telegram) {
        window.Telegram.WebApp.openTelegramLink(url);
    }
}

TelegramUtils.prototype.openTelegramLinkByUrl = function(url) {
    if(window.Telegram) {
        window.Telegram.WebApp.openTelegramLink(url);
    }
}

TelegramUtils.prototype.ShowAdv = function(OverEvent,NoOverEvent=null)
{
    if(window.Telegram)
    {
        window.AdController.show().then((result) => {
            if(result.done){
                if(OverEvent!=null)
                {
                    OverEvent();
                }
            }else{
                if(NoOverEvent!=null)
                {
                    NoOverEvent();
                }
            }
            }).catch((err) => {
            if(err){
                gUICtrl.openUI(gUIIDs.UI_GAME_TIP,null, {type:3,value:"Watching unfinished"});
            }
        })
    }
}

/** 发起挑战的时候 */
TelegramUtils.prototype.onChallenge = function(){
    let myGid = 0;
    let myTgId = 0;
    myGid = GameData.UsersProxy.getMyGid();
    myTgId = GameData.UsersProxy.getMyTgid();
    let random = Math.floor( Math.random() * this.challengeText.length );
    let ct = this.challengeText[random];
    let replaceData = {XX:GameData.GameProxy.getTotalScore()};
    ct = GameTool.replacePlaceHolders(ct, replaceData);
    let replay = encodeURI(ct);
    let theUrl = "";
    if(myGid) {
        let tempGid = 90000000;
        if(myGid < 10000000){
            tempGid = tempGid + myGid;
        } else {
            tempGid = myGid;
            
        }
        theUrl = `https://t.me/share/url?text=${replay}&url=${GameConfig.getRobotURL()}?startapp=rp_${tempGid}_${myTgId}`;

        
    } else {
        theUrl = `https://t.me/share/url?text=${replay}&url=${GameConfig.getRobotURL()}?startapp=r_${myTgId}`;
    }
    // utils.openTelegramLink(theUrl);
    //const data = JSON.stringify({ url: theUrl,try_instant_view:false });
    // if(window.TelegramWebviewProxy) {
    //     window.TelegramWebviewProxy.postEvent('web_app_open_link', data);
    // }
    if(window.Telegram) {
        window.Telegram.WebApp.openTelegramLink(theUrl);
    }
}

/** 邀请加入某个团队 */
TelegramUtils.prototype.onInviteToJoinSquad = function(){
    let myGid = 0;
    let myTgId = 0;
    myGid = GameData.UsersProxy.getMyGid();
    myTgId = GameData.UsersProxy.getMyTgid();
    let replay = encodeURI(this.joinTeamtr);
    let theUrl = "";
    if(myGid) {
        let tempGid = 90000000;
        if(myGid < 10000000){
            tempGid = tempGid + myGid;
        } else {
            tempGid = myGid;
        }
        theUrl = `https://t.me/share/url?text=${replay}&url=${GameConfig.getRobotURL()}?startapp=rp_${tempGid}_${myTgId}`;
    } else {
        theUrl = `https://t.me/share/url?text=${replay}&url=${GameConfig.getRobotURL()}?startapp=r_${myTgId}`;
    }
    // utils.openTelegramLink(theUrl);
    const data = JSON.stringify({ path_full: theUrl});
    //const data = JSON.stringify({ url: theUrl,try_instant_view:true });
    if(window.Telegram) {
        window.Telegram.WebApp.openTelegramLink(theUrl);
        
    }
}
/** 发起跟人聊天的时候 */
TelegramUtils.prototype.onChat = function(username){
    let theUrl = "https://t.me/" + username;

    const data = JSON.stringify({ url: theUrl,try_instant_view:false });
    // if(window.TelegramWebviewProxy) {
    //     window.TelegramWebviewProxy.postEvent('web_app_open_link', data);
    // }
    if(window.Telegram) {
        window.Telegram.WebApp.openTelegramLink(theUrl);
    }
}

TelegramUtils.prototype.onCloseApp = function(){
    window.TelegramWebviewProxy.postEvent('web_app_close',null);
}

/** 邀请玩家的时候，随机生成一段文字 */
TelegramUtils.prototype.onInvite = function(){
    let myGid = 0;
    let myTgId = 0;
    myGid = GameData.UsersProxy.getMyGid();
    myTgId = GameData.UsersProxy.getMyTgid();
    let random = Math.random() > 0.5 ? 0 : 1;
    let replay = encodeURI(this.inviteText[random]);
    let theUrl = "";
    if(myGid) {
        let tempGid = 90000000;
        if(myGid < 10000000){
            tempGid = tempGid + myGid;
        } else {
            tempGid = myGid;
        }
        theUrl = `https://t.me/share/url?text=${replay}&url=${GameConfig.getRobotURL()}?startapp=rp_${tempGid}_${myTgId}`;
    } else {
        theUrl = `https://t.me/share/url?text=${replay}&url=${GameConfig.getRobotURL()}?startapp=r_${myTgId}`;
    }
    // utils.openTelegramLink(theUrl);
    const data = JSON.stringify({ path_full: theUrl});
    //const data = JSON.stringify({ url: theUrl,try_instant_view:true });
    if(window.Telegram) {
        window.Telegram.WebApp.openTelegramLink(theUrl);
    }
}

TelegramUtils.prototype.onOpenUrl = function(path) {
    const data = JSON.stringify({ url: path,try_instant_view:false });
    if(window.TelegramWebviewProxy) {
        window.TelegramWebviewProxy.postEvent('web_app_open_link',data);
    }
    // if(window.Telegram) {
    //     window.Telegram.WebApp.openTelegramLink(path);
    // }
}

TelegramUtils.prototype.onOpenTelegramUrl = function(path) {
    const data = JSON.stringify({ url: path,try_instant_view:false });
    // if(window.TelegramWebviewProxy) {
    //     window.TelegramWebviewProxy.postEvent('web_app_open_link',data);
    // }
    if(window.Telegram) {
        window.Telegram.WebApp.openTelegramLink(path);
    }
}

module.exports = new TelegramUtils();