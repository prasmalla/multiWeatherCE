/* eslint-disable */

const globalVar = 20;

document.addEventListener("DOMContentLoaded", function() {
  function injectTheScript() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // query the active tab, which will be only one tab
      //and inject the script in it
      chrome.tabs.executeScript(tabs[0].id, { file: "main.js" });
    });
  }
  
  document.getElementById('clickactivity').addEventListener('click', () => {
    // form values not working right now
    // const form1Location = document.getElementById('location1').value;
    // console.log(form1Location);
    injectTheScript();
    // let newMessage = document.getElementById('textInput').value;
  });
})