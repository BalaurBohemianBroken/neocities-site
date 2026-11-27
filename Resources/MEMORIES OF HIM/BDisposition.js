class BDisposition extends BMOH {
    static width = 30
    static get height() {
        return BDisposition.width;
    };
    
    get exhausted() {
        return this.classList.contains("Exhausted");
    }

    set exhausted(is_exhausted) {
        if (is_exhausted) {
            this.classList.add("Exhausted");
        }
        else {
            this.classList.remove("Exhausted");
        }
    }
    
    constructor() {
        super();
        this.style.width = BDisposition.width + "px";
        this.style.height = BDisposition.height + "px";
        this.classList.add("Disposition");
    }
}

class Longing extends BDisposition {
    constructor() {
        super();
        this.classList.add("Longing");
    }
}
customElements.define("b-longing", Longing);

class Insight extends BDisposition {
    constructor() {
        super();
        this.classList.add("Insight");
        const img = document.createElement("img");
        img.src = "Resources/MEMORIES OF HIM/Sprites/eye.png";
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.object_fit = "contain";
        this.appendChild(img);
    }
}
customElements.define("b-insight", Insight);