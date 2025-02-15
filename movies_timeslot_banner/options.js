document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get(['theatre', 'time'], function (data) {
        if (data.theatre) {
            document.getElementById('theatre').value = data.theatre;
        }
        if (data.time) {
            document.getElementById('time').value = data.time;
        }
    });
});

// Save settings when form is submitted
document.getElementById('settingsForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const theatre = document.getElementById('theatre').value;
    const time = document.getElementById('time').value;

    chrome.storage.sync.set({ theatre: theatre, time: time }, function () {
        console.log('Settings saved');
    });
});