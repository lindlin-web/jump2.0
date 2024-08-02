let telegramUtil = require('../Script/Common/TelegramUtils');
var SettingTip = cc.Class({
    extends: require('BaseView'),

    properties: {
       
        btnOn:cc.Button,
        btnOff:cc.Button,
        copyBtn:cc.Button,
        myTgidLabel:cc.Label,           // 我的tgid 是多少.
    },
    statics:{
        instance:null,
    },

    destroy() {
        this._super();
        SettingTip.instance = null;
    },

    onLoad() {
        SettingTip.instance = this;
        this.setUIID(gUIIDs.SETTING_TIP);
        this._super();
        this.setClickEvent(this.btnOn, this.onSoundBtnClick.bind(this));
        this.setClickEvent(this.btnOff, this.onSoundBtnClick.bind(this));
        this.setClickEvent(this.copyBtn, this.onCopyBtn.bind(this));
        this.myTgidLabel.string = GameTool.convertUserName15(GameData.UsersProxy.getMyToken());                      //   获得我的tg id .
        this.initSoundStatus();
    },

    onPrivicy() {
        telegramUtil.onOpenUrl(GameTool.getPolicyUrl());
    },

    onSoundBtnClick() {
        let sound = GameData.SoundProxy.getSoundOpen();
        if(sound == MUSICT_STATUS.ON) {
            GameData.SoundProxy.setSoundOpen(MUSICT_STATUS.OFF);
        } else {
            GameData.SoundProxy.setSoundOpen(MUSICT_STATUS.ON);
        }
        this.initSoundStatus();
    },

    onCopyBtn() {
        let myTgid = GameData.UsersProxy.getMyTgid();
        GameData.GameProxy.webCopyString(myTgid, ()=>{
            gUICtrl.openUI(gUIIDs.UI_GAME_TIP,null, {type:3,value:"COPIED"});
        });
    },

    initSoundStatus() {
        let sound = GameData.SoundProxy.getSoundOpen();
        if(sound == MUSICT_STATUS.ON) {
            this.btnOn.node.active = true;
            this.btnOff.node.active = false;
        } else {
            this.btnOn.node.active = false;
            this.btnOff.node.active = true;
        }
    },
});
