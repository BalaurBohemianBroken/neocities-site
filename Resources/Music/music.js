// Scope variables
music_page = {
    albums_container: null,
    art_path: "/Resources/Music/Index",
    music_index: null,
}

document.addEventListener("DOMContentLoaded", function(event) {
    MusicPage();
});

function MusicPage() {
    music_page.albums_container= document.getElementById("albums_container");
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
    CreateTiles(json_index.toSorted(SortByAverageColor));
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

function SortByArtist(a, b) {
    return a["artist"].localeCompare(b["artist"]);
}

function SortByAlbum(a, b) {
    return a["album"].localeCompare(b["album"]);
}

function SortByAverageColor(a, b) {
    let a_hsv = RGBtoHSV(a["average_color"]);
    let b_hsv = RGBtoHSV(b["average_color"]);
    console.log(a["average_color"]);
    return a_hsv.h > b_hsv.h;
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