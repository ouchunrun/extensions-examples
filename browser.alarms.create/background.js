
let popupPort = null
let openerPopupId = null
let extensionNamespace
if (chrome) {  // chrome
    extensionNamespace = chrome
} else if (browser) {  // firefox
    extensionNamespace = browser
}
let alarmCreated = false

/**
 * 点击popup图标触发事件
 */
extensionNamespace.action.onClicked.addListener(function (tab) {
    console.log('action onClicked')
    let url = 'popup.html'
    let customWidth = 456
    let customHeight = 540
    let iTop = 200
    let iLeft = 600

    if (openerPopupId > 0) {
        extensionNamespace.windows.get(openerPopupId, {}, function (win) {
            if (win) {
                // 更新窗口
                console.log('update window')
                extensionNamespace.windows.update(win.id, {
                    focused: true,
                },)
            } else {
                extensionNamespace.windows.create({
                    url: url,
                    type: "popup",
                    height: customHeight,
                    width: customWidth,
                    left: iLeft,
                    top: iTop
                },);
            }
        })
    } else {
        extensionNamespace.windows.create({
            url: url,
            type: "popup",
            height: customHeight,
            width: customWidth,
            left: iLeft,
            top: iTop,
        },);
    }
})

/**
 * 监听popup的连接事件
 */
extensionNamespace.runtime.onConnect.addListener(function (port) {
    console.log('runtime onConnect')
    popupPort = port
    port.onMessage.addListener(request => {
        console.log('receive message from popup:', request)
        if(request){
            switch (request.action) {
                case 'alarm':
                    createAlarm(request.data.alarm)
                    break
                default:
                    break
            }
        }
    })

    port.onDisconnect.addListener(function () {
        console.log('onDisconnect, clear popup port and interval')
        popupPort = null
        clearAlarms()
    })
})

/**
 * 创建定时器
 * @param alarm
 */
function createAlarm(alarm) {
    console.log('create Alarm? ', alarm)
    if(!extensionNamespace.alarms){
        console.log('alarms is not supported')
        return
    }

    if(alarm){
        if(!alarmCreated){
            // TODO: 事件页面在空闲时通常会被终止以节省资源
            //  How to stop a background script from going idle in MV3?
            //  https://discourse.mozilla.org/t/how-to-stop-a-background-script-from-going-idle-in-mv3/128327
            // https://bugzilla.mozilla.org/show_bug.cgi?id=1748530
            console.log('add alarms to stop a background script from going idle')
            extensionNamespace.alarms.create("keep-loaded-alarm-0", {
                periodInMinutes: 1
            });
            setTimeout(() => extensionNamespace.alarms.create("keep-loaded-alarm-1", {
                periodInMinutes: 1
            }), "20000");
            setTimeout(() => extensionNamespace.alarms.create("keep-loaded-alarm-2", {
                periodInMinutes: 1
            }), "40000");

            extensionNamespace.alarms.onAlarm.addListener(() => {
                console.log("keeping extension alive - log for debug");
            });
            alarmCreated = true
        }else {
            console.log('alarm has been created')
        }
    }else {
        clearAlarms()
    }
}

/**
 * 清除定时器
 */
function clearAlarms(){
    console.log('clear alarm')
    alarmCreated = false
    extensionNamespace.alarms.clear("keep-loaded-alarm-0")
    extensionNamespace.alarms.clear("keep-loaded-alarm-1")
    extensionNamespace.alarms.clear("keep-loaded-alarm-2")
}
