all = {
    keyboard_history: [],
    keyboard_history_max: 20,
    
    codes_max: 20,
    
    codes: {
        70068064: blue_rose  // do i?
    },

    br_style: `
    .BlueRose {
        display: none; 
    }`,
    br_stylesheet: null,
}
document.addEventListener("keydown", code_listener)

all.br_stylesheet = document.createElement("style");
all.br_stylesheet.textContent = all.br_style;
document.head.appendChild(all.br_stylesheet);

function code_listener(keypress) {
    all.keyboard_history.unshift(keypress.key);
    let size = Math.min(all.keyboard_history_max, all.keyboard_history.length);
    all.keyboard_history = all.keyboard_history.slice(0, size);
    check_for_codes(all.keyboard_history);
}

// This is pretty much just for fun and so i can surprise my friends with hidden content
// It's not a secure hiding place! :)
function check_for_codes(values) {
    let code = "";
    for (let i = 0; i < all.codes_max; i++) {
        if (i >= values.length)
            break;
        // This reads the array from the front, but reverses the order.
        code = values[i] + code;
        let h = hash_code(code);
        if (h in all.codes)
            all.codes[h]();
        console.log(`code: ${code}; hash: ${h}`);
    }
}

function blue_rose() {
    all.br_stylesheet.textContent = `.BlueRose {background-color: #08608287;}`
}

// From: https://stackoverflow.com/a/8831937
// I thought about using a more secure hashing function.
// But for one, this is all client side
// two this stuff isn't very hidden anyway
// three if someone wants to crack this that sounds fun
// and four the secure stuff will be server side.
function hash_code(str) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}