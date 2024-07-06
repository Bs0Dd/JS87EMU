var stopped = false;

var realConsoleLog = console.log;

function PANEL() {

    const pnl = document.createElement("table");
    pnl.id = "mk87_panel_int";

    var dwram = document.createElement('a');
    dwram.id = "dwram";
    dwram.style.display = "none";
    dwram.download = "mk87_ram.bin";

    pnl.appendChild(dwram);

    var dbgm = DEBUG ? "checked" : "";

    if (!DEBUG) {
        console.log = function() {};
    }

    var tabcont = [[],[]];

    tabcont[0][0] = `<button id="imem" onClick="panelInitMem()">Init memory</button>
            <button id="showk" onClick="panelShowKey()">Show key</button>
            <button id="eegg" onClick="panelShowEgg()">Easter egg</button>
            <button id="ufun" onClick="panelUnkFun()">Unknown function</button>
            <button id="rstcl" onClick="panelResetWa()">Reset clock (11:11)</button>
            <button id="setrt" onClick="panelSetRTWa()">Set real time</button>`

    tabcont[0][1] = `<button id="stst" onClick="panelSwState()">Pause</button>
            <button id="rst" onClick="panelDevRestart()">Restart</button>`;

    if (supportsVibrate) {
        var vib = useVibrate ? "checked" : "";

        tabcont[0][1] += ` | <label for="vib">Vibro (keys):</label> <input type="checkbox" onChange="panelSwVibro()" id="vib" name="vib" ${vib}>`;
    }

    tabcont[1][0] = `RAM file (2KB only): <span id="rfi"></span><br><button onClick="panelSaveRaF()">Save RAM</button>
    <button onClick="panelClrMem()">Clear RAM</button><br>
    <button onClick="panelLoadRaF()">Load RAM from file</button>: <input type="file" id="ramf" name="ramf" accept=".bin">`;

    tabcont[1][1] = `<button onClick="panelOpenLay()">Keyboard layout</button> <button onClick="panelOpenDbg()">Debugger</button>
    <button onClick="panelOpenHelp()">Help</button> <button onClick="panelOpenInfo()">About</button><br>
    <label for="dbgm">Show debug messages in console:</label> <input type="checkbox" onChange="panelSWDbgMsg()" id="dbgm" name="dbgm" ${dbgm}>`;

    for (i=0; i < 2; i++){
        const row = document.createElement("tr");
        for (c=0; c < 2; c++) {

            const td = document.createElement("td");
            td.id = `cl${i}-${c}`;

            if (typeof tabcont[i][c] != "undefined") {
                td.innerHTML = tabcont[i][c];
            }

            if (c == 0 && i == 0) {
                td.style.width = "400px";
                td.style.height = "50px";
            }

            row.appendChild(td);
        }
        pnl.appendChild(row);
    }
    
    const row = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 2;
    td.innerText = `JS87EMU v${VERVAR}`;
    td.style.textAlign = "center";
    td.style.fontWeight = "bold";
    row.appendChild(td);
    pnl.appendChild(row);

    pnl.ramName = function() {
        document.getElementById("rfi").innerText = ramname;
    }

    return pnl;
}
function panelSetRTWa() {
    WATCH.stop();
    WATCH.run();
}

function panelResetWa(){
    WATCH.reset();
}

function panelClrMem() {

    if (POWER){
        LCD.stopAnimating();
        LCD.clearScreen();
    }

    RAM = new Uint8Array(2048);
    window.localStorage.setItem('mk87_ram', btoa(String.fromCharCode.apply(null, RAM)));
    ramname = "internal";
    window.localStorage.setItem('mk87_ramname', ramname);
    PAN.ramName();

    if (stopped) {
        document.getElementById("stst").innerText="Pause"
	    stopped = false;
    }

    if (POWER){
        MK85CPU = new CPU();
        startEmu();
    }

}

function panelInitMem() {
    uniquesPressed.push("init");

	setTimeout(function () {
		uniquesPressed.splice("init", 1);
	  }, 500)

    setTimeout(function () {
		window.localStorage.setItem('mk87_ram', btoa(String.fromCharCode.apply(null, RAM)));
	  }, 2500)
}

function panelShowKey() {
    uniquesPressed.push("shkey");

	setTimeout(function () {
		uniquesPressed.splice("shkey", 1);
	  }, 500)
}

function panelShowEgg() {
    uniquesPressed.push("egg");

	setTimeout(function () {
		uniquesPressed.splice("egg", 1);
	  }, 500)
}

function panelUnkFun() {
    uniquesPressed.push("unkf");

	setTimeout(function () {
		uniquesPressed.splice("unkf", 1);
	  }, 500)
}


function panelOpenHelp() {
    window.open(`${BASEPATH}/help.html`,'targetWindow', `toolbar=no, location=no, status=no, menubar=no,
        scrollbars=no, resizable=no, width=820, height=340`)
}

function panelOpenDbg() {
    window.open(`${BASEPATH}/debug.html`,'targetWindow', `toolbar=no, location=no, status=no, menubar=no,
        scrollbars=no, resizable=no, width=820, height=340`)
}


function panelSWDbgMsg(){
    DEBUG = !DEBUG;
    window.localStorage.setItem('mk87_debugmsg', DEBUG);

    if (DEBUG) {
        console.log = realConsoleLog;
    }
    else {
        console.log = function() {};
    }

}

function panelOpenInfo() {
    window.open(`${BASEPATH}/about.html`,'targetWindow', `toolbar=no, location=no, status=no, menubar=no,
        scrollbars=no, resizable=no, width=820, height=710`)
}

function panelOpenLay() {
    window.open(`${BASEPATH}/layout.html`,'targetWindow', `toolbar=no, location=no, status=no, menubar=no,
        scrollbars=no, resizable=no, width=820, height=340`)
}

function panelSwVibro() {
    useVibrate = !useVibrate;
    document.getElementById("vib").checked = useVibrate;
    window.localStorage.setItem('mk87_vibro', useVibrate);
}

function panelSaveRaF(){
    //PAN.panelStop();

    if (POWER && !stopped) {
        LCD.stopAnimating();
    }

    
    window.localStorage.setItem('mk87_ram', btoa(String.fromCharCode.apply(null, RAM)));

    var dwram = document.getElementById("dwram");
    var blob = new Blob([RAM], {'type':'application/octet-stream'});
    dwram.href = URL.createObjectURL(blob);
    dwram.click();

    //PAN.panelStart();
    if (POWER && !stopped) {
        LCD.animate(LCD_ANIMSPEED);
    }
}

function panelLoadRaF() {
    const ramf = document.getElementById("ramf").files[0];

    if (typeof ramf == "undefined") {
        return;
    }
    else if (ramf.size != 2048) {  // 2KB max size for firmware
		alert("File size must be equal to 2KB");
        return;
	}

    const reader = new FileReader();

    reader.onload = function() {
        console.log(reader.result)

        if (POWER) {
            LCD.stopAnimating();
            LCD.clearScreen();
            if (stopped) {
                document.getElementById("stst").innerText="Pause"
                stopped = false;
            }
        }

        RAM = new Uint8Array(reader.result);
        ramname = ramf.name;
        window.localStorage.setItem('mk87_ram', btoa(String.fromCharCode.apply(null, RAM)));
        window.localStorage.setItem('mk87_ramname', ramname);
        document.getElementById("rfi").innerText = ramname;

        if (POWER) {
            MK85CPU = new CPU();
            startEmu();
        }
    };

    reader.readAsArrayBuffer(ramf);
}

function panelDevRestart() {
    LCD.stopAnimating();
    LCD.clearScreen();

    if (stopped) {
        document.getElementById("stst").innerText="Pause"
	    stopped = false;
    }

    MK85CPU = new CPU();
    startEmu();
}

function panelSwState(stat) {
    if (stat == stopped) {
        return;
    }
    else if (typeof stat == "boolean") {
        stopped = stat
    }
    else {
        stopped = !stopped;
    }

    if (!stopped) {
        LCD.animate(LCD_ANIMSPEED);
        document.getElementById("stst").innerText="Pause";
    }
    else {
        LCD.stopAnimating();
        document.getElementById("stst").innerText="Resume";
    }
}