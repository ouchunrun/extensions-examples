let alarmBtn = document.getElementById('alarm-set')

// 创建弹窗和后台通信的连接
let popupPort
let extensionNamespace
if (window.chrome && window.chrome.runtime && window.chrome.runtime.connect) {  // chrome
    extensionNamespace = chrome
} else if (window.browser && window.browser.runtime && window.browser.runtime.connect) {  // firefox
    extensionNamespace = browser
}

window.onload = function(){
    console.log('initConnect to backgroundJS')
    popupPort = extensionNamespace.runtime.connect({ name: 'popup' })

    if(popupPort){
        /** 监听连接断开事件* */
        popupPort.onDisconnect.addListener(function() {
            console.log("Connection is disconnected, close Popup page");
            // window.close()
        })
        /** Listen for messages from the backgroundJS. **/
        popupPort.onMessage.addListener(function (msg){
            console.log('receive message from backgroundJS:', msg)
        })
    }

    alarmBtn.setAttribute('disabledAlarm', true)
}

// 绑定监听事件
alarmBtn.addEventListener('click', function () {
    if (alarmBtn.getAttribute('disabledAlarm') === 'true') {
        console.log('open alarm')
        alarmBtn.setAttribute('disabledAlarm', false)
        alarmBtn.innerText = '关闭闹钟'
        popupPort.postMessage({
            action: 'alarm',
            data: {
                alarm: true
            }
        })
    } else {
        console.log('close alarm')
        alarmBtn.setAttribute('disabledAlarm', true)
        alarmBtn.innerText = '开启闹钟'
        popupPort.postMessage({
            action: 'alarm',
            data: {
                alarm: false
            }
        })
        let notice = document.getElementById('notice')
        notice.innerText = 'Attention: After few seconds(45 - 90) the background script always stops.'
    }
})
