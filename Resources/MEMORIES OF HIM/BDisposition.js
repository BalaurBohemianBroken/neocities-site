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