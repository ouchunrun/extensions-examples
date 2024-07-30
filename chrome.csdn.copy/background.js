
chrome.action.onClicked.addListener((tab) => {
    console.log("Executing code when the plugin icon is clicked.");
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'executeCode' }, function(response) {
            console.log(response);
        });
    });
});
