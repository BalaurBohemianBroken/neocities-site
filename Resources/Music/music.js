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
    CreateTiles(json_index.toSorted(SortByArtist));
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