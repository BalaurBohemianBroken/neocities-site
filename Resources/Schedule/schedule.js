schedule = {
    current_day: null,
    json: null,
    pixels_per_day: 480,
    day_width: 40,
    day_length: (24 * 60 * 60 * 1000),
    
    state: {
        schedule_e: null,
        day_e: null,
        day_time: 0,
        next_day_time: 0,
        last_time: 0,
        num_days: 0,
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

        FillSchedule(from, null);
        FillSchedule(to, entry);
    }
    
    AddGridlines();
    AddGridMargins();
}

function AddGridlines() {
    let gridlines = document.createElement("div");
    gridlines.classList.add("Gridlines");
    gridlines.style.width = (schedule.state.num_days * schedule.day_width).toString() + "px";
    document.getElementById("schedule_grid").appendChild(gridlines);
}

function AddGridMargins() {
    let hours = document.getElementById("schedule_hours");
    for (let i = 0; i < 24; i++) {
        let p = document.createElement("p");
        p.innerText = i.toString().padStart(2, "0");
        hours.appendChild(p);
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
        s.schedule_e = document.getElementById("schedule_grid");
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
    let duration = Math.max(to - s.last_time, 0);
    if (duration === 0)
        return;
    while (duration > 0) {
        let day_remaining = s.next_day_time - s.last_time;
        let fill_time = Math.min(duration, day_remaining);
        let fill_percent = fill_time / schedule.day_length;
        let fill_pixels = schedule.pixels_per_day * fill_percent;
        let fill_e = document.createElement("div");
        fill_e.classList.add(fill_type);
        fill_e.style.height = `${fill_pixels}px`;
        // debug info for if stuff looks weird
        fill_e.setAttribute("starttime", new Date(s.last_time).toTimeString());
        fill_e.setAttribute("end", new Date(s.last_time + fill_time).toTimeString());
        s.day_e.appendChild(fill_e);
        
        s.last_time = s.last_time + fill_time;
        day_remaining -= fill_time;
        duration -= fill_time;
        // Hover tooltip
        
        // Start new day
        if (day_remaining <= 0) {
            ScheduleGeneratorNewDay();
        }
    }
}

function ScheduleGeneratorNewDay() {
    let s = schedule.state;
    if (s.day_e !== null) {
        s.schedule_e.appendChild(s.day_e);
        s.num_days++;
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