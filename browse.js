let rawDataInfo = {
    content: undefined,
    current_sort: undefined,
    offset: 0
};

function loadRawData(target) {
    target.innerHTML = '';
    const data = rawDataInfo.content.slice(rawDataInfo.offset, rawDataInfo.offset + 10);

    document.querySelector('#data-footer-count').innerHTML = rawDataInfo.content.length + ' rows';

    data.forEach((elem, i) => {
        target.innerHTML += `<tr>
            <th scope="row">${i + rawDataInfo.offset + 1}</th>
            <td>${elem.title}</td>
            <td>${elem.artist}</td>
            <td>${elem.timestamp}</td>
            <td>${elem.playtime.toFixed(1) + ' sec'}</td>
        </tr>`;
    });
}

function handleSortChange() {
    rawDataInfo.offset = 0;

    let byTitle = document.querySelector('#data-by-title');
    let byArtist = document.querySelector('#data-by-artist');
    let byTS = document.querySelector('#data-by-timestamp');
    let byST = document.querySelector('#data-by-streamtime');

    byTitle.innerHTML = 'Song title';
    byArtist.innerHTML = 'Artist';
    byTS.innerHTML = 'End timestamp';
    byST.innerHTML = 'Stream time';

    let comparer;
    switch (rawDataInfo.current_sort) {
        case 'title-down': comparer = (a, b) => a.title < b.title; byTitle.innerHTML += ' &#x25be;'; break;
        case 'title-up': comparer = (a, b) => a.title > b.title; byTitle.innerHTML += ' &#x25b4;'; break;
        case 'artist-down': comparer = (a, b) => a.artist < b.artist; byArtist.innerHTML += ' &#x25be;'; break;
        case 'artist-up': comparer = (a, b) => a.artist > b.artist; byArtist.innerHTML += ' &#x25b4;'; break;
        case 'timestamp-down': comparer = (a, b) => a.timestamp < b.timestamp; byTS.innerHTML += ' &#x25be;'; break;
        case 'timestamp-up': comparer = (a, b) => a.timestamp > b.timestamp; byTS.innerHTML += ' &#x25b4;'; break;
        case 'streamtime-down': comparer = (a, b) => a.playtime < b.playtime; byST.innerHTML += ' &#x25be;'; break;
        case 'streamtime-up': comparer = (a, b) => a.playtime > b.playtime; byST.innerHTML += ' &#x25b4;'; break;
    }

    rawDataInfo.content = rawDataInfo.content.sort(comparer);
    loadRawData(document.querySelector('#data-table tbody'));
}

function handleFilterChange(event) {
    try {
        const filter = new RegExp(event.target.value.toLowerCase());
        rawDataInfo.content = window.views.browsing.filter(e => {
            return filter.test(e.title.toLowerCase() +
                ' ' + e.artist.toLowerCase() +
                ' ' + e.timestamp.toLowerCase() +
                ' ' + e.playtime.toFixed(1));
        });
        event.target.classList.remove('is-invalid');
    } catch (ex) {
        rawDataInfo.content = [];
        event.target.classList.add('is-invalid');
    }

    rawDataInfo.offset = 0;
    handleSortChange();
}

displayBrowse = () => {
    if (!window.views.browsing) {
        window.views.browsing = window.parsedData.map(elem => ({
            title: elem.trackName,
            artist: elem.artistName,
            timestamp: elem.endTime.toISOString().replace('T', ' ').slice(0, -5),
            playtime: Number(elem.msPlayed) / 1000
        }));
    }

    rawDataInfo.content = window.views.browsing;

    document.querySelector('#data-filter-input').oninput = handleFilterChange;
    document.querySelector('#data-filter-input').value = '';
    rawDataInfo.current_sort = 'timestamp-up';
    handleSortChange();
};

document.querySelector('#data-next-button').onclick = () => {
    rawDataInfo.offset = Math.min(rawDataInfo.offset + 10, rawDataInfo.content.length - 1);
    loadRawData(document.querySelector('#data-table tbody'));
}

document.querySelector('#data-prev-button').onclick = () => {
    rawDataInfo.offset = Math.max(rawDataInfo.offset - 10, 0);
    loadRawData(document.querySelector('#data-table tbody'));
}

document.querySelector('#data-by-title').onclick = () => {
    rawDataInfo.current_sort = (rawDataInfo.current_sort === 'title-up') ? 'title-down' : 'title-up';
    handleSortChange();
};

document.querySelector('#data-by-artist').onclick = () => {
    rawDataInfo.current_sort = (rawDataInfo.current_sort === 'artist-up') ? 'artist-down' : 'artist-up';
    handleSortChange();
};

document.querySelector('#data-by-timestamp').onclick = () => {
    rawDataInfo.current_sort = (rawDataInfo.current_sort === 'timestamp-up') ? 'timestamp-down' : 'timestamp-up';
    handleSortChange();
};

document.querySelector('#data-by-streamtime').onclick = () => {
    rawDataInfo.current_sort = (rawDataInfo.current_sort === 'streamtime-up') ? 'streamtime-down' : 'streamtime-up';
    handleSortChange();
};
