

let nameSpace
try {
    if (chrome && chrome.runtime) {
        nameSpace = chrome
        console.log('get extension namespace, ', chrome)
    }
} catch (e) {
    if (browser && browser.runtime) {
        nameSpace = browser
        console.log('get extension namespace, ', browser)
    }
}

/**
 * 监听背景页发送的消息
 */
if (nameSpace && nameSpace.runtime && nameSpace.runtime.onMessage) {
    console.log('set runtime onMessage listener')
    nameSpace.runtime.onMessage.addListener(function (request, sender, sendResponse){
        console.log('runtime onMessage', request)
        if (request && request.action === 'cancelUserSelectNone') {
            console.log('set user-select to text!!!!!!!')
            setUserSelectToText()
        }
        sendResponse('request success')
    })
}

/**
 * 1、取消所有节点的user-select:none 设置
 * @param el
 */
function setUserSelectToText(el = document.body) {
    for (let index = 0; index < el.children.length; index++) {
        const e = el.children.item(index);
        e.style.userSelect = 'text';
        setUserSelectToText(e);
    }
}

/**
 * 2.鼠标松开时，复制选中的文本
 */
document.documentElement.addEventListener('mouseup', e => {
    const pasteText = window.getSelection().toString();
    if (null === pasteText || undefined === pasteText || '' === pasteText.trim()) {
        return;
    }
    navigator.clipboard.writeText(pasteText).then(() => {
        console.log('复制成功！', pasteText)
    }).catch((e) => {
        console.log('复制失败！', e)
    });
});
