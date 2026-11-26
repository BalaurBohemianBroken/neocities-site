class BMOH extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {

    }

    disconnectedCallback() {

    }
}

class BSpawnZone extends BMOH {
    // Positions are relative to parent.
    get left() {
        return this.offsetLeft - this.offsetWidth / 2;  // Element is positioned with transform, offsetleft doesn't consider this
    }
    get right() {
        return this.left + this.offsetWidth;
    }
    get xMiddle() {
        return this.left + (this.right - this.left) / 2;
    }
    
    get top() {
        return this.offsetTop;
    }
    get bottom() {
        return this.offsetTop + this.offsetHeight;
    }
    get yMiddle() {
        return this.top + (this.bottom - this.top) / 2;
    }
    
    static spawnPadding = 10;
    get spawnLeft() {
        return this.left + BCard.width/2 + BSpawnZone.spawnPadding;
    }
    get spawnRight() {
        return this.right - BCard.width/2 - BSpawnZone.spawnPadding;
    }
    get spawnWidth() {
        return this.spawnRight - this.spawnLeft;
    }
    
    
    get spawnPositions() {
        return [
            [this.spawnLeft + (this.spawnWidth * (0)), this.yMiddle],
            [this.spawnLeft + (this.spawnWidth * (1/3)), this.yMiddle],
            [this.spawnLeft + (this.spawnWidth * (2/3)), this.yMiddle],
            [this.spawnLeft + (this.spawnWidth * (3/3)), this.yMiddle],
        ];
    }
}
customElements.define("b-spawn-zone", BSpawnZone);

class BCardSlot extends BMOH {
    static _prefab = Helpers.ElementFromString(`
    <b-card-slot>
        
    </b-card-slot>`);

    static Instantiate(parent, position) {
        let card = BCardSlot._prefab.cloneNode(true);
        parent.appendChild(card);
        card.SetPosition(position);
        return card;
    }

    SetPosition(position) {
        this.style.left = position[0] + "px";
        this.style.top = position[1] + "px";
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.style.borderRadius = "10px";
        this.style.transform = "translate(-50%, -50%)";
        this.style.position = "absolute";
        this.style.width = BCard.width + "px";
        this.style.height = BCard.height + "px";
        this.style.border = "2px solid #261e57";
        this.style.backgroundColor = "#1d0d36";
        this.style.position = "absolute";
    }

    disconnectedCallback() {

    }
}

customElements.define("b-card-slot", BCardSlot);

class BActivityOption extends BMOH {
    static _prefab = Helpers.ElementFromString(`
<b-activity-option style="display: flex; height: 30px; background: #772a9b; background: radial-gradient(ellipse at 70%, rgba(119, 42, 155, 1) 0%, rgba(119, 42, 155, 0) 100%);">
    <p style="margin: auto; padding-right: var(--text-padding); text-align: right; width: 100%;">activity name</p>
</b-activity-option>`);

    static Instantiate(parent) {
        let inst = this._prefab.cloneNode(true);
        parent.appendChild(inst);
        return inst;
    }

    constructor() {
        super();
    }

    connectedCallback() {
    }

    disconnectedCallback() {

    }
}

customElements.define("b-activity-option", BActivityOption);