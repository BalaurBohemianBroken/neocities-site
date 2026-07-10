// scope variables
terminus = {
    dropdown_collapsed: "🞂 ",
    dropdown_uncollapsed: "🞃 ",
    
    main_panel: null,
    menu_panel: null,
    unparsed_data: null,
    // DataPoints as they appear in the menu, with nesting.
    parsed_data: [],
    // Name: DataPoint
    data_point_register: {},
    
    body_content_current: null,
    data_point_selected: null,
};

document.addEventListener("DOMContentLoaded", function(event) {
    Terminus();
});

function Terminus() {
    terminus.main_panel = document.getElementById("main_panel");
    terminus.menu_panel = document.getElementById("side_panel");
    terminus.unparsed_data = document.getElementById("unparsed_data");
    terminus.parsed_data = ParseData();
    InitMenu(terminus.parsed_data);
    
    // Open and select based on fragment.
    let fragment = decodeURIComponent(window.location.hash.substring(1));
    if (fragment in terminus.data_point_register) {
        OpenDataPoint(fragment);
    }
}

function ParseData() {
    let parsed_data = [];
    for (const data_point_element of terminus.unparsed_data.querySelectorAll(":scope > .DataPoint")) {
        let data = CreateDataPoint(data_point_element, "");
        if (data !== null) {
            parsed_data.push(data);
        }
    }
    return parsed_data;
}

function CreateDataPoint(element, parent_name) {
    let data_point = {
        full_name: "",
        name: "",
        parent_name: "",
        // Filled with an element.
        body_element: null,
        menu_element: null,
        nested_data_points: null,
        // This gets filled in CreateMenuEntry.
        nesting_element: null
    };
    
    // name
    data_point.name = element.getAttribute("data-name");
    data_point.parent_name = parent_name;
    if (data_point.name && parent_name) {
        data_point.full_name = parent_name + "." + data_point.name;
    }
    else {
        data_point.full_name = data_point.name;
    }
    
    // menu_element
    let menu_name = element.querySelector(":scope > .MenuName");
    if (menu_name !== null) {
        data_point.menu_element = menu_name;
    }
    else if (data_point.name !== null) {
        data_point.menu_element = document.createElement("p");
        data_point.menu_element.innerText = data_point.name;
    }
    else {
        console.error("DataPoint had no data-name attribute and no MenuName element. Element: ", element);
        return null;
    }
    
    // body_element
    data_point.body_element = element.querySelector(":scope > .BodyContent");
    if (data_point.body_element !== null) {
        data_point.menu_element.classList.add("HasBodyContent");
    }
    
    // nested_data_points
    let nested_content_element = element.querySelector(":scope > .NestedContent");
    if (nested_content_element !== null) {
        data_point.nested_data_points = [];
        
        for (const data_point_element of nested_content_element.querySelectorAll(":scope > .DataPoint")) {
            let data = CreateDataPoint(data_point_element, data_point.full_name);
            if (data !== null) {
                data_point.nested_data_points.push(data);
            }
        }
        data_point.menu_element.innerText = terminus.dropdown_collapsed + data_point.menu_element.innerText; 
    }
    
    terminus.data_point_register[data_point.full_name] = data_point;
    return data_point;
}

function InitMenu(data_point_list) {
    // We create a div element that is not a part of the document flow to insert in,
    // This is so the document doesn't get updated with every new element that is added,
    // but instead all at once when we're done.
    let container = document.createElement("div");
    for (const data_point of data_point_list) {
        CreateMenuEntry(data_point, container);
    }
    terminus.menu_panel.appendChild(container);
}

function CreateMenuEntry(data_point, container_element) {
    // Create entry.
    container_element.appendChild(data_point.menu_element);
    
    // Create collapsible content element if applicable.
    let collapsible_content = null;
    if (data_point.nested_data_points !== null) {
        collapsible_content = document.createElement("div");
        // collapsible_content.classList.add("CollapsibleContent");
        collapsible_content.classList.add("Indented");
        
        data_point.menu_element.addEventListener("click", function () {
            HandleCollapse(data_point);
        });
        
        collapsible_content.classList.add("Deactivated");
        data_point.nesting_element = collapsible_content;
        container_element.appendChild(collapsible_content);
        data_point.menu_element.classList.add("Collapsible");
    }
    
    // body_element onclick
    if (data_point.body_element !== null) {
        data_point.menu_element.addEventListener("click", function () {
            MenuSelect(data_point);
        })
    }
    
    // Create child entries.
    if (data_point.nesting_element == null || data_point.nested_data_points == null) {
        return;
    }
    
    for (const child of data_point.nested_data_points) {
        CreateMenuEntry(child, data_point.nesting_element);
    }
}

function HandleCollapse(data_point) {
    let is_collapsed = data_point.nesting_element.classList.contains("Deactivated");
    if (is_collapsed) {
        data_point.nesting_element.classList.remove("Deactivated");
        data_point.menu_element.innerText = terminus.dropdown_uncollapsed + data_point.menu_element.innerText.slice(3);
    }
    else {
        data_point.nesting_element.classList.add("Deactivated");
        data_point.menu_element.innerText = terminus.dropdown_collapsed + data_point.menu_element.innerText.slice(3);
    }
}

function MenuSelect(data_point) {
    // If it's a collapsible, and we just collapsed it, don't do anything.
    if (data_point.nesting_element != null && data_point.nesting_element.classList.contains("Deactivated")) {
        return;
    }
    
    // Clean up previous selection.
    if (terminus.data_point_selected != null) {
        terminus.data_point_selected.menu_element.classList.remove("Selected");
        terminus.data_point_selected.body_element.remove();
    }
    
    data_point.menu_element.classList.add("Selected");
    terminus.main_panel.appendChild(data_point.body_element);
    terminus.data_point_selected = data_point;
    terminus.main_panel.scroll(0, 0);
    // Putting it here makes it only update if there is body content. 
    window.location.hash = "#" + encodeURI(data_point.full_name);
}

function OpenDataPoint(data_point_name) {
    // TODO: If it is a collapsible element, ensure it remains open.
    let target_data_point = terminus.data_point_register[data_point_name];
    let forcebreak = 0;  // Guard against reference loops.
    let chain = [target_data_point];
    while (forcebreak++ < 10 && target_data_point.parent_name) {
        target_data_point = terminus.data_point_register[target_data_point.parent_name];
        chain.unshift(target_data_point);
    }

    if (forcebreak >= 10) {
        console.error("Hit forcebreak while trying to open DataPoint named: " + data_point_name);
        return;
    }

    // Click down the chain!
    for (const data_point of chain) {
        data_point.menu_element.click();
    }
}