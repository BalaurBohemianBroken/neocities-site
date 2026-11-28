// TODO: Volume check/adjustment
// TODO: Track passages the player's read, grey them out. Maybe this conflicts with the design of overwhelming the player?
class MOH {
    static instance = null;
    static tickSpeed = 17;
    static sfxTick =  new Audio("/Resources/MEMORIES OF HIM/SFX/Tick.mp3");
    static sfxTock =  new Audio("/Resources/MEMORIES OF HIM/SFX/Tock.mp3");
    
    static z_layer_ranges = {
        "": [0, 999],
        "Card": [2000, 2999],
    }

    spawnZone_e = null;
    playArea_e = null;
    actionOptions_e = null;

    static mousePosition = [0, 0];
    static updateEvents = new Set();
    
    lastFrameTime = -1;
    frameTime = -1;
    get deltaTime() {
        return this.frameTime - this.lastFrameTime; 
    };
    static get realTime() {
        return Date.now();
    };
    
    clockTime = 7500;
    clockSpeedMultiplier = 1;
    
    clockTimeRemaining = this.clockTime;
    clockNextTrigger = MOH.EClockTriggers.tick;
    
    constructor() {
        MOH.instance = this;
        this.lastFrameTime = MOH.realTime;
        this.frameTime = this.lastFrameTime;
        document.addEventListener("mousemove", this.MouseMove);

        this.StartGame();
    }
    
    StartGame() {
        this.clockTimeRemaining = this.clockTime;
        // This wrapping is necessary because otherwise this. is set to Window in setInterval
        setInterval(function () {MOH.instance.Update()}, MOH.tickSpeed);

        this.spawnZone_e = document.getElementById("spawnZone");
        this.playArea_e = document.getElementById("playArea");
        this.actionOptions_e = document.getElementById("actionOptions");
        
        this.SpawnCard();
    }
    
    MouseMove(event) {
        MOH.mousePosition = [event.pageX, event.pageY]; 
    }
    
    Update() {
        this.lastFrameTime = this.frameTime;
        this.frameTime = MOH.realTime;
        
        this.clockTimeRemaining -= this.deltaTime * this.clockSpeedMultiplier;
        if (this.clockTimeRemaining <= 0) {
            this.ClockProgressed();
            this.clockTimeRemaining += this.clockTime;  // += is used to carry any overflow to the next frame. Keeps on time.
        }
        
        for (const event of MOH.updateEvents) {
            event();
        }
    }
    
    ClockProgressed() {
        switch (this.clockNextTrigger) {
            case MOH.EClockTriggers.tick:
                this.Tick();
                break;
            case MOH.EClockTriggers.tock:
                this.Tock();
                break;
        }
    }

    Tick() {
        // Thought updates
        console.log("tick");
        MOH.sfxTick.play();
        this.clockNextTrigger = MOH.EClockTriggers.tock;
    }

    Tock() {
        // Action updates
        console.log("tock");
        MOH.sfxTock.play();
        this.clockNextTrigger = MOH.EClockTriggers.tick;
    }
    
    SpawnCard() {
        BCardSlot.Instantiate(this.playArea_e, this.spawnZone_e.spawnPositions[0]);
        let d = new Longing();
        let d2 = new Insight();
        BCard.Instantiate("DESPAIR", this.playArea_e, this.spawnZone_e.spawnPositions[1], [d, new Insight(),new Longing(),new Insight()]);
        BCard.Instantiate("HOPE", this.playArea_e, this.spawnZone_e.spawnPositions[2], [new Longing(), d2]);
        BCard.Instantiate("PASSION", this.playArea_e, this.spawnZone_e.spawnPositions[3], [new Longing()]);
        d.exhausted = true;
        d2.exhausted = true;
        BActivityOption.Instantiate(this.actionOptions_e);
    }

    static EClockTriggers = {
        tick: 1,
        tock: 2,
    };
}

function LoadScript(url, onload)  {
    let head = document.getElementsByTagName('head')[0];
    let script = document.createElement('script');
    script.onload = onload;
    script.type = 'text/javascript';
    script.src = url;
    head.appendChild(script);
}

function OnScriptLoaded() {
    // hopefully no race conditions here
    scripts_loaded += 1;
    
    if (scripts_loaded >= scripts_count)
        new MOH();
}

// request all the other scripts this game needs to run
scripts_required = [
    "/Resources/MEMORIES OF HIM/b-prefabs.js", 
    "/Resources/MEMORIES OF HIM/BCard.js",
    "/Resources/MEMORIES OF HIM/BDisposition.js"
]
scripts_loaded = 0;
scripts_count = scripts_required.length;
for (const s of scripts_required) {
    LoadScript(s, OnScriptLoaded);
}

// document.addEventListener('DOMContentLoaded', function() {new MOH()});