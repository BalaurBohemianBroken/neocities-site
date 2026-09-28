// Scope variables
music_page = {
    albums_container: null,
    art_path: "/Resources/Music/Index",
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
    for (let index = 0; index < json_index.length; index++) {
        let img = document.createElement("img");
        img.src = music_page.art_path + "/" + encodeURIComponent(json_index[index]["art"]);
        img.classList.add("AlbumEntry");
        music_page.albums_container.appendChild(img);    
    }
    
    // console.log(json_index);
}