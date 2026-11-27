class BMOH extends HTMLElement {
    _render_layer = "";
    get render_layer() {
        return this._render_layer;
    }
    set render_layer(layer_name) {
        this.UpdateRenderLayer(this._render_position, layer_name);
    }
    
    _render_position = -1;
    get render_position() {
        return this._render_position;
    }
    set render_position(layer_position) {
        this.UpdateRenderLayer(layer_position, this._render_layer);
    }

    constructor() {
        super();
    }

    connectedCallback() {

    }

    disconnectedCallback() {

    }
    
    UpdateRenderLayer(position= -1, layer= null) {
        if (layer === null) {
            layer = this._render_layer;
        }
        this._render_layer = layer;
        
        if (this._render_layer === "") {
            this.style.z_index = "auto";
            return;
        }
        
        if (position === -1) {
            position = this._render_position;
        }
        this._render_position = position;
        
        let range = MOH.z_layer_ranges[this._render_layer];
        this.style.z_index = range[0] + this._render_position;
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