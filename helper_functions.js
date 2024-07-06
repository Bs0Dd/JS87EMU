var loadCounter = 0;

function loadProperty(propname, defval, convtobool){
	var prop = window.localStorage.getItem(propname);

	if (prop == null) {
		prop = defval;
		window.localStorage.setItem(propname, prop);
		return prop;
	}

	if (convtobool){
		prop = (prop == "true");
	}

	return prop;
}

/* http://stackoverflow.com/questions/21797299/convert-base64-string-to-arraybuffer */

function base64ToArrayBuffer(base64) {
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

/* ---------- */

function devicePower(powst) {
	if (POWER == powst) {
		return;
	}
	else if (!powst) {
		LCD.stopAnimating();
		LCD.clearScreen();
		document.getElementById("stst").innerText = "Pause";
		stopped = false;
	}
	else {
		MK85CPU = new CPU();
		startEmu();
	}

	document.getElementById("stst").disabled = !powst;
	document.getElementById("rst").disabled = !powst;
	
	POWER = powst;
}

function startEmu() {
	glueCPU();
	LCD.timerCallback = function () {
		if(uniquesPressed.length>0)
		{
//			if(uniquesPressed.indexOf("stop")!=-1) MK85CPU.flag_halt = true;
			MK85CPU.cpuctrl |= 0x0400;	// enable CPU clock if anything is pressed
//			if()
		}
		for(var steps = 0; steps < 1200; steps++)
		{

			MK85CPU.step();
/*			if(MK85CPU.reg_u16[7] == 0x00f4) {
				console.log("HALT INTERRUPT");
				DEBUG = true;
			}*/
			//if(MK85CPU.psw&MK85CPU.flags.H) console.log(MK85CPU.reg_u16[7].toString(16));
		}
			
	}
	LCD.animate(LCD_ANIMSPEED);
}

// Attach CPU to everything else
function glueCPU() {
	
	MK85CPU.readCallback = function (addr) {
		if((addr&0xfffe)==0x0100) return (keysRead()>>((addr&1)?8:0))&0xff;
		if(addr<0x2000) return ROM[addr&0x1FFF];
		if((addr>=0x2000)&&(addr<0x2800)) return RAM[addr&0x1FFF];
		// keyboard column regs
		return 0;
	};

	MK85CPU.writeCallback = function (addr, byteVal) {
		if((addr>0x7f)&&(addr<0xe0)) {	// 0x80...0xDF is LCD contoller memory
			LCD.videoMemory[addr&0x7f] = byteVal;
			return;
		}
		if(addr==0xe0) {			// 0xe0 - LCD cursor register
			LCD.cursorReg = byteVal;
			return;
		}
		if((addr>=0x2000)&&(addr<0x2800)) {
			RAM[addr&0x1FFF] = byteVal;
			return;
		}
		return;
	};
}
