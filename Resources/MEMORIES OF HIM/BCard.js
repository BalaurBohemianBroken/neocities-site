class BCard extends BMOH {
    static _prefab = Helpers.ElementFromString(
        `<b-card style="display: flex; flex-direction: column; border-radius: 10px; background-color: #261e57; position: absolute; transform: translate(-50%, -50%);">
        <div class="CardArt" style="width: 100%; justify-content: center; align-content: center; display: grid; grid-template: 30px 30px/30px 30px; gap: 5px; border-radius: 10px 10px 0 0; background-color: #1d0d36; padding: 10px;"></div>
        <div class="CardNameContainer" style="width: 100%; display: flex; align-items: center; justify-content: center;">
            <p class="CardName" style="font-size: var(--text-mid);">INSIGHT</p>
        </div>
    </b-card>`);
    
    static artHeight = 90;
    static nameHeight = 40;
    
    static get width() {
        return 90;
    }
    static get height() {
        return BCard.artHeight + BCard.nameHeight;
    }

    get cardNameContainer_e() {
        return this.getElementsByClassName("CardNameContainer")[0];
    }
    get cardName_e() {
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

    // Ordered based on last interacted with.
    static active_cards = [];
    
    disposition = [];

    static Instantiate(card_name, parent, position, disposition = []) {
        let card = BCard._prefab.cloneNode(true);
        parent.appendChild(card);
        card.name = card_name;
        card.SetPosition(position);
        card.AddDispositions(disposition);
        return card;
    }

    SetPosition(position) {
        this.style.left = position[0] + "px";
        this.style.top = position[1] + "px";
    }
    
    AddDispositions(disposition = []) {
        for (const d of disposition) {
            this.cardArt_e.appendChild(d);
            this.disposition.push(d);
        }
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.style.width = BCard.width + "px";
        this.cardArt_e.style.height = BCard.artHeight + "px";
        this.cardNameContainer_e.style.height = BCard.nameHeight + "px";
    }

    disconnectedCallback() {

    }
}
customElements.define("b-card", BCard);

class BCardSlot extends BMOH {
    static _prefab = Helpers.ElementFromString(`
    <b-card-slot>
        
    </b-card-slot>`);

    static _border_thickness = 2;

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
        this.style.width = BCard.width + BCardSlot._border_thickness * 2 + "px";
        this.style.height = BCard.height + BCardSlot._border_thickness * 2 + "px";
        this.style.border = `${BCardSlot._border_thickness}px solid #261e57`;
        this.style.backgroundColor = "#1d0d36";
        this.style.position = "absolute";
    }

    disconnectedCallback() {

    }
}
customElements.define("b-card-slot", BCardSlot);
