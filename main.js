/* Top level script for MK-87 emulator.
 * Trying to keep things simple this time and not cram the entire thing into a single object.
 * Although that would be handy, who knows, maybe I want to run 3 calculators on a single page
 * concurrently =)
 * 
 * 
 */

window.onload = function() {
	document.getElementById("mk87").appendChild(GUI);
	document.getElementById("mk87_panel").appendChild(PAN);
	document.getElementById("mk87_dbg").appendChild(DBG);
	if ((!extram || eramd)){
		PAN.ramName();
	}
	
	pagld = true;
	//DBG.debugStart();
};

var VERVAR = "1.6 - build 21.09.2024"

var supportsVibrate = "vibrate" in navigator;

var useVibrate = window.localStorage.getItem('mk87_vibro');

if(supportsVibrate && (useVibrate == null)) {
	useVibrate = true;
	window.localStorage.setItem('mk87_vibro', useVibrate);
}
else if (supportsVibrate) {
	useVibrate = (useVibrate == "true");
}

//var BASEPATH = "/jsemu/mk87";
var BASEPATH = "."; // Base path for files!

var GUI = composeGUI();

var WATCH = new WATCH51(GUI);
WATCH.run();
var W_D_TSTAMP;

var LCD = new MK85_SVG_LCD();
var LCD_ANIMSPEED = 10;

var DBG = new DBGTOOL();

var DEBUG_STEPS = false;
var BREAKPOINT = false;
var SKIPBSTEP = false;

var ignorePowerOff = loadProperty('mk87_ignorepoff', false, true);

var DEBUG = loadProperty('mk87_debugmsg', false, true);

var PAN = new PANEL();

GUI.appendChild(LCD.svg);

var MK85CPU = new CPU();

var RAM = null;
var ROM = null;

var POWER = true;
var PAUSE_ON_HID = false;

function extrun() {
	if (extram && pagld) {
		PAN.ramName();
	}
	startEmu();
}

// Load RAM and ROM contents

function ramlo() {
	if(ram == null) {
		console.log("Creating new RAM memory file");
		RAM = new Uint8Array(2048);
		ramname = "internal";
		setTimeout(panelInitMem, 500);
		//loadBinary("ram.bin", function (buf) { RAM = new Uint8Array(buf); checkIfMemoryLoaded(); });
	} else {
		console.log("Getting RAM contents from local storage");
	
		if (ramname == null) {
			ramname = "internal";
		}
	
		RAM = new Uint8Array(base64ToArrayBuffer(ram));
	}
}

var ram = window.localStorage.getItem('mk87_ram');
var ramname = window.localStorage.getItem('mk87_ramname');

var urargs = parseURLParams(window.location.href);
var extram = false;
var eramd = false;

var pagld = false;

if (urargs && urargs.ram) {
	var ract = true;
	if (ram != null && !(urargs.fload && urargs.fload=="force")) {
		ract = confirm('You are going to load RAM from the link and the old RAM will be lost. \
If the data in it is important to you, interrupt the load and save the old RAM.')
	}
	
	if (ract) {	
		console.log('Ext RAM load started.');
		extram = true;
		ramname = urargs.ram.toString().split('/').pop();
		loadBinaryHTTP(urargs.ram,
		function (buf) {
			RAM = new Uint8Array(buf);
			RAMbou();
			eramd = true;
			window.localStorage.setItem('mk87_ram', btoa(String.fromCharCode.apply(null, RAM)));
			window.localStorage.setItem('mk87_ramname', ramname);
			extrun();
		},
		function () {
			extram = false;
			ramname = window.localStorage.getItem('mk87_ramname');
			alert("Failed to load RAM from the link, loading old RAM...");
			ramlo();
			eramd = true;
			extrun();
		},);
	} else {
		console.log('Ext RAM load interrupted.');
		ramlo();
	}
}
else {
	ramlo();
}

console.log("Loading internal ROM memory file");
ROM = new Uint8Array(ROM_int); // Internal ROM image constant

if (!extram) {
	startEmu();
}


document.addEventListener("visibilitychange", () => {
	if (document.hidden) {
		if (POWER) {
			PAUSE_ON_HID = stopped;
			panelSwState(true);
		}
		// Store RAM in local storage
		window.localStorage.setItem('mk87_ram', btoa(String.fromCharCode.apply(null, RAM)));
		WATCH.stop();
		W_D_TSTAMP = new Date();
	}
	else{
		if (POWER && !PAUSE_ON_HID) {
			panelSwState(false);
		}
		if (typeof W_D_TSTAMP == "object") {
			var ndate = new Date();
			const diff = (ndate - W_D_TSTAMP);
			//console.log(W_D_TSTAMP, ndate, diff);
			WATCH.run(diff);
		}
	}
});