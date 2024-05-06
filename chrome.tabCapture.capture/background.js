let capturedTab = null
chrome.browserAction.onClicked.addListener(function (tab) {
    console.log('onClicked tab', tab, ', capturedTab , ', capturedTab)
    if(!capturedTab){
        chrome.tabCapture.getCapturedTabs((capturedArr) => {
            if (!capturedArr.some((capturedTab) => capturedTab.tabId === tab.id && capturedTab.status === "active")) {
                captureStream(tab)
            } else {
                console.log('capturedArr:', capturedArr)
                chrome.tabCapture.onStatusChanged.removeListener(reviveCapture);
            }
        });
    }else {
        stopRecording()
    }
});

chrome.tabCapture.onStatusChanged.addListener(reviveCapture);

/**
 * chrome.tabCapture.getCapturedTabs 返回已经请求捕获或者正在捕获的标签页列表，即 status != "stopped" 并且 status != "error"。
 * @param info
 */
function reviveCapture(info) {
    if (info.status === "stopped" || info.status === "error") {
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
            if (info.tabId === tabs[0].id) {
                captureStream(info)
            }
        });
    }
}

/**
 *
 */
function captureStream(info) {
    capturedTab = info;
    console.log('captureStream', info)
    let video_constraints = {
        mandatory: {
            chromeMediaSource: 'tab',
            minWidth: 1920,
            minHeight: 1080,
            maxWidth: 1920,
            maxHeight: 1080,
            minFrameRate: 60,
            maxFrameRate: 60
        }
    };

    let constraints = {
        audio: true,
        video: true,
        videoConstraints: video_constraints
    };

    console.log('tabCapture.capture constraints', JSON.stringify(constraints, null, '    '))
    chrome.tabCapture.capture(constraints, (stream) => {
        console.log('tabCapture.capture get stream', stream);
        startRecord(stream)
    });
}

/*********************************************************录制*****************************************************/
let recorder;
let data = [];
function startRecord(stream) {
    console.log('startRecord', stream)
    // Continue to play the captured audio to the user.
    const output = new AudioContext();
    const source = output.createMediaStreamSource(stream);
    source.connect(output.destination);

    // Start recording.
    recorder = new MediaRecorder(stream, {mimeType: 'video/webm'});
    recorder.ondataavailable = (event) => data.push(event.data);
    recorder.onstop = () => {
        const blob = new Blob(data, {type: 'video/webm'});
        window.open(URL.createObjectURL(blob), '_blank');

        // Clear state ready for next recording
        recorder = undefined;
        data = [];
    };
    recorder.start();

    // Record the current state in the URL. This provides a very low-bandwidth
    // way of communicating with the service worker (the service worker can check
    // the URL of the document and see the current recording state). We can't
    // store that directly in the service worker as it may be terminated while
    // recording is in progress. We could write it to storage but that slightly
    // increases the risk of things getting out of sync.
    window.location.hash = 'recording';
    chrome.browserAction.setIcon({path: '/icons/recording.png'});
}


/**
 * Stop recording.
 * @returns {Promise<void>}
 */
async function stopRecording() {
    capturedTab = null
    chrome.browserAction.setIcon({path: 'icons/recording_idlepng'});

    if(recorder){
        recorder.stop();

        // Stopping the tracks makes sure the recording icon in the tab is removed.
        recorder.stream.getTracks().forEach((t) => t.stop());
    }

    // Update current state in URL
    window.location.hash = '';

    // Note: In a real extension, you would want to write the recording to a more
    // permanent location (e.g IndexedDB) and then close the offscreen document,
    // to avoid keeping a document around unnecessarily. Here we avoid that to
    // make sure the browser keeps the Object URL we create (see above) and to
    // keep the sample fairly simple to follow.
}
