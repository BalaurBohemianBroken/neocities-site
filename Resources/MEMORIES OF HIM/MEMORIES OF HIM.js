// TODO: Volume check/adjustment
// TODO: Track passages the player's read, grey them out. Maybe this conflicts with the design of overwhelming the player?
class MOH {
    static instance = null;
    static tickSpeed = 17;
    static sfxTick =  new Audio("/Resources/MEMORIES OF HIM/SFX/Tick.mp3");
    static sfxTock =  new Audio("/Resources/MEMORIES OF HIM/SFX/Tock.mp3");

    spawnZone_e = null;
    playArea_e = null;
    
    lastFrameTime = -1;
    frameTime = -1;
    get deltaTime() {
        return this.frameTime - this.lastFrameTime; 
    };
    static get realTime() {
        return Date.now();
    };

    clockTime = 5000;
    clockSpeedMultiplier = 1;
    
    clockTimeRemaining = this.clockTime;
    clockNextTrigger = MOH.EClockTriggers.tick;
    
    constructor() {
        MOH.instance = this;
        this.lastFrameTime = MOH.realTime;
        this.frameTime = this.lastFrameTime;

        this.StartGame();
    }
    
    StartGame() {
        this.clockTimeRemaining = this.clockTime;
        // For some reason, giving setInterval this.Update causes this. to refer to the Window object, instead of MOH.
        // Only by wrapping it within a function call can I get this. to refer to the object.
        setInterval(function () {MOH.instance.Update()}, MOH.tickSpeed);

        this.spawnZone_e = document.getElementById("spawnZone");
        this.playArea_e = document.getElementById("playArea");
        
        this.SpawnCard();
    }
    
    Update() {
        this.lastFrameTime = this.frameTime;
        this.frameTime = MOH.realTime;
        
        this.clockTimeRemaining -= this.deltaTime * this.clockSpeedMultiplier;
        if (this.clockTimeRemaining <= 0) {
            this.ClockProgressed();
            this.clockTimeRemaining += this.clockTime;  // += is used to carry any overflow to the next frame. Keeps on time.
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
        BCard.Instantiate("INSIGHT", this.playArea_e, this.spawnZone_e.spawnPositions[0]);
        BCard.Instantiate("DESPAIR", this.playArea_e, this.spawnZone_e.spawnPositions[1]);
        BCard.Instantiate("HOPE", this.playArea_e, this.spawnZone_e.spawnPositions[2]);
        BCard.Instantiate("PASSION", this.playArea_e, this.spawnZone_e.spawnPositions[3]);
    }

    static EClockTriggers = {
        tick: 1,
        tock: 2,
    };
}

document.addEventListener('DOMContentLoaded', function() {new MOH()});