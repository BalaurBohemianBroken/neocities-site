function oninput_plusminus(e_input, id_plusminus) {
    let e_plusminus = document.getElementById(id_plusminus);
    if (e_input.value.includes("+")) {
        e_plusminus.innerText = "+";
        e_input.value = e_input.value.replace("+", "");
    }
    if (e_input.value.includes("-")) {
        e_plusminus.innerText = "-";
        e_input.value = e_input.value.replace("-", "");
    }
}

function submit() {
    let sub = gather_submission();
    if (!validate_submission(sub)) {
        // TODO: error readout for user
        set_log("<span style='color:red'>Broadcast failed</span>")
        return;
    }
    set_log("Init broadcast..");
    send_guestbook_request(sub);
}

// this code waa written on my phone at a bus stop sorry
function send_guestbook_request(submission) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "https://api.balaur.online/guestbook/", true);
  xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  const body = JSON.stringify(submission);
  xhr.onload = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      set_log("<span style='color: green;'>Successful!</span>");
    }
    else {
      set_log("<span style='color: red;'>Unknown error</span>");
      console.log(`Error submitting broadcast: ${xhr.status}`);
    }
  };
  xhr.send(body);
}

function gather_submission() {
    let o = {};
    o.alias = document.getElementById("falias").value;
    o.x = document.getElementById("x_plusminus").innerText + document.getElementById("flocation_y_ghost").innerText;
    o.y = document.getElementById("y_plusminus").innerText + document.getElementById("flocation_y_ghost").innerText;
    o.website = document.getElementById("fwebsite").value;
    // o.freq = document.getElementById("radio_freq").value;
    o.message = document.getElementById("fmessage").value;
    return o;
}

function validate_submission(s) {
    let collision_distance = 32;
    // TODO: Change backend web_max to match
    let alias_min = 1;
    let alias_max = 16;
    let web_min = 0;
    let web_max = 64;
    // TODO: Alt message limitation based on vertical size.
    let m_min = 1;
    let m_max = 512;
    let x_range = (1920 - collision_distance) / 2;
    let y_range = (1080 - collision_distance) / 2;
    let re_chars_alias = /^[ -~]+$/;
    let re_chars_web = /^[ -~]*$/;
    let re_number = /^[\+\-]?[0-9]+$/;

    if (!validate_input(s.alias, re_chars_alias, alias_min, alias_max)) {
        set_log("<span style='color:red'>Bad alias</span>");
        return false;
    }
    if (!validate_input(s.website, re_chars_web, web_min, web_max)) {
        set_log("<span style='color:red'>Bad website</span>");
        return false;
    }
    if (!validate_input(s.message, re_chars_alias, m_min, m_max)) {
        set_log("<span style='color:red'>Bad message</span>");
        return false;
    }
    
    if (!re_number.test(s.x)) {
        set_log("<span style='color:red'>Bad x</span>");
        return false;
    }
    // This can send -0. I don't know if that's a problem.
    s.x = Number(s.x);
    if (Math.abs(s.x) > x_range) {
        set_log("<span style='color:red'>x too large</span>");
        return false;
    }

    if (!re_number.test(s.y)) {
        set_log("<span style='color:red'>Bad y</span>");
        return false;
    }
    s.y = Number(s.y);
    if (Math.abs(s.y) > y_range) {
        set_log("<span style='color:red'>y too large</span>");
        return false;
    }
    // TODO: Collision check.

    return true;
}

function validate_input(text, re, min, max) {
    if (!re.test(text))
        return false;
    if (text.length > max || text.length < min)
        return false;
    return true;
}

function place_signal() {
    // TODO:
    // Player clicks somewhere on screen to place their signal.
    // Provides x/y inherently.
    return;
}

// From: https://stackoverflow.com/a/16153675
function image_selected(e) {
  var selectedFile = e.target.files[0];
  var reader = new FileReader();

  var imgtag = document.getElementById("guestbook_input_img");
  imgtag.title = selectedFile.name;

  reader.onload = function(e) {
    imgtag.src = e.target.result;
  };

  reader.readAsDataURL(selectedFile);
}

function oninput_ioreadout_update_limit() {
    document.getElementById("chars_left").innerText = io_curr_count - io_curr_input.value.length;
}

io_curr_input = null;
io_curr_count = -1;
function onfocus_ioreadout(e, msg, count) {
    if (io_curr_input !== null) {
        io_curr_input.removeEventListener("input", oninput_ioreadout_update_limit);
        io_curr_input = null;
    }

    io_curr_input = e;
    io_curr_count = count;
    io_curr_input.addEventListener("input", oninput_ioreadout_update_limit);
    document.getElementById("restriction").innerText = msg;
    oninput_ioreadout_update_limit();
}

// Width of 16 characters currently.
debug_log_entries = [];
function set_log(msg) {
    debug_log_entries.push(msg);
    let log_lines = 3;
    let inner_str = "";
    for (let i = 0; i < log_lines; i++) {
        let log_index = debug_log_entries.length - 1 - i;
        let content = "";
        if (log_index >= 0)
            content = debug_log_entries[debug_log_entries.length - 1 - i];
        inner_str = content + "<br>" + inner_str;
    }
    document.getElementById("debug_log").innerHTML = inner_str;
}