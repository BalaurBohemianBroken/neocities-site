// scope variables
terminus = {
    dropdown_collapsed: "🞂 ",
    dropdown_uncollapsed: "🞃 ",
    main_panel: null,
    side_panel: null,
    
    body_content_elements: {},
    body_content_current: null,
    side_panel_selected: null,
};

document.addEventListener("DOMContentLoaded", function(event) {
    Terminus();
});

function Terminus() {
    terminus.main_panel = document.getElementById("main_panel");
    terminus.side_panel = document.getElementById("side_panel");
    InitBodyContent();
    InitCollapsibles();
}

function InitBodyContent() {
    let elements = terminus.main_panel.getElementsByClassName("BodyContent");
    // Register body content
    for (const element of elements) {
        let name = element.getAttribute("data-content_name");
        if (name == null) {
            console.warn("Couldn't find attribute data-content_name on an element.");
            continue;
        }
        terminus.body_content_elements[name] = element;
    }
    // Add onclick events for HasBodyContent
    let content_havers = terminus.side_panel.getElementsByClassName("HasBodyContent");
    for (const element of content_havers) {
        let name = element.innerText;
        element.addEventListener("click", function() {SidePanelSelect(this, name);});
    }
}

function InitCollapsibles() {
    let collapsibles = document.getElementsByClassName("Collapsible");

    for (let i = 0; i < collapsibles.length; i++) {
        let element = collapsibles[i];
        element.addEventListener("click", function() {HandleCollapse(element);});
        element.innerText = terminus.dropdown_collapsed + element.innerText;
        element.nextElementSibling.classList.add("Deactivated");
    }
}

function HandleCollapse(element) {
    element.classList.toggle("Active");
    let isCollapsed = !element.classList.contains("Active");
    let content = element.nextElementSibling;
    if (isCollapsed) {
        content.classList.add("Deactivated");
        element.innerText = terminus.dropdown_collapsed + element.innerText.slice(3);
    }
    else {
        content.classList.remove("Deactivated");
        element.innerText = terminus.dropdown_uncollapsed + element.innerText.slice(3);
    }
}

function SidePanelSelect(selected_element, content_name) {
    // TODO: This. Test stuff works too.
    let target_element = terminus.body_content_elements[content_name];
    if (target_element == null) {
        console.warn("Couldn't find body content element with name " + content_name);
        return;
    }
    
    // Handle side panel
    if (terminus.side_panel_selected != null) {
        terminus.side_panel_selected.classList.remove("Selected");
    }
    selected_element.classList.add("Selected");
    terminus.side_panel_selected = selected_element;
    
    // Handle body content
    if (terminus.body_content_current != null) {
        // Display: none is in their class.
        terminus.body_content_current.style.display = "";
    }
    terminus.body_content_current = target_element;
    target_element.style.display = "block";
}