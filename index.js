// Display a pie and a bar chart color coded by the amount of listening time
// grouped by the hour of the day of the stream.
function displayHourly() {
    // Aggregate data (in milliseconds).
    const data = window.parsedData.reduce(
        (result, current) => {
            const hour = current.endTime.getHours();
            result[hour] = (result[hour] || 0) + Number(current.msPlayed);
            return result;
        }, {}
    );

    // Map to minutes.
    Object.keys(data).forEach(key => data[key] /= 60 * 1000 * 365);

    // Display graphs.
    Plotly.newPlot(document.getElementById('plotly-root'), [
        {
            theta: Object.keys(data).map(h => String(h).padStart(2, '0') + 'h'),
            r: Object.values(data),
            type: 'barpolar',
            marker: {
                color: Object.values(data),
                colorscale: 'Greens',
                reversescale: true
            }
        }
    ], {
        title: 'Average listening time (in minutes) in each hour of an average day',
        polar: {
            radialaxis: { angle: 90, dtick: 5, ticksuffix: 'm', tickangle: 90 },
            angularaxis: { direction: 'clockwise', dtick: 2 }
        }
    }, {
        responsive: true
    });
}
