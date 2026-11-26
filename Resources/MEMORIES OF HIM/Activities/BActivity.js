// TODO: Make an Action state where multiple actions are taking place at once, e.g. at a party.

// Activities encompass both Actions, such as work or sleep, and also Thoughts, such as MEMORIES OF HIM, or INSANITY.
// An activity being active means that it is subscribed to, and responds to, the passing of time.
// It displays a selectable panel in its chosen field, which when selected, displays text, and optionally clickable choices or card slots.
class BActivity extends BMOH {
    // TODO: A mechanic that tracks how much time has passed, and changes events based on it.
//     static _prefab = Helpers.ElementFromString(`
// <b-activity-option style="display: flex; height: 30px; background: #772a9b; background: radial-gradient(ellipse at 70%, rgba(119, 42, 155, 1) 0%, rgba(119, 42, 155, 0) 100%);">
//     <p style="margin: auto; padding-right: var(--text-padding); text-align: right; width: 100%;">activity name</p>
// </b-activity-option>`);
    
    // What the activity is called.
    name = "DREAD.";
    // What is shown in the description box.
    content = "If you see this, something has gone horribly wrong.";
    
    // See SetEnabled
    enabled = true;

    static Instantiate() {
        
    }
    
    // == Events == //
    
    // Code to run when time progresses on this activity.
    OnProgress() {
        return null;
    }

    // When disabled:
    // Cards cannot be added to an activity
    // Existing cards are returned to the table
    // OnProgress will not fire.
    SetEnabled(enabled) {
        this.enabled = enabled;
    }
    
    // == Internal functions == //
    
    // Add a card slot to the description section of this activity.
    SpawnCardSlot() {
        
    }
    
    // A collection of options to click on and select one.
    SpawnDecisions() {
        
    }
}

customElements.define("b-activity", BActivity);