// This variable will be used to track the parsed streaming history.
window.parsedData = [];

// Parse and append a JSON array. Used by Spotify.
function parseJSONFile(text) {
    const entries = JSON.parse(text)
        .map(entry => ({ ...entry, endTime: new Date(entry.endTime) }));

    window.parsedData = window.parsedData.concat(entries);
}

// Parse and append a CSV file structure. Used by Apple Music.
function parseCSVFile(text) {
    const entries = d3.csvParse(text)
        .filter(entry => entry["Event Type"] === "PLAY_END" && entry["Play Duration Milliseconds"] > 0)
        .map(entry => ({
            endTime: new Date(entry["Event End Timestamp"]),
            artistName: entry["Artist Name"],
            trackName: entry["Song Name"],
            msPlayed: entry["Play Duration Milliseconds"]
        }));

    window.parsedData = window.parsedData.concat(entries);
}

// Handle file uploading and redirect processing to relevant parser method.
// As multiple files can be parsed together, the parsedData variable is only reset here.
const form = document.getElementById('file-input-form');
form.addEventListener('submit', (event) => {
    window.switchDisplay('content-loading');
    window.showNavigation(false);

    event.preventDefault();
    window.parsedData = [];

    for (const file of form.querySelector('#file-input').files) {
        const reader = new FileReader();

        switch (file.name.split('.').pop().toLowerCase()) {
            case 'json': reader.addEventListener('load', e => parseJSONFile(e.target.result)); break;
            case 'csv': reader.addEventListener('load', e => parseCSVFile(e.target.result)); break;
        }

        reader.addEventListener('load', () => {
            window.switchDisplay('content-loaded', `
                <p>File(s) parsed, ${window.parsedData.length} entries loaded.</p>
                <p>Click on one of the navigation bar items to display the results!</p>
            `);
            window.showNavigation(true);
        });
        
        reader.readAsText(file);
    }
});
