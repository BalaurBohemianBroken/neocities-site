class Vector2 {
    x = 0;
    y = 0;
    
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    
    Add(other) {
        return new Vector2(this.x + other.x, this.y + other.y);
    }
    
    Subtract(other) {
        return new Vector2(this.x - other.x, this.y - other.y);
    }
    
    Multiply(amount) {
        return new Vector2(this.x * amount, this.y * amount);
    }
    
    Magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    
    Normalize() {
        let m = this.Magnitude();
        return new Vector2(this.x / m, this.y / m);
    }

    Distance(other) {
        return this.Subtract(other).Magnitude();
    }
}