schedule = {
    current_day: null,
    json: null,
    pixels_per_day: 480,
    day_length: (24 * 60 * 60 * 1000),
    
    state: {
        schedule_e: null,
        day_e: null,
        day_time: 0,
        next_day_time: 0,
        last_time: 0,
    },
}

document.addEventListener("DOMContentLoaded", function(event) {
    ScheduleInit();
});

function ScheduleInit() {
    RequestJSON("/Resources/Schedule/schedule.json", ParseSchedule);
}

function ParseSchedule(data) {
    schedule.json = data;
    schedule.current_day = GetCurrentDay();
    let day_utc = schedule.current_day.getTime();
    
    for (const entry of data["schedule"]) {
        let end = (entry["time"] + entry["duration"]) * 1000;
        if (end < day_utc)
            continue;

        let from = new Date(entry["time"] * 1000);
        let to = new Date(end);
        
        
    }
}

function GetCurrentDay() {
    // TODO: Make this stuff timezone aware. Lazy option is just hour offset but there's surely a library for it.
    let cd = new Date(Date.now());
    cd.setHours(0, 0, 0, 0);
    return cd;
}

// This requires schedule.current_day to be set. Write this better another time.
function FillSchedule(to, event) {
    let s = schedule.state;
    if (s.schedule_e === null) {
        // TODO: Probably wanna ID and fetch this instead, only one.
        s.schedule_e = document.createElement("div");
    }
    if (s.day_e === null) {
        ScheduleGeneratorNewDay();
    }
    
    let fill_type;
    if (event !== null) {
        fill_type = "ScheduleBusy";
    }
    else {
        fill_type = "ScheduleFree";
    }
    
    // Coloured box
    let duration = to - s.last_time;
    while (duration > 0) {
        let day_remaining = s.next_day_time - s.last_time;
        let fill_time = Math.min(duration, day_remaining);
        let fill_percent = fill_time / schedule.day_length;
        let fill_pixels = schedule.pixels_per_day * fill_percent;
        let fill_e = document.createElement("div");
        fill_e.classList.add(fill_type);
        fill_e.style.height = `${fill_pixels}px`;
        
        s.last_time = s.last_time + fill_time;
        day_remaining -= fill_time;
        duration -= fill_time;
        
        // Start new day
        if (day_remaining <= 0) {
            ScheduleGeneratorNewDay();
        }
    }
    
    // Hover tooltip
}

function ScheduleGeneratorNewDay() {
    let s = schedule.state;
    if (s.day_e !== null) {
        s.schedule_e.appendChild(s.day_e);
    }
    
    s.day_e = document.createElement("div");
    if (s.day_time === 0) {
        s.day_time = schedule.current_day.getTime();
    }
    else {
        s.day_time += schedule.day_length;
    }
    s.next_day_time = s.day_time + schedule.day_length;
    
    // Aligns this to the start of the day, handles floating point imprecision.
    s.last_time = s.day_time;
}