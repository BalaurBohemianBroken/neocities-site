b_console = {
    input_field_e: null,
    console_log_e: null,
    current_line_e: null,
    
    command_history: [],
    console_line_history: [],
    console_log: "",
    account: "balaur@balaur",
    filepath: "~",
    
    fix_stupid_flashing: false,
    
    commands: {
        "whoami": whoami
    },
}

document.addEventListener("DOMContentLoaded", Console);
document.addEventListener("click", function(event) {
    b_console.input_field_e.focus();
});

// I had issue where onkeydown fires before the character is actually added to the input element
// This keeps it (humanly) in sync, without trying to mess around with parsing the value of the onkeydown event
setInterval(MatchHiddenInput, 20);

function Console() {
    b_console.input_field_e = document.getElementById("console_secret_input");
    b_console.console_log_e = document.getElementById("console_log");
    b_console.current_line_e = document.getElementById("current_line");

    b_console.input_field_e.addEventListener("keydown", OnConsoleInput);
    OnConsoleInput(null);
    b_console.input_field_e.focus();
}

function MatchHiddenInput() {
    b_console.current_line_e.innerText = ActiveLine();
}

function OnConsoleInput(event) {
    if (event !== null && event.key === "Enter") {
        ConsoleSubmit();
    }
}

// TODO: there's a ghosting thing going on here
function ConsoleSubmit() {
    let line = ActiveLine();
    let cmd = b_console.input_field_e.value;
    b_console.input_field_e.value = "";
    b_console.command_history.push(cmd);
    
    PrintToConsole(line);
    ParseCommand(cmd);
}

function ParseCommand(command) {
    command = command.trim();
    let args = command.split(' ');
    if (args.length <= 0) {
        return;
    }
    // TODO: More not found text :)
    if (!(args[0] in b_console.commands)) {
        PrintToConsole(`Could not find command ${args[0]}`);
        return;
    }
    b_console.commands[args[0]](command);
}

function PrintToConsole(to_print) {
    b_console.console_line_history.push(to_print);
    b_console.console_log_e.innerHTML += to_print + "\n";
}

function ActiveLine() {
    return `${b_console.account}:${b_console.filepath}\$ ${b_console.input_field_e.value}`;
}

function whoami(command) {
    PrintToConsole(`Traceback (final call last):
<span class="ConsolePurple">File "/bin/identity/whoami.rosh", line 9740.00.00 (841,536,000)</span>
<span class="ConsoleRed">  serve_forever();</span>
<span class="ConsolePurple">line 235, in serve_forever</span>
<span class="ConsoleRed">  ready = self.isthisit(state);</span>
<span class="ConsolePurple">line 962, in Creature.isthisit</span>
<span class="ConsoleRed">  formed_ident = self._fragments.collect(timeout);</span>
<span class="ConsoleRed">  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^</span>
<span class="ConsolePurple">  DataExcept: Shards create a fragmentary object. Does the collection belong to one entity?</span>`);
}