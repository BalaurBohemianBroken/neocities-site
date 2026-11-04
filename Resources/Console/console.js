b_console = {
    version: "v.28.20261104",
    
    console_e: null,
    console_log_e: null,
    current_line_e: null,
    input_field_e: null,

    linebreak_limit_soft: 40,
    
    command_history: [],
    console_line_history: [],
    console_log: "",
    account: "<span class='ColorBalaur'>balaur</span>@<span class='ColorBalaur'>balaur</span>",
    filepath: "~",
    
    greetings: [
        "welcome home! :)",
        "hiya again",
        "henlo",
        "helo. thanks for coming",
    ],
    
    commands: {
        "help": help,
        "use": use,
        "whoami": whoami,
        "specs": specs,
        "cls": cls,
        "echo": echo,
    },
}

document.addEventListener("DOMContentLoaded", Console);
document.addEventListener("click", function(event) {
    b_console.input_field_e.focus();
});

function Console() {
    b_console.console_e = document.getElementById("console");
    b_console.console_log_e = document.getElementById("console_log");
    b_console.current_line_e = document.getElementById("prompt");
    b_console.input_field_e = document.getElementById("console_secret_input");

    b_console.input_field_e.addEventListener("keydown", OnConsoleInput);
    b_console.input_field_e.focus();
    b_console.current_line_e.innerHTML = GetPrompt();
    PrintToConsole(StartupText());
    localStorage.setItem('last_login', Date.now().toString());
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
    b_console.console_e.scrollTop = b_console.console_e.scrollHeight;
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
    b_console.commands[args[0]](command, args);
}

function PrintToConsole(to_print, dont_limit = false) {
    if (!dont_limit)
        to_print = LimitLineLength(to_print, b_console.linebreak_limit_soft);
    b_console.console_line_history.push(to_print);
    b_console.console_log_e.innerHTML += to_print + "\n";
}

function LimitLineLength(str_to_limit, soft_limit_length) {
    // Automatically add linebreaks to keep it within console width.
    // This isn't robust. If I use < or > in a non-tag format it will get confused.
    // but the effect of that is that line wrapping doesn't work for that line, so it's not high stakes.
    let lines = str_to_limit.split("\n");
    let limited = "";
    for (const line of lines) {
        let in_tag = 0;
        let length = 0;

        for (let i = 0; i < line.length; i++) {
            let c = line.charAt(i);
            switch(c) {
                case "<":
                    in_tag += 1;
                    break;
                case ">":
                    in_tag -= 1;
                    break;
                case " ":
                    if (length >= soft_limit_length) {
                        c = "\n";
                        length = 0;
                    }
                    break;
            }

            if (in_tag === 0) {
                length += 1;
            }
            limited += c;
        }
        limited += "\n";
    }
    return limited.slice(0, -1);  // Removes the final, redundant \n that is a result of joining lines in the foreach loop
}

function GetPrompt() {
    return `${b_console.account}:${b_console.filepath}\$`;
}

function GetUserInput() {
    return b_console.input_field_e.value;
}

function StartupText() {
    let greeting = b_console.greetings[Math.floor(Math.random() * b_console.greetings.length)];
    let last_login = localStorage.getItem("last_login");
    let login_string = "Never!";
    if (last_login != null) {
        let login_date = new Date();
        login_date.setTime(parseInt(last_login));
        let options = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        };
        login_string = login_date.toLocaleDateString("en-GB", options);
        login_string = login_string.replaceAll(',', '');
    }
    return `<span class="AlignCenter">The programs included with this <span class="ColorBalaur">Ba-lOr-S</span> instance are without ownership;
this unlicenced abandonware is provided for historical, emotional, or hypothetical use ONLY.

<span class="ColorBalaur">Ba-lOr-S</span> comes with ABSOLUTELY NO WARRANTY.
This instance may or may not function or change or cease to exist without warning or reason.
${"-".repeat(b_console.linebreak_limit_soft)}
${b_console.version}
Last login: ${login_string}
${greeting}</span>`;
}

function help() {
    let cmd_list = Object.keys(b_console.commands).join('\n');
    PrintToConsole(`Hello!
If you've made it here, you either know something about terminals, or care enough to figure it out.
<span class="ColorBalaur">Ba-lOr-S</span> is loosely based on the Bourne Again SHell (B.A.S.H) and the ROver SHell (R.O.S.H).

Command list:
${cmd_list}`);
}

function cd(command, args) {
    if (args.length <= 1) {
        PrintToConsole('Provide a directory to change to, e.g. cd oad');
        return;
    }
    if (args[1].charAt(0) === '/') {
        PrintToConsole(`<span class="ConsoleRed">Invalid:</span> Traversal from root is <span class="ConsoleRed">not</span> allowed. You are sandboxed within user:<span class="ColorBalaur">balaur!</span>
The internal workings elude you.`);
    }
    
    let path_tree = args[1].split('/');
}

function use(command, args) {
    
}

function whoami() {
    let str_whoami = `<span>Traceback (final call last):</span>
<span class="ConsolePink">File "/bin/ident/whoami.rosh", line 9740.00.00 (841,536,000)</span>
<span class="ConsoleRed">serve_forever();    </span>
<span class="ConsolePink">line 235, in serve_forever</span>
<span class="ConsoleRed">ready = self.isthisit(state);    </span>
<span class="ConsolePink">line 962, in Creature.isthisit</span>
<span class="ConsoleRed">formed_ident = self._fragments.collect(timeout);    </span>
<span class="ConsoleRed">~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^~    </span>
<span class="ConsolePink">DataExcept: Fragments don't fit together. Are you sure form one entity?</span>`;
    PrintToConsole(str_whoami, true);
}

function cls() {
    b_console.console_log_e.innerHTML = "";
}

function echo(command) {
    PrintToConsole(command.slice(5));
}

function stats() {
    let greetings = 0;
    let song_otd = 0;
    let art_otd = 0;
    let pages = 0;
    let codes = [];
    let session_time = 0;
}

function about() {
    PrintToConsole(`about: /`);
}

function specs() {
    let det = `RAM:
3-5 discrete single-item units; down from 7  
SD:
1; unreliable/indeterminate quantity/quality  
Network:
Wireless LAN;  
<span class="ConsoleGreen">●</span> Operational telePath Link™    
Servos:
<span class="ConsoleGreen">●</span> Operational (Overclock; Sleep; Service soon!)  
PSU:
76b4chamber stock  
<span class="ConsoleRed">Volt flux detected!</span> Expect failure!  
Camera:
(2) <span class="ConsoleGreen">●</span> Operational; a.aliased (-1.5); grey-gold  `;
    PrintToConsole(det, true);
}