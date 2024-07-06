var uniquesPressed = [];

var trkey = false;

window.addEventListener('keydown', KBKeyPress, true);
window.addEventListener('keyup', KBKeyRelease, true);

function keyByCode(keyCode) {
	for (var key in keyboardMapping)
		if(keyboardMapping[key] === keyCode) return key
	for (var key in numpadKeyboardMapping)
		if(numpadKeyboardMapping[key] === keyCode) return key
	return undefined;
}

function KBKeyPress(evt) {

	console.log(evt.keyCode.toString(16));

	var key = keyByCode(evt.keyCode);
	if(typeof key == 'undefined') return;

	evt.preventDefault();

	if (key=="off" || key=="on") {
		devicePower(key=="on");
	}

	if (key=="onoff") {
		key = POWER ? "off" : "on"
		if (trkey && (trkey != key)) {
			return;
		}
		else {
			trkey = key;
		}
		document.getElementById(key).children[0].setAttributeNS(null, "opacity", 0.5);
		devicePower(!POWER);
	}
	else {
		document.getElementById(key).children[0].setAttributeNS(null, "opacity", 0.5);
	}

	// find the key in mapping
	if((uniquesPressed.indexOf(key) == -1)&&(uniquesPressed.length < 2)&&(key!=trkey)) {
		if(key=="on") MK85CPU.flag_halt = true;
		uniquesPressed.push(key);
		console.log("Pressed", key, uniquesPressed);
	}
}

function KBKeyRelease(evt) {

	var key = keyByCode(evt.keyCode);
	if(typeof key == 'undefined') return;

	evt.preventDefault();

	if (key=="onoff") {
		trkey = false;
		key = !POWER ? "off" : "on"
		document.getElementById(key).children[0].setAttributeNS(null, "opacity", 0);
	}
	else {
		document.getElementById(key).children[0].setAttributeNS(null, "opacity", 0);
	}

	if(uniquesPressed.indexOf(key) != -1) {
		uniquesPressed.splice(uniquesPressed.indexOf(key), 1);
		console.log("Released", key, uniquesPressed);
	}
}

function GUIKeyPress(evt) {
	var key = evt.currentTarget.id;
	evt.preventDefault();
	if(supportsVibrate && useVibrate) window.navigator.vibrate(100);

	evt.currentTarget.children[0].setAttributeNS(null, "opacity", 0.5);

	if (key=="off" || key=="on") {
		devicePower(key=="on");
	}

	if((uniquesPressed.indexOf(key) == -1)&&(uniquesPressed.length < 2)) {
		if((key=="on")&&(!MK85CPU.flag_halt)) MK85CPU.flag_halt = true;
		uniquesPressed.push(key);
		console.log(uniquesPressed);
	}
}

function GUIKeyRelease(evt) {
	evt.preventDefault();
	var key = evt.currentTarget.id;

	evt.currentTarget.children[0].setAttributeNS(null, "opacity", 0);

	if(uniquesPressed.indexOf(key) != -1) {
		uniquesPressed.splice(uniquesPressed.indexOf(key), 1);
		console.log(uniquesPressed);
	}
}
