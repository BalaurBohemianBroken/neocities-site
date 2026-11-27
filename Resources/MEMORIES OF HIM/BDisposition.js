class BDisposition extends BMOH {
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

class DispositionTest extends BDisposition {
    constructor() {
        super();
        this.classList.add("Test");
        const img = document.createElement("img");

        img.src = "Resources/MEMORIES OF HIM/Sprites/eye.png";
        this.appendChild(img);
    }
}
customElements.define("b-disposition-test", DispositionTest);