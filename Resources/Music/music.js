// Scope variables
music_page = {
    albums_container: null,
    art_path: "/Resources/Music/Index",
    music_index: null,
    sort_array: [SortByArtist, SortByAlbum, SortByAverageColor],
    sort_names: ["artist", "album", "colour"],
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
    music_page.music_index = json_index;
    SetSort(2, false);
    // console.log(json_index);
}

function CreateTiles(tiles) {
    for (let index = 0; index < tiles.length; index++) {
        let album = tiles[index]; 
        let container = document.createElement("div");
        container.classList.add("AlbumEntry");

        let img = document.createElement("img");
        img.src = music_page.art_path + "/" + encodeURIComponent(album["art"]);
        img.classList.add("AlbumEntryImg");

        let album_name = document.createElement("p");
        album_name.classList.add("AlbumName");
        album_name.innerText = album["album"];
        let artist_name = document.createElement("p");
        artist_name.classList.add("ArtistName");
        artist_name.innerText = album["artist"];

        container.appendChild(img);
        container.appendChild(album_name);
        container.appendChild(artist_name);
        music_page.albums_container.appendChild(container);
    }
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
    CreateTiles(music_page.music_index.toSorted(music_page.sort_array[music_page.sort_current]));
    
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