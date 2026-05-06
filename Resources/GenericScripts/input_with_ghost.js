function oninput_ghost(input_element, ghost_id, ghost_default, limit_size = true, regex_remove = null) {
    let default_len = ghost_default.length;
    let ghost = document.getElementById(ghost_id);
    if (regex_remove !== null) {
        input_element.value = input_element.value.replace(regex_remove, "");
    }
    let input_len = input_element.value.length;
    let ghost_size = Math.max(ghost_default.length - input_len, 0);
    ghost.innerText = ghost_default.slice(0, ghost_size);

    if (!limit_size) {
        return;
    }
    if (input_len > ghost_default.length) {
        input_element.value = input_element.value.slice(0, ghost_default.length);
    }
}