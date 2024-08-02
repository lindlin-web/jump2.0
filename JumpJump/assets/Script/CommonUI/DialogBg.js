var DialogBg = window.DialogBg = cc.Class({
    extends: cc.Component,

    properties: {
        bgSprite: cc.Sprite,
        dialogComponent: {
            default: null,
            type: cc.Component
        },

        bgOpacity: {
            default: 170,
            tooltip: "通用底板透明度"
        },
        closeSelf: true
    },

    // use this for initialization
    onLoad: function() {
        this.node.on(cc.Node.EventType.TOUCH_END, function(e) {
            if (this.dialogComponent != null) {
                if (this.dialogComponent.bounding.contains(e.getLocation()) || e.getLocation().x <= 0 || e.getLocation().y <= 0 || e.getLocation().x >= cc.winSize.width || e.getLocation().y >= cc.winSize.height) {
                    return false;
                }
                return this.onBgTouchEnd();
            }
        }.bind(this), this);
    },
    onBgTouchEnd() {
        if (this.dialogComponent != null) {
            if (this.dialogComponent.closeFromDialogBg && this.dialogComponent.isOpened) {
                this.dialogComponent.closeFromDialogBg();
            } else {
                if (this.closeSelf && this.dialogComponent.isOpened) {
                    this.dialogComponent.removeSelf();
                }
            }
            //GameData.SoundProxy.playClickSound();
        }
    },

    setIsCloseSelf(isCloseSelf) {
        this.closeSelf = isCloseSelf;
    },

    setDialogComponent: function(component, closeself) {
        this.dialogComponent = component;
        if (closeself != undefined) {
            this.closeSelf = closeself;
        }
    },

    fadeInAction(){
        this.node.opacity = 0;
        this.node.runAction(cc.fadeTo(0.1, this.bgOpacity));
    },
    // onEnable: function() {
    //     DialogBg.inUsedNum = DialogBg.inUsedNum || 0;
    //     ++DialogBg.inUsedNum;
    // },
    // onDisable: function() {
    //     --DialogBg.inUsedNum;
    // }
});