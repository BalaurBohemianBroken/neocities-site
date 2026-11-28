class Collider extends BMOH {
    static collisionLayers = {
        "Card": new Set(),
        "CardSlot": new Set()
    }
    static collisionMatrix = [
        [1, 1],  // Cards
        [1, 1],  // Card slots
    ]

    // For now, I'm assuming that objects have an x/y value that can be read.
    // I'd like to have an interface or component to handle this in the future, but for now i can't justify the extra work.
    get x() {
        return this.parent.x + this.x_offset;
    }
    get y() {
        return this.parent.y + this.y_offset;
    }
    x_offset = 0;
    y_offset = 0;
    w = 0;
    h = 0;

    get tl() { return [this.x, this.y]; };
    get tr() { return [this.x, this.y + this.w]; };
    get bl() { return [this.x + this.w, this.y]; };
    get br() { return [this.x + this.w, this.y + this.w]; };

    onCollide = new Set();

    _OnCollide(collided_with) {
        for (const event of this.onCollide) {
            event(collided_with);
        }
    }

    constructor(parent, width, height, layer, x_offset = 0, y_offset = 0) {
        super();
        Collider.collisionLayers[layer].add(this);
        this.parent = parent;
        this.w = width;
        this.h = height;
        this.x_offset = x_offset;
        this.y_offset = y_offset;

        this.style.display = "none";
        this.parent.appendChild(this);
    }

    IsColliding(other) {
        return (
            this.x < other.x + other.w &&
            this.x + this.w > other.x &&
            this.y < other.y + other.h &&
            this.y + this.h > other.y
        );
    }

    static CheckCollisions() {
        let layer_names =  Object.keys(Collider.collisionLayers);
        for (let i = 0; i < layer_names.length; i++)  {
            let layer_name = layer_names[i];
            let layer_matrix = Collider.collisionMatrix[i];
            for (let matrix_i = 0; matrix_i < layer_matrix.length; matrix_i++) {
                if (layer_matrix[i] === 0)
                    continue;
                Collider.CheckLayerCollisions(layer_name, layer_names[matrix_i]);
            }
        }
    }

    static CheckLayerCollisions(from, to) {
        // TODO: This will need a special rule if we're checking collider against itself, to prevent multiple collisions firing.
        let from_colliders = Collider.collisionLayers[from];
        let to_colliders = Collider.collisionLayers[to];
        for (let collider of from_colliders) {
            if (!collider) continue;  // Can happen if a collision causes a destruction.
            for (let other of to_colliders) {
                if (!other) continue;
                if (collider.IsColliding(other)) {
                    collider._OnCollide(other);
                    // other._OnCollide(other);
                }
            }
        }
    }
}
customElements.define("b-collider", Collider);