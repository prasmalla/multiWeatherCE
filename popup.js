function injectTheScript() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // query the active tab, which will be only one tab
    //and inject the script in it
    chrome.tabs.executeScript(tabs[0].id, { file: "main.js" });
  });
}

document.getElementById('clickactivity').addEventListener('click', injectTheScript);
