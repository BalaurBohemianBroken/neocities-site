// scope variables
terminus = {
    dropdown_collapsed: "🞂 ",
    dropdown_uncollapsed: "🞃 ",
    main_panel: null,
    side_panel: null,
    
    // element name: content that gets hidden 
    menu_collapsible_elements: {},
    // element name: HasBodyContent element
    menu_content_elements: {},
    
    // content name: element
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
        terminus.menu_content_elements[name] = element;
        element.addEventListener("click", function() {SidePanelSelect(this, name);});
    }
    
    // TODO: Check that there's union between BodyContent and HasBodyContent
}

function InitCollapsibles() {
    let collapsibles = document.getElementsByClassName("Collapsible");

    for (let i = 0; i < collapsibles.length; i++) {
        let element = collapsibles[i];
        let name = element.innerText;
        terminus.menu_collapsible_elements[name] = element.nextElementSibling;
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
    // TODO: Reset scroll.
    let target_element = terminus.body_content_elements[content_name];
    if (target_element == null) {
        console.warn("Couldn't find body content element with name " + content_name);
        return;
    }
    
    // If it's a collapsible, and we just collapsed it, don't do anything.
    let coll = terminus.menu_collapsible_elements[content_name]; 
    if (coll != null && !coll.classList.contains("Deactivated")) {
        return;
    }
    
    // Handle menu
    if (terminus.side_panel_selected != null) {
        terminus.side_panel_selected.classList.remove("Selected");
    }
    selected_element.classList.add("Selected");
    terminus.side_panel_selected = selected_element;
    
    // Handle body content
    if (terminus.body_content_current != null) {
        terminus.body_content_current.style.display = "";
    }
    terminus.body_content_current = target_element;
    target_element.style.display = "block";
}