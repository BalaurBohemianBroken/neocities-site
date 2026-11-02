b_console = {
    input_field_e: null,
    console_log_e: null,
    current_line_e: null,
    
    command_history: [],
    console_line_history: [],
    console_log: "",
    account: "<span class='ColorBalaur'>balaur</span>@<span class='ColorBalaur'>balaur</span>",
    filepath: "~",
    
    greetings: [
        "welcome home! :)",
        "hiya again",
        "henlo",
        "helo. i appreciate you being here",
    ],
    
    commands: {
        "whoami": whoami,
        "cls": cls,
        "echo": echo,
    },
}

document.addEventListener("DOMContentLoaded", Console);
document.addEventListener("click", function(event) {
    b_console.input_field_e.focus();
});

function Console() {
    b_console.input_field_e = document.getElementById("console_secret_input");
    b_console.console_log_e = document.getElementById("console_log");
    b_console.current_line_e = document.getElementById("prompt");

    b_console.input_field_e.addEventListener("keydown", OnConsoleInput);
    b_console.input_field_e.focus();
    b_console.current_line_e.innerHTML = GetPrompt();
    PrintToConsole(StartupText());
}


function OnConsoleInput(event) {
    if (event !== null && event.key === "Enter") {
        ConsoleSubmit();
    }
}

// TODO: there's a ghosting thing going on here
function ConsoleSubmit() {
    let cmd = GetUserInput();
    let line = `<span class="AlignLeft">${GetPrompt()}${cmd}</span>`;
    b_console.input_field_e.value = "";
    b_console.command_history.push(cmd);
    
    PrintToConsole(line);
    ParseCommand(cmd);

    b_console.current_line_e.innerHTML = GetPrompt();
}

function ParseCommand(command) {
    command = command.trim();
    let args = command.split(' ');
    if (command === "" || args.length <= 0) {
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

function GetPrompt() {
    return `${b_console.account}:${b_console.filepath}\$`;
}

function GetUserInput() {
    return b_console.input_field_e.value;
}

function StartupText() {
    let greeting = b_console.greetings[Math.floor(Math.random() * b_console.greetings.length)];
    // TODO: save/fetch login date
    return `<span class="AlignCenter">The programs included with this Ba-lOr-S instance are without ownership;
this unlicenced abandonware is provided for historical, emotional,
or hypothetical use ONLY.

Ba-lOr-S comes with ABSOLUTELY NO WARRANTY.
This instance may or may not function or change
or cease to exist without warning or reason.
====
${greeting}
Last login: Sat Oct 31 15:08:06 2026 from 90.190.222.255.
v.24.20261102</span>`;
}

function whoami(command) {
    PrintToConsole(`<span>Traceback (final call last):</span>
<span class="ConsolePink">File "/bin/ident/whoami.rosh", line 9740.00.00 (841,536,000)</span>
<span class="ConsoleRed">serve_forever();    </span>
<span class="ConsolePink">line 235, in serve_forever</span>
<span class="ConsoleRed">ready = self.isthisit(state);    </span>
<span class="ConsolePink">line 962, in Creature.isthisit</span>
<span class="ConsoleRed">formed_ident = self._fragments.collect(timeout);    </span>
<span class="ConsoleRed">~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^~    </span>
<span class="ConsolePink">DataExcept: Fragments don't fit together. Do they belong to one entity?    </span>`);
}

function cls(command) {
    b_console.console_log_e.innerHTML = "";
}

function echo(command) {
    PrintToConsole(command.slice(5));
}