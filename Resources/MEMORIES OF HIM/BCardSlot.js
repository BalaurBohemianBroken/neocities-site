class BCardSlot extends BMOH {
    static _prefab = Helpers.ElementFromString(`
    <b-card-slot>
        
    </b-card-slot>`);

    static _border_thickness = 2;

    static get width() {
        return BCard.width + BCardSlot._border_thickness * 2;
    }
    static get height() {
        return BCard.height + BCardSlot._border_thickness * 2;
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

    update_instance = null;
    collider = null;
    grabbedCard = null;

    static Instantiate(parent, position) {
        let card_slot = BCardSlot._prefab.cloneNode(true);
        parent.appendChild(card_slot);
        card_slot.position = position;
        card_slot.collider = new Collider(card_slot, BCardSlot.width, BCardSlot.height, "CardSlot");
        card_slot.collider.onCollide.add(card_slot.OnCollide.bind(card_slot))
        return card_slot;
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
    
    Update() {
        if (this.pullingCard) {
            // Move card towards this point
            let delta = this.position.Subtract(this.grabbedCard.position);
            let distance = delta.Magnitude();
            let speed_mult = Math.min(distance / this.grabRadiusSlow, 1);
            let speed = this.grabMaxSpeed * speed_mult;
            speed = Math.max(this.grabMinSpeed, speed) * MOH.deltaS;
            let distance_to_move = Math.min(speed, distance);
            let move_vector = delta.Normalize().Multiply(distance_to_move);
            this.grabbedCard.position = this.grabbedCard.position.Add(move_vector);
            
            if (this.position.Subtract(this.grabbedCard.position).Magnitude() === 0) {
                this.pullingCard = false;
                this.grabbedCard.beingGrabbed = false;
            }
        }
    }
    
    GrabCard(card) {
        if (this.grabbedCard !== null)
            return;
        
        // Lock the card to prevent other things from taking it
        this.grabbedCard = card;
        card.OnCardSlotGrab(this);
        this.pullingCard = true;
        
        // TODO: sfx for grabbing
    }
    
    OnCollide(other) {

    }
}
customElements.define("b-card-slot", BCardSlot);