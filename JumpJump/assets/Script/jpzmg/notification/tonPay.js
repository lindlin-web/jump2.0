

// const TonConnectUI = require("@tonconnect/ui");
// console.log("hhhh");
// const { beginCell, Cell } = require ("@ton/ton")
// const TonWeb = require("tonweb");
require('../../Common/GameConfig');
if(window.Telegram) {
    let tonweb = new window.TonWeb();
    let $pay = {
        manifestUrl: GameConfig.getPayManiAddress(),
        baseUrl: "https://tonwallet.cash",
        tonConnectUI: ''
    }
    $pay.tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
        manifestUrl: $pay.manifestUrl
    });
    $pay.tonConnectUI.uiOptions = {
        twaReturnUrl: GameConfig.getPayAddress()
    }
    let requestUrl = $pay.baseUrl;
    function getEvent(url) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', requestUrl + url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        if (xhr.responseText) {
                            return resolve({ data: JSON.parse(xhr.responseText) })
                        }
                        return reject('Request Error')
                    } else {
                        return reject('Request Error')
                    }
                }
            };
            xhr.send();
        })
    }

    function getEventFromLind(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", requestUrl + url, true);
        xhr.onreadystatechange = function() {
            if(xhr.readyState === XMLHttpRequest.DONE) {
                if(xhr.status === 200) {
                    if(xhr.responseText) {
                        return callback(1, JSON.parse(xhr.responseText));
                    }
                }
                return callback(2, "Request Error");
            } else {
                return callback(2, "Request Error");
            }
        };
        xhr.send();
    }

    function postEventFromLind(url, params,callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', requestUrl + url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    if (xhr.responseText) {
                        return callback(1,JSON.parse(xhr.responseText));
                    }
                    return callback(2, "Request Error");
                } else {
                    return callback(2, "Request Error");
                }
            }
        };
        let paramsStr = JSON.stringify(params);
        xhr.send(paramsStr);
    }

    function postEvent(url, params) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', requestUrl + url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        if (xhr.responseText) {
                            return resolve({ data: JSON.parse(xhr.responseText) })
                        }
                        return reject('Request Error')
                    } else {
                        return reject('Request Error')
                    }
                }
            };
            let paramsStr = JSON.stringify(params);
            xhr.send(paramsStr);
        })
    }
    function bindAddress(){
        
    
    }
    $pay.checkConnect = () => {
        $pay.tonConnectUI.onStatusChange(
            (walletInfo) => {
                
            }
        );
    }
    $pay.createPayload = (text) => {
        const body = beginCell()
            .storeUint(0, 32)
            .storeStringTail(text)
            .endCell();
        return body.toBoc().toString("base64")
    }
    $pay.getProofEvent = () => {
        return new Promise(function (resolve, reject) {
            getEvent('/api/ton_proof/generatePayload').then((res) => {
                if (res.data.code == 0) {
                    return resolve(res.data.data.payload)
                } else {
                    return reject(res.data.msg)
                }
            })
        });
    }
    $pay.checkProofEvent = (walletInfo) => {
        return new Promise(function (resolve, reject) {
            postEvent('/api/ton_proof/checkProof', { proof: walletInfo.proof, wallet: walletInfo.account }).then((res) => {
                if (res.data.code == 0) {
                    return resolve(res.data.data)
                } else {
                    return reject(res.data.msg)
                }
            })
        });
    }

    $pay.disconnect = () => {
        $pay.tonConnectUI.disconnect();
    }

    $pay.isConnecting = () => {
        if ($pay.tonConnectUI && $pay.tonConnectUI.wallet) {
            return true
        } else {
            return false
        }
    }

    $pay.getAddress = ()=>{
        return $pay.tonConnectUI.wallet.account.address;
    }

    $pay.connect = (cb) => {
        return new Promise(async(resolve, reject) => {
            try {
                if ($pay.isConnecting()) {
                    cb($pay.tonConnectUI.wallet.account.address);
                    return resolve($pay.tonConnectUI.wallet);
                }
                let payload = await $pay.getProofEvent();
                $pay.tonConnectUI.onStatusChange(
                    (walletInfo) => {
                        
                    }
                );
                if ($pay.tonConnectUI) {
                    $pay.tonConnectUI.setConnectRequestParameters({
                        value: {
                            tonProof: payload
                        }
                    })
                    await $pay.tonConnectUI.connectWallet();
                } else {
                    await $pay.init()
                    $pay.tonConnectUI.setConnectRequestParameters({
                        value: {
                            tonProof: payload
                        }
                    })
                    await $pay.tonConnectUI.connectWallet();
                }
                let walletInfo = $pay.tonConnectUI.wallet
                let proof = walletInfo && (walletInfo.connectItems ? walletInfo.connectItems.tonProof.proof : '');
                if (proof) {
                    let token = await $pay.checkProofEvent({
                        account: walletInfo.account,
                        proof: proof
                    });
                    window.localStorage.setItem('pT', token);
                }

                cb($pay.tonConnectUI.wallet.account.address);
                return resolve($pay.tonConnectUI.wallet)
            } catch (error) {
                return reject('Connect Error')
            }
        });
    }

    $pay.checkConnect();
    window.TonPay = {
        connect: $pay.connect,
        //pay: $pay.pay,
        // getbalance: $pay.getbalance,
        // getWalletInfo: $pay.getWalletInfo,
        disconnect: $pay.disconnect,
        isConnecting: $pay.isConnecting,
        getAddress: $pay.getAddress,
        //decodeBoc: $pay.decodeBoc,
        //changeAddress: $pay.changeAddress,
    };
}


