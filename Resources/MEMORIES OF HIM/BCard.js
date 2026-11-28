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

    get position() {
        return new Vector2(this.x, this.y);
    }
    set position(to) {
        this.x = to.x;
        this.y = to.y;
    }
    get x() {
        return Number(this.style.left.slice(0, -2));
    }
    set x(value) {
        this.style.left = value + "px";
    }
    get y() {
        return Number(this.style.top.slice(0, -2));
    }
    set y(value) {
        this.style.top = value + "px";
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
    
    updateInstance = null;
    collider = null;
    inCardSlot = null;

    moveTarget = null;
    moveMaxSpeed = 1000;
    moveMinSpeed = 100;
    moveRadiusSlow = 100;
    
    beingDragged = false;
    dragOffset = [0, 0];
    draggingFunction = null;
    disposition = [];

    constructor() {
        super();
    }

    connectedCallback() {
        this.style.width = BCard.width + "px";
        this.cardArt_e.style.height = BCard.artHeight + "px";
        this.cardNameContainer_e.style.height = BCard.nameHeight + "px";
    }

    static Instantiate(card_name, parent, position, disposition = []) {
        let card = BCard._prefab.cloneNode(true);
        // Child elements don't exist unless I append to the parent first. Dunno why.
        parent.appendChild(card);
        
        card.addEventListener("pointerdown", card.PointerDown);
        card.addEventListener("pointerup", card.PointerUp);
        card.name = card_name;
        card.position = position;
        card.AddDispositions(disposition);
        card.collider = new Collider(card, BCard.width, BCard.height, "Card");
        card.collider.onCollide.add(card.OnCollide.bind(card));
        
        card.updateInstance = card.Update.bind(card);
        MOH.updateEvents.add(card.updateInstance);
        return card;
    }
    
    Update() {
        if (this.beingDragged) {
            this.FollowMouse();
        }
        else if (this.moveTarget) {
            this.MoveToward(this.moveTarget);
        }
    }
    
    OnCollide(other) {

    }
    
    PointerDown(event) {
        if (this.beingDragged || this.beingGrabbed)
            return;
        this.StartDrag(event);
    }
    
    PointerUp(event) {
        if (!this.beingDragged) return;
        this.StopDrag();
        
        for (let col of Array.from(this.collider.collidingWith)) {
            if (col.parent instanceof BCardSlot) {
                this.EnterSlot(col.parent);
                return;
            }
        }
    }

    // TODO: Limit positions the card can go. Prevent it from going off screen, overlapping UI elements.
    FollowMouse() {
        this.x = MOH.mousePosition[0] + this.dragOffset[0];
        this.y = MOH.mousePosition[1] + this.dragOffset[1];
    }
    
    StartDrag(event) {
        this.LeaveSlot();
        this.dragOffset = [this.x - event.pageX, this.y - event.pageY];
        this.beingDragged = true;
    }
    
    StopDrag() {
        MOH.updateEvents.delete(this.draggingFunction);
        this.beingDragged = false;
    }
    
    EnterSlot(card_slot) {
        if (card_slot.grabbedCard !== null) {
            console.warn("Cannot be grabbed by slot, it is already filled!", this, card_slot);
            return;
        }
        
        this.inCardSlot = card_slot;
        this.moveTarget = card_slot.position;
        card_slot.grabbedCard = this;
    }
    
    LeaveSlot() {
        if (this.inCardSlot !== null) {
            this.inCardSlot.grabbedCard = null;
        }
        this.inCardSlot = null;
        this.moveTarget = null;
    }
    
    MoveToward(point) {
        // Move card towards this point
        let delta = point.Subtract(this.position);
        let distance = delta.Magnitude();
        let speed_mult = Math.min(distance / this.moveRadiusSlow, 1);
        let speed = this.moveMaxSpeed * speed_mult;
        speed = Math.max(this.moveMinSpeed, speed) * MOH.deltaS;
        let distance_to_move = Math.min(speed, distance);
        let move_vector = delta.Normalize().Multiply(distance_to_move);
        this.position = this.position.Add(move_vector);
    }
    
    AddDispositions(disposition = []) {
        for (const d of disposition) {
            this.cardArt_e.appendChild(d);
            this.disposition.push(d);
        }
    }
}
customElements.define("b-card", BCard);