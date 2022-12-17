// Display a pie and a bar chart color coded by the amount of listening time
// grouped by the hour of the day of the stream.
function displayHourly(targetId) {
    if (!window.views.hourly) {
        // Aggregate data (in milliseconds).
        window.views.hourly = window.parsedData.reduce(
            (result, current) => {
                const hour = current.endTime.getHours();
                result[hour] = (result[hour] || 0) + Number(current.msPlayed);
                return result;
            }, {}
        );
    
        // Map to minutes.
        Object.keys(window.views.hourly).forEach(key => window.views.hourly[key] /= 60 * 1000 * 365);
    }

    const data = window.views.hourly;

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
        title: {
            text: 'Hourly distribution of listening time<br>' +
            '<sup>Average listening time (in minutes) in each hour of an average day</sup>',
            font: { family: 'Sans-Serif', size: 28 }
        },
        grid: {
            rows: (parent.offsetWidth >= 1200) ? 1 : 2,
            columns: (parent.offsetWidth >= 1200) ? 2 : 1,
            pattern: 'independent'
        },
        polar: {
            radialaxis: {
                linecolor: '#aaaaaa', tickfont:  { family: 'Sans-Serif', size: 16 },
                angle: 90, nticks: 5, tickangle: 90, gridcolor: '#aaaaaa'
            },
            angularaxis: {
                linecolor: '#aaaaaa', tickfont:  { family: 'Sans-Serif', size: 16 },
                direction: 'clockwise', dtick: 2, gridcolor: '#bbbbbb'
            }
        },

        xaxis2: { 
            title: { text: 'Hour of day', font: { family: 'Sans-Serif', size: 18 } },
            dtick: 3, gridcolor: '#bbbbbb', linecolor: '#aaaaaa',
            tickfont:  { family: 'Sans-Serif', size: 16 }
        },
        yaxis2: {
            title: { text: 'Minutes listened (per day)', font: { family: 'Sans-Serif', size: 18 } },
            nticks: 5, gridcolor: '#aaaaaa', linecolor: '#aaaaaa',
            tickfont:  { family: 'Sans-Serif', size: 16 }
        },

        showlegend: false,
        width: parent.offsetWidth,
        height: parent.offsetHeight
    });

    // Set resize event handler to resize plot whenever the window size changes.
    window.onresize = () => {
        const target = document.getElementById(targetId);
        const parent = target.parentElement;
        if (target.innerHTML) {
            Plotly.relayout(target, {
                grid: {
                    rows: (parent.offsetWidth >= 1200) ? 1 : 2,
                    columns: (parent.offsetWidth >= 1200) ? 2 : 1,
                    pattern: 'independent'
                },
                width: parent.offsetWidth,
                height: parent.offsetHeight
            });
        }
    };
}

// Display a GitHub-like heatmap chart and a simple bar chart color coded by the
// amount of listening time grouped by the day of the year of the stream.
function displayDaily(targetId) {
    if (!window.views.daily) {
        // Aggregate data (in milliseconds).
        window.views.daily = window.parsedData.reduce(
            (result, current) => {
                const day = current.endTime.getDayOfYear();
                result[day] = (result[day] || 0) + Number(current.msPlayed);
                return result;
            }, {}
        );
    
        // Map to minutes.
        Object.keys(window.views.daily).forEach(key => window.views.daily[key] /= 60 * 1000);
    }

    const data = window.views.daily;

    // Display graphs.
    const parent = document.getElementById(targetId).parentElement;
    Plotly.newPlot(document.getElementById(targetId), [
        {
            x: Object.keys(data),
            y: Object.values(data),
            type: 'bar',
            marker: {
                color: Object.values(data),
                colorscale: window.getColorscale(),
                autocolorscale: false
            }
        }
    ], {
        title: {
            text: 'Daily distribution of listening time<br>' +
            '<sup>Total listening time (in minutes) on each day of the year</sup>',
            font: { family: 'Sans-Serif', size: 28 }
        },
        grid: {
            rows: 2,
            columns: 1,
            pattern: 'independent'
        },

        xaxis: {
            gridcolor: '#bbbbbb', linecolor: '#aaaaaa',
            tickvals: [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335],
            ticktext: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            tickfont:  { family: 'Sans-Serif', size: 16 }
        },
        yaxis: {
            title: { text: 'Minutes listened', font: { family: 'Sans-Serif', size: 18 } },
            nticks: 5, gridcolor: '#aaaaaa', linecolor: '#aaaaaa',
            tickfont:  { family: 'Sans-Serif', size: 16 }
        },

        showlegend: false,
        width: parent.offsetWidth,
        height: parent.offsetHeight
    });

    // Set resize event handler to resize plot whenever the window size changes.
    window.onresize = () => {
        const target = document.getElementById(targetId);
        const parent = target.parentElement;
        if (target.innerHTML) {
            Plotly.relayout(target, {
                width: parent.offsetWidth,
                height: parent.offsetHeight
            });
        }
    };
}
