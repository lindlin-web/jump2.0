
cc.Class({
    extends: cc.Component,

    properties: {
        colors:[cc.Color]
    },

    onLoad() {
        
    },

    start() {
        
    },

    _updateColors() {
        let colors = this.colors;
        colors = colors.reverse();
        let nodes = [this.node];
        if (this.node.getComponent(cc.RichText) != null) {
            nodes = this.node.children;
        }
        let self = this;
        if(self.testLabel) {
            //self.testLabel.string = "mmmmmmmmmmmmmmmmmmmmmmmmmmmm";
        }
        for (let i = 0; i < nodes.length; i++) {
            let cmp = nodes[i].getComponent(cc.RenderComponent);
            if (!cmp) return;
            if (this.isAlignDown) {
                cmp.verticalAlign = 2;
            }
            if (this.isItalic) {
                cmp.enableItalic = true;
            }
            if (this.isBold) {
                cmp.enableBold = true;
            }
            let tmpFunc = cmp._updateColor.bind(cmp);
            cmp._updateColor = function() {
                tmpFunc();
                if(self.testLabel) {
                    //self.testLabel.string = "1111111111111111";
                }
                let _assembler = cmp['_assembler'];
                if (!(_assembler instanceof cc['Assembler2D'])) return;
                let uintVerts = _assembler._renderData.uintVDatas[0];
                if (!uintVerts) return;
                if(self.testLabel) {
                    //self.testLabel.string = "33333333333333333";
                }
                let color = cmp.node.color;
                let floatsPerVert = _assembler.floatsPerVert;
                let colorOffset = _assembler.colorOffset;
                let count = 0;
                for (let j = colorOffset, l = uintVerts.length; j < l; j += floatsPerVert) {
                    uintVerts[j] = (colors[count++] || color)['_val'];
                }
            }
        }
    },
    onEnable() {
        // this.node.opacity = 0;
        // this.node.runAction(cc.fadeTo(5,255));
        // NotifyMgr.on(AppNotify.OnViewOpened, this._updateColors.bind(this), this);
        cc.director.once(cc.Director.EVENT_BEFORE_DRAW, this._updateColors, this);
    },
    onDisable() {
        // NotifyMgr.off(AppNotify.OnViewOpened, this._updateColors.bind(this), this);
        cc.director.off(cc.Director.EVENT_BEFORE_DRAW, this._updateColors, this);
        this.node['_renderFlag'] |= cc['RenderFlow'].FLAG_COLOR;
    },

    // update (dt) {},
});
