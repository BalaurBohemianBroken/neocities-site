function oninput_ghost(input_element, ghost_id, ghost_default) {
    let default_len = ghost_default.length;
    let ghost = document.getElementById(ghost_id);
    let input_len = input_element.value.length;
    let ghost_size = Math.max(ghost_default.length - input_len, 0);
    ghost.innerText = ghost_default.slice(0, ghost_size);
}

function oninput_limit(input_element, size_limit=0, regex_remove=null) {
    if (regex_remove !== null)
        input_element.value = input_element.value.replace(regex_remove, "");
    if (size_limit !== 0)
        input_element.value = input_element.value.slice(0, Math.min(input_element.value.length, size_limit));
}