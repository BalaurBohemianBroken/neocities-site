radio = {
    playlist: null,
    playlist_size: 0,
    playlist_duration: -1,  // Time, without accounting for fades.
    
    fade_duration: -1,  // How long before the end of a song the next song will start to fade in.
    page_duration: -1,  // Time with fades.
    
    sync: {
        epoch: 1791062633000,  // Unix epoch in milliseconds. This is just the time as I'm writing this code.
        time: -1,  // When did we start synchronizing?
        elapsed: -1,  // epoch - sync_time
        
        page_num: -1,
        page_start_time: -1,
        page_delta: -1,  // Distance in to the current page
        
        track_order: [],  // The order of tracks to play.
    },
    current_song: null,
    next_song: null,
}

document.addEventListener("DOMContentLoaded", function(event) {
    RadioInit();
});

function RadioInit() {
    
}

function SyncRadio() {
    let sync = radio.sync;
    sync.time = Date.now();
    sync.elapsed = sync.epoch - sync.time;
    sync.page_num = Math.floor(sync.elapsed / sync.page_duration);
    sync.page_delta = sync.elapsed % sync.page_duration;
    sync.page_start_time = sync.elapsed - (sync.page_num * radio.page_duration);

    sync.track_order = SeededShuffle(sync.page_start_time, radio.playlist);
}