
var ListViewCtrl = cc.Class({
    extends: cc.Component,

    properties: {
        itemTemplate: cc.Node,
        scrollView:cc.ScrollView,
        spawnCount: 0,
        spacing:0,
        bufferZone: 0, 
        nameOfItem: "",
        prefabHeight:0,
        totalCount:0,
    },


    start() {

    },

    onLoad() {
        this.theData = [];
        this.totalCount = 0;
        this.reload(this.theData);
    },

    reload(data, prefab, component){
        if(this.totalCount > 0) {
            this.resetTheData(data);
        } else {
            this.theData = [];
            this.content = this.scrollView.content;
            if(prefab) {
                this.itemTemplate = prefab;
            }
            if(component) {
                this.nameOfItem = component;
            }
            this.theData = data;
            this.totalCount = data.length;
            this.items = [];        // array to store spawned items
            this.content.removeAllChildren();
            this.initialize();
            this.updateTimer = 0;
            this.updateInterval = 0.2;
            this.lastContentPosY = 0;
        }
    },

    resetTheData(newData) {
        let newLength = newData.length;
        this.theData = newData;
        let gap = newLength - this.totalCount;
        if(gap >= 0) {
            for(let i = 0; i < gap; i++) {
                this.addItem();
            }
        } else {
            gap = -gap;
            for(let i = 0; i < gap; i++) {
                this.removeItem();
            }
        }

        this.refreshTheItem();
    },

    refreshTheItem() {
        for(let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            
            let comp = item.getComponent(this.nameOfItem);
            let index = comp.getIndex();
            let info = this.theData[index];
            comp.setInfo(info);
        }
    },

    initialize() {
        let itemHeight = 0;
        let length = this.theData.length;
        if(this.prefabHeight == 0) {
            let item = cc.instantiate(this.itemTemplate);
            item.active = true;
            itemHeight = item.height;
            this.prefabHeight = itemHeight;
        }
        for(let i = 0; i < this.theData.length && i < this.spawnCount; i++) {
            let item = cc.instantiate(this.itemTemplate);
            item.active = true;
            this.content.addChild(item);
            item.setPosition(0, -item.height * (0.5 + i) - this.spacing * (i + 1));
            item.getComponent(this.nameOfItem).setInfo(this.theData[i]);
            this.items.push(item);
        }
        this.content.height = length * (this.prefabHeight + this.spacing) + this.spacing;       // get total content height
    },

    addItem:function() {
        this.content.height = (this.totalCount + 1) * (this.prefabHeight + this.spacing) + this.spacing;
        if(this.totalCount < this.spawnCount) {
            let item = cc.instantiate(this.itemTemplate);
            item.active = true;
            item.setPosition(0, -item.height * (0.5) - this.spacing * (1));
            item.getComponent(this.nameOfItem).setInfo(this.theData[0]);
            let bottom = this.getItemAtBottom();
            if(bottom) {
                let itemComp = bottom.getComponent(this.nameOfItem);
                let bottomId = itemComp.getIndex();
                item.setPosition(0, bottom.y - this.spacing - bottom.height);
                item.getComponent(this.nameOfItem).setInfo(this.theData[bottomId + 1]);
            }
            this.content.addChild(item);
            this.items.push(item);
        }
        this.totalCount = this.totalCount + 1;
    },

    removeItem() {
        this.content.height = (this.totalCount - 1) * (this.prefabHeight + this.spacing) + this.spacing;
        this.totalCount = this.totalCount - 1;

        let bottomItem = this.moveBottomItemToTop();
        if(this.totalCount < this.spawnCount) {
            if(bottomItem) {
                let index = this.items.indexOf(bottomItem);
                this.items.splice(index, 1);
                bottomItem.destroy();
            }
        }
    },

    moveBottomItemToTop() {
      let offset = (this.prefabHeight + this.spacing) * this.items.length;
      let length = this.items.length;
      let item = this.getItemAtBottom();
      // whether need to move to top
      if(item.y + offset < 0) {
        item.y = item.y + offset;
        let itemComp = item.getComponent(this.nameOfItem);
        let itemId = itemComp.getIndex() - length;
        let newInfo = this.theData[itemId];
        itemComp.setInfo(newInfo);
        return null;
      }
      return item;
    },

    getPositionInView(item) {
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },

    getItemAtBottom() {
        let item = this.items[0];
        for(let i = 1; i < this.items.length; i++) {
            if(item.y > this.items[i].y) {
                item = this.items[i];
            }
        }
        return item;
    },

    update(dt) {
        this.updateTimer += dt;
        this.updateTimer = 0;
        let items = this.items;
        let buffer = this.bufferZone;
        let isDown = this.content.y < this.lastContentPosY;
        let offset = (this.prefabHeight + this.spacing) * items.length;
        for(let i = 0; i < items.length; i++) {
            let viewPos = this.getPositionInView(items[i]);
            if(isDown) {
                // if away from buffer zone and not reaching top of content
                if(viewPos.y < -buffer && items[i].y + offset < 0) {
                    items[i].y = items[i].y + offset;
                    let item = items[i].getComponent(this.nameOfItem);
                    let itemId = item.getIndex() - items.length;
                    let newInfo = this.theData[itemId];
                    item.updateItem(newInfo);
                }
            } else {
                // if away from buffer zone and not reaching bottom of content
                if (viewPos.y > buffer && items[i].y - offset > -this.content.height) {
                    items[i].y = items[i].y - offset;
                    let item = items[i].getComponent(this.nameOfItem);
                    let itemId = item.getIndex() + items.length;
                    let newInfo = this.theData[itemId];
                    item.updateItem(newInfo);
                }
            }
        }
        // update lastContentPosY
        this.lastContentPosY = this.scrollView.content.y;
    }
});
module.exports = ListViewCtrl;