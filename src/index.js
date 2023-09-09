let changeColor = document.getElementById("changeColor");


changeColor.addEventListener("click", async() => {
    let inputtag = document.querySelector("#tagcolor");
    chrome.storage.sync.set({ inputtag: inputtag.value });
 
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
 
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: setBorderColor,
    });
 });
 
 function setBorderColor() {
    chrome.storage.sync.get("inputtag", ({ inputtag }) => {
      document.querySelectorAll(inputtag).forEach((element) => {
        element.style.border = "1px solid red";
      });
    });
};