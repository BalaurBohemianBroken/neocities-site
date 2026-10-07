// Also requires CSS file.
// make an element with class "Tooltip". this element will be used in the tooltip popup container
tooltip = {
    e: null,
    index: {},
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
    // For some reason this always triggers??
    // if (par in tooltip.index) {
    //     return;
    // }
    tooltip.index[par] = tooltip_e;
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

function UpdateTooltip() {
    tooltip.e.innerHTML = "";
    let ttl = tooltip.tooltips_on;
    if (ttl.length > 0) {
        let to_display_e = tooltip.index[tooltip.tooltips_on[ttl.length - 1]];
        tooltip.e.innerHTML = to_display_e.innerHTML;
        
        tooltip.e.style.display = "block";
        tooltip.e.firstChild.style.display = "block";
    }
    else {
        tooltip.e.style.display = "none";
    }
}

function MoveTooltip(event) {
    tooltip.e.style.left = `${event.pageX}px`;
    tooltip.e.style.top = `${event.pageY}px`;
}