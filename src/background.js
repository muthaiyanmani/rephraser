chrome.runtime.onInstalled.addListener(function () {
  console.log("Hello from background");
});

// chrome.action.setIcon({ path: "/public/assets/logo-success-48.png" });