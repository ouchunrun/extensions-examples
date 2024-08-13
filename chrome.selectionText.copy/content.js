
// let copyReady = false
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
        if (request && request.action === 'cancelUserSelectNoneStyle') {
            console.log('set user-select to text!!!!!!!')
            // 取消页面不可选择的样式设置
            // copyReady = true
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
        e.style.userSelect = 'text'
        setUserSelectToText(e)
    }
}

/**
 * 创建拷贝按钮
 */
function createCopyButton(e, pasteText){
    if(!e || !e.target){
        return
    }

    let parentElement = e.target
    let copyButton = document.getElementById('copyButtonWithClick')
    if(copyButton){
        copyButton.parentElement.removeChild(copyButton)
    }
    
    copyButton = document.createElement('button')
    copyButton.style = 'position: absolute;background-color: #fff;box-shadow: rgb(0, 39, 97) 0px 0px 10px;border-radius: 5px;width: 50px;height: 30px;font-size: 14px;font-family: fantasy;color: darkorange;'
    copyButton.id = 'copyButtonWithClick'
    copyButton.innerText = 'Copy'
    copyButton.addEventListener('click', e => {
         console.log('click copy button！')
         e.stopPropagation()
         copyButton.parentElement.removeChild(copyButton)
         navigator.clipboard.writeText(pasteText).then(() => {
            console.log('copy text success. content is : ', pasteText)
        }).catch((e) => {
            console.log('copy text failed', e)
        });
    })

    // 设置按钮显示位置
    if (e.pageX && e.pageY) {
        copyButton.style.left = e.pageX - 20 + 'px'
        copyButton.style.top = e.pageY + 20 + 'px'
        copyButton.style.right = ''
        copyButton.style.bottom = ''
    } else {
        // 内嵌iframe元素的网页，点击时无法拿到位置，居中显示
        copyButton.style.top = '0'
        copyButton.style.left = '0'
        copyButton.style.right = '0'
        copyButton.style.bottom = '0'
    }
    document.body.appendChild(copyButton)
}

/**
 * 2.鼠标松开时，复制选中的文本
 */
document.documentElement.addEventListener('mouseup', e => {
    if(e.target.id === 'copyButtonWithClick'){
        return
    }

    // 获取选中的文本，没有选中文本则返回
    const pasteText = window.getSelection().toString()
    if (null === pasteText || undefined === pasteText || '' === pasteText.trim()) {
        // 没有选中的文本，不处理
        let copyButton = document.getElementById('copyButtonWithClick')
        if(copyButton && copyButton.parentElement) {
            copyButton.parentElement.removeChild(copyButton)
        }
        return
    }

    // console.log('选择的文本pasteText:', pasteText)
    createCopyButton(e, pasteText)
});

/**
 * 页面加载完成，取消页面禁止选择文本的设置
 */
window.addEventListener('load', () => {
    console.log('[Extension]window load, set user-select to text')
    setUserSelectToText()
})