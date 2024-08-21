
var DebugLevel = window.DebugLevel = {
    Log: 1,
    Info: 2,
    Warn: 4,
    Error: 8,
};


var TsubasaConsoleLog = function(value, level) {
    if (!GameTool.debugMode) {
        return;
    }
    switch (level) {
        case DebugLevel.Error:
            cc.error.apply(cc.error, value);
            // console.log.apply(console.log, value);
            break;
        case DebugLevel.Info:
            cc.log.apply(cc.log, value);
            break;
        case DebugLevel.Warn:
            cc.log.apply(cc.warn, value);
            break;
        case DebugLevel.Log:
            cc.log.apply(cc.log, value);
            break;
    }
};
var GameTool = window.GameTool = {
    debugLevel: DebugLevel.Log | DebugLevel.Info | DebugLevel.Warn | DebugLevel.Error,
    debugMode: CC_DEBUG,
    ip:"",
    log: function() {
        // if (!this.debugMode) {
        //     return;
        // }
        // if (!(this.debugLevel & DebugLevel.Log)) {
        //     return;
        // }
        // var value = this.debug.apply(this, arguments);
        // if (value) {
        //     TsubasaConsoleLog(value, DebugLevel.Log);
        // }
    },
    setIp(ip)
    {
        this.ip = ip;
    },

    getIp()
    {
        return this.ip;
    },

    info: function() {
        if (!this.debugMode) {
            return;
        }
        if (!(this.debugLevel & DebugLevel.Info)) {
            return;
        }
        var value = this.debug.apply(this, arguments);
        if (value) {
            TsubasaConsoleLog(value, DebugLevel.Info);
        }
    },
    warn: function() {
        if (!this.debugMode) {
            return;
        }
        if (!(this.debugLevel & DebugLevel.Warn)) {
            return;
        }
        var value = this.debug.apply(this, arguments);
        if (value) {
            TsubasaConsoleLog(value, DebugLevel.Warn);
        }
    },

    // let textTemplate = "这是一个占位符示例：{name}，今年{age}岁。";
 
    // // 定义一个对象，包含要替换的键值对
    // let replacementData = {
    //     name: "小明",
    //     age: 18
    // };
    /** setting a function to replace Data */
    replacePlaceHolders: function(template, data) {
        return template.replace(/\{([^\}]+)\}/g, function(match, key) {
            return typeof data[key] !== 'undefined' ? data[key] : match;
        });
    },

    
    error: function() {
        if (!this.debugMode) {
            return;
        }
        if (!(this.debugLevel & DebugLevel.Error)) {
            return;
        }
        var value = this.debug.apply(this, arguments);
        if (value) {
            TsubasaConsoleLog(value, DebugLevel.Error);
        }
    },

    //弹窗
    showAlert(content, confirmHandler, cancelHandler, buttonType, subcontent, confirmText, cancelText, horizontalAlign, notCloseSelf, titleStr) {
        gUICtrl.openUI(gUIIDs.UI_Alert, null, {
            content: content,
            confirmHandler: confirmHandler,
            cancelHandler: cancelHandler,
            buttonType: buttonType == null ? AlertButtonType.CONFIRM : buttonType,
            confirmText: confirmText,
            cancelText: cancelText,
            horizontalAlign: horizontalAlign,
            subcontent: subcontent,
            notClose: notCloseSelf,
            titleStr: titleStr,
        })
    },

    /** 获得一个无穷大的标志 */
    getInfinite: function() {
        return "∞";
    },

    getset: function(isStatic, o, name, getfn, setfn) {
        setfn = setfn || function() {};
        if (getfn && setfn)
            Object.defineProperty(o, name, {
                get: getfn,
                set: setfn,
                enumerable: false,
                configurable: true
            });
        else {
            getfn && Object.defineProperty(o, name, {
                get: getfn,
                enumerable: false,
                configurable: true
            });
            setfn && Object.defineProperty(o, name, {
                set: setfn,
                enumerable: false,
                configurable: true
            });
        }
    },

    /** 把number转换成string */
    convertNumberToString: function(strNum) {
        let arr = ["K", "M", "B", "T", "Q"];
        let keepNum = 5;
        strNum = strNum.toString();
        let len = strNum.length;
        let result = "";
        if(len > 6) {
            let leftNum = len - keepNum;
            let realNum = Math.ceil(leftNum / 3);
            let zhengshuNum = len - realNum * 3;
            for(var i = 0; i < zhengshuNum; i++) {
                let ch = strNum.slice(i,i+1);
                result += ch;
            }
            let begin = i;
            if(result.length < 5) {
                let leftleft = 5 - result.length;
                result += ".";
                for(let i = 0; i < leftleft; i++) {
                    let ch = strNum.slice(begin, begin+1);
                    result += ch;
                    begin += 1;
                }
            }
            let tail = arr[realNum-1];
            result += tail;
        } else {
            result = strNum;
        }
        return result;
    },

    parseURL: function(str) {
        var urlObj = {
            url: "",
            params: {}
        };
        if (typeof str === "string") {
            var urlObjParams = urlObj.params;
            var decode = decodeURIComponent(str);
            var parts = decode.split("?")
            var paramsPart;
            if (parts.length > 1) {
                urlObj.url = parts[0];
                paramsPart = parts.slice(1).join("");
            } else {
                paramsPart = parts[0];
            }
            var paramArr = paramsPart.split("&");
            for (var i = 0; i < paramArr.length; i++) {
                var tmp = paramArr[i].split("=");
                var key = tmp[0];
                var value = tmp[1] || true;

                if (typeof urlObjParams[key] === "undefined") {
                    urlObjParams[key] = value;
                } else {
                    var newValue = urlObjParams[key] + "," + value; // 有多个重复的先连接字符串,然后才分割开
                    urlObjParams[key] = newValue.split(",");
                }
            }
        }
        return urlObj;
    },

    getDataString:function(str) {
        return "";
    },

    /** 复制一份bottomNode */
    copyBottomNode:function(uiid,theParent) {
        // let wrapper = cc.director.getScene().getChildByName("Canvas").getChildByName("wrapper");
        // let homePage = wrapper.getChildByName("home_page");
        // let bottom = homePage.getChildByName("bottom");

        let mainHome = cc.director.getScene().getChildByName("Canvas").getComponent("ZMMainHome");
        if(!mainHome) {
            return;
        }

        let resurl = "ui/jpzmg/bottom";
        let panels = mainHome.getPanelsNode();
        console.log(panels, "===========panels");

        let nameOfPrefab = resurl.substring(resurl.lastIndexOf("/")+1);

        let prefab = panels.getChildByName(nameOfPrefab);
        prefab.active = true;
        let bottom = cc.instantiate(prefab);
        GameTool.addBottomToWrapper(uiid,bottom,theParent);

        // gFuncs.createPrefab("ui/jpzmg/bottom",function(prefab, err){
        //     let bottom = cc.instantiate(prefab);
        //     GameTool.addBottomToWrapper(uiid,bottom,theParent);
        // })
    },

    addBottomToWrapper(uiid,bottom,theParent) {
        let wrapper = theParent;
        wrapper.addChild(bottom);
        bottom.getComponent("ZMBottom").setCurrent(uiid);
    },

    getErrorString: function(key, params, defaultStr) {
        return "";
    },

    showBottom:function() {
        let canvas = cc.director.getScene().getChildByName("Canvas");
        let homeScript = canvas.getComponent("ZMMainHome");
        homeScript.showBottom();
    },

    hideBottom:function() {
        let canvas = cc.director.getScene().getChildByName("Canvas");
        let homeScript = canvas.getComponent("ZMMainHome");
        homeScript.hideBottom();
    },

    isChineseChar:function(char) {
        return /[\u4e00-\u9fff]/.test(char);
    },

    /** 转换用户名字，10个字符 */
    convertUserName10: function(name) {
        let result = 0;
        let index = 0;
        for(let i = 0; i < name.length; i++) {
            let ch = name[i];
            let bo = this.isChineseChar(ch);
            if(bo) {
                result += 2;
            } else {
                result += 1;
            }
            if(result >= 10) {
                index = i;
                break;
            }
        }
        if(index != 0) {
            let temp = name.substring(0, index) + "...";
            return temp;
        } else {
            return name;
        }
        
    },

    /** 转换用户名字，15个字符 */
    convertUserName15: function(name) {
        let result = 0;
        let index = 0;
        for(let i = 0; i < name.length; i++) {
            let ch = name[i];
            let bo = this.isChineseChar(ch);
            if(bo) {
                result += 2;
            } else {
                result += 1;
            }
            if(result >= 15) {
                index = i;
                break;
            }
        }
        if(index != 0) {
            let temp = name.substring(0, index) + "...";
            return temp;
        } else {
            return name;
        }
    },

    getJumpAdditionByCombo:function(combo) {
        if(combo < 50) {
            return 0;
        } else if(combo >= 50 && combo < 150) {
            return 10;
        } else if(combo >= 150 && combo < 300) {
            return 20;
        } else if(combo >= 300 && combo < 500) {
            return 30;
        } else if(combo >= 500 && combo < 1000) {
            return 40;
        } else if(combo >= 1000 && combo < 1500) {
            return 50;
        } else if(combo >= 1500 && combo < 2000) {
            return 60;
        } else if(combo >= 2000 && combo < 3000) {
            return 70;
        } else if(combo >= 3000 && combo < 4000) {
            return 80;
        } else if(combo >= 4000 && combo < 5000) {
            return 90;
        } else {
            return 100;
        }
    },

    /** 这个算子是用来计算每一步跳跃，所能赚取的金币 */
    getEarnMoneyByStep:function(score) {
        let myBaseCoinLevel = GameData.UsersProxy.getMyUpgradeLevel(0);
        let baseCoin = GameData.UpgradeProxy.getBaseCoinByLevel(myBaseCoinLevel);
        let combo = GameData.GameProxy.getTotalScore();             // 跳跃了多少的分数是多少的呢。
        let plusAdd = GameTool.getJumpAdditionByCombo(combo);       // 跳跃的额外的加成.
        let myTgGid = GameData.UsersProxy.getMyTgGid();
        let teamAdd = GameData.RankProxy.getBenefitByTgGid(myTgGid);                                          // 假装是0.1是我本次的队伍的加成.
        let isGoldTime = GameData.GameProxy.getLeftHappyTime() > 0;        // 如果快乐时间是大于0 ，就说明了，是快乐时间
        let myHappTimeLevel = GameData.UsersProxy.getMyUpgradeLevel(2);         // 获得happyTime的level是多少.
        let timeBenifit = GameData.UpgradeProxy.getHappyTimeByLevel(myHappTimeLevel);
        let happytimePlus = isGoldTime ? timeBenifit : 1.0;                 // 
        
        let result = score * baseCoin * (1 + plusAdd/100 + teamAdd) * happytimePlus;
        // 这个地方，还需要跟我的每日的上线，做一下比较，如果超过了每日上限。就不可以增加....
        let roundAlreadyEarnMoney = GameData.GameProxy.getGoldOfTodayPlusThisRound();
        let myDailyLimitLevel = GameData.UsersProxy.getMyUpgradeLevel(5);         // 获得happyTime的level是多少.
        let myLimit = GameData.UpgradeProxy.getDailyLimitByLevel(myDailyLimitLevel);
        let gap = myLimit - roundAlreadyEarnMoney;
        if(gap > result) {
            return result;
        } else {
            gap = gap < 0 ? 0 : gap;
            return gap;
        }
    },

    /** 转化钱包的地址 */
    converWalletAddress: function(address) {
        if(!address) {
            return "";
        }
        if(address.length <= 8) {
            return address;
        }
        let pre = address.substring(0, 4);
        let length = address.length;
        let last = address.substring(length - 5, length - 1);
        return pre + "..." + last;
    },

    getUrl: function() {
        var result;
        var href = window.location && window.location.origin;
        href += window.location.pathname;
        return href;
    },

    getPolicyUrl: function() {
        let url = this.getUrl();
        url += "PrivacyPolicy.af5e1.html";
        return url;
    },

    getEntryParams: function() {
        var result;
        var href = window.location && window.location.href;
        if (href) {
            result = this.parseURL(href).params;
        }
        result = result || {};
        return result;
    },

    /**
     * 快速排序一个数组
     * @param {Array} arr 要排序的数组
     * @param {Array} compareKeys 要排序的键数组，数组中如果有数字，则视为下一个比对的键值的因子，比对结果会乘以该因子。默认因子为1，即从小到大排序
     * eg: [-1, "key1", "key2", 1, "key2"]
     *
     */
    sortArrayWithKeys: function(arr, compareKeys) {
        var cloneArr = arr.concat();
        arr.sort(function(itemA, itemB) {
            var compareResult = 0;
            var factor = 1;
            compareKeys.every(function(compareKey) {
                if (typeof(compareKey) == "number") {
                    factor = compareKey;
                } else {
                    if (compareKey instanceof Function) {
                        compareResult = (compareKey(itemA) - compareKey(itemB)) * factor;
                    } else if (compareKey) {
                        compareResult = (GameTool.getValueByKeyString(itemA, compareKey) - GameTool.getValueByKeyString(itemB, compareKey)) * factor;
                    } else {
                        compareResult = (itemA - itemB) * factor;
                    }
                    if (compareResult != 0) {
                        return false;
                    }
                    factor = 1;
                }
                return true;
            }, this);

            // 最后保持原始顺序
            if (compareResult == 0) {
                compareResult = cloneArr.indexOf(itemA) - cloneArr.indexOf(itemB);
            }
            return compareResult;
        });
    },

    isValidHttpUrl: function(url) {
        // 正则表达式检查URL的结构
        var httpUrlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        return httpUrlRegex.test(url);
    },

    getTheWidthGap:function() {
        let size = cc.view.getFrameSize();
        let width = size.width;
        let height = size.height;
        let designWidth = 720;
        let designHeight = 1560;
        let widthScale = width / designWidth;
        let heightScale = height / designHeight;
        let min = Math.min(widthScale, heightScale);
        let gap = (width - designWidth * min);
        return gap;
    },

    /** 对这些进行RSA加密 */
    // openSSLEncrypt(str) {
    //     var encrypt = new JSEncrypt();
    //     const publicKey = "tttttttttttttttttttttttttttttttt";
    //     encrypt.setPublicKey(publicKey);
    //     var encrypted = encrypt.encrypt(str);
    //     console.log('加密前数据:%o', str);
    //     console.log('加密后数据:%o', encrypted);
    //     return encrypted;
    // },

    toBase64(str) {
        let binaryData = str.split('').map(c=>c.charCodeAt(0));
        let base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        let base64Data = '';
        let remainder = 0;
        let remainderSize = 0;
        for (let i = 0; i < binaryData.length; i++) {
            let byte = binaryData[i];
            let char1 = base64Chars[(byte >> 2) & 0x3f];
            let char2 = base64Chars[((byte << 4) + remainder) & 0x3f];
            base64Data += char1 + char2;
            remainder = (byte << 2) & 0x3f;
            remainderSize += 2;
            if (remainderSize == 6) {
                base64Data += base64Chars[remainder];
                remainder = 0;
                remainderSize = 0;
            }
        }
        if (remainderSize > 0) {
            base64Data += base64Chars[remainder];
            base64Data += '=';
            if (remainderSize == 2) {
                base64Data += '=';
            }
        }
        return base64Data;
    },

    /** 获得 */
    getUtcHour() {
        return new Date().getUTCHours();
    },

    getUtcMinute() {
        return new Date().getUTCMinutes();
    },

    getGameLogicScaleSize:function() {
        let size = cc.view.getFrameSize();
        let width = size.width;
        let height = size.height;
        let designWidth = 720;
        let designHeight = 1560;
        let widthScale = width / designWidth;
        let heightScale = height / designHeight;
        return widthScale / heightScale;
    },

    clearTimeout: function(callback, target, timeoutId, autoComplete) {
        if (!this.__globalScheduleObj) {
            this.__globalScheduleObj = {

            };
            cc.director.getScheduler().enableForTarget(this.__globalScheduleObj);
        }

        var globalObj = this.__globalScheduleObj;
        this.__timeoutRecords = this.__timeoutRecords || [];
        for (var i = this.__timeoutRecords.length - 1; i >= 0; --i) {
            var record = this.__timeoutRecords[i];
            if (record && (!callback || record.callback.call == callback.call) && record.target == target && (!timeoutId || timeoutId == record.timeoutId)) {
                if (record.repeat > 0) {
                    record.repeat--;
                }
                if (record.repeat > 0) {
                    continue;
                }
                this.__timeoutRecords.splice(i, 1);
                // GameTool.log("移除计时：", callback);
                if (autoComplete) {
                    if (target) {
                        record.callback && record.callback.apply(target);
                    } else {
                        record.callback && record.callback();
                    }
                }
                cc.director.getScheduler().unschedule(record.scheduleCallback, globalObj);
            }
        }
    },


    getLocalSprite:function(sprite, url) {
        cc.resources.load(url, function(err, texture) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            texture.addRef();
            if(sprite && sprite.node && sprite.node.isValid) {
                var spriteFrame = new cc.SpriteFrame();
                spriteFrame.setTexture(texture);
                sprite.spriteFrame = spriteFrame;
            }
        });
    },

    getStartAppParam: function() {
        const params = new URLSearchParams(window.location.search);
        // 获取单个参数
        const param1 = params.get('startapp'); // 返回 'value1'
        console.log(param1);
    },

    getRemoteSprite:function(sprite, url) {
        cc.assetManager.loadRemote(url, {ext:'.png'}, function(err, texture) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            if(sprite && sprite.node && sprite.node.isValid) {
                var spriteFrame = new cc.SpriteFrame();
                spriteFrame.setTexture(texture);
                sprite.spriteFrame = spriteFrame;
            }
        });
    },

    /** 发送埋伏点，给服务器... */
    sendPointToServer: function(eventStr,useMobile) {
        if(window.Telegram){
            useMobile = !!useMobile;
            if(useMobile) {
                let param = {UA:"",Model:""};
                param.UA = GameTool.getMobileAgent();
                param.Model = GameTool.getMobileModel();
                plausible(eventStr,{props: param});
            }
            else {
                plausible(eventStr);
            }
        }
    },

    /** 获得玩家的手机代理 */
    getMobileAgent:function() {
        let ua = navigator.userAgent;
        return ua;
    },

    /** 获得手机model */
    getMobileModel:function() {
        const ua = navigator.userAgent;
        let model = "Unknown";
      
        if (/iP(hone|od|ad)/.test(ua)) {
          const matches = ua.match(/iP(hone|od|ad);.*?OS\s([\d_]+)/);
          if (matches) {
            model = `iPhone ${matches[2].replace(/_/g, '.')}`;
          }
        }
      
        else if (/Android/.test(ua)) {
          const matches = ua.match(/Android\s([0-9\.]+);\s([^;]+)/);
          if (matches) {
            model = matches[2];
          }
        }
        return model;
    },

    getValueByKeyString: function(data, key) {
        var v = data;
        var propKeys = key.split(".");
        for (var i = 0, len = propKeys.length; i < len; ++i) {
            if (v == null) {
                break
            };
            v = v[propKeys[i]];
        };
        return v;
    },


}