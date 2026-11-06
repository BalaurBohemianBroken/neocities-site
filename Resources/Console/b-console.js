class BConsole extends HTMLElement {
    get file_name() {
        return this.getAttribute("name");
    }
    
    get file_path() {
        if (!(this.parentElement instanceof BConsole))
            return this.file_name;
        let p_name = this.parentElement.file_path;
        return `${p_name}/${this.file_name}`;
    }
    
    get file_parent() {
        let par = this.parentNode;
        if (!(par instanceof BCFolder))
            return null;
        return par;
    }
    
    get file_children() {
        let children = this.children;
        let filtered_children = [];
        for (let child of children) {
            if (child instanceof BConsole) {
                filtered_children.push(child);
            }
        }
        return filtered_children;
    }
    
    file_traverse(to_file) {
        if (to_file === "..")
            return this.file_parent;
        return this.querySelector(`[name=${to_file}]`);
    }
    
    constructor() {
        super();
    }

    connectedCallback() {

    }

    disconnectedCallback() {

    }
}

class BCFolder extends BConsole {
    constructor() {
        super();
    }

    connectedCallback() {

    }

    disconnectedCallback() {

    }
}
customElements.define("bc-folder", BCFolder);

class BCAlbum extends BCFolder {
    constructor() {
        super();
    }

    connectedCallback() {

    }

    disconnectedCallback() {

    }
}
customElements.define("bc-album", BCAlbum);

class BCImg extends BConsole {
    constructor() {
        super();
    }

    connectedCallback() {

    }

    disconnectedCallback() {

    }
}
customElements.define("bc-img", BCImg);

class BCTxt extends BConsole {
    constructor() {
        super();
    }

    connectedCallback() {

    }

    disconnectedCallback() {

    }
}
customElements.define("bc-txt", BCTxt);

class BCMp3 extends BConsole {
    constructor() {
        super();
    }

    connectedCallback() {

    }

    disconnectedCallback() {

    }
}
customElements.define("bc-mp3", BCMp3);
