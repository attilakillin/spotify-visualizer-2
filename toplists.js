function loadSongData(target, data, offset) {
    target.innerHTML = '';
    data.forEach((elem, i) => {
        target.innerHTML += `<tr>
            <th scope="row">${i + offset + 1}</th>
            <td>${elem.title}</td>
            <td>${elem.artist}</td>
            <td>${elem.count}</td>
            <td>${elem.time.toFixed(1)} mins</td>
        </tr>`;
    });
}

function loadArtistData(target, data, offset) {
    target.innerHTML = '';
    data.forEach((elem, i) => {
        target.innerHTML += `<tr>
            <th scope="row">${i + offset + 1}</th>
            <td>${elem.artist}</td>
            <td>${elem.count}</td>
            <td>${elem.time.toFixed(1)} mins</td>
        </tr>`;
    });
}

let song_data = {
    offset: 0,
    current_sort: undefined,
    comparer: undefined
};
let artist_data = {
    offset: 0,
    current_sort: undefined,
    comparer: undefined
};

// Display toplists that are sortable and contain a bunch of other utility functions.
displayToplists = () => {
    // Aggregate song data if not done already.
    if (!window.views.toplist_by_song) {
        const map = window.parsedData.reduce(
            (result, current) => {
                let elem = result.get(`${current.trackName} ${current.artistName}`);
                if (!elem) {
                    result.set(`${current.trackName} ${current.artistName}`, {
                        title: current.trackName,
                        artist: current.artistName,
                        count: 1,
                        time: Number(current.msPlayed)
                    });
                } else {
                    elem.count += 1;
                    elem.time += Number(current.msPlayed);
                }
                return result;
            }, new Map()
        );
        window.views.toplist_by_song = Array.from(map.values());

        // Map to minutes.
        window.views.toplist_by_song.forEach(elem => elem.time /= 60 * 1000);
    }

    // Aggregate artist data if not done already.
    if (!window.views.toplist_by_artist) {
        const map = window.parsedData.reduce(
            (result, current) => {
                let elem = result.get(current.artistName);
                if (!elem) {
                    result.set(current.artistName, {
                        artist: current.artistName,
                        count: 1,
                        time: Number(current.msPlayed)
                    });
                } else {
                    elem.count += 1;
                    elem.time += Number(current.msPlayed);
                }
                return result;
            }, new Map()
        );
        window.views.toplist_by_artist = Array.from(map.values());

        // Map to minutes.
        window.views.toplist_by_artist.forEach(elem => elem.time /= 60 * 1000);
    }

    // Set element counts
    document.querySelector('#song-footer-count').innerHTML = window.views.toplist_by_song.length + ' rows';
    document.querySelector('#artist-footer-count').innerHTML = window.views.toplist_by_artist.length + ' rows';

    // Load both tables by count descending.
    song_data.current_sort = undefined;
    artist_data.current_sort = undefined;
    document.querySelector('#songs-by-count').click();
    document.querySelector('#artists-by-count').click();
};

function renderToplist(metadata, selectorPrefix) {
    let data = window.views[`toplist_by_${selectorPrefix}`]
        .sort(metadata.comparer)
        .slice(metadata.offset, metadata.offset + 10);
    let byCount = document.querySelector(`#${selectorPrefix}s-by-count`);
    let byTime = document.querySelector(`#${selectorPrefix}s-by-time`);
    byCount.innerHTML = 'Count';
    byTime.innerHTML = 'Stream time';

    switch (metadata.current_sort) {
        case 'count-down': byCount.innerHTML += ' &#x25be;'; break;
        case 'count-up': byCount.innerHTML += ' &#x25b4;'; break;
        case 'time-down': byTime.innerHTML += ' &#x25be;'; break;
        case 'time-up': byTime.innerHTML += ' &#x25b4;'; break;
    }
    let loaderFunc = (selectorPrefix === 'song') ? loadSongData : loadArtistData;
    loaderFunc(document.querySelector(`#${selectorPrefix}-table tbody`), data, metadata.offset);
}

document.querySelector('#songs-by-count').onclick = () => {
    song_data.offset = 0;
    song_data.current_sort = (song_data.current_sort === 'count-down') ? 'count-up' : 'count-down';
    song_data.comparer = (song_data.current_sort === 'count-down')
        ? ((a, b) => a.count < b.count)
        : ((a, b) => a.count > b.count);

    renderToplist(song_data, 'song');
};

document.querySelector('#songs-by-time').onclick = () => {
    song_data.offset = 0;
    song_data.current_sort = (song_data.current_sort === 'time-down') ? 'time-up' : 'time-down';
    song_data.comparer = (song_data.current_sort === 'time-down')
        ? ((a, b) => a.time < b.time)
        : ((a, b) => a.time > b.time);

    renderToplist(song_data, 'song');
};

document.querySelector('#artists-by-count').onclick = () => {
    artist_data.offset = 0;
    artist_data.current_sort = (artist_data.current_sort == 'count-down') ? 'count-up' : 'count-down';
    artist_data.comparer = (artist_data.current_sort === 'count-down')
        ? ((a, b) => a.count < b.count)
        : ((a, b) => a.count > b.count);

    renderToplist(artist_data, 'artist');
};

document.querySelector('#artists-by-time').onclick = () => {
    artist_data.offset = 0;
    artist_data.current_sort = (artist_data.current_sort == 'time-down') ? 'time-up' : 'time-down';
    artist_data.comparer = (artist_data.current_sort === 'time-down')
        ? ((a, b) => a.time < b.time)
        : ((a, b) => a.time > b.time);

    renderToplist(artist_data, 'artist');
};

document.querySelector('#song-next-button').onclick = () => {
    song_data.offset = Math.min(song_data.offset + 10, window.views.toplist_by_song.length - 1);
    renderToplist(song_data, 'song');
}

document.querySelector('#artist-next-button').onclick = () => {
    artist_data.offset = Math.min(artist_data.offset + 10, window.views.toplist_by_artist.length - 1);
    renderToplist(artist_data, 'artist');
}

document.querySelector('#song-prev-button').onclick = () => {
    song_data.offset = Math.max(song_data.offset - 10, 0);
    renderToplist(song_data, 'song');
}

document.querySelector('#artist-prev-button').onclick = () => {
    artist_data.offset = Math.max(artist_data.offset - 10, 0);
    renderToplist(artist_data, 'artist');
}
