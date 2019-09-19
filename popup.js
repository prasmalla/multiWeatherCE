document.getElementById("clickactivity").addEventListener("click", () => {
  const zips = {
    location1: document.getElementById("location1").value,
    location2: document.getElementById("location2").value,
    location3: document.getElementById("location3").value,
    location4: document.getElementById("location4").value
  };
  chrome.tabs.executeScript(
    {
      code: "let zipCodes = JSON.parse('" + JSON.stringify(zips) + "');"
    },
    function() {
      chrome.tabs.executeScript({
        file: "main.js"
      });
    }
  );
});
