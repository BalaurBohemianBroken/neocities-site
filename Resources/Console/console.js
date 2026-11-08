// TODO: Make the side panels load up sequentially in the boot process, flicking on one after another as though read from slow CPU.
// TODO: startup/ambient sounds
//   help
//   about
//   GOTO page
//   git history of pages
//   Query info about web pages
//   cat
//   echo
//   history (command number + command)
//   view picture - enter for next, shift+enter for previous
//   play song
//
// forbidden:
//   sudo
//   mkdir
//   nano
//   touch
//   rm
//  
// files:
//   on notable people
//   poems
//   music
//   in-world archival stuff?
//   in-world files to represent hobbies?
//   RAT REPO
//  
//   command to view camera that uses the bweh meme
//   snippets of old conversations?
//
//    Below that, a music player - controllable by mouse or console.
//    Typing anywhere focuses the input into the terminal.
//    Resize only changes size of text.
//   
//    This layout allows me to easily hide things.
//    It allows me to filter people.
//    I can store as much data as necessary.
//    Console themes.
//    Can "view" images, which changes what is in the side bar. This is how people can see different pfps.
//    Automatically change pfp based on day.
//    A viewable "update" chart, based on Github's, that shows a heatmap of commits for the site.
class CMDs {
    static help() {
        let cmd_list = Object.keys(b_console.commands).join('\n');
        PrintToConsole(`Hello!
If you've made it here, you either know something about terminals, or care enough to figure it out.
<span class="ColorBalaur">Ba-lOr-S</span> is loosely based on the Bourne Again SHell (B.A.S.H) and the ROver SHell (R.O.S.H).

Command list:
${cmd_list}`);
    }

    static cd(command, args) {
        if (args.length <= 1 && b_console.filepath === "~") {
            PrintToConsole('Already in home directory. Provide a directory to change to, e.g. cd oad');
            return;
        }
        if (args[1].charAt(0) === '/') {
            PrintToConsole(`<span class="ConsoleRed">Invalid:</span> Traversal from root is <span class="ConsoleRed">not</span> allowed. You are sandboxed within user:<span class="ColorBalaur">balaur</span>!`);
        }

        // Is path relative to CWD or home?
        let path = args.slice(1).join(" ");
        let new_folder = TraverseFileSystem(path);
        if (new_folder === null)
            return;
        
        if (!(new_folder instanceof BCFolder)) {
            PrintToConsole(`<span class="ConsoleRed">err:</span> ${path} is not a folder.`);
            return;
        }
        b_console.cwd_e = new_folder;
    }

    static ls(command, args) {
        let folder_e = b_console.cwd_e;
        if (args.length > 1) {
            folder_e = TraverseFileSystem(args.slice(1).join(" "));
            if (folder_e === null) {
                return;
            }
        }
        let children = folder_e.file_children;
        if (children.length === 0) {
            PrintToConsole(`${folder_e.file_path} has no children.`);
            return;
        }
        
        for (let child of children) {
            PrintToConsole(child.file_name);
        }
    }
    
    static use(command, args) {

    }

    static whoami() {
        let str_whoami = `<span>Traceback (final call last):</span>
<span class="ConsolePink">File "/bin/ident/whoami.rosh", line 9740.00.00 (841,536,000)</span>
    <span class="ConsoleRed">serve_forever();</span>
<span class="ConsolePink">line 235, in serve_forever</span>
    <span class="ConsoleRed">ready = self.isthisit(state);</span>
<span class="ConsolePink">line 962, in Creature.isthisit</span>
    <span class="ConsoleRed">formed_ident = self._fragments.collect(timeout);</span>
    <span class="ConsoleRed">~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^~</span>
<span class="ConsolePink">DataExcept: Fragments don't fit together. Are you sure form one entity?</span>`;
        str_whoami = InvertIndentation(str_whoami);
        PrintToConsole(str_whoami, true);
    }

    static cls() {
        b_console.console_log_e.innerHTML = "";
    }

    static echo(command) {
        PrintToConsole(command.slice(5));
    }

    static stats() {
        // TODO: These
        let greetings = 0;
        let song_otd = 0;
        let art_otd = 0;
        let pages = 0;
        let codes = [];
        let session_time = 0;
    }

    static about() {
        // TODO: This
        PrintToConsole(`about: /`);
    }

    static specs() {
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
  (2) <span class="ConsoleGreen">●</span> Operational; a.aliased (-1.5); grey-gold`;
        det = InvertIndentation(det);
        PrintToConsole(det, true);
    }
    
    static exit() {
        while (document.body.children.length > 0) {
            document.body.children[0].remove();
        }
    }
}

b_console = {
    get version(){ return document.getElementById("version").innerText; },
    
    file_system_e: null,
    cwd_e: null,
    
    console_e: null,
    active_line_e: null,
    console_log_e: null,
    prompt_e: null,
    input_field_e: null,
    right_panel_e: null,

    linebreak_limit_soft: 40,
    
    command_history: [],
    console_line_history: [],
    console_log: "",
    account: "<span class='ColorBalaur'>balaur</span>@<span class='ColorBalaur'>balaur</span>",
    get filepath() { return b_console.cwd_e.file_path; },
    
    greetings: [
        "welcome home! :)",
        "hiya again",
        "henlo",
        "helo. thanks for coming",
    ],
    
    commands: {
        "help": CMDs.help,
        "use": CMDs.use,
        "whoami": CMDs.whoami,
        "specs": CMDs.specs,
        "cls": CMDs.cls,
        "echo": CMDs.echo,
        "exit": CMDs.exit,
        "cd": CMDs.cd,
        "ls": CMDs.ls,
    },
    
    versions: {},
}

document.addEventListener("DOMContentLoaded", Console);
document.addEventListener("click", function() {
    b_console.input_field_e.focus();
});

function Console() {
    // Assign elements
    b_console.file_system_e = document.getElementById("file_system");
    b_console.cwd_e = b_console.file_system_e; 
    
    b_console.console_e = document.getElementById("console");
    b_console.active_line_e = document.getElementById("active_line");
    b_console.console_log_e = document.getElementById("console_log");
    b_console.prompt_e = document.getElementById("prompt");
    b_console.input_field_e = document.getElementById("console_secret_input");
    b_console.right_panel_e = document.getElementById("main_right");

    // Listeners
    b_console.input_field_e.addEventListener("keydown", OnConsoleInput);

    // Requests
    // TODO: Request all data for visited pages, rather than hardcode
    RequestText("/Resources/PageData/Version/_.txt", function(data) {
        b_console.versions["_"] = data;
    });

    // Boot process
    // Hidden for boot process
    b_console.active_line_e.style.display = "none";
    let frame_rate = 50;
    let boot_generator = BootProcess(frame_rate);
    // TODO: kill this coroutine on completion
    let interval_id = setInterval(function() {
        boot_generator.next();
    }, frame_rate);
}

function* BootProcess(frame_gap) {
    frame_gap = frame_gap / 1000;
    let boot = {
        prompt: "*****@RemoteTerminal ~ %",
        type_speed: 1,
        _boot_str: "",
        get boot_str() {
            return this._boot_str;
        },
        set boot_str(boot_str) {
            this._boot_str = boot_str;
            b_console.console_log_e.innerHTML = `<span class="AlignLeft">${boot_str}</span>\n`;
        },
    }
    boot.boot_str = boot.prompt;

    let to_type = "source sconnect.sh";
    let wait_time = boot.type_speed;
    while (to_type.length > 0) {
        while (wait_time > 0) {
            wait_time -= frame_gap;
            yield null;
        }
        boot.boot_str += to_type.charAt(0);
        to_type = to_type.slice(1);
        yield null;
    }

    wait_time = 1;
    while (wait_time > 0) {
        wait_time -= frame_gap;
        yield null;
    }
    boot.boot_str += "\nconnecting to balaur@balaur...\n";

    wait_time = 2;
    while (wait_time > 0) {
        wait_time -= frame_gap;
        yield null;
    }

    boot.boot_str += "connected!";

    wait_time = 0.5;
    while (wait_time > 0) {
        wait_time -= frame_gap;
        yield null;
    }

    OnConnected();
}

// ========== Events ===========
function OnConsoleInput(event) {
    if (event !== null && event.key === "Enter") {
        ConsoleSubmit();
    }
}

function OnConnected() {
    b_console.prompt_e.innerHTML = GetPrompt();
    PrintToConsole(StartupText());

    b_console.active_line_e.style.display = "";
    b_console.input_field_e.focus();

    b_console.right_panel_e.style.display = "";
    localStorage.setItem('last_login', Date.now().toString());
    CreateActivityHeatmap(b_console.versions["_"]);
}

function ConsoleSubmit() {
    let cmd = GetUserInput();
    let line = `<span class="AlignLeft">${GetPrompt()}${cmd}</span>`;
    b_console.input_field_e.value = "";
    b_console.command_history.push(cmd);
    
    PrintToConsole(line);
    ParseCommand(cmd);

    b_console.prompt_e.innerHTML = GetPrompt();
    b_console.console_e.scrollTop = b_console.console_e.scrollHeight;
}

// ========== Functions ===========
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

function InvertIndentation(str) {
    // Move indentation from the left side of a string to the right side.
    let ret = "";
    let lines = str.split("\n");
    for (let line of lines) {
        let indent_size = line.match(/^( *)/)[1].length;
        line = line.slice(indent_size) + " ".repeat(indent_size);
        ret += line + "\n";
    }
    return ret.slice(0, -1);
}

function GetPrompt() {
    return `${b_console.account}:<span class="ConsoleBlue">${b_console.filepath}</span>\$`;
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

function TraverseFileSystem(path) {
    let current_file = b_console.cwd_e;
    let stops = path.split("/");
    // case: absolute path
    if (stops[0] === "~") {
        current_file = b_console.file_system_e;
        stops.shift();
    }

    // case: relative path
    for (let stop of stops) {
        current_file = current_file.file_traverse(stop);
        if (current_file === null) {
            PrintToConsole(`<span class='ConsoleRed'>err:</span> no file at ${current_file}`);
            return null;
        }
    }
    return current_file;
}

function CreateActivityHeatmap() {
    let versions = b_console.versions["_"].split("\n");
    let commit_dates = {};
    for (let ver of versions) {
        const reg = /^(v\.\d+\.(\d+)) (.+)/;
        let m = ver.match(reg);
        if (m === null) {
            console.warning("Unable to match a given version: " + ver);
            continue;
        }
        let version_date = DateTime.YMDToDate(m[2]);
        let time = version_date.getTime();
        let c = 0;
        if (time in commit_dates)
            c = commit_dates[time];
        commit_dates[time] = c + 1; 
    }
    
    let total_days = 364;
    
    let end_day = new Date();
    end_day.setHours(0, 0, 0, 0);
    
    let start_day = new Date(end_day.getTime() - (DateTime.day_length * (total_days - 1)));
    start_day = new Date(start_day.getTime());

    console.log(start_day.getDay());
    console.log((end_day.getTime() - start_day.getTime()) / DateTime.day_length);
    
    let heatmap = CreateHeatmap(start_day.getTime(), end_day.getTime(), commit_dates);
    
    PrintToConsole(heatmap, true);
}

function CreateHeatmap(start_time, end_time, commits) {
    let day_strings = Array(14).fill("");
    let current_time = start_time;
    let day_i = 0;
    while (current_time <= end_time) {
        let compare_time = new Date(current_time);
        compare_time.setUTCHours(0, 0, 0, 0);
        compare_time = compare_time.getTime();
        let c = 0;
        if (compare_time in commits)
            c = commits[compare_time];
        
        if (c < 1)
            c = `<div class="Heatmap HeatmapNone"></div>`;
        else if (c < 3)
            c = `<div class="Heatmap HeatmapLow"></div>`;
        else if (c < 5)
            c = `<div class="Heatmap HeatmapMid"></div>`;
        else if (c < 6)
            c = `<div class="Heatmap HeatmapHigh"></div>`;
        else if (c < 9)
            c = `<div class="Heatmap HeatmapExcessive"></div>`;
        else
            c = `<div class="Heatmap HeatmapExcessive"></div>`;
        day_strings[day_i] += c;
        day_i = (day_i + 1) % 14;
        current_time += DateTime.day_length;
    }
    // let width = day_strings[0].length;
    // for (let i = 1; i < day_strings.length; i++) {
    //     if (day_strings[i].length < width)
    //         day_strings[i] += " ";
    // }
    let ret = `<div></div>`;
    for (let day of day_strings) {
        ret += `<div style="height: 13px;">${day}</div>`;
    }
    return `<div>${ret}</div>`;
}