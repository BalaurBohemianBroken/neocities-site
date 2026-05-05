window.addEventListener("load", get_ghosts);

function get_ghosts() {
    let ghosts = document.getElementsByClassName("inputWithGhost");
    for (let i = 0; i < ghosts.length; i++) {
        let e = ghosts[i];
        let ig = InputGhost(e);
        e.addEventListener("input", function() {oninput_ghost(ig)});
    }
}

function oninput_ghost(input_ghost) {
    let input_len = input_ghost.input.value.length;
    let num_chars = Math.max(input_ghost.default_len - input_len, 0);
    input_ghost.text.innerText = input_ghost.default.slice(0, num_chars);
}

function InputGhost(e) {
    let el = {};
    el.root = e;
    el.text = e.getElementsByTagName("span")[0];
    el.default = el.text.innerText;
    el.default_len = el.default.length;
    el.input = e.getElementsByTagName("input")[0];
    return el;
}