// Options panel module
// Panel with standard functions to configure emulator
// (change RAM size, load from files, save to disk, press key combinations and etc.)

// 2024 (c) Bs0Dd

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

    var ignp = ignorePowerOff ? "checked" : "";

    var dbgm = DEBUG ? "checked" : "";

    if (!DEBUG) {
        console.log = function() {};
    }

    var tabcont = [[],[]];

    tabcont[0][0] = `<button id="imem" onClick="panelInitMem()">Init memory</button>
            <button id="showk" onClick="panelShowKey()">Show key</button>
            <button id="eegg" onClick="panelShowEgg()">Easter egg</button>
            <button id="ufun" onClick="panelUnkFun()">Unknown function</button>
            <button onClick="panelResetRoF()">Reset ROM</button>
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
    <label for="dbgm">Show debug messages in console:</label> <input type="checkbox" onChange="panelSWDbgMsg()" id="dbgm" name="dbgm" ${dbgm}><br>
    <label for="ipoff">Disable soft poff (bit 12 in cpuctrl):</label> <input type="checkbox" onChange="panelSwDivPo()" id="ipoff" name="ifrdiv" ${ignp}>`;

    for (let i=0; i < 2; i++){
        const row = document.createElement("tr");
        for (let c=0; c < 2; c++) {

            const td = document.createElement("td");
            td.id = `cl${i}-${c}`;
            //td.style.lineHeight = "1.8";

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
        panelUnStop();
    }

    if (POWER){
        MK85CPU = new CPU();
        startEmu();
        if (document.getElementById("mk87_dbg_int").style.display == "") {
            debugUpdate();
        }
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
    window.open(`${BASEPATH}/help/help.html`,'87_helpWindow', `toolbar=no, location=no, status=no, menubar=no,
        scrollbars=no, resizable=no, width=820, height=660`)
}

function panelOpenDbg() {
    const hidp = document.getElementById("mk85_dbg_int");
    hidp.style.display = (hidp.style.display == "none") ? "" : "none";
    document.getElementById("mk85_dbg_br").style.display = hidp.style.display;
    var active = (!stopped && POWER);
    if (hidp.style.display == "" && active) {
        DBG.debugStart();
    }
    else if (hidp.style.display == "" && !active) {
        debugUpdate();
        debugUpdRegIn();
    }
    else{
        DBG.debugStop();
    }
}

function panelSwDivPo() {
    ignorePowerOff = document.getElementById("ipoff").checked;
    MK85CPU.ignorePowerOff = ignorePowerOff;
    window.localStorage.setItem('mk87_ignorepoff', ignorePowerOff);
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
    window.open(`${BASEPATH}/about.html`,'87_aboutWindow', `toolbar=no, location=no, status=no, menubar=no,
        scrollbars=no, resizable=no, width=820, height=710`)
}

function panelOpenLay() {
    window.open(`${BASEPATH}/layout.html`,'87_layoutWindow', `toolbar=no, location=no, status=no, menubar=no,
        scrollbars=no, resizable=no, width=820, height=340`)
}

function panelSwVibro() {
    useVibrate = !useVibrate;
    document.getElementById("vib").checked = useVibrate;
    window.localStorage.setItem('mk87_vibro', useVibrate);
}

function panelUnStop() {
    if (document.getElementById("mk87_dbg_int").style.display == "") {
        DBG.debugStart();
    }
    document.getElementById("stst").innerText="Pause";
    document.getElementById("dstst").innerText="Pause";

    document.getElementById("dbst").disabled = true;
    document.getElementById("dbsts").disabled = true;
    document.getElementById("dbbr").disabled = true;
    document.getElementById("regist").disabled = true;
    document.getElementById("reged").disabled = true;
    document.getElementById("edreg").disabled = true;
    
    document.getElementById("disu").disabled = true;
    document.getElementById("dispu").disabled = true;
    document.getElementById("disgo").disabled = true;
    document.getElementById("disgob").disabled = true;
    document.getElementById("dispd").disabled = true;
    document.getElementById("disd").disabled = true;
    document.getElementById("disr").disabled = true;
    document.getElementById("dised").disabled = true;
    document.getElementById("diss").disabled = true;
    stopped = false;
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

    const reader = new FileReader();

    reader.onload = function() {
        //console.log(reader.result)

        if (POWER) {
            LCD.stopAnimating();
            LCD.clearScreen();
            if (stopped) {
                panelUnStop();
            }
        }

        RAM = new Uint8Array(reader.result);

        if (RAM.length > 2048) {  // 2KB max size for firmware
            RAM = RAM.subarray(0, 2048);
            console.log("Maximum RAM memory size (for firmware) is 2KB, memory area reduced");
        }
        else if (RAM.length % 2048 != 0) {  // Real processor uses a RAM chips multiple of 2KB min
            var nRAM = new Uint8Array((Math.floor(RAM.length / 2048)+1)*2048);
            nRAM.set(RAM);
            RAM = nRAM;
            console.log(`The RAM size must be a multiple of 2KB, increasing the area to ${RAM.length / 1024}KB.`);
        }

        ramname = ramf.name;
        window.localStorage.setItem('mk87_ram', btoa(String.fromCharCode.apply(null, RAM)));
        window.localStorage.setItem('mk87_ramname', ramname);
        document.getElementById("rfi").innerText = ramname;

        if (POWER) {
            MK85CPU = new CPU();
            startEmu();
            if (document.getElementById("mk87_dbg_int").style.display == "") {
                debugUpdate();
            }
        }
    };

    reader.readAsArrayBuffer(ramf);
}

function panelDevRestart() {
    LCD.stopAnimating();
    LCD.clearScreen();

    if (stopped) {
        panelUnStop();
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
        document.getElementById("dstst").innerText="Pause";
        if (document.getElementById("mk87_dbg_int").style.display == "") {
            DBG.debugStart();
        }
    }
    else {
        LCD.stopAnimating();
        document.getElementById("stst").innerText="Resume";
        document.getElementById("dstst").innerText="Resume";
        if (document.getElementById("mk87_dbg_int").style.display == "") {
            DBG.debugStop();
            debugUpdRegIn();
            debugUpdate();
        }
        
    }

    document.getElementById("dbst").disabled = !stopped;
	document.getElementById("dbsts").disabled = !stopped;
	document.getElementById("dbbr").disabled = !stopped;
    document.getElementById("regist").disabled = !stopped;
    document.getElementById("reged").disabled = !stopped;
    document.getElementById("edreg").disabled = !stopped;

    document.getElementById("disu").disabled = !stopped;
    document.getElementById("dispu").disabled = !stopped;
    document.getElementById("disgo").disabled = !stopped;
    document.getElementById("disgob").disabled = !stopped;
    document.getElementById("dispd").disabled = !stopped;
    document.getElementById("disd").disabled = !stopped;
    document.getElementById("disr").disabled = !stopped;
    document.getElementById("dised").disabled = !stopped;
    document.getElementById("diss").disabled = !stopped;
}

function panelEditFocus() {
    window.removeEventListener('keydown', KBKeyPress, true);
    window.removeEventListener('keyup', KBKeyRelease, true);
} 

function panelEditNoFocus() {
    window.addEventListener('keydown', KBKeyPress, true);
    window.addEventListener('keyup', KBKeyRelease, true);
}

function panelResetRoF() {
    if (POWER) {
        LCD.stopAnimating();
        LCD.clearScreen();
        if (stopped) {
            panelUnStop();
        }
    }

    ROM = new Uint8Array(ROM_int); // Internal ROM image constant

    if (POWER) {
        MK85CPU = new CPU();
        startEmu();
        if (document.getElementById("mk87_dbg_int").style.display == "") {
            debugUpdate();
        }
    }
}