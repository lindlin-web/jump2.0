let mPrefabCaches = {};
let mSpFrameCaches = {};
let mSpineDataCaches = {};
let mShowMsgCenter = null;
let mShowMsgTip = null;
let mCDatas;
var mSpriteAtlasCaches = {};
var mAudioClipCaches = {};
// var autoLabelAlignPrefix = [
//     "img/jpzmg/vip/",
// ];


var gFuncs = window.gFuncs = {
    str_repeat(i, m) {
        let o;
        for (o = []; m > 0; o[--m] = i);
        return o.join('');
    },
    format() {
        let i = 0,
            a, f = arguments[i++],
            o = [],
            m, p, c, x, s = '';
        while (f) {
            if (m = /^[^\x25]+/.exec(f)) {
                o.push(m[0]);
            } else if (m = /^\x25{2}/.exec(f)) {
                o.push('%');
            } else if (m = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(f)) {
                if (((a = arguments[m[1] || i++]) == null) || (a == undefined)) {
                    GameTool.log('Too few arguments.');
                }
                if (/[^s]/.test(m[7]) && (typeof(a) != 'number')) {
                    GameTool.log(f + ' Expecting number but found ' + typeof(a));
                }
                switch (m[7]) {
                    case 'b':
                        a = a.toString(2);
                        break;
                    case 'c':
                        a = String.fromCharCode(a);
                        break;
                    case 'd':
                        a = parseInt(a);
                        break;
                    case 'e':
                        a = m[6] ? a.toExponential(m[6]) : a.toExponential();
                        break;
                    case 'f':
                        a = m[6] ? parseFloat(a).toFixed(m[6]) : parseFloat(a);
                        break;
                    case 'o':
                        a = a.toString(8);
                        break;
                    case 's':
                        a = ((a = String(a)) && m[6] ? a.substring(0, m[6]) : a);
                        break;
                    case 'u':
                        a = Math.abs(a);
                        break;
                    case 'x':
                        a = a.toString(16);
                        break;
                    case 'X':
                        a = a.toString(16).toUpperCase();
                        break;
                }
                a = (/[def]/.test(m[7]) && m[2] && a >= 0 ? '+' + a : a);
                c = m[3] ? m[3] == '0' ? '0' : m[3].charAt(1) : ' ';
                x = m[5] - String(a).length - s.length;
                p = m[5] ? this.str_repeat(c, x) : '';
                o.push(s + (m[4] ? a + p : p + a));
            } else {
                GameTool.log('Huh ?!');
            }
            f = f.substring(m[0].length);
        }
        return o.join('');
    },

    distance(pos1, pos2) {
        if (!pos1 || !pos2) {
            return 0;
        }
        return pos1.sub(pos2).mag();
    },

    formatLocalStr() {
        let str = this.getLocalStr(arguments[0]);
        arguments[0] = str;
        return this.formatParamStr.apply(this, arguments);
    },

    // 返回格式化后的字符串, formatString("hello: {0}", "js"); formatString("hello: {0}、{1}", "js", 888);
    formatString() {
        let count = arguments.length;
        if (count == 0) return "";
        if (count == 1) return arguments[0];
        let msg = arguments[0];
        for (let i = 1; i < count; i++) {
            var reg = new RegExp("\\{" + (i - 1) + "\\}", "g");
            msg = msg.replace(reg, arguments[i]);
        }
        return msg;
    },
    formatParamStr(str, params) {
        return str && str.replace(/\{\{(\S+?)\}\}/g, function(t, key) {
            var datas = key.split(",");
            return params[key];
        }.bind(this));
    },
    replaceString() {
        let count = arguments.length;
        if (count == 0) return "";
        if (count == 1) return arguments[0];
        let msg = arguments[0];
        if (!msg) {
            return ""
        }
        for (let i = 1; i < count; i++) {
            var str = "<" + (i - 1) + ">"
            var reg = new RegExp(str, "g")
            msg = msg.replace(reg, arguments[i]);
        }
        return msg;
    },
    //打错误log
    // 输出log, 用法如: log("hello"); log("hello: {0}", "js"); log("hello: {0}、{1}", "js", 888);
    errorLog() {
        let count = arguments.length;
        if (count == 0) return;
        let msg = arguments[0];
        if (count > 1) {
            for (let i = 1; i < count; i++) {
                var reg = new RegExp("\\{" + (i - 1) + "\\}", "g");
                msg = msg.replace(reg, arguments[i]);
            }
        }
        cc.error(msg);
        // window.gSdkCenter.dealErrorLog(msg);
    },

    warnLog() {
        let count = arguments.length;
        if (count == 0) return;
        let msg = arguments[0];
        if (count > 1) {
            for (let i = 1; i < count; i++) {
                var reg = new RegExp("\\{" + (i - 1) + "\\}", "g");
                msg = msg.replace(reg, arguments[i]);
            }
        }
        cc.warn(msg);
    },

    warnAlert() {
        if (GameConfig.debugLevel < 1) {
            return;
        }
        let count = arguments.length;
        if (count == 0) return;
        let msg = arguments[0];
        if (count > 1) {
            for (let i = 1; i < count; i++) {
                var reg = new RegExp("\\{" + (i - 1) + "\\}", "g");
                msg = msg.replace(reg, arguments[i]);
            }
        }
        alert(msg);
    },
    //调试log 只有debug模式开启才会显示
    printDebug() {
        if (GameConfig.debugLevel < 1) {
            return;
        }
        let count = arguments.length;
        if (count == 0) return;
        let msg = arguments[0];
        if (count > 1) {
            for (let i = 1; i < count; i++) {
                var reg = new RegExp("\\{" + (i - 1) + "\\}", "g");
                msg = msg.replace(reg, arguments[i]);
            }
        }
        cc.log(msg, arguments[1]);
    },

    // 字节数转换显示
    formatBytesLength(bytesLength) {
        if (bytesLength < 1024) {
            return bytesLength + "Bytes";
        } else if (bytesLength < 1024 * 1024) {
            return (bytesLength / 1024).toFixed(2) + "K";
        } else if (bytesLength < 1024 * 1024 * 1024) {
            return (bytesLength / 1024 / 1024).toFixed(2) + "M";
        } else if (bytesLength < 1024 * 1024 * 1024 * 1024) {
            return (bytesLength / 1024 / 1024 / 1024).toFixed(2) + "G";
        }
        return bytesLength;
    },

    //获取字符串长度 中文算3个长度
    getStringLenth(str) {
        //判断中文的正则
        let length = str.length;
        let byteZW = this.getCNStrNum(str);
        return length + byteZW * 2;
    },

    //获取中文个数
    getCNStrNum(str) {
        let re = /[\u4E00-\u9FA5]/g;
        let byteZW = 0;
        if (re.test(str)) {
            byteZW = str.match(re).length;
        }
        return byteZW
    },

    //多出的文字 缩略显示
    getStringBreviary(txt, length) {
        length = length ? length : 10;
        var ChineseLength = 2;
        if (this.getStringLenth(txt) <= length) {
            return txt;
        }
        let str = txt;
        let subLenth = 0;
        for (let i = 0; i < str.length; i++) {
            let tempLen = 1;
            if (this.getCNStrNum(str[i]) != 0) {
                tempLen = ChineseLength;
            }
            if (subLenth + tempLen > length - ChineseLength) {
                if (GameData.LocaleProxy.localeName == "ar") {
                    str = str.substr(0, i) + '......' + GameTool.getDataString("none_1");
                    // str = str.substr(0, i) + '...';
                } else {
                    str = str.substr(0, i) + '...';
                }

                return str;
                break;
            } else {
                subLenth += tempLen;
            }
        }
        return str;
    },
    getStringBreviarySimple(txt, length) {
        length = length ? length : 10;
        var ChineseLength = 2;
        if (this.getStringLenth(txt) <= length) {
            return txt;
        }
        let str = txt;
        let subLenth = 0;
        for (let i = 0; i < str.length; i++) {
            let tempLen = 1;
            if (this.getCNStrNum(str[i]) != 0) {
                tempLen = ChineseLength;
            }
            if (subLenth + tempLen > length - ChineseLength) {
                if (GameData.LocaleProxy.localeName == "ar") {
                    str = str.substr(0, i);
                    // str = str.substr(0, i) + '...';
                } else {
                    str = str.substr(0, i);
                }

                return str;
                break;
            } else {
                subLenth += tempLen;
            }
        }
        return str;
    },
    //绑定一个方法
    handler(target, func) {
        return func.bind(target);
    },
    // 解压带密码的zip包
    unzipFilesToPathWithPassword(zipFileFullPath, unZipFullPath, isDeleteZipFile, zipPassword) {

        if (!cc.sys.isNative) {
            return;
        }
        if (unZipFullPath.charAt(unZipFullPath.length - 1) != "/" && unZipFullPath.charAt(unZipFullPath.length - 1) != "\\") {
            unZipFullPath = unZipFullPath + "\/";
        }
        // return jsb.CustomUtils.getInstance().unzipFilesToPathPassword(zipFileFullPath, unZipFullPath, isDeleteZipFile, zipPassword);
    },
    // 不解压带密码的zip包
    unzipFilesToPathWithoutPassword(zipFileFullPath, unZipFullPath, isDeleteZipFile) {

        if (!cc.sys.isNative) {
            return;
        }
        if (unZipFullPath.charAt(unZipFullPath.length - 1) != "/" && unZipFullPath.charAt(unZipFullPath.length - 1) != "\\") {
            unZipFullPath = unZipFullPath + "\/";
        }
        GameTool.log("最终路径：{0}", unZipFullPath);
        return jsb.CustomUtils.getInstance().unzipFilesToPathNoPassword(zipFileFullPath, unZipFullPath, isDeleteZipFile);
    },
    //动态创建一个预创建资源对象
    createPrefab(resurl, callback, bCache) {
        // if (mPrefabCaches[resurl] != null) {
        //     if (callback != null && callback != undefined) {
        //         if (isCachedDelay) {
        //             setTimeout(function() {
        //                 callback(mPrefabCaches[resurl]);
        //                 callback = null;
        //             }, 1);
        //         } else {
        //             callback(mPrefabCaches[resurl]);
        //             callback = null;
        //         }
        //     }
        //     return;
        // }
        // cc.resources.load(resurl, function(err, prefab) {
        //     if (err) {
        //         GameTool.error("load error" + resurl);
        //         if (callback != null && callback != undefined) {
        //             // callback(null, err);
        //             // callback = null;
        //         }
        //     }
        //     if (!prefab) {
        //         return;
        //     }
        //     if (!(prefab instanceof cc.Prefab)) {
        //         GameTool.error('load file not a Prefab');
        //         if (callback != null && callback != undefined) {
        //             callback(null, err);
        //             callback = null;
        //         }
        //         return;
        //     }
        //     if (callback != null && callback != undefined) {
        //         callback(prefab);
        //         callback = null;
        //     }
        //     mPrefabCaches[resurl] = prefab;
        // });
        LeakManager.cachePrefab(resurl, function(err, res) {
            if (err) {
                GameTool.error('load error ,' + err.message ? err.message : err.errorMessage);
                if (res != null) {
                    callback && callback(res, err);
                } else {
                    gUICtrl.hideLoadingProgress();
                }
                return;
            }
            callback && callback(res, err);
        }, bCache);
    },

    //获得一个精灵纹理
    createSpFrame(resurl, callback, isCachedDelay, isIgnorErr) {
        if (typeof resurl !== "string") {
            return;
        }
        if (resurl.indexOf("http") == 0) {
            cc.loader.load(resurl, null, function(err, texture) {
                if (err && !isIgnorErr) {
                    GameTool.error('load error ,' + err.message ? err.message : err.errorMessage);
                    callback && callback(null, err);
                    return;
                }
                if (!(texture instanceof cc.Texture2D)) {
                    GameTool.error('load file not a texture');
                    return;
                }
                var spriteFrame = new cc.SpriteFrame();
                spriteFrame.setTexture(texture);
                if (callback != null && callback != undefined) {
                    callback(spriteFrame);
                    callback = null;
                }
                // mSpFrameCaches[resurl] = spriteFrame;
            }.bind(this));
        } else if (resurl.indexOf(".plist/") != -1) {
            var resurls = resurl.split(".plist/");
            this.getSpriteAtlas(resurls[0], function(atlas) {
                var spriteFrame = atlas.getSpriteFrame(resurls[1]);
                if (callback != null && callback != undefined) {
                    callback(spriteFrame);
                    callback = null;
                }
            });
        } else {
            LeakManager.cacheSpriteFrame(resurl, function(err, res) {
                if (err && !isIgnorErr) {
                    GameTool.error('load error ,' + err.message ? err.message : err.errorMessage);
                    callback && callback(null, err);
                    return;
                }
                callback && callback(res, err);
            });
        }
    },

    getSpriteAtlas(resurl, callback, isCachedDelay, errorCb) {
        // if (mSpriteAtlasCaches[resurl]) {
        //     if (callback) {
        //         if (isCachedDelay) {
        //             setTimeout(function() {
        //                 callback(mSpriteAtlasCaches[resurl]);
        //                 callback = null;
        //             }, 1);
        //         } else {
        //             callback(mSpriteAtlasCaches[resurl]);
        //             callback = null;
        //         }
        //     }
        //     return;
        // };
        // cc.resources.load(resurl, cc.SpriteAtlas, function(err, spriteAtlas) {
        //     if (err) {
        //         GameTool.error('load error ,' + err);
        //         // this.createSpFrame("img/100838", callback);
        //         errorCb && errorCb();
        //         return;
        //     }
        //     if (!(spriteAtlas instanceof cc.SpriteAtlas)) {
        //         GameTool.error('load file not a SpriteAtlas');
        //         errorCb && errorCb();
        //         // this.createSpFrame("img/100838", callback);
        //         return;
        //     }
        //     if (callback != null && callback != undefined) {
        //         callback(spriteAtlas);
        //         callback = null;
        //     }
        //     mSpriteAtlasCaches[resurl] = spriteAtlas;
        // }.bind(this));
        LeakManager.cacheSpriteAtlas(resurl, function(err, res) {
            if (err) {
                GameTool.error('load error ,' + err.message ? err.message : err.errorMessage);
                return;
            }
            callback && callback(res, err);
        });
    },
    getAudioClip(resurl, callback, isCachedDelay, errorCb) {
        // if (mAudioClipCaches[resurl]) {
        //     if (callback) {
        //         if (isCachedDelay) {
        //             setTimeout(function() {
        //                 callback(mAudioClipCaches[resurl]);
        //                 callback = null;
        //             }, 1);
        //         } else {
        //             callback(mAudioClipCaches[resurl]);
        //             callback = null;
        //         }
        //     }
        //     return;
        // };
        cc.resources.load(resurl, cc.AudioClip, function(err, audioClip) {
            if (err) {
                GameTool.error('load error ,' + err.message ? err.message : err.errorMessage);
                // this.createSpFrame("img/100838", callback);
                errorCb && errorCb();
                return;
            }
            // if (!(audioClip instanceof cc.AudioClip)) {
            //     GameTool.error('load file not a audioClip');
            //     errorCb && errorCb();
            //     // this.createSpFrame("img/100838", callback);
            //     return;
            // }
            if (callback != null && callback != undefined) {
                callback(audioClip);
                callback = null;
            }
            // mAudioClipCaches[resurl] = audioClip;
        }.bind(this));
    },
    getAsset(resurl, callback) {
        cc.resources.load(resurl, cc.Asset, function(err, res) {
            if (err) {
                GameTool.error('load error ,' + err.message ? err.message : err.errorMessage);
                return;
            }
            LeakManager.cacheNode[gUICfgs[gUIIDs.UI_Video].res] = res;
            callback && callback(res, err);
        }.bind(this));
    },

    //创建一个item控件
    createItemIcon(itemId, callback, resname, jsname) {
        resname = resname == undefined ? "ui/Equip1" : resname;
        jsname = jsname == undefined ? "UIItemIcon" : jsname;
        this.createPrefab(resname, function(prefab, err) {
            if (prefab == null) {
                GameTool.error('load error ,' + err.message ? err.message : err.errorMessage);
                if (callback != null && callback != undefined) {
                    callback(null, err);
                    callback = null;
                }
                return;
            }
            let tempItemNode = cc.instantiate(prefab);
            let itemicon = tempItemNode.getComponent(jsname);
            if (itemId != undefined) {
                itemicon.setItemId(itemId);
            }
            if (callback != null && callback != undefined) {
                callback(tempItemNode)
                callback = null;
            }
        });
    },

    //设置一个节点的图片 itemCfg可以不传
    setImgByItemId(node, itemId, itemCfg) {
        if (!node || !itemId) {
            return;
        }
        itemCfg = itemCfg ? itemCfg : gCfgMgr.getCfgByKey(gCfgs.ITEM, itemId);
        this.setSpFrame(node, gCDatas.getImgFilePath(itemCfg["icon"]));
    },

    _setRoleSkin() {
        let roleSkin = this.roleSkins[0];
        if (roleSkin) {
            this.setRoleSkin(roleSkin[0], roleSkin[1], roleSkin[2], function(pra) {
                if (roleSkin[3]) {
                    roleSkin[3](pra);
                }
                this.roleSkins.shift();
                if (this.roleSkins.length != 0) {
                    setTimeout(function() {
                        this._setRoleSkin();
                    }.bind(this), 100);
                }
            }.bind(this), roleSkin[4], roleSkin[5], roleSkin[6]);
        }
    },

    setRoleSkinOBO(node, resname, noPlaying, callback, playName, offset, skinName) {
        if (!this.roleSkins) {
            this.roleSkins = [];
        }
        this.roleSkins.push([node, resname, noPlaying, callback, playName, offset, skinName]);
        if (this.roleSkins.length == 1) {
            setTimeout(function() {
                this._setRoleSkin();
            }.bind(this), 100);
        }
    },

    setRoleSkin(node, resname, noPlaying, callback, playName, offset, skinName) {
        if (node instanceof cc.Component) {
            node = node.node;
        }
        let sprite = node.getComponent(cc.Sprite);
        if (sprite) {
            sprite.spriteFrame = null;
        }
        var alignComponent = node.getComponent("LabelLocaleAlign");
        if (!alignComponent) {
            alignComponent = node.addComponent("LabelLocaleAlign");
        }
        let animateBase = null;
        let skeleton = null;
        let skNode = node.getChildByName("sk_9999");
        if (!skNode) {
            skNode = new cc.Node();
            animateBase = skNode.addComponent("AnimateBase");
            skeleton = skNode.addComponent(sp.Skeleton);
            skeleton.premultipliedAlpha = false;
            skeleton.loop = true;
            animateBase.setSpine(skeleton);
            skNode.parent = node;
            skNode.name = "sk_9999";
        }
        skNode.active = true;
        skNode.opacity = node.opacity;
        skNode.zIndex = -1;
        offset = offset != null ? offset : -350;
        skNode.setPosition(0, offset);
        // skNode.setScale();
        animateBase = skNode.getComponent("AnimateBase");
        if (animateBase.getResName() == resname) {
            callback && callback(animateBase);
            callback = null;
            if (skinName) {
                animateBase.setSkin(skinName);
            }
        } else {
            animateBase.setResName(resname);
            this.preloadSpine(resname, function(skeletonData, err) {
                if (err) {
                    GameTool.error("load error , " + err);
                    if (callback != null && callback != undefined) {
                        callback(animateBase);
                        callback = null;
                    }
                    return;
                }
                if (!cc.isValid(skNode)) {
                    return;
                }
                if (animateBase.setSpineSkeletonData(skeletonData, resname)) {
                    if (!noPlaying) {
                        var aniName = playName || "stand";
                        animateBase.play(aniName);
                    }
                    if (skinName) {
                        animateBase.setSkin(skinName);
                    }
                }
                if (callback != null && callback != undefined) {
                    callback(animateBase);
                    callback = null;
                }
            }.bind(this));
        }
        return skNode;
    },
    //创建一个spine动画
    createAnimateForSpine(resname, callback, isCachedDelay) {
        let tempNode = new cc.Node();
        let animateBase = tempNode.addComponent("AnimateBase");
        let skeleton = tempNode.addComponent(sp.Skeleton);
        skeleton.premultipliedAlpha = false;
        skeleton.loop = true;
        animateBase.setSpine(skeleton);
        if (!resname) {
            return tempNode;
        }
        animateBase.setResName(resname);
        this.preloadSpine(resname, function(skeletonData, err) {
            if (err) {
                GameTool.error("load error , " + err);
                if (callback != null && callback != undefined) {
                    callback(animateBase);
                    callback = null;
                }
                return;
            }
            if (!cc.isValid(tempNode)) {
                return;
            }
            animateBase.setSpineSkeletonData(skeletonData, resname);
            if (callback != null && callback != undefined) {
                callback(animateBase);
                callback = null;
            }
        }.bind(this), isCachedDelay);
        return tempNode;
    },

    //创建一个精灵
    createSprite(resname, callback) {
        let tempNode = new cc.Node();
        let sp = tempNode.addComponent(cc.Sprite);
        this.setSpFrame(sp, resname, callback);
        return tempNode;
    },

    //预加载一个spine的data
    preloadSpine(resname, callback, isCachedDelay) {
        LeakManager.cacheSkeleton(resname, function(err, res) {
            callback && callback(res, err);
        });

        // if (mSpineDataCaches[resname]) {
        //     if (callback) {
        //         if (isCachedDelay) {
        //             setTimeout(function() {
        //                 callback(mSpineDataCaches[resname]);
        //                 callback = null;
        //             }, 1);
        //         } else {
        //             GameTool.log("resname = {0}", resname);
        //             callback(mSpineDataCaches[resname]);
        //             callback = null;
        //         }
        //     }
        //     return;
        // }
        // cc.resources.load(resname, sp.SkeletonData, function(err, skeletonData) {
        //     if (err) {
        //         GameTool.error("load error , " + err);
        //         if (callback) {
        //             callback(null, err);
        //             callback = null;
        //         }
        //         return;
        //     }
        //     mSpineDataCaches[resname] = skeletonData;
        //     if (callback) {
        //         GameTool.log("load resname = " + resname);
        //         callback(skeletonData);
        //         callback = null;
        //     }
        // }.bind(this));
    },

    //替换一张图片的纹理
    setSpFrame(sprite, resurl, callback, notEmpty) {
        if (typeof resurl !== "string") {
            return;
        }
        if (resurl == "") {
            GameTool.warn("resurl = ");
            return;
        }
        if (!resurl) {
            GameTool.error("resurl = undefine");
            return;
        }
        if (sprite == null) {
            if (callback) {
                callback(false);
                callback = null;
            }
            return;
        }
        if (!(sprite instanceof cc.Sprite)) {
            let tmpSp = sprite.getComponent(cc.Sprite);
            if (tmpSp == null) {
                sprite = sprite.addComponent(cc.Sprite);
                sprite.sizeMode = 0;
            } else {
                sprite = tmpSp;
            }
        }
        if (sprite.realurl == resurl && sprite.spriteFrame != null) {
            if (callback) {
                callback(sprite.spriteFrame);
                callback = null;
            }
            return;
        }
        var width = sprite.node.___width = sprite.node.___width || sprite.node.width;
        var height = sprite.node.___height = sprite.node.___height || sprite.node.height;
        var sizeMode = sprite.sizeMode;
        var type = sprite.type;
        var trim = sprite.trim;
        sprite.realurl = resurl;
        if (!notEmpty) {
            sprite.spriteFrame = null;
        }
        var alignComponent = sprite.node.getComponent("LabelLocaleAlign");
        if (!alignComponent) {
            alignComponent = sprite.node.addComponent("LabelLocaleAlign");
        }
        let func = function(sizeMode, trim, type, width, height, spriteFrame, err) {
            if (!cc.isValid(sprite.node)) {
                return;
            }
            if (sprite.spriteFrame != spriteFrame && sprite.realurl == resurl) {
                sprite.spriteFrame = spriteFrame;
            }

            function checkWidth() {
                if (sizeMode == 0 && (sprite.node.width != width || sprite.node.height != height)) {
                    sprite.sizeMode = sizeMode;
                    sprite.trim = trim;
                    sprite.type = type;
                    sprite.node.width = width;
                    sprite.node.height = height;
                    sprite.scheduleOnce(checkWidth, 1 / 60);
                }
            }
            // checkWidth();
            if (callback) {
                callback(spriteFrame);
                callback = null;
            }
        };
        if (!this.mTIdx) {
            this.mTIdx = 0;
        }
        if (cc.sys.isNative) {
            setTimeout(function() {
                // this.mTIdx--;
                this.createSpFrame(resurl, func.bind(this, sizeMode, trim, type, width, height));
            }.bind(this), 100);
            // this.mTIdx++;
        } else {
            this.createSpFrame(resurl, func.bind(this, sizeMode, trim, type, width, height));
        }
    },

    setSpFrameAndShine(sprite, resurl, maskurl, callback) {
        if (!cc.sys.capabilities.opengl || sprite == null) {
            if (callback) {
                callback(false);
                callback = null;
            }
            return;
        }
        if (!(sprite instanceof cc.Sprite)) {
            sprite = sprite.getComponent(cc.Sprite);
            if (sprite == null) {
                if (callback) {
                    callback(false);
                    callback = null;
                }
                return;
            }
        }
        this.setSpFrame(sprite, resurl, function() {
            this.createSpFrame(maskurl, function(spriteFrame, err) {
                if (!cc.isValid(sprite.node)) {
                    return;
                }
                if (callback) {
                    callback(true);
                    callback = null;
                }
                //移除旧的闪光图片
                let oldShineNode = sprite.node.getChildByName("shineNode");
                if (oldShineNode) {
                    oldShineNode.removeFromParent(true);
                }
                let newShineNode = cc.instantiate(sprite.node);
                let flashJs = newShineNode.addComponent("ShaderFlash");
                flashJs.maskFrame = spriteFrame;
                flashJs.shineSpeed = 1.25;
                newShineNode.x = 0;
                newShineNode.y = 0;
                newShineNode.setName("shineNode");
                newShineNode.parent = sprite.node;
            }.bind(this));
        }.bind(this));
    },

    //替换按钮的一个状态图片
    setBtnSpFrame(btn, resurl, stateName, callback) {
        if (btn == null) {
            if (callback) {
                callback(false);
                callback = null;
            }
            return;
        }
        if (!(btn instanceof cc.Button)) {
            btn = btn.getComponent(cc.Button);
            if (btn == null) {
                if (callback) {
                    callback(false);
                    callback = null;
                }
                return;
            }
        }
        this.createSpFrame(resurl, function(spriteFrame, err) {
            if (!cc.isValid(btn.node) || !btn[stateName]) {
                return;
            }
            btn[stateName].spriteFrame = spriteFrame;
            if (callback) {
                callback(true);
                callback = null;
            }
        });
    },
    //精灵设置为灰色
    setSpriteGray(target, isGray, isTouch) {
        var spriteCom = target.getComponent(cc.Sprite);
        if (spriteCom) {
            if (spriteCom.isGray == isGray || (!isGray && spriteCom.isGray == undefined)) {
                return;
            }
            var material = cc.MaterialVariant.createWithBuiltin(isGray ? "2d-gray-sprite" : "2d-sprite", spriteCom.node);
            spriteCom.setMaterial(0, material);
            spriteCom.isGray = isGray;
        }
        var btnCom = target.getComponent(cc.Button);
        if (btnCom && !isTouch) {
            btnCom.enableAutoGrayEffect = true;
            btnCom.interactable = !isGray;
        }
        // 给子对象操作
        var node = target instanceof cc.Component ? target.node : target;
        if (!node) {
            return;
        }
        for (var i = 0, len = node.childrenCount; i < len; ++i) {
            var child = node.children[i];
            this.setSpriteGray(child, isGray);
        }
    },

    /**设置一个道具（芝麻官） */
    setItem(parentNode, ID, itemNum, noFormat, noNumber, noGray, useClickEffect, showEffect, addDetail) {
        if (!parentNode) {
            GameTool.error("paretnNode = null");
            return null;
        }
        let node = parentNode.getChildByName("ZMItemBox999");
        if (!node) {
            node = cc.instantiate(LeakManager.getCacheNode("ui/jpzmg/ZMItemBox"));
            node.parent = parentNode;
            node.name = "ZMItemBox999";
        }

        var itemJS = node.getComponent("ZMItemBox");
        itemJS.setItem(ID, itemNum, noFormat, noNumber, noGray, useClickEffect, showEffect, addDetail);
        return node;
    },

    //创建一个Ani动画播放
    //skeletonData可以为路径也可以为sp.SkeletonData callback为播放结束回调
    //callback开始为可选参数
    createSpineAni(skeletonData, showName, callback, loop, loopCount) {
        let openSpineAniView = function(tSkeletonData) {
            window.gUICtrl.openUI(window.gUIIDs.UI_SPINEANIVIEW, null, {
                "skeleton_data": tSkeletonData,
                "callback": callback,
                "show_name": showName,
                "loop": loop,
                "loop_count": loopCount
            });
        }
        if (!(skeletonData instanceof sp.SkeletonData)) {
            this.preloadSpine(resname, function(tskeletonData, err) {
                if (err) {
                    GameTool.error("load error , " + err);
                    if (callback) {
                        callback(null);
                    }
                    return;
                }
                openSpineAniView(tskeletonData);
            }.bind(this), false);
        } else {
            openSpineAniView(skeletonData);
        }
    },

    //获取一个数据
    getDataByValues(dataObject, values) {
        for (let v in dataObject) {
            if (dataObject.hasOwnProperty(v)) {
                let object = dataObject[v];
                let isAllRight = true;
                for (let v2 in values) {
                    if (values.hasOwnProperty(v2)) {
                        let value = values[v2];
                        let objectValue = object[v2];
                        if (objectValue == undefined) {
                            GameTool.error("key = {0} not the attribute ======================", v2);
                            return null;
                        }
                        if (value != object[v2]) {
                            isAllRight = false;
                            break;
                        }
                    }
                }
                if (isAllRight) {
                    return object;
                }
            }
        }
        return null;
    },

    getListDataByValues(dataObject, values) {
        let tempLists = []
        for (let v in dataObject) {
            if (dataObject.hasOwnProperty(v)) {
                let object = dataObject[v];
                let isAllRight = true;
                for (let v2 in values) {
                    if (values.hasOwnProperty(v2)) {
                        let value = values[v2];
                        let objectValue = object[v2];
                        if (objectValue == undefined) {
                            GameTool.error("key = {0} not the attribute for {1} ======================", v2, cfg.cfgName);
                            return tempLists;
                        }
                        if (value != object[v2]) {
                            isAllRight = false;
                            break;
                        }
                    }
                }
                if (isAllRight) {
                    tempLists.push(object);
                }
            }
        }
        return tempLists;
    },


    //发送消息的弹窗
    alertCmd(msg, cmdObj, sureHandler, cancelHandler, uiid, isShowToggle) {
        let openUiid = gUIIDs.UI_ALERT
        if (uiid) {
            openUiid = uiid;
        }
        gUICtrl.openUI(openUiid, function(prefab) {
            let alert = prefab.getComponent("UIAlertLayer");
            alert.setMsg(msg);
            alert.setSureCmd(cmdObj);
            alert.setIsShowToggle(isShowToggle);
            alert.setHandler(sureHandler, cancelHandler);
        })
    },
    //vip弹窗
    alertVip(msg, uiid) {
        let openUiid = gUIIDs.UI_ALERT
        if (uiid) {
            openUiid = uiid;
        }
        gUICtrl.openUI(openUiid, function(prefab) {
            let alert = prefab.getComponent("UIAlertLayer");
            alert.setMsg(msg);
            alert.setBtnTxt();
            alert.setHandler(function() {
                window.gUICtrl.openUI(window.gUIIDs.UI_VIP, null, {
                    "type": 1,
                });
            }, function() {});

        })
    },
    //带材料的弹窗
    alertWithMaterial(msg, num, itemId, sureHandler, cancelHandler, sureText, cancelText, uiid) {
        let openUiid = gUIIDs.UI_ALERT;
        if (uiid) {
            openUiid = uiid;
        }
        gUICtrl.openUI(openUiid, function(prefab) {
            let alert = prefab.getComponent("UIAlertLayer");
            alert.setMsg(msg);
            alert.setMaterail(itemId, num);
            alert.setHandler(sureHandler, cancelHandler, sureText, cancelText);
        });
    },


    //货币检查通用接口 needToken:需要的代币数量 ntType:需要的代币类型
    checkItem(itemId, needNum) {
        if (!itemId) {
            return true;
        }
        if (!mCDatas) {
            mCDatas = window.gCDatas;
        }
        let haveNum = mCDatas.getItemNum(itemId)[0];
        if (haveNum >= needNum) {
            return true;
        } else {
            if (itemId == gE.NTITEMID.DIAMOND) {
                let msg = this.getLocalStr("c_DQZSBZ");
                this.alertVip(msg)
            } else {
                gUICtrl.openUI(gUIIDs.UI_ITEMGET, null, {
                    "item_id": itemId,
                    "item_num": needNum - haveNum,
                });
            }
            return false;
        }
    },

    getGroupUrlByTgGid(tgGid) {
        let md5 = gFuncs.md5String(tgGid+"");
        let url = "https://image.googlescdn.com/" + md5;
        return url;
    },

    getAvatarUrlByTgid(tgid) {
        let md5 = gFuncs.md5String(tgid+"");
        let url = "https://image.googlescdn.com/" + md5;
        return url;
    },

    md5String(str) {
        return MD5(str);
    },

    //数字大于10万用？万代替
    setReplaceNum(value, symbol) {
        value = value ? value : 0;
        symbol = symbol ? symbol : "";
        if (value >= 100000000 || value <= -100000000) {
            return symbol + this.formatLocalStr("TIP_CYYY", value / 100000000);
        } else if (value >= 100000 || value <= -100000) {
            return symbol + this.formatLocalStr("TIP_WDW", value / 10000);
        }
        return symbol + value;
    },

    setReplaceNumWang(value, symbol) {
        value = value ? value : 0;
        symbol = symbol ? symbol : "";
        if (value >= 1000000000 || value <= -1000000000) {
            return symbol + this.formatLocalStr("TIP_CYYY", value / 100000000);
        } else if (value >= 100000 || value <= -100000) {
            return symbol + this.formatLocalStr("TIP_WDW", value / 10000);
        } else if (value >= 10000 || value <= -10000) {
            return symbol + this.formatLocalStr("TIP_WDW", value / 10000);
        }
        return symbol + value;
    },

    //排序 0和不传是升序 1是降序
    sortListByKey(list, keyName, orderType) {
        list.sort(function(a, b) {
            if (orderType != 1) {
                return a[keyName] - b[keyName];
            } else {
                return b[keyName] - a[keyName];
            }
        });
    },

    //排序服务端数据
    sortPBListByFunc(list, funcName, orderType) {
        list.sort(function(a, b) {
            if (orderType != 1) {
                return a[funcName]() - b[funcName]();
            } else {
                return b[funcName]() - a[funcName]();
            }
        });
    },

    getLocalStr(strDataID, isFromCfg) {
        if (!isFromCfg) {
            let localizedString = LanguageData.t("data." + strDataID);
            if (localizedString || localizedString == "") {
                return localizedString;
            }
        }
        return strDataID;
    },

    getErrorStr(strDataID) {
        let localizedString = LanguageData.t("error." + strDataID);
        if (localizedString) {
            return localizedString;
        }
        return strDataID;
    },

    getMD5(filepath) {
        if (cc.sys.isNative) {
            let data = jsb.fileUtils.getDataFromFile(filepath);
            let curMD5 = MD5(data);
            return curMD5;
        } else {
            GameTool.error("只有原声平台支持md5计算");
            return "";
        }
    },

    md5String(str) {
        return MD5(str);
    },

    //保留小数点几位
    getPreciseDecimal(nNum, n) {
        if (typeof(nNum) != 'number') {
            return nNum;
        }

        n = n || 0;
        n = Math.floor(n);
        if (n == 0) {
            nNum = Math.floor(nNum);
        }

        let fmt = '%.' + n + 'f';

        let nRet = parseInt(this.format(fmt, nNum));
        return nRet
    },

    //获取一个缩略时间
    getLessTimeString(second) {
        if (second) {
            let sevenDay = this.getPreciseDecimal(second / (3600 * 24 * 7));
            if (sevenDay > 0) {
                return [sevenDay, 4]
            } else {
                let day = this.getPreciseDecimal(second / (3600 * 24));
                if (day > 0) {
                    return [day, 3]
                } else {
                    let hour = this.getPreciseDecimal(second / (3600));
                    if (hour > 0) {
                        return [hour, 2]
                    } else {
                        let min = this.getPreciseDecimal(second / 60);
                        if (min > 0) {
                            return [min, 1]
                        } else {
                            if (second > 0) {
                                return [second, 0]
                            }
                        }
                    }
                }
            }
        }
    },

    //字符串多语言转换
    getReplaceStr(headStr, parmsList) {
        let realHeadStr = window.gCfgMgr.getLanCfgStr(headStr);
        let strList = [realHeadStr];
        for (var i = 0; i < parmsList.length; i++) {
            let param = parmsList[i];
            let paramStr = "";
            if (param.getParamType() == 0) {
                paramStr = param.getParamValue();
            } else {
                paramStr = window.gCfgMgr.getLanCfgStr(param.getParamValue());
            }
            strList.push(paramStr);
        }
        let replaceStr = this.formatString.apply(this, strList);
        return replaceStr;
    },

    //获得时间转换
    getTimeStr(time, isNeedDay, isTz) {
        //向上取整
        time = Math.floor(time + 0.999999);
        //秒数
        let s = time % 60;
        let m = Math.floor(time / 60) % 60;
        let h = isNeedDay ? Math.floor(time / (60 * 60)) % 24 : Math.floor(time / (60 * 60));
        let d = Math.floor(time / 60 * 60 * 24);

        let timeStr = this.format("%02d:%02d:%02d", h, m, s);
        if (isNeedDay) {
            return [timeStr, d];
        } else {
            if (isTz) {
                return [timeStr, h, m, s];
            } else {
                return timeStr;
            }
        }
    },

    //获得合适的时间
    getPassedTime(time) {
        let timestamp = new Date().getTime();
        let passTime = (timestamp / 1000 - time);
        if (passTime > 24 * 60 * 60) {
            return this.formatLocalStr("c_YJSJ4", Math.floor(passTime / (24 * 60 * 60)));
        } else if (passTime > 60 * 60) {
            return this.formatLocalStr("c_YJSJ3", Math.floor(passTime / (60 * 60)));
        } else if (passTime > 60) {
            return this.formatLocalStr("c_YJSJ2", Math.floor(passTime / (60)));
        } else {
            return this.formatLocalStr("c_YJSJ1", Math.floor(passTime / (60)));
        }
    },

    //设置材料文本
    setMetrialNums(richLb, curNum, needNum, isOutline) {
        if (richLb == null) {
            return;
        }
        if (!(richLb instanceof cc.RichText)) {
            richLb = richLb.getComponent(cc.RichText);
            if (richLb == null) {
                return;
            }
        }
        if (isOutline) {
            let color = (curNum >= needNum) ? "53fc00" : "ff4343";
            let outlinecolor = (curNum >= needNum) ? "3a5740" : "573232";
            richLb.string = this.format("<outline color=#%s width=4><color=%s>%d/%d</c></outline>", outlinecolor, color, curNum, needNum);
        } else {
            let color = (curNum >= needNum) ? "53fc00" : "ff4343";
            let outlinecolor = (curNum >= needNum) ? "3a5740" : "573232";
            // richLb.string = this.format("<color=%s>%d</c><color=#62554e>/%d</color>", color, curNum, needNum);
            richLb.string = this.format("<outline color=#%s width=4><color=%s>%d/%d</c></outline>", outlinecolor, color, curNum, needNum);
        }
        return curNum >= needNum;
    },

    //设置材料文本
    setMetrialNums2(label, curNum, needNum, isOutline, maxNum, localStr) {
        if (label == null) {
            return;
        }
        if (!(label instanceof cc.Label)) {
            label = label.getComponent(cc.Label);
            if (label == null) {
                return;
            }
        }
        let color = (curNum >= needNum) ? "53FC00" : "ff4343";
        let outlinecolor = (curNum >= needNum) ? "3A5740" : "573232";
        let laterNum = maxNum ? maxNum : needNum;
        if (localStr) {
            label.string = this.formatLocalStr(localStr, curNum, laterNum);
        } else {
            label.string = this.format("%d/%d", curNum, laterNum);
        }
        label.node.color = new cc.Color().fromHEX(color);
        let outLine = label.node.getComponent(cc.LabelOutline);
        if (outLine && isOutline) {
            outLine.color = new cc.Color().fromHEX(outlinecolor);
        }

        return curNum >= needNum;
    },

    //获得一串guid
    createGUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    getPrefabByName(resname) {
        // return mPrefabCaches[resname];
        return LeakManager.getCacheNode(resname);
    },

    //内存释放
    //设置为自动释放
    setAutoRelease(obj, isAutoRelease) {
        if (!obj) {
            return;
        }
        obj.mIsAutoRelease = isAutoRelease;
    },

    //引用计数管理
    retainObj(obj, number) {
        if (!obj) {
            return;
        }
        number = number == undefined ? 1 : number;
        if (obj.mRetainCount == undefined || obj.mRetainCount == null) {
            obj.mRetainCount = 0;
        }
        obj.mRetainCount += number;
    },

    releaseObj(obj, number) {
        if (!obj) {
            return;
        }
        number = number == undefined ? 1 : number;
        if (obj.mRetainCount == undefined || obj.mRetainCount == null) {
            obj.mRetainCount = 0;
        }
        obj.mRetainCount -= number;

        //释放掉
        if (obj.mRetainCount <= 0 && obj.mIsAutoRelease) {
            setTimeout(function() {
                //释放动画的缓存
                if (obj instanceof cc.SkeletonData) {
                    this.releaseSpineCache(obj);
                }
            }.bind(this), 100);
        }
    },

    //释放精灵动作内存
    releaseSpineCache(obj) {
        for (let key in mSpineDataCaches) {
            if (mSpineDataCaches.hasOwnProperty(key)) {
                let skeletonData = mSpineDataCaches[key];
                if (obj == skeletonData) {
                    let deps = cc.loader.getDependsRecursively(key);
                    cc.loader.release(skeletonData);
                    cc.loader.release(deps);
                    delete mSpineDataCaches[key];
                    break;
                }
            }
        }
    },


    clearUnUseSpineCache() {
        setTimeout(function() {
            for (let key in mSpineDataCaches) {
                if (mSpineDataCaches.hasOwnProperty(key)) {
                    let skeletonData = mSpineDataCaches[key];
                    if (!skeletonData.mRetainCount) {
                        let deps = cc.loader.getDependsRecursively(key);
                        cc.loader.release(skeletonData);
                        cc.loader.release(deps);
                        delete mSpineDataCaches[key];
                    }
                }
            }
            setTimeout(function() {
                cc.sys.garbageCollect();
            }.bind(this), 1000);
        }.bind(this), 100);
    },

    //释放所有动态加载的预制缓存
    clearAllPrefabs() {
        for (let key in mPrefabCaches) {
            if (mPrefabCaches.hasOwnProperty(key)) {
                let deps = cc.loader.getDependsRecursively(key);
                cc.loader.release(mPrefabCaches[key]);
                cc.loader.release(deps);
            }
        }
        mPrefabCaches = {};
        cc.sys.garbageCollect();
    },

    //释放所以动态加载的图片
    clearAllSpFrames() {
        for (let key in mSpFrameCaches) {
            if (mSpFrameCaches.hasOwnProperty(key)) {
                let deps = cc.loader.getDependsRecursively(key);
                cc.loader.release(mSpFrameCaches[key]);
                cc.loader.release(deps);
            }
        }
        mSpFrameCaches = {};
        cc.sys.garbageCollect();
    },

    deepCopy: function(obj) {
        var str, newobj = obj.constructor === Array ? [] : {};
        if (typeof obj !== 'object') {
            return;
        } else if (window.JSON) {
            str = JSON.stringify(obj), //系列化对象
                newobj = JSON.parse(str); //还原
        } else {
            for (var i in obj) {
                newobj[i] = typeof obj[i] === 'object' ?
                    this(obj[i]) : obj[i];
            }
        }

        return newobj;
    },

    /**
     * 产生随机整数，包含下限值，但不包括上限值
     * @param {Number} lower 下限
     * @param {Number} upper 上限
     * @return {Number} 返回在下限到上限之间的一个随机整数
     */
    random: function(lower, upper) {
        return Math.floor(Math.random() * (upper - lower)) + lower;
    },
    /**
     * 若value处于min、max之间返回value，若小于min返回min，若大于max返回max
     * @param {Number} value 比较值
     * @param {Number} min 下限，为null则无下限
     * @param {Number} max 上限，为null则无上限
     */
    clamp: function(value, min, max) {
        if (min != null && value < min) {
            return min;
        }
        if (max != null && value > max) {
            return max;
        }
        return value;
    },


    //获取url参数
    getQueryString(name) {
        if (!window.location || !window.location.search) {
            return null;
        }
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    },

}
gFuncs;
