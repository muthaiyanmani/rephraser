// Getting API key from user input
const tokenForm = document.getElementById("tokenForm");
tokenForm.addEventListener("submit", saveToken);

function saveToken(e) {
  e.preventDefault();
  const token = document.getElementById("apiToken").value;
  chrome.storage.local.set({ apiToken: token }, function () {
    chrome.action.setIcon({ path: "/public/assets/logo-success-48.png" });
  });
}

// Get token from the localstorage
chrome.storage.local.get(["apiToken"], function (items) {
  if (items.apiToken) {
    document.getElementById("apiToken").value = items.apiToken;
    chrome.action.setIcon({ path: "/public/assets/logo-success-48.png" });
  } else {
    chrome.action.setIcon({ path: "/public/assets/logo-warn-48.png" });
  }
});
