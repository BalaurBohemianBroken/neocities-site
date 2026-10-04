function RequestJSON(url, callback) {
    const my_request = new Request(url);
    fetch(my_request)
        .then((response) => response.json())
        .then((data) => { callback(data); })
        .catch(console.error);
}

function RequestText(url, callback) {
    const my_request = new Request(url);
    fetch(my_request)
        .then((response) => response.text())
        .then((data) => { callback(data); })
        .catch(console.error);
}