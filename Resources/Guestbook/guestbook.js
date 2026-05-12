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
    if (!validate_submission()) {
        // TODO: error readout for user
        return;
    }
}

function gather_submission() {
    let o = {};
    o.alias = document.getElementById("falias").value;
    o.x = document.getElementById("x_plusminus").value + document.getElementById("flocation_x").value.padStart(1, "0");
    o.y = document.getElementById("y_plusminus").value + document.getElementById("flocation_y").value.padStart(1, "0");
    o.website = document.getElementById("fwebsite").value;
    // o.freq = document.getElementById("radio_freq").value;
    o.message = document.getElementById("fmessage").value;
    return o;
}

function validate_submission(s) {
    let collision_distance = 32;
    // TODO: Change backend web_max to match
    let alias_min = 1;
    let alias_max = 1;
    let web_min = 0;
    let web_max = 64;
    // TODO: Alt message limitation based on vertical size.
    let m_min = 1;
    let m_max = 512;
    let x_range = (1920 - collision_distance) / 2;
    let y_range = (1080 - collision_distance) / 2;
    let re_chars_allowed = /^[ -~]+$/;
    let re_number = /^[\+\-]?[0-9]+$/;

    if (!validate_input(s.alias, re_chars_allowed, alias_min, alias_max))
        return false;
    if (!validate_input(s.website, re_chars_allowed, web_min, web_max))
        return false;
    if (!validate_input(s.message, re_chars_allowed, m_min, m_max))
        return false;
    
    if (!re_number.test(s.x))
        return false;
    // This can send -0. I don't know if that's a problem.
    s.x = Number(s.x);
    if (Math.abs(s.x) > x_range)
        return false;

    if (!re_number.test(s.x))
        return false;
    s.y = Number(s.y);
    if (Math.abs(s.y) > y_range)
        return false;

    // TODO: Collision check.
}

function validate_input(text, re, min, max) {
    if (!re.test(text))
        return false;
    if (text.length > max || text.length < min)
        return false;
    return true;
}

function place_signal() {
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