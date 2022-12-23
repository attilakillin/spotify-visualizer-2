function loadSongData(target, data) {
    target.innerHTML = '';
    data.forEach(elem => {
        target.innerHTML += `<tr>
            <td>${elem.title}</td>
            <td>${elem.artist}</td>
            <td>${elem.count}</td>
            <td>${elem.time.toFixed(1)} mins</td>
        </tr>`;
    });
}

function loadArtistData(target, data) {
    target.innerHTML = '';
    data.forEach(elem => {
        target.innerHTML += `<tr>
            <td>${elem.artist}</td>
            <td>${elem.count}</td>
            <td>${elem.time.toFixed(1)} mins</td>
        </tr>`;
    });
}

const limit = 10; // TODO Make this modifyable
let song_current_sort = undefined;
let artist_current_sort = undefined;

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

    // Load both tables by count descending.
    song_current_sort = undefined;
    artist_current_sort = undefined;
    document.querySelector('#songs-by-count').click();
    document.querySelector('#artists-by-count').click();
};

document.querySelector('#songs-by-count').onclick = () => {
    let target = document.querySelector(`#song-table tbody`);
    song_current_sort = (song_current_sort === 'count-down') ? 'count-up' : 'count-down';
    const comparer = (song_current_sort === 'count-down')
        ? ((a, b) => a.count < b.count)
        : ((a, b) => a.count > b.count);

    let data = window.views.toplist_by_song.sort(comparer).slice(0, limit);
    document.querySelector('#songs-by-count').innerHTML = 'Count ' +
        ((song_current_sort === 'count-down') ? '&#x25be;' : '&#x25b4;');
    document.querySelector('#songs-by-time').innerHTML = 'Stream time';
    loadSongData(target, data);
};

document.querySelector('#songs-by-time').onclick = () => {
    let target = document.querySelector(`#song-table tbody`);
    song_current_sort = (song_current_sort === 'time-down') ? 'time-up' : 'time-down';
    const comparer = (song_current_sort === 'time-down')
        ? ((a, b) => a.time < b.time)
        : ((a, b) => a.time > b.time);

    let data = window.views.toplist_by_song.sort(comparer).slice(0, limit);
    document.querySelector('#songs-by-count').innerHTML = 'Count';
    document.querySelector('#songs-by-time').innerHTML = 'Stream time ' +
        ((song_current_sort === 'time-down') ? '&#x25be;' : '&#x25b4;');
    loadSongData(target, data);
};

document.querySelector('#artists-by-count').onclick = () => {
    let target = document.querySelector(`#artist-table tbody`);
    artist_current_sort = (artist_current_sort == 'count-down') ? 'count-up' : 'count-down';
    const comparer = (artist_current_sort === 'count-down')
        ? ((a, b) => a.count < b.count)
        : ((a, b) => a.count > b.count);

    let data = window.views.toplist_by_artist.sort(comparer).slice(0, limit);
    document.querySelector('#artists-by-count').innerHTML = 'Count ' +
        ((artist_current_sort === 'count-down') ? '&#x25be;' : '&#x25b4;');
    document.querySelector('#artists-by-time').innerHTML = 'Stream time';
    loadArtistData(target, data);
};

document.querySelector('#artists-by-time').onclick = () => {
    let target = document.querySelector(`#artist-table tbody`);
    artist_current_sort = (artist_current_sort == 'time-down') ? 'time-up' : 'time-down';
    const comparer = (artist_current_sort === 'time-down')
        ? ((a, b) => a.time < b.time)
        : ((a, b) => a.time > b.time);

    let data = window.views.toplist_by_artist.sort(comparer).slice(0, limit);
    document.querySelector('#artists-by-count').innerHTML = 'Count';
    document.querySelector('#artists-by-time').innerHTML = 'Stream time ' +
        ((artist_current_sort === 'time-down') ? '&#x25be;' : '&#x25b4;');
    loadArtistData(target, data);
};
