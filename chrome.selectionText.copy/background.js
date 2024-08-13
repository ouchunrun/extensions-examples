
/**
 * 点击插件图标，手动取消页面禁止选择文本的设置
 */
chrome.action.onClicked.addListener((tab) => {
    console.log("Executing code when the plugin icon is clicked.");
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'cancelUserSelectNoneStyle' }, function(response) {
            console.log(response);
        });
    });
});
