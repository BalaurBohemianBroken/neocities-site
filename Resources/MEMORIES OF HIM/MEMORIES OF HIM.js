class MOH {
    static instance = null;
    clockSpeedDefault = 5;
    clockSpeedMultiplier = 1;
    
    static Init() {
        MOH.instance = new MOH();
    }
    
    constructor() {
        setInterval(this.MainUpdate, 17);
    }
    
    MainUpdate() {
        
    }

    Tick() {
        // Thought updates
    }

    Tock() {
        // Action updates
    }
}

document.addEventListener('DOMContentLoaded', MOH.Init);