
var MUSICT_STATUS = window.MUSICT_STATUS = {ON:1, OFF:2};
var SoundProxy = window.SoundProxy = (function() {
    function SoundProxy() {
        /** 是否启用背景音乐 */
        this.isMusicOpen = true;        //  localProxy.get(LocalKey.MUSIC_OPEN, true);
        
        /** 是否启用音效 */
        this.isSoundOpen = MUSICT_STATUS.ON;        //  localProxy.get(LocalKey.SOUND_OPEN, true);

        let sp = parseInt(localStorage.getItem("soundOpen"));
        if(sp) {
            this.isSoundOpen = sp;
        }
        // 记录当前音乐地址
        this.currMusic = null;

        /** 是否音乐静音 */
        this.musicMuted = false;
        /** 是否音效静音 */
        this.soundMuted = false;

        this.soundVolume = 1;           //      localProxy.get(LocalKey.SoundVolume, 1);
        this.musicVolume = 1;           //      localProxy.get(LocalKey.MusicVolume, 1);

        this.cacheMusic = {};

        this.initConfig();
    }
    SoundProxy.prototype.initConfig = function(data) {
        
    };

    /** 获得，是否音效，是开启的，还是关闭的 */
    SoundProxy.prototype.getSoundOpen = function() {
        return this.isSoundOpen;
    }

    /** 设置是否要开启音效 */
    SoundProxy.prototype.setSoundOpen = function(bo) {
        this.isSoundOpen = bo;
        let result = bo;
        localStorage.setItem("soundOpen", result);              // 设置音效是否要开启.
    }

    SoundProxy.prototype.stopHoldBreath = function() {
        cc.audioEngine.stop(this.cacheMusic["sound/jump_start"]);
        cc.audioEngine.stop(this.cacheMusic["sound/jump_loop"]);
    };

    SoundProxy.prototype.playFail = function() {
        var volume = 1;
        volume = volume * this.soundVolume;
        let url = "sound/fail"
        if (this.isSoundOpen == MUSICT_STATUS.ON) {
            this.preloadAudio(url, (function(clip) {
                if (!clip) {
                    return;
                }
                let soundID = cc.audioEngine.playEffect(clip, false);
                if(volume > 1) {
                    volume = 1;
                }
                cc.audioEngine.setEffectsVolume(volume)
            }).bind(this));
        } else {
            return null;
        }
    };

    SoundProxy.prototype.playScore = function(score) {
        var volume = 1;
        volume = volume * this.soundVolume;
        let url = "sound/jump_start"
        if(score <= 1) {
            url = "sound/score_1"
        } else {
            url = "sound/score_more"
        }
        if (this.isSoundOpen == MUSICT_STATUS.ON) {
            this.preloadAudio(url, (function(clip) {
                if (!clip) {
                    return;
                }
                let soundID = cc.audioEngine.playEffect(clip, false);
                if(volume > 1) {
                    volume = 1;
                }
                cc.audioEngine.setEffectsVolume(volume)
            }).bind(this));
        } else {
            return null;
        }
    };



    SoundProxy.prototype.playHoldBreath = function() {
        
        var volume = 1;
        volume = volume * this.soundVolume;
        
        if (this.isSoundOpen == MUSICT_STATUS.ON) {
            this.preloadAudio("sound/jump_start", (function(clip) {
                if (!clip) {
                    return;
                }
                let soundID = cc.audioEngine.playEffect(clip, false);
                this.cacheMusic["sound/jump_start"] = soundID;
                if(volume > 1) {
                    volume = 1;
                }
                cc.audioEngine.setEffectsVolume(volume)
                if (soundID) {
                    cc.audioEngine.setFinishCallback(soundID, function() {
                        this.preloadAudio("sound/jump_loop",(function(clip) {
                            let theId = cc.audioEngine.playEffect(clip, true);
                            this.cacheMusic["sound/jump_loop"] = theId;
                        }).bind(this));
                    }.bind(this));
                }
            }).bind(this));
        } else {
            return null;
        }
    }

    SoundProxy.prototype.playClickSound = function() {
        // GameData.SoundProxy.playSound(ResManifest.clickSound);
        this.playSound("sound/button");
    }

    SoundProxy.prototype.playUpgradeSound= function() {
        // GameData.SoundProxy.playSound(ResManifest.clickSound);
        this.playSound("sound/levelup");
    }

    SoundProxy.prototype.playSound = function(url, onBegin, onEnd, isLoop) {
        isLoop = !!isLoop;
        if (!url) {
            return;
        }
        var volume = 1;
        volume = volume * this.soundVolume;
        url = url;
        if (typeof url != "string") {
            return;
        }
        if (this.isSoundOpen == MUSICT_STATUS.ON) {
            this.preloadAudio(url, (function(clip) {
                if (!clip) {
                    return;
                }
                let soundID = cc.audioEngine.playEffect(clip, isLoop);
                if(volume > 1) {
                    volume = 1;
                }
                cc.audioEngine.setEffectsVolume(volume)
                if (soundID) {
                    onBegin && onBegin(soundID);
                    cc.audioEngine.setFinishCallback(soundID, function() {
                        onEnd && onEnd(soundID);
                    }.bind(this));
                }
            }).bind(this));
        } else {
            return null;
        }
    };

    SoundProxy.prototype.playMusic = function(url, onBegin, onEnd, isLoop) {
        if (!url) {
            return;
        }
        isLoop = isLoop == undefined ? true : isLoop;
        var volume = 1;
        volume = volume * this.musicVolume;
        url = url;
        if (typeof url != "string" || this.mPlayingUrl == url) {
            return;
        }
        this.readyURL = url;
        if (!this.isMusicOpen == MUSICT_STATUS.ON) {
            this.currMusic = url;
            return null;
        }
        this.preloadAudio(url, (function(url, clip) {
            if (!clip) {
                return;
            }
            if (!this.isMusicOpen == MUSICT_STATUS.ON) {
                this.currMusic = url;
                return null;
            }
            if (this.readyURL != url) {
                return;
            }
            if (url != this.currMusic || this.currMusciId == null) {
                if (cc.audioEngine.isMusicPlaying()) {
                    cc.audioEngine.stopMusic();
                }
                this.currMusic = url;
                if (this.mTimeOutId) {
                    clearTimeout(this.mTimeOutId);
                }
                this.mTimeOutId = setTimeout(function() {
                    this.mTimeOutId = 0;
                    this.currMusciId = cc.audioEngine.playMusic(clip, isLoop);
                    cc.audioEngine.setMusicVolume(volume);
                    this.currVolume = volume;
                    if (this.currMusciId) {
                        onBegin && onBegin(this.currMusciId);
                        cc.audioEngine.setFinishCallback(this.currMusciId, function(currMusciId) {
                            // GameTool.log("MusicComplete:" + currMusciId);
                            onEnd && onEnd(currMusciId);
                        }.bind(this, this.currMusciId));
                    }
                    this.mPlayingUrl = url;
                }.bind(this), 100);
            }
        }).bind(this, url));
    }

    SoundProxy.prototype.preloadAudio = function(resurl, callback, isCachedDelay) {
        cc.resources.load(resurl, cc.AudioClip, (function(err, clip) {
            if (err) {
                if (callback != null && callback != undefined) {
                    callback(null, err);
                    callback = null;
                }
                return;
            }
            if (callback != null && callback != undefined) {
                callback(clip);
                callback = null;
            }
        }).bind(this));
    };
    return SoundProxy;
})();

SoundProxy.MUSICT_STATUS = MUSICT_STATUS;