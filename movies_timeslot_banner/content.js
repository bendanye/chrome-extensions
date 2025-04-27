chrome.storage.sync.get(['shaw_theatre', 'shaw_time'], function (data) {
    setTimeout(() => {
        const url = chrome.runtime.getURL('singapore_ph.json');
        fetch(url)
            .then((response) => response.json())
            .then((json) => check(json));

        function check(holidays) {
            const pageUrl = window.location.href;

            if (pageUrl.includes('gv.com.sg')) {
                checkForGoldenVillage()
            } else if (pageUrl.includes('shaw.sg')) {
                checkForshaw(data.shaw_theatre, data.shaw_time, holidays)
            }

            function checkForGoldenVillage() {
                const dateRegex = /\b(Sun|Mon|Tue|Wed|Thu|Fri|Sat), (\d{1,2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4})\b/;
                const timeRegex = /\b(0?[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)\b/i;
                const theatreRegex = /([\w\s]+Hall \d+)/

                let message = ''

                const pageText = document.body.innerText;

                const theatreMatch = pageText.match(theatreRegex);
                if (theatreMatch) {
                    message = theatreMatch[0];
                }

                const dateMatch = pageText.match(dateRegex);
                if (dateMatch) {
                    message += ' ' + dateMatch[0];
                }

                const timeMatch = pageText.match(timeRegex);
                if (timeMatch) {
                    message += ' ' + timeMatch[0];
                }

                if (message) {
                    showDateBanner(message)
                }
            }

            function checkForshaw(preferredTheatre, preferredTiming, holidays) {
                const dateRegex = /\b(SUN|MON|TUE|WED|THU|FRI|SAT) (\d{1,2}) (JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (\d{4})\b/;
                const timeRegex = /\b(0?[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)\b/i;
                const theatreRegex = /\bShaw Theatres\b[\s\S]*\b(\d+)\b/

                let message = ''

                const pageText = document.body.innerText;

                const theatreMatch = pageText.match(theatreRegex);
                if (theatreMatch) {
                    const theatre = theatreMatch[0].split("Hall")[0]
                    if (preferredTheatre) {
                        if (theatre.includes(preferredTheatre)) {
                            message = `<span class="ok">${theatre}</span>`
                        } else {
                            message = `<span class="highlight">${theatre}</span>`
                        }
                    } else {
                        message = theatre
                    }
                }

                const dateMatch = pageText.match(dateRegex);
                if (dateMatch) {
                    if (dateMatch[0].includes("SAT ") || dateMatch[0].includes("SUN ") || isPublicHoliday(holidays, dateMatch[0])) {
                        message += ' ' + `<span class="ok">${dateMatch[0]}</span>`
                    } else {
                        message += ' ' + `<span class="highlight">${dateMatch[0]}</span>`;
                    }
                }

                const timeMatch = pageText.match(timeRegex);
                if (timeMatch) {
                    time = timeMatch[0]
                    if (preferredTiming) {
                        let time1Minutes = convertTo24HourFormat(preferredTiming);
                        let time2Minutes = convertTo24HourFormat(time);

                        if (time1Minutes < time2Minutes) {
                            message += ' ' + `<span class="highlight">${time}</span>`
                        } else {
                            message += ' ' + `<span class="ok">${time}</span>`;
                        }
                    } else {
                        message += ' ' + time;
                    }
                }

                const singleDateMatchOnly = message.match(dateRegex);

                if (message && singleDateMatchOnly) {
                    showDateBanner(message)
                }
            }

            //TODO currently only support shaw date format
            function isPublicHoliday(holidays, selectedDate) {
                const parts = selectedDate.split(' ');
                const [_, dateStr, monthStr, yearStr] = parts;

                const monthMap = {
                    JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
                    JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11
                };
                const dateObj = new Date(yearStr, monthMap[monthStr], parseInt(dateStr));

                // Format manually
                const year = dateObj.getFullYear();
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const day = String(dateObj.getDate()).padStart(2, '0');

                const formattedDate = `${year}-${month}-${day}`;

                return holidays.some(holiday => holiday.date === formattedDate);
            }

            function convertTo24HourFormat(timeStr) {
                let match = timeStr.match(/^(\d{1,2}):?(\d{2})?\s?(AM|PM)?$/i);
                if (!match) return null;

                let hours = parseInt(match[1], 10);
                let minutes = parseInt(match[2] || "00", 10);
                let period = match[3] ? match[3].toUpperCase() : "";

                if (period === "PM" && hours !== 12) {
                    hours += 12;
                } else if (period === "AM" && hours === 12) {
                    hours = 0;
                }

                return hours * 60 + minutes;
            }

            function showDateBanner(message) {
                const banner = document.createElement('div');
                banner.id = 'timeslot-banner';
                banner.innerHTML = `Selected slot: ${message}`;

                document.body.insertBefore(banner, document.body.firstChild);
            }
        }

    }, 1000);
});


