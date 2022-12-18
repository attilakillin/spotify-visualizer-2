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
        xaxis: { fixedrange: true },
        yaxis: { fixedrange: true },
        xaxis2: { 
            title: { text: 'Hour of day', font: { family: 'Sans-Serif', size: 18 } },
            dtick: 3, gridcolor: '#bbbbbb', linecolor: '#aaaaaa',
            tickfont:  { family: 'Sans-Serif', size: 16 }, fixedrange: true,
        },
        yaxis2: {
            title: { text: 'Minutes listened (per day)', font: { family: 'Sans-Serif', size: 18 } },
            nticks: 5, gridcolor: '#aaaaaa', linecolor: '#aaaaaa',
            tickfont:  { family: 'Sans-Serif', size: 16 }, fixedrange: true,
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
    if (!window.views.daily_doy) {
        // Aggregate data (in milliseconds).
        window.views.daily_doy = window.parsedData.reduce(
            (result, current) => {
                const day = current.endTime.getDayOfYear();
                result[day] = (result[day] || 0) + Number(current.msPlayed);
                return result;
            }, {}
        );
    
        // Map to minutes.
        Object.keys(window.views.daily_doy).forEach(key => window.views.daily_doy[key] /= 60 * 1000);
    }

    if (!window.views.daily_waffle) {
        // Compile waffle plot data (in milliseconds).
        const data = window.parsedData.reduce(
            (result, current) => {
                const dow = (current.endTime.getDay() || 7) - 1;
                const week = current.endTime.getWeekOfYear();

                if (!result[week]) result[week] = {};
                result[week][6 - dow] = (Number(result[week][6 - dow]) || 0) + Number(current.msPlayed);
                return result;
            }, {}
        );

        // Map to minutes.
        Object.keys(data).forEach(week => Object.keys(data[week]).forEach(day => data[week][day] /= 60 * 1000));

        // Convert to 2D array for heatmap rendering.
        window.views.daily_waffle = Array(7).fill().map(() => Array(53).fill(0));
        Object.keys(data).forEach(week => Object.keys(data[week]).forEach(day =>
            window.views.daily_waffle[day][week - 1] = data[week][day]));
    }

    if (!window.views.daily_doy_avg) {
        // Convert object keys into ordered array values.
        const doyAsArray = Array(Object.keys(window.views.daily_doy).length).fill(0);
        Object.keys(window.views.daily_doy).forEach(day => doyAsArray[day - 1] = window.views.daily_doy[day]);

        // Create average data.
        window.views.daily_doy_avg = {};
        const avgs = getArrayMovingAverage(doyAsArray, 7);
        for (let i = 0; i < avgs.length; i++) { window.views.daily_doy_avg[i + 1] = avgs[i]; };
    }

    const data_doy = window.views.daily_doy;
    const data_doy_avg = window.views.daily_doy_avg;
    const data_waffle = window.views.daily_waffle;

    // Display graphs.
    const parent = document.getElementById(targetId).parentElement;
    Plotly.newPlot(document.getElementById(targetId), [
        {
            y: ['Sun', 'Sat', 'Fri', 'Thu', 'Wed', 'Tue', 'Mon'],
            z: data_waffle,
            type: 'heatmap',
            xgap: 5,
            ygap: 5,
            showscale: false,
            colorscale: window.getDistinctZeroColorscale(),
            autocolorscale: false
        },
        {
            x: Object.keys(data_doy),
            y: Object.values(data_doy),
            xaxis: 'x2',
            yaxis: 'y2',
            type: 'bar',
            marker: {
                color: Object.values(data_doy),
                colorscale: window.getColorscale(),
                autocolorscale: false
            }
        },
        {
            x: Object.keys(data_doy_avg),
            y: Object.values(data_doy_avg),
            xaxis: 'x2',
            yaxis: 'y2',
            type: 'line',
            line: {
                color: '#000000'
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
            fixedrange: true,
            zeroline: false,
            showgrid: false
        },
        yaxis: {
            fixedrange: true,
            zeroline: false,
            showgrid: false
        },
        xaxis2: {
            gridcolor: '#bbbbbb', linecolor: '#aaaaaa', fixedrange: true,
            tickvals: [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335],
            ticktext: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            tickfont:  { family: 'Sans-Serif', size: 16 }
        },
        yaxis2: {
            title: { text: 'Minutes listened', font: { family: 'Sans-Serif', size: 18 } },
            nticks: 5, gridcolor: '#aaaaaa', linecolor: '#aaaaaa', fixedrange: true,
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
                height: parent.offsetHeight,
            });
        }
    };
}
