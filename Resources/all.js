/// This provides general helper functions,
// and cross-site functionality, such as which pages have been visited.

class Helpers {
    static ElementFromString(html) {
        // From: https://stackoverflow.com/a/35385518
        const template = document.createElement('template');
        template.innerHTML = html.trim();
        const nNodes = template.content.childNodes.length;
        if (nNodes !== 1) {
            throw new Error("string does not represent a single element.");
        }
        return template.content.firstChild;
    }
}

function all_main() {
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
    MarkPageVisited();

    document.addEventListener("keydown", code_listener);

    all.br_stylesheet = document.createElement("style");
    all.br_stylesheet.textContent = all.br_style;
    document.head.appendChild(all.br_stylesheet);
}

function code_listener(keypress) {
    all.keyboard_history.unshift(keypress.key);
    let size = Math.min(all.keyboard_history_max, all.keyboard_history.length);
    all.keyboard_history = all.keyboard_history.slice(0, size);
    check_for_codes(all.keyboard_history);
}

function check_for_codes(values) {
    // This is pretty much just for fun and so i can surprise my friends with hidden content
    // It's not a secure hiding place! :)
    let code = "";
    for (let i = 0; i < all.codes_max; i++) {
        if (i >= values.length)
            break;
        // This reads the array from the front, but reverses the order.
        code = values[i] + code;
        let h = hash_code(code);
        if (h in all.codes)
            all.codes[h]();
    }
}

function blue_rose() {
    all.br_stylesheet.textContent = `.BlueRose {background-color: #08608287;}`
}

function hash_code(str) {
    // From: https://stackoverflow.com/a/8831937
    // I thought about using a more secure hashing function.
    // But for one, this is all client side
    // two this stuff isn't very hidden anyway
    // three if someone wants to crack this that sounds fun
    // and four the secure stuff will be server side.
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

function MarkPageVisited() {
    let visited = GetPagesVisited();
    
    let t = Date.now();
    let p = window.location.pathname;
    let count = 1;
    if (p in visited) {
        count = visited[p].count + 1;
    }
    visited[p] = {"time": t, "count": count};
    
    localStorage.setItem("visited", JSON.stringify(visited));
}

// Stored as [{page_name: {date: int, count: int}}, ...]
function GetPagesVisited() {
    let existing_cookie = localStorage.getItem("visited");
    if (existing_cookie == null)
        return {};
    return JSON.parse(existing_cookie);
}

all_main();