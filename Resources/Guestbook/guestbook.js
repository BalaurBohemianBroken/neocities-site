window.addEventListener("load", get_location_inputs);

function get_location_inputs() {
    let ghosts = document.getElementsByClassName("inputCoordinates");
    for (let i = 0; i < ghosts.length; i++) {
        let e = ghosts[i];
        let ig = InputLocation(e);
        e.addEventListener("input", function() {oninput_location(ig)});
    }
}

function oninput_location(input_ghost) {
    if (input_ghost.input.value.includes("+")) {
        input_ghost.sign.innerText = "+";
        input_ghost.input.value = input_ghost.input.value.replace("+", "");
    }
    if (input_ghost.input.value.includes("-")) {
        input_ghost.sign.innerText = "-";
        input_ghost.input.value = input_ghost.input.value.replace("-", "");
    }
    input_ghost.input.value = input_ghost.input.value.replace(/[^0-9]+/, "");

    let input_len = input_ghost.input.value.length;
    if (input_len > input_ghost.default_len) {
        input_ghost.input.value = input_ghost.input.value.slice(0, input_ghost.default_len);
    }
    let num_chars = Math.max(input_ghost.default_len - input_len, 0);
    input_ghost.value.innerText = input_ghost.value_default.slice(0, num_chars);
}

function InputLocation(e) {
    let el = {};
    el.root = e;
    el.sign = e.getElementsByTagName("span")[0];
    el.value = e.getElementsByTagName("span")[1];
    el.value_default = el.value.innerText;
    el.default_len = el.value_default.length;
    el.input = e.getElementsByTagName("input")[0];
    return el;
}


function validate_submission() {
    
}