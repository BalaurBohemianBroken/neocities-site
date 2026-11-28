class Collider extends BMOH {
    static eLayerName = {
        "Card": 0,
        "CardSlot": 1,
    }
    
    static allColliders = new Set();
    static collisionLayers = [
        new Set(),
        new Set(),
    ]
    
    static collisionMatrix = [
    //      C  
    //      a  
    //      r  
    //      d  
    //   C  s  
    //   a  l  
    //   r  o  
    //   d  t  
    //   s  s  
        [0, 1],  // Cards
        [1, 0],  // Card slots
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
    layer = "";
    layer_i = -1;

    onCollide = new Set();
    
    collidingWith = new Set();

    _OnCollide(collided_with) {
        this.collidingWith.add(collided_with);
        for (const event of this.onCollide) {
            event(collided_with);
        }
    }

    constructor(parent, width, height, layer, x_offset = 0, y_offset = 0) {
        super();
        this.layer = layer;
        this.layer_i = Collider.eLayerName[layer];
        
        Collider.allColliders.add(this);
        Collider.collisionLayers[this.layer_i].add(this);
        
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
        // Clear last frame's collision info.
        for (let col of Collider.allColliders) {
            col.collidingWith = new Set();
        }
        
        for (let i = 0; i < Collider.collisionLayers.length; i++)  {
            for (let j = i; j < Collider.collisionLayers.length; j++) {
                if (!Collider.CanLayersCollide(i, j)) continue;
                Collider.CheckCollisionsBetweenLayers(i, j);
            }
        }
    }

    static CheckCollisionsBetweenLayers(l1, l2) {
        // TODO: This will need a special rule if we're checking collider against itself, to prevent multiple collisions firing.
        let l1_colliders = Collider.collisionLayers[l1];
        let l2_colliders = Collider.collisionLayers[l2];
        for (let collider of l1_colliders) {
            if (!collider) continue;  // Can happen if a collision causes a destruction.
            for (let other of l2_colliders) {
                if (!other) continue;
                if (collider.IsColliding(other)) {
                    // TODO: I can implement one-way collisions with my current set up, if I want to.
                    collider._OnCollide(other);
                    other._OnCollide(collider);
                }
            }
        }
    }

    static CanLayersCollide(matrix1, matrix2) {
        return Collider.collisionMatrix[matrix1][matrix2] !== 0;
    }
}
customElements.define("b-collider", Collider);