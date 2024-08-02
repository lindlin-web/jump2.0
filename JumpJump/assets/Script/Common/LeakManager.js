let uiCfgs = window.gUICfgs;

var LeakManager = function() {
    this.loadRes = {};
    this.prefabCache = {};
    this.cacheDuration = 300000;
    this.resCount = {};
    this.cacheNode = {};
    this.LastClearTime = 0;
    this.closeArr = {};
    this.isGC = false;
    this.openCount = 0;
    this.spCache = {};

    if (cc.sys.os == cc.sys.OS_IOS) {
        this.cacheDuration = 0;
        // cc.director.on(cc.Director.EVENT_AFTER_UPDATE, (function name(dt) {
        //     if (this.isGC && 0 == this.openCount) {
        //         this.isGC = false;

        //         this.clearPrefabTimeout();
        //     }
        // }).bind(this));
    }

}

LeakManager.prototype.cachePrefab = function(path, callback, bCache) {
    cc.resources.load(path, (function(err, res) {
        if (!err) {
            if (bCache) {
                var deps = cc.loader.getDependsRecursively(res);
                if (deps.length > 0) {
                    for (var index = 0; index < deps.length; ++index) {
                        var element = deps[index];
                        this.loadRes[element] = 1;
                    }
                    this.cacheNode[path] = res;
                }
            } else {
                this.openPrefab(path);
            }
        }

        callback && callback(err, res);
        this.openCount--;
        if (this.openCount < 0) {
            this.openCount = 0;
        }
    }).bind(this));
}

LeakManager.prototype.cacheSpriteFrame = function(path, callback) {
    if (this.spCache[path]) {
        // setTimeout(function() {
        callback && callback(null,
            this.spCache[path]);
        // }.bind(this), 1 / 60);
        return;
    }
    this.openCount++;
    cc.resources.load(path, cc.SpriteFrame, (function(err, res) {
        if (!err) {
            // var deps = cc.loader.getDependsRecursively(res);
            // if (deps.length > 0) {
            //     for (var index = 0; index < deps.length; ++index) {
            //         var element = deps[index];
            //         this.loadRes[element] = 1;
            //     }
            //     this.cacheNode[path] = res;                                
            // }
        }
        this.spCache[path] = res;
        callback && callback(err, res);
        this.openCount--;
        if (this.openCount < 0) {
            this.openCount = 0;
        }

    }).bind(this));
}

LeakManager.prototype.cacheSpriteAtlas = function(path, callback) {
    this.openCount++;
    cc.resources.load(path, cc.SpriteAtlas, (function(err, res) {
        if (!err) {
            // var deps = cc.loader.getDependsRecursively(res);
            // if (deps.length > 0) {
            //     for (var index = 0; index < deps.length; ++index) {
            //         var element = deps[index];
            //         this.loadRes[element] = 1;
            //     }
            //     this.cacheNode[path] = res;                
            // }
        }

        callback && callback(err, res);
        this.openCount--;
        if (this.openCount < 0) {
            this.openCount = 0;
        }

    }).bind(this));
}

LeakManager.prototype.cacheSkeleton = function(path, callback) {
    this.openCount++;
    cc.resources.load(path, sp.SkeletonData, (function(err, res) {
        if (!err) {
            // var deps = cc.loader.getDependsRecursively(res);
            // if (deps.length > 0) {
            //     for (var index = 0; index < deps.length; ++index) {
            //         var element = deps[index];
            //         this.loadRes[element] = 1;
            //     }
            //     this.cacheNode[path] = res;            
            // }            
        }

        callback && callback(err, res);
        this.openCount--;
        if (this.openCount < 0) {
            this.openCount = 0;
        }

    }).bind(this));
}

LeakManager.prototype.createSkeleton = function(path, callback) {
    this.openCount++;
    cc.resources.load(path, sp.SkeletonData, (function(err, res) {
        if (!err) {
            // var deps = cc.loader.getDependsRecursively(res);

            // if (deps.length > 0) {
            //     if (!this.prefabCache[path]) {
            //         this.prefabCache[path] = {};  
            //     }
            //     var prefabCache = this.prefabCache[path];
            //     prefabCache.time = 0;
            //     prefabCache.deps = [];     

            //     for (var index = 0; index < deps.length; ++index) {
            //         var element = deps[index];
            //         // 不在缓存中的资源才做引用计数
            //         if (!this.isResInCache(element)) {
            //             if (!this.resCount[element]) {
            //                 this.resCount[element] = 1;
            //             } else {
            //                 ++this.resCount[element];
            //             }
            //             prefabCache.deps.push(element);
            //         }
            //     }
            // }            
        }

        callback && callback(err, res);
        this.openCount--;
        if (this.openCount < 0) {
            this.openCount = 0;
        }

    }).bind(this));
}

LeakManager.prototype.createSpriteFrame = function(path, callback) {
    this.openCount++;
    cc.resources.load(path, cc.SpriteFrame, (function(err, res) {
        if (!err) {
            // var deps = cc.loader.getDependsRecursively(res);

            // if (deps.length > 0) {
            //     if (!this.prefabCache[path]) {
            //         this.prefabCache[path] = {};  
            //     }
            //     var prefabCache = this.prefabCache[path];
            //     prefabCache.time = 0;
            //     prefabCache.deps = [];     

            //     for (var index = 0; index < deps.length; ++index) {
            //         var element = deps[index];
            //         // 不在缓存中的资源才做引用计数
            //         if (!this.isResInCache(element)) {
            //             if (!this.resCount[element]) {
            //                 this.resCount[element] = 1;
            //             } else {
            //                 ++this.resCount[element];
            //             }
            //             prefabCache.deps.push(element);
            //         }
            //     }
            // }            
        }

        callback && callback(err, res);
        this.openCount--;
        if (this.openCount < 0) {
            this.openCount = 0;
        }

    }).bind(this));
}

LeakManager.prototype.releaseResources = function(path) {
    // var prefabPath = uiCfgs[uiid].res;
    if (!path) {
        return;
    }
    var prefabCache = this.prefabCache[path];
    if (!prefabCache) {
        return
    }

    if (!this.closeArr[path]) {
        this.closeArr[path] = {};
    }

    // var curTime = GameData.TimeProxy.getNowTime();
    // var closePrefab = this.closeArr[prefabPath];
    // closePrefab.time = curTime;
    // // 对每个资源做引用计数--
    // for (var index = 0; index < prefabCache.deps.length; ++index) {
    //     var element = prefabCache.deps[index];
    //     // 不在缓存中的资源才做引用计数
    //     if (!this.isResInCache(element)) {
    //         if (this.resCount[element]) {
    //             --this.resCount[element];
    //             if (this.resCount[element] < 0) {
    //                 this.resCount[element] = 0;
    //             }
    //         }
    //     }
    // }
}

LeakManager.prototype.getCacheNode = function(path) {
    return this.cacheNode[path];
}

LeakManager.prototype.openPrefab = function(prefabPath) {
    // var prefabPath = uiCfgs[uiid].res;
    if (!prefabPath) {
        return;
    }

    // 对每个资源做引用计数++
    var deps = cc.loader.getDependsRecursively(prefabPath);
    if (deps.length > 0) {
        if (!this.prefabCache[prefabPath]) {
            this.prefabCache[prefabPath] = {};
        }
        var prefabCache = this.prefabCache[prefabPath];
        prefabCache.time = 0;
        prefabCache.deps = [];

        for (var index = 0; index < deps.length; ++index) {
            var element = deps[index];
            // 不在缓存中的资源才做引用计数
            if (!this.isResInCache(element)) {
                if (!this.resCount[element]) {
                    this.resCount[element] = 1;
                } else {
                    ++this.resCount[element];
                }
                prefabCache.deps.push(element);
            }
        }
    }

}

LeakManager.prototype.loadScene = function() {
    this.openCount++;
}

LeakManager.prototype.openScene = function(scenePath) {
    if (!scenePath) {
        return;
    }
    var bundle = cc.assetManager.getBundle('resources');
    var info = bundle.getSceneInfo(scenePath); //cc.director._getSceneUuid(scenePath);
    // 对每个资源做引用计数++
    var deps = cc.loader.getDependsRecursively(info.uuid);
    if (deps.length > 0) {
        this.openCount--;
        if (this.openCount < 0) {
            this.openCount = 0;
        }
        if (!this.prefabCache[scenePath]) {
            this.prefabCache[scenePath] = {};
        }
        var prefabCache = this.prefabCache[scenePath];
        prefabCache.time = 0;
        prefabCache.deps = [];

        for (var index = 0; index < deps.length; ++index) {
            var element = deps[index];
            // 不在缓存中的资源才做引用计数
            if (!this.isResInCache(element)) {
                if (!this.resCount[element]) {
                    this.resCount[element] = 1;
                } else {
                    ++this.resCount[element];
                }
                prefabCache.deps.push(element);
            }
        }
    }

}

LeakManager.prototype.closePrefab = function(prefabPath) {
    // var prefabPath = uiCfgs[uiid].res;
    if (!prefabPath) {
        return;
    }
    var prefabCache = this.prefabCache[prefabPath];
    if (!prefabCache) {
        return
    }

    if (!this.closeArr[prefabPath]) {
        this.closeArr[prefabPath] = {};
    }

    // var curTime = GameData.TimeProxy.getNowTime();
    // var closePrefab = this.closeArr[prefabPath];
    // closePrefab.time = curTime;
    // // 对每个资源做引用计数--
    // for (var index = 0; index < prefabCache.deps.length; ++index) {
    //     var element = prefabCache.deps[index];
    //     // 不在缓存中的资源才做引用计数
    //     if (!this.isResInCache(element)) {
    //         if (this.resCount[element]) {
    //             --this.resCount[element];
    //             if (this.resCount[element] < 0) {
    //                 this.resCount[element] = 0;
    //             }
    //         }
    //     }
    // }
    // this.isGC = true;
}

LeakManager.prototype.clearPrefabTimeout = function(time) {
    var curTime = time || GameData.TimeProxy.getNowTime();
    if (curTime - this.LastClearTime >= this.cacheDuration) {
        this.LastClearTime = curTime;
    } else {
        return;
    }

    for (const key in this.closeArr) {
        if (this.closeArr.hasOwnProperty(key)) {
            const element = this.closeArr[key];
            if (curTime - element.time >= this.cacheDuration) {
                this.releasePrefab(key);
                delete this.closeArr[key];
            }
        }
    }
}

LeakManager.prototype.releasePrefab = function(prefabPath) {
    if (!prefabPath) {
        return;
    }
    var prefabCache = this.prefabCache[prefabPath];
    if (!prefabCache) {
        return;
    }

    for (var index = 0; index < prefabCache.deps.length;) {
        var element = prefabCache.deps[index];
        if (!this.isResInCache(element)) {
            var count = this.resCount[element];

            if (0 !== count) {
                prefabCache.deps.splice(index, 1);
            } else {
                ++index;
                delete this.resCount[element];
            }
        } else {
            prefabCache.deps.splice(index, 1);
        }
    }

    if (prefabCache.deps.length > 0) {
        cc.loader.release(prefabCache.deps);
        cc.loader.release(prefabPath);

        cc.sys.garbageCollect();

        delete this.prefabCache[prefabPath];
    }
}

LeakManager.prototype.isResInCache = function(resPath) {
    return resPath && this.loadRes[resPath];
}

window.LeakManager = new LeakManager();