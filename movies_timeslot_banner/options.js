document.addEventListener('DOMContentLoaded', function () {
    const shaw_theatre = document.getElementById("shaw_theatre");
    chrome.storage.sync.get(['shaw_theatre', 'shaw_time'], function (data) {
        if (data.shaw_theatre) {
            shaw_theatre.value = value = data.shaw_theatre
        }
        if (data.shaw_time) {
            document.getElementById('shaw_time').value = data.shaw_time;
        }
    });
});

// Save settings when form is submitted
document.getElementById('settingsForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const selectedOption = shaw_theatre.value;
    const time = document.getElementById('shaw_time').value;

    chrome.storage.sync.set({ shaw_theatre: selectedOption, shaw_time: time }, function () {
        console.log('Settings saved');
    });
});