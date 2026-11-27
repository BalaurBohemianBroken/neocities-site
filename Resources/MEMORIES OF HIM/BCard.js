class BCard extends BMOH {
    static _prefab = Helpers.ElementFromString(
        `<b-card style="display: flex; flex-direction: column; border-radius: 10px; background-color: #261e57; position: absolute; transform: translate(-50%, -50%);">
        <div class="CardArt" style="border-radius: 10px 10px 0 0; flex-basis: 66%; background-color: #1d0d36; padding: 10px;"></div>
        <div style="flex-basis: 33%; display: flex; align-items: center; justify-content: center;">
            <p class="CardName" style="font-size: var(--text-mid);">INSIGHT</p>
        </div>
    </b-card>`);

    static _aspectRatio = 3/5;
    static get width() {
        return 80;
    }
    static get height() {
        return this.width * (1/this._aspectRatio);
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
    
    disposition = []

    static Instantiate(card_name, parent, position, disposition = []) {
        let card = BCard._prefab.cloneNode(true);
        card.name = card_name;
        card.style.width = `${BCard.width}px`;
        card.style.aspectRatio = `${BCard._aspectRatio}`;
        parent.appendChild(card);
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

    }

    disconnectedCallback() {

    }
}

customElements.define("b-card", BCard);