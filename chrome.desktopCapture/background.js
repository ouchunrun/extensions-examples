let openerPopupId
chrome.action.onClicked.addListener(function (tab) {
    console.log('action onClicked')
    let customWidth = 456
    let customHeight = 540
    let iTop = 200
    let iLeft = 600

    let url = chrome.runtime.getURL('popup.html')
    if (openerPopupId > 0) {
        chrome.windows.get(openerPopupId, {}, function (win) {
            if (win) {
                // 更新窗口
                console.log('update window')
                chrome.windows.update(win.id, {
                    focused: true,
                })
            } else {
                chrome.windows.create({
                    url: url,
                    type: "popup",
                    height: customHeight,
                    width: customWidth,
                    left: iLeft,
                    top: iTop
                });
            }
        })
    } else {
        chrome.windows.create({
            url: url,
            type: "popup",
            height: customHeight,
            width: customWidth,
            left: iLeft,
            top: iTop,
        },);
    }
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('background.js onMessage:', request)
    if (request.type === 'startCapture') {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            let tab = tabs[0];
            chrome.desktopCapture.chooseDesktopMedia(['screen', 'window'], tab, function(streamId) {
                // streamId 是一个字符串，用于标识要捕获的媒体流。
                // 你可以将此 ID 传递给 getUserMedia() API 来获取媒体流。
                console.log('chooseDesktopMedia streamId:', streamId);
                sendResponse({streamId: streamId});
            });
        });
        return true;  // 保持消息通道打开，直到 sendResponse 被调用。
    }
});
