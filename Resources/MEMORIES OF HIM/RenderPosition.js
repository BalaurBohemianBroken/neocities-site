class RenderController {
    static _layerRanges = {
        "": [1, 1999],
        "Card": [2000, 2999],
    }
    
    _renderLayer = "";
    get renderLayer() {
        return this._renderLayer;
    }
    set renderLayer(layer_name) {
        this.SetRenderLayer(this._renderPosition, layer_name);
    }

    _renderPosition = -1;
    get renderPosition() {
        return this._renderPosition;
    }
    set renderPosition(layer_position) {
        this.SetRenderLayer(layer_position, this._renderLayer);
    }
    
    parent = null;

    constructor(parent) {
        this.parent = parent;
        this.SetRenderLayer(0, "");
    }

    SetRenderLayer(position= -1, layer= null) {
        if (layer === null) {
            layer = this._renderLayer;
        }
        this._renderLayer = layer;

        if (position === -1) {
            position = this._renderPosition;
        }
        this._renderPosition = position;

        let range = RenderController._layerRanges[this._renderLayer];
        this.parent.style.z_index = range[0] + this._renderPosition;
    }
}