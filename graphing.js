// Display a pie and a bar chart color coded by the amount of listening time
// grouped by the hour of the day of the stream.
function displayHourly(targetId) {
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
    const parent = document.getElementById(targetId).parentElement;
    Plotly.newPlot(document.getElementById(targetId), [
        {
            theta: Object.keys(data).map(h => String(h).padStart(2, '0') + 'h'),
            r: Object.values(data),
            type: 'barpolar',
            xaxis: 'x1',
            yaxis: 'y1',
            marker: {
                color: Object.values(data),
                colorscale: window.getColorscale(),
                autocolorscale: false
            }
        },
        {
            x: Object.keys(data).map(h => String(h).padStart(2, '0') + 'h'),
            y: Object.values(data),
            xaxis: 'x2',
            yaxis: 'y2',
            type: 'bar',
            marker: {
                color: Object.values(data),
                colorscale: window.getColorscale(),
                autocolorscale: false
            }
        }
    ], {
        title: 'Average listening time (in minutes) in each hour of an average day',
        grid: {
            rows: (parent.offsetWidth >= 1200) ? 1 : 2,
            columns: (parent.offsetWidth >= 1200) ? 2 : 1,
            pattern: 'independent'
        },
        polar: {
            radialaxis: { angle: 90, nticks: 5, ticksuffix: 'm', tickangle: 90, gridcolor: "#aaaaaa" },
            angularaxis: { direction: 'clockwise', dtick: 2, gridcolor: "#bbbbbb" }
        },
        
        xaxis2: { dtick: 3, gridcolor: "#bbbbbb" },
        yaxis2: { nticks: 5, ticksuffix: 'm', gridcolor: "#aaaaaa" },

        showlegend: false,
        width: parent.offsetWidth,
        height: parent.offsetHeight
    });

    // Set resize event handler to resize plot whenever the window size changes.
    window.onresize = () => {
        const parent = document.getElementById(targetId).parentElement;
        Plotly.relayout(document.getElementById(targetId), {
            grid: {
                rows: (parent.offsetWidth >= 1200) ? 1 : 2,
                columns: (parent.offsetWidth >= 1200) ? 2 : 1,
                pattern: 'independent'
            },
            width: parent.offsetWidth,
            height: parent.offsetHeight
        });
    };
}
