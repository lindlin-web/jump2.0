let mUICtrl = window.gUICtrl;
cc.Class({
    extends: require("BaseView"),

    properties: {},

    // use this for initialization
    onLoad: function() {
        this._super();

        gUICtrl.createDialogBg(this);
    },

    start() {
        this._super();
        gUICtrl.addDialog(this);
    },
    __beforeOpened() {
        this.onOpened && this.onOpened();
        if (this.uiid) {
            NotifyMgr.send(AppNotify.OnViewOpened, this.uiid);
        }
    },
    setDialogBg(dialogBgJs) {
        this.mDialogBgJs = dialogBgJs;
    },

    setIsCloseSelf(isCloseSelf) {
        this.mDialogBgJs.setIsCloseSelf(isCloseSelf);
    },

    onDestroy: function() {
        gUICtrl.removeDialog(this);
        this._super();
        // this.node.on(cc.Node.EventType.TOUCH_START,function(e)
        // {
        //     cc.log("touch start")
        // }.bind(this),this);
    },

    removeSelf(closeAction) {
        var readyHandler = function() {
            gUICtrl.unUseDialog(this);
        }.bind(this);

        this.readyForRemove(closeAction, readyHandler);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
