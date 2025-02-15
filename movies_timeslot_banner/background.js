console.log("Background script loaded!");

chrome.runtime.onInstalled.addListener(() => {
    console.log("Timeslot Extractor Extension Installed!");
});

// Keep the service worker alive
chrome.alarms.create("keepAlive", { periodInMinutes: 5 });

chrome.alarms.onAlarm.addListener(() => {
    console.log("Service Worker is still alive");
});