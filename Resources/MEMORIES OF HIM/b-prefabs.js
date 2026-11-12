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

class BCard extends BMOH {
    static get _prefab() {
        return document.getElementById("prefabs").getElementsByTagName("b-card")[0];
    }

    static _aspectRatio = 3/5;
    static get width() {
        return 80;
    }
    static get height() {
        return width * (1/this._aspectRatio);
    }
    
    get cardName_e() {
        console.log(this);
        return this.getElementsByClassName("CardName")[0];
    }
    get cardArt_e() {
        return this.getElementsByClassName("CardArt")[0];
    }
    
    get name() {
        return this.cardName_e.innerText;
    }
    set name(val) {
        this.cardName_e.innerText = val;
    }
    
    static Instantiate(card_name, parent, position) {
        let card = BCard._prefab.cloneNode(true);
        card.name = card_name;
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

    }

    disconnectedCallback() {

    }
}

customElements.define("b-card", BCard);