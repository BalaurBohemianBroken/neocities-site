// from: https://stackoverflow.com/a/49110531
function copyTextContent(element_id) {
    // Get the text field
    var to_copy = document.getElementById(element_id).textContent;
    const text_area = document.createElement('textarea');
    text_area.textContent = to_copy;
    document.body.append(text_area);
    text_area.select();
    document.execCommand("copy");
}