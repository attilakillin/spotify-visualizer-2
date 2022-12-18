# Spotify Visualizer 2

An in-browser music streaming history visualizer built on Plotly.js and Bootstrap 5.

[https://attilakillin.github.io/spotify-visualizer-2](https://attilakillin.github.io/spotify-visualizer-2/)

Runs completely locally, in the browser, no backend is needed.

## Features

Both Spotify and Apple Music provide ways to download your data, which includes your streaming history in a structured format
(either JSON or CSV). This application parses the streaming data downloaded from either platform, and visualizes your habits in
a number of ways.

### Hourly visualization

Across all your streams, how much music did you listen to in any one hour of an average day?
Currently it is assumed that the uploaded files cover the span of one year.

![](https://user-images.githubusercontent.com/43002846/208313795-2eeacb76-7bf6-4bd9-9584-4afc76984dc8.png)

### Daily visualization

Across all your streams, how much music did you listen to on each specific day of the year?
Currently it is assumed that the uploaded files cover the span of one year.

![](https://user-images.githubusercontent.com/43002846/208313912-eb0b563f-30d9-4ac1-bf19-89780756f977.png)

### Colors!

Everything is better with a little variety! To change the color of the graphs,
simply select your preferred choice in the upper right corner and the graphs will update instantly.

Each graph is color coded with subtle shade differences in the base color, with darker colors meaning higher values.

![](https://user-images.githubusercontent.com/43002846/208314219-8cbdabfd-96a2-4ea4-8809-eeea15efdea9.png)

## Objectives

The goal of this project was to provide additional insight into my listening habits above the basic top 10 lists
that Spotify compiles for you in Spotify Wrapped. A year ago, [I wrote a similar parser in R](https://github.com/attilakillin/spotify-visualizer),
but because of the R environment, quickly deploying the application anywhere proved difficult.

In the current project, I self-imposed some constraints:

* The project needs to be written as a web application to ease portability and accessability.
* The application has to run in itself, locally, without any backend or server to communicate with.
* The application source must be able to run as is, without any compilation before deployment.
* The interface needs to be intuitive and responsive.

As such, the whole site is a self-contained HTML file, with its logic separated in a few JS scripts. The three required libraries
(Bootstrap, Plotly.js, and D3.js) are downloaded from CDNs when the main HTML file is loaded.
