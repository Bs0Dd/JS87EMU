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
	PAN.ramName();
};

var VERVAR = "1.0 - build 06.07.2024"

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

var WATCH = new WATCH51(GUI)
WATCH.run();
var W_D_TSTAMP;

var LCD = new MK85_SVG_LCD();
var LCD_ANIMSPEED = 10;

var DEBUG = loadProperty('mk87_debugmsg', false, true);

var PAN = new PANEL();

GUI.appendChild(LCD.svg);

var MK85CPU = new CPU();

var RAM = null;
var ROM = null;

var POWER = true;

// Load RAM and ROM contents

var ram = window.localStorage.getItem('mk87_ram');
var ramname = window.localStorage.getItem('mk87_ramname');

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

console.log("Loading internal ROM memory file");
ROM = ROM_int;

startEmu();


document.addEventListener("visibilitychange", () => {
	if (document.hidden) {
		panelSwState(true);
		// Store RAM in local storage
		window.localStorage.setItem('mk87_ram', btoa(String.fromCharCode.apply(null, RAM)));
		WATCH.stop();
		W_D_TSTAMP = new Date();
	}
	else{
		panelSwState(false);
		if (typeof W_D_TSTAMP == "object") {
			var ndate = new Date();
			const diff = (ndate - W_D_TSTAMP);
			//console.log(W_D_TSTAMP, ndate, diff);
			WATCH.run(diff);
		}
	}
});