function setAllSelect(el = document.body) {
    for (let index = 0; index < el.children.length; index++) {
        const e = el.children.item(index);
        e.style.userSelect = 'text';
        setAllSelect(e);
    }
}

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

if (nameSpace && nameSpace.runtime && nameSpace.runtime.onMessage) {
    console.log('set runtime onMessage listener')
    nameSpace.runtime.onMessage.addListener(function (request, sender, sendResponse){
        console.log('runtime onMessage', request)
        if (request && request.action === 'executeCode') {
            setAllSelect()
        }
        sendResponse('request success')
    })
}

