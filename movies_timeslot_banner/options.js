document.addEventListener('DOMContentLoaded', function () {
    const theatre = document.getElementById("theatre");
    chrome.storage.sync.get(['theatre', 'time'], function (data) {
        if (data.theatre) {
            theatre.value = value = data.theatre
        }
        if (data.time) {
            document.getElementById('time').value = data.time;
        }
    });
});

// Save settings when form is submitted
document.getElementById('settingsForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const selectedOption = theatre.value;
    const time = document.getElementById('time').value;

    chrome.storage.sync.set({ theatre: selectedOption, time: time }, function () {
        console.log('Settings saved');
    });
});