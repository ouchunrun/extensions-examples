# chrome.tabCapture recorder

This sample demonstrates how to use the [`chrome.tabCapture`](https://developer.chrome.com/docs/extensions/reference/tabCapture/) API to record in the background, using a service worker and [offscreen document](https://developer.chrome.com/docs/extensions/reference/offscreen/).

## Overview

In this sample, clicking the action button starts recording the current tab in an offscreen document. After 30 seconds, or once the action button is clicked again, the recording ends and is saved as a download.
