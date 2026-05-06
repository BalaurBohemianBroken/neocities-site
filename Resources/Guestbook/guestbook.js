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

function validate_submission() {
    
}