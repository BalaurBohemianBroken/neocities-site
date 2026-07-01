dropdown_collapsed = "🞂 ";
dropdown_uncollapsed = "🞃 ";

document.addEventListener("DOMContentLoaded", function(event) {
    InitCollapsibles();
});

function InitCollapsibles() {
    let collapsibles = document.getElementsByClassName("Collapsible");

    for (let i = 0; i < collapsibles.length; i++) {
        let element = collapsibles[i];
        element.addEventListener("click", function() {HandleCollapse(element);});
        element.innerText = dropdown_collapsed + element.innerText;
        element.nextElementSibling.style.display = "none";
    }
}

function HandleCollapse(element) {
    element.classList.toggle("Active");
    let isCollapsed = !element.classList.contains("Active");
    let content = element.nextElementSibling;
    if (isCollapsed) {
        content.style.display = "none";
        element.innerText = dropdown_collapsed + element.innerText.slice(3);
    }
    else {
        content.style.display = "block";
        element.innerText = dropdown_uncollapsed + element.innerText.slice(3);
    }
}