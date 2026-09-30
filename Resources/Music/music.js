// Scope variables
music_page = {
    albums_container: null,
    full_index: null,
    music_index: null,
    sort_array: [SortByArtist, SortByAlbum, SortByAverageColor, SortByDate],
    sort_names: ["artist", "album", "colour", "date"],
    sort_current: 2,
    sort_inverted: false,
    sort_multiplier: 1,
    sort_text_e: null,
}

document.addEventListener("DOMContentLoaded", function(event) {
    MusicPage();
});

function MusicPage() {
    music_page.albums_container = document.getElementById("albums_container");
    music_page.sort_text_e = document.getElementById("sort_mode");
    GetMusicIndex()
}

function GetMusicIndex() {
    const my_request = new Request("/Resources/Music/Index/music_index.json");

    fetch(my_request)
        .then((response) => response.json())
        .then((data) => { ParseMusicIndex(data); })
        .catch(console.error);
}

function ParseMusicIndex(json_index) {
    music_page.full_index = json_index;
    music_page.music_index = Object.values(json_index["index"]);
    console.log(json_index);
    MakeStats(json_index);
    SetSort(2, false);
    // console.log(json_index);
}

function MakeStats(json_index) {
    let stats_e = document.getElementById("stats");
    let albums = Object.values(json_index["index"]);
    
    let num_albums = albums.length;
    let num_songs = 0;
    let artists = new Set();
    let duration = 0;
    let unindex_albums = json_index["metadata"]["omitted"];
    
    for (let index = 0; index < albums.length; index++) {
        let album = albums[index];
        duration += album["duration"];
        num_songs += album["song_count"];
        artists.add(album["artist"]);
    }
    
    let p = null;
    p = document.createElement("p");
    p.innerText = "albums: " + num_albums;
    stats_e.appendChild(p);

    p = document.createElement("p");
    p.innerText = "artists: " + artists.size;
    stats_e.appendChild(p);

    p = document.createElement("p");
    p.innerText = "songs: " + num_songs;
    stats_e.appendChild(p);

    p = document.createElement("p");
    // let days = Math.floor(duration / 86400);
    let hours = Math.floor(duration / 3600);
    let minutes = String(Math.floor((duration % 3600) / 60)).padStart(2, "0");
    let seconds  = String(Math.floor(duration % 60)).padStart(2, "0");
    p.innerText = `duration: ${hours}h ${minutes}m ${seconds}s`;
    stats_e.appendChild(p);
    
    // Number of albums
    // Total songs
    // Total artists
    // Total duration
    // Unindexed albums
}

function CreateTiles(tiles) {
    let container = document.createElement("div");
    container.classList.add("ImageGrid");
    for (let index = 0; index < tiles.length; index++) {
        let album = tiles[index];
        container.appendChild(CreateTile(album));
    }
    music_page.albums_container.appendChild(container);
}

function CreateTilesYear(albums) {
    let current_year = "0"
    let image_year_container = null;
    let section_container = null;
    let num_in_year = 0;
    let year_container = null;
    for (let index = 0; index < albums.length; index++) {
        if (current_year !== albums[index]["release_date"]) {
            current_year = albums[index]["release_date"];
            if (section_container !== null) {
                let p = document.createElement("p");
                p.innerText = "(" + num_in_year.toString() + ")";
                p.classList.add("CountInYear");
                year_container.appendChild(p);
                
                music_page.albums_container.appendChild(section_container);
            }
            num_in_year = 0;
            section_container = document.createElement("div");
            section_container.classList.add("YearSectionContainer");
            image_year_container = document.createElement("div");
            image_year_container.classList.add("ImageGrid");
            year_container = document.createElement("div");

            let p = document.createElement("p");
            p.innerText = current_year + ":";
            p.classList.add("YearSeparator");
            
            year_container.appendChild(p);
            section_container.appendChild(year_container);
            section_container.appendChild(image_year_container);
        }
        num_in_year += 1;
        let album = albums[index];
        image_year_container.appendChild(CreateTile(album));
    }

    let p = document.createElement("p");
    p.innerText = "(" + num_in_year.toString() + ")";
    p.classList.add("CountInYear");
    year_container.appendChild(p);

    music_page.albums_container.appendChild(section_container);
}

function CreateTile(album) {
    let container = document.createElement("div");
    container.classList.add("AlbumEntry");

    let img = document.createElement("img");
    img.src = "/" + encodeURIComponent(album["art"]);
    img.classList.add("AlbumEntryImg");

    let album_name = document.createElement("p");
    album_name.classList.add("AlbumName");
    album_name.innerText = album["album"];
    let artist_name = document.createElement("p");
    artist_name.classList.add("ArtistName");
    artist_name.innerText = album["artist"];
    let year = document.createElement("p");
    year.classList.add("Year");
    year.innerText = album["release_date"];

    container.appendChild(img);
    container.appendChild(album_name);
    container.appendChild(artist_name);
    container.appendChild(year);
    return container
}

function PreviousSort() {
    SetSort(music_page.sort_current - 1, music_page.sort_inverted);
}

function NextSort() {
    SetSort(music_page.sort_current + 1, music_page.sort_inverted);
}

function SortInvertedToggle() {
    SetSort(music_page.sort_current, !music_page.sort_inverted);
}

// function UpdateTileSize(slider_e) {
//     document.getElementsByClassName()
// }

function SetSort(index, inverted) {
    if (index >= music_page.sort_array.length) {
        index = 0;
    }
    if (index < 0) {
        index = music_page.sort_array.length - 1;
    }
    music_page.sort_inverted = inverted;
    music_page.sort_multiplier = inverted ? -1 : 1;
    music_page.sort_current = index;
    // Clear existing tiles
    music_page.albums_container.innerHTML = "";
    
    // Generate new tiles
    if (music_page.sort_current === 3) {
        CreateTilesYear(music_page.music_index.toSorted(music_page.sort_array[music_page.sort_current]));
    }
    else {
        CreateTiles(music_page.music_index.toSorted(music_page.sort_array[music_page.sort_current]));
    }
    
    // Update text
    music_page.sort_text_e.innerText = music_page.sort_names[index];
}

// dumb chud language doesn't have a way to pass or handle inverting these functions, so i'm using a global!!!
function SortByArtist(a, b) {
    return a["artist"].localeCompare(b["artist"]) * music_page.sort_multiplier;
}

function SortByAlbum(a, b) {
    return a["album"].localeCompare(b["album"]) * music_page.sort_multiplier;
}

function SortByAverageColor(a, b) {
    let a_hsv = RGBtoHSV(a["average_color"]);
    let b_hsv = RGBtoHSV(b["average_color"]);
    return Math.sign(a_hsv.h - b_hsv.h) * music_page.sort_multiplier;
}

function SortByDate(a, b) {
    return Math.sign(parseInt(a["release_date"]) - parseInt(b["release_date"])) * music_page.sort_multiplier;
}

// From: https://stackoverflow.com/questions/17242144/how-to-convert-hsb-hsv-color-to-rgb-accurately
function RGBtoHSV(rgb) {
    let r = rgb[0];
    let b = rgb[1];
    let g = rgb[2];
    var max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min,
        h,
        s = (max === 0 ? 0 : d / max),
        v = max / 255;

    switch (max) {
        case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }

    return {
        h: h,
        s: s,
        v: v
    };
}