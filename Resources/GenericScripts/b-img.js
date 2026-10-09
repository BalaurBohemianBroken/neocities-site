b_img = {
    popup_container: null,
    popup_img: null,
}

document.addEventListener("DOMContentLoaded", BImgInit);

function BImgInit() {
    b_img.popup_container = document.createElement("div");
    b_img.popup_container.classList.add("b_popup_image_container");
    b_img.popup_container.addEventListener("click", function() {SetPopupState(false)});

    b_img.popup_img = document.createElement("img");
    b_img.popup_img.classList.add("b_popup_image");
    b_img.popup_img.addEventListener("click", function() {SetPopupState(false)});

    b_img.popup_container.appendChild(b_img.popup_img);
    SetPopupState(false);
    document.body.appendChild(b_img.popup_container);

    const style = document.createElement("style");
    style.textContent = `
.b_popup_image_container {
    position: fixed;
    width: 100vw;
    height: 100vh;
    min-width: 900px;
    background-color: #120120a3;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 10;
    top: 0;
}

.b_popup_image {
    margin: auto;
    max-width: 80vw;
    max-height: 80vh;
    z-index: 10;
}
    `;
    document.head.appendChild(style);
}

// img that loads lazily, and can be clicked on to enlarge.
// based on: https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
class BImg extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();
    }

    connectedCallback() {
        // shadow root - This caused way more problems than was worth. i couldn't find a way to detach the shadow, so my DOM fuckery really upset it.
        // const shadow = this.attachShadow({ mode: "open" });
        const img = document.createElement("img");
        if (!this.hasAttribute("eager")) {
            img.setAttribute("loading", "lazy");
        }
        
        img.src = this.getAttribute("src");
        img.addEventListener("click", function() {SetPopupState(true, img.src)});
        if (this.hasAttribute("style")) {
            img.style.cssText = this.getAttribute("style");
        }
        img.style.cursor = "pointer";

        // Attach the created elements to the shadow dom
        this.appendChild(img);
    }
    
    disconnectedCallback() {
        this.innerHTML = "";
    }
}

function SetPopupState(state, src="") {
    if (state !== true) {
        b_img.popup_container.style.display = "none";
        return;
    }
    b_img.popup_container.style.display = "";
    b_img.popup_img.src = src;
}

customElements.define("b-img", BImg);