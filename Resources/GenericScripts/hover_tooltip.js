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
    let tooltip_es = document.getElementsByClassName("Tooltip");
    for (const tooltip_e of tooltip_es) {
        let par = tooltip_e.parentElement;
        tooltip.index[par] = tooltip_e;
        par.addEventListener("onmouseover", function() {TooltipOn(par)});
        par.addEventListener("onmouseout", function() {TooltipOff(par)});
    }
    
    tooltip.e = document.createElement("div");
    tooltip.e.classList.add("TooltipContainer");
    document.body.appendChild(tooltip.e);
}

function TooltipOn(e) {
    tooltip.tooltips_on.push(e);
    UpdateTooltip()
}

function TooltipOff(e) {
    tooltip.tooltips_on.splice(tooltip.tooltips_on.indexOf(e), 1);
    UpdateTooltip()
}

function UpdateTooltip() {
    let ttl = tooltip.tooltips_on;
    if (ttl.length > 0) {
        tooltip.e.style.display = "block";
        tooltip.e.innerHTML = tooltip.tooltips_on[ttl.length - 1];
    }
    else {
        tooltip.e.style.display = "none";
    }
}

function MoveTooltip(event) {
    tooltip.e.style.left = `${event.pageX}px`;
    tooltip.e.style.top = `${event.pageY}px`;
}