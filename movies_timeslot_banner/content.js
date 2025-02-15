setTimeout(() => {
    const pageUrl = window.location.href;
    if (pageUrl.includes('gv.com.sg')) {
        checkForGoldenVillage()
    } else if (pageUrl.includes('shaw.sg')) {
        checkForshaw()
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

    function checkForshaw() {
        const dateRegex = /\b(SUN|MON|TUE|WED|THU|FRI|SAT) (\d{1,2}) (JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (\d{4})\b/;
        const timeRegex = /\b(0?[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)\b/i;
        const theatreRegex = /\bShaw Theatres\b[\s\S]*\b(\d+)\b/

        let message = ''

        const pageText = document.body.innerText;

        const theatreMatch = pageText.match(theatreRegex);
        if (theatreMatch) {
            message = theatreMatch[0].split("Hall")[0];
        }

        const dateMatch = pageText.match(dateRegex);
        if (dateMatch) {
            message += ' ' + dateMatch[0];
        }

        const timeMatch = pageText.match(timeRegex);
        if (timeMatch) {
            message += ' ' + timeMatch[0];
        }

        const singleDateMatchOnly = message.match(dateRegex);

        if (message && singleDateMatchOnly) {
            showDateBanner(message)
        }
    }

    function showDateBanner(message) {
        const banner = document.createElement('div');
        banner.id = 'timeslot-banner';
        banner.textContent = `Selected slot: ${message}`;

        document.body.insertBefore(banner, document.body.firstChild);
    }

}, 1000);


