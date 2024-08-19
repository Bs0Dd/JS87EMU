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
    for (let i = 0; i < len; i++)        {
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
		DBG.debugStop();
		document.getElementById("stst").innerText = "Pause";
		document.getElementById("dstst").innerText = "Pause";

		document.getElementById("dbst").disabled = POWER;
		document.getElementById("dbsts").disabled = POWER;
		document.getElementById("dbbr").disabled = POWER;
		document.getElementById("stps").disabled = POWER;
		document.getElementById("brkp").disabled = POWER;
		document.getElementById("regist").disabled = POWER;
        document.getElementById("reged").disabled = POWER;
        document.getElementById("edreg").disabled = POWER;
		stopped = false;
	}
	else {
		MK85CPU = new CPU();
		startEmu();
		DBG.debugStart();
	}

	document.getElementById("stst").disabled = !powst;
	document.getElementById("rst").disabled = !powst;
	document.getElementById("dstst").disabled = !powst;
	document.getElementById("drst").disabled = !powst;

	document.getElementById("disu").disabled = powst;
	document.getElementById("dispu").disabled = powst;
	document.getElementById("disgo").disabled = powst;
	document.getElementById("disgob").disabled = powst;
	document.getElementById("dispd").disabled = powst;
	document.getElementById("disd").disabled = powst;
	document.getElementById("disr").disabled = powst;
	document.getElementById("dised").disabled = powst;
	document.getElementById("diss").disabled = powst;
	
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
		MK85CPU.steps = 1100;
		for(var steps = 0; steps < MK85CPU.steps; steps++)
		{

			MK85CPU.step();

			if (BREAKPOINT<0) {
				panelSwState();
				BREAKPOINT = false;
				return;
			}

			if (SKIPBSTEP){SKIPBSTEP=false;}

			if((MK85CPU.cpuctrl&0x1000)!=0 && !MK85CPU.ignorePowerOff) {
				console.log("Device was turned off by firmware (bit 12 in cpuctrl was set)!");
				devicePower();
				setTimeout(LCD.clearScreen.bind(LCD), 100); //clear screen after last update
				return;
			}

			if (typeof DEBUG_STEPS == "number") {
				MK85CPU.steps = DEBUG_STEPS;
			}

/*			if(MK85CPU.reg_u16[7] == 0x00f4) {
				console.log("HALT INTERRUPT");
				DEBUG = true;
			}*/
			//if(MK85CPU.psw&MK85CPU.flags.H) console.log(MK85CPU.reg_u16[7].toString(16));
		}
			
	}
	LCD.animate(LCD_ANIMSPEED);
}

var PP = 0;	// CPU parallel port (not used in firmware)

// Attach CPU to everything else
function glueCPU() {

	var ramLastAddr = 0x2000+RAM.length;
	var romLastAddr = 0x0000+ROM.length;
	
	MK85CPU.readCallback = function (addr) {
		if((addr&0xfffe)==0x0100) return (keysRead()>>((addr&1)?8:0))&0xff;
		if((addr<0x2000)&&(addr<romLastAddr)) return ROM[addr];
		if((addr>=0x2000)&&(addr<ramLastAddr)) return RAM[addr&0x1FFF];
		// keyboard column regs
		return 0xFF;
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
		if(addr==0x102) {			// 0x102 - parallel port (not used in firmware)
			PP &= 0xff00;
			PP |= byteVal;
			return;
		}
		if(addr==0x103) {			// 0x102 - parallel port (not used in firmware)
			PP &= 0x00ff; 
			PP |= byteVal<<8;
			return;
		}
		if((addr>=0x2000)&&(addr<0x2800)) {
			RAM[addr&0x1FFF] = byteVal;
			return;
		}
		return;
	};
}
