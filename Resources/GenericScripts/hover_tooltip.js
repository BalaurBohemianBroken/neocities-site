// Also requires CSS file.
// make an element with class "Tooltip". this element will be used in the tooltip popup container
tooltip = {
    e: null,
    index: new Map(),
    tooltips_on: [],
};

document.addEventListener("DOMContentLoaded", function(event) {
    TooltipInit();
});

document.addEventListener("mousemove", MoveTooltip)

function TooltipInit() {
    tooltip.e = document.createElement("div");
    tooltip.e.classList.add("TooltipContainer");
    document.body.appendChild(tooltip.e);
    
    let tooltip_es = document.getElementsByClassName("Tooltip");
    for (const tooltip_e of tooltip_es) {
        RegisterTooltip(tooltip_e);
    }
}

// Can also be called from other scripts if a tooltip is defined in code, rather than part of the .html
function RegisterTooltip(tooltip_e) {
    let par = tooltip_e.parentNode;
    if (tooltip.index.has(par)) {
        return;
    }
    tooltip.index.set(par, tooltip_e);
    par.addEventListener("mouseover", function() {TooltipOn(par)});
    par.addEventListener("mouseout", function() {TooltipOff(par)});
}

function TooltipOn(e) {
    tooltip.tooltips_on.push(e);
    UpdateTooltip()
}

function TooltipOff(e) {
    tooltip.tooltips_on.splice(tooltip.tooltips_on.indexOf(e), 1);
    UpdateTooltip();
}

function SortTooltips(a, b) {
    // bad, slow, oh well, gonna be like 5 elements in the list
    let ia = 0;
    while (a.parentElement != null) {
        ia += 1;
        a = a.parentElement;
    }
    
    let ib = 0;
    while (b.parentElement != null) {
        ib += 1;
        b = b.parentElement;
    }
    return ia - ib;
}

function UpdateTooltip() {
    if (tooltip.e.firstChild !== null) {
        tooltip.e.firstChild.display = "";
        tooltip.e.removeChild(tooltip.e.firstChild);
    }
    
    let ttl = tooltip.tooltips_on.toSorted(SortTooltips);
    if (ttl.length > 0) {
        let to_display_e = tooltip.index.get(tooltip.tooltips_on[0]);
        tooltip.e.appendChild(to_display_e);
        
        tooltip.e.style.display = "block";
        tooltip.e.firstChild.style.display = "block";
    }
    else {
        tooltip.e.style.display = "none";
    }
}

function MoveTooltip(event) {
    tooltip.e.style.left = `${event.clientX}px`;
    tooltip.e.style.top = `${event.clientY}px`;
}