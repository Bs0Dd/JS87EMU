function MK85_SVG_LCD() {
	this.svgNS = "http://www.w3.org/2000/svg";
	var svg = document.createElementNS(this.svgNS, "svg");
	svg.setAttributeNS(null,"width",  270);
	svg.setAttributeNS(null,"height", 76);
	svg.setAttributeNS(null,"x",      64);
	svg.setAttributeNS(null,"y",      102);	// 102
//	svg.setAttributeNS(null,"style", "background-color:gainsboro");
	this.svg = svg;

	var r = document.createElementNS(this.svgNS, "rect");
	r.setAttributeNS(null,"x",      0);
	r.setAttributeNS(null,"y",      0);	
	r.setAttributeNS(null,"width",  270);
	r.setAttributeNS(null,"height", 76);
	r.setAttributeNS(null,"fill",   "#9ea197");
	svg.appendChild(r);

	var svgimg = document.createElementNS(svgNS,'image');
	svgimg.setAttributeNS(null,'width','252');
	svgimg.setAttributeNS('http://www.w3.org/1999/xlink','href', `${BASEPATH}/bitmaps/segments.png`);
	svgimg.setAttributeNS(null,'x','8');
	svgimg.setAttributeNS(null,'y','9');
	svgimg.setAttributeNS(null, 'visibility', 'visible');
	svg.appendChild(svgimg);
	
	

	var segmentOn  = "black";	
	var segmentOff = "#888984";
	
	var pixelWidth  = 3.5;
	var pixelHGap   = 0.5;
	var pixelHeight = 4.5;
	var pixelVGap   = 0.5;
	
	var x_offset = 7;
	var y_offset = 38;

	// make 2 pages of video memory
	var videoMemorySize = 96;
	this.videoMemory = new Uint8Array(videoMemorySize);
	this.videoPages = [new Uint8Array(videoMemorySize), new Uint8Array(videoMemorySize)];
	this.videoPage = [0,1];

	this.cursorReg = 0;

	this.cursorDelay = 35;
	this.cursorTimer = 0;
	this.cursorVisible = false;

	this.characters = [];
/* create 12 character places */
	for (let x = 0; x < 12; x++)
		this.characters.push(createDotMatrix(this.svg,7,5,x_offset+x*((3.1)*7),y_offset,2,3,1,1,segmentOn,segmentOff));

/* array to sort out extra mappings */
	var extraMappings = [];

/* create lcd segments */

	for(var x = 0; x<picSegs.length; x++) {
		var seg = picSegs[x];
		var mapping = {};
		mapping["addr"] = seg["addr"];
		mapping["bit"] = seg["bit"];
		mapping["f"] = createPicField(this.svg, seg.x, seg.y, seg.img, seg.height);
		extraMappings.push(mapping);
	}

/* create 7Seg digits */

	for (let x = 0; x < sevenSegsMapping.length; x++) {
		// create seven-segment digit and get array of functions to access its segments
		xrd = (x==4) ? 151.4+x*19 : ((x==3) ? 158.2+(x*19) : 163.2+(x*19));

		var digit = create7SegDisplay(this.svg, xrd, 10, (x==3));
		
		for(segment in digit)
		{
			var mapping = sevenSegsMapping[x][segment];
			
			// assign access function to mapping and add mapping to array
			mapping["f"] = digit[segment];
			extraMappings.push(mapping);
		}		
	}

	// create LCD memory mapping for addresses
	this.mapping = Array.apply(null, Array(videoMemorySize));

	for (let x = 0; x<this.characters.length; x++) {
		for (let y = 0; y<this.characters[x].length; y++) {
			this.mapping[(x<<3)+y+1] = this.characters[x][y];
		}
	}

	this.timerHandle = null;
	this.timerCallback = null;
	
	this.animate = function(delay_ms) {
		this.timerHandle = setInterval(this.doFrame.bind(this), delay_ms);
	};
	this.stopAnimating = function() {
		clearInterval(this.timerHandle);
		this.timerHandle = null;
	};
	


/* almost there, map all extra segments to memory locations and generate byte writers */
	var byteMappings = {};
	for(var x = 0; x < extraMappings.length; x++) {
		var mapping = extraMappings[x];		// get mapping
		var b = (mapping.addr in byteMappings)?byteMappings[mapping.addr]:{};
		b[mapping.bit] = mapping.f; // assign a function
		byteMappings[mapping.addr] = b; // write it back
	}

/* and finally, generate byte writers and put them into array */	
	for(var m in byteMappings) this.mapping[m] = arbitraryWriter(byteMappings[m]);
}

MK85_SVG_LCD.prototype.clearScreen = function() {
	for(var x = 0; x < 96; x++) {
		if (this.mapping[x]!=null){
			this.mapping[x](0);
		}
	}

	var videoMemorySize = 96;
	this.videoMemory = new Uint8Array(videoMemorySize);
	this.videoPages = [new Uint8Array(videoMemorySize), new Uint8Array(videoMemorySize)];
}

//	this.doFrame = function() {
MK85_SVG_LCD.prototype.doFrame = function() {
		if(typeof this.timerCallback == "function") this.timerCallback();
	
		if(this.cursorTimer == 0) {
			this.cursorTimer = this.cursorDelay;
			this.cursorVisible = !this.cursorVisible;
		} else {
			this.cursorTimer--;
		}

		var cursorShape = cursorShapes[this.cursorVisible?((this.cursorReg&0x10)?"underscore":"block"):"none"];
//		console.log(this.videoPage);
		var newPage = (this.videoPage[1]+1)%2;	
		var oldPage = (this.videoPage[0]+1)%2;
		var cursorAddr = ((this.cursorReg&0xf)<<3)+1;
		// copy videomemory into a buffer and overlay cursor image while we're at it
		for(var x = 0; x < this.videoPages[newPage].length; x++) {
		
			if((x>=cursorAddr)&&(x<cursorAddr+7)) {
				var b = this.videoMemory[x];
				b = (b&cursorShape.and[x-cursorAddr])|cursorShape.or[x-cursorAddr];
				this.videoPages[newPage][x] = b;
			} else {
				this.videoPages[newPage][x] = this.videoMemory[x];
			}								 
										 
			if((this.videoPages[newPage][x]!=this.videoPages[oldPage][x])&&(this.mapping[x]!=null))
				this.mapping[x](this.videoPages[newPage][x]);
		}
		this.videoPage[1]=(this.videoPage[1]+1)%2;
		this.videoPage[0]=(this.videoPage[0]+1)%2;
	};


function arbitraryWriter(mapping) {
	var arr = Array.apply(null, Array(8));
	for(var b in mapping) arr[b] = mapping[b];
	return function(state) {
		var bits = state;
		var bitStates = arr;
		for(var k = 0; k < bitStates.length; k++)
		{
			if(bitStates[k]!=null) bitStates[k](bits&1);
			bits >>= 1;
		}
	};
}

function picFieldWriter(field) {
	return function(state) {
		field.setAttributeNS(null,"opacity",state?"1":"0");
	};
}

function createPicField(root, x, y, img, height) {
	var svgimg = document.createElementNS(svgNS, "image");
	svgimg.setAttributeNS('http://www.w3.org/1999/xlink','href', BASEPATH+"/"+img);
	svgimg.setAttributeNS(null,"height", height);
	svgimg.setAttributeNS(null, 'visibility', 'visible');
	svgimg.setAttributeNS(null,"x", x);
	svgimg.setAttributeNS(null,"y", y);
	svgimg.setAttribute("unselectable", "on");
	svgimg.setAttribute("class", "unselectable");
	svgimg.setAttributeNS(null, "opacity", 0);
	root.appendChild(svgimg);
	return(picFieldWriter(svgimg));
	
}

function createDotMatrix(root, rows, cols, x, y, dotWidth, dotHeight, dotHGap, dotVGap, dotColorOn, dotColorOff) {
	var writers = [];
	for(var i = 0; i < rows; i++) {
		var row = [];
		for(var j = 0; j < cols; j++) {
			// create dot
			var dot = document.createElementNS(svgNS, "rect");
			dot.setAttributeNS(null,"x", x+j*(dotWidth+dotHGap));
			dot.setAttributeNS(null,"y", y+i*(dotHeight+dotVGap));
			dot.setAttributeNS(null,"width",  dotWidth);
			dot.setAttributeNS(null,"height", dotHeight);
			dot.setAttributeNS(null,"fill", dotColorOff);
			dot.setAttributeNS(null,"stroke", "none");
			root.appendChild(dot);
			row.push(dot);
		}
		writers.push(dotMatrixRowWriter(row.slice(), dotColorOn, dotColorOff));
	}
	return writers;
}

function dotMatrixRowWriter(row, dotColorOn, dotColorOff) {
	return function(data) {
		var dots = row;
		var bits = data;
		for(var k = 0; k < dots.length; k++) {
			dots[k].setAttributeNS(null,"fill", (bits&1)?dotColorOn:dotColorOff);
			bits >>= 1;
		}
	};
}

/*
   a
   _
 f|_|b 
 e|_|c  
   d   

 and there's g in the middle
 just a little hint
 */


function set7SegWriter(segment) {
	return function(state) {
		segment.setAttributeNS(null,"opacity",state?"1":"0");
	};
}

function create7SegDisplay(root, x, y, oneSeg) {

	var lines = (!oneSeg) ? {
		a:{img:"bitmaps/a.png", x:1, y:1, height:2},
		b:{img:"bitmaps/b.png", x:5.9, y:2.2, height:6},
		c:{img:"bitmaps/c.png", x:5, y:10, height:6.2},
		d:{img:"bitmaps/d.png", x:-0.8, y:14.7, height:2},
		e:{img:"bitmaps/e.png", x:-1.5, y:9.8, height:5.4},
		f:{img:"bitmaps/f.png", x:-0.3, y:2.5, height:5.4},
		g:{img:"bitmaps/g.png", x:1.4, y:8.2, height:2}
	} : {
		a:{img:"bitmaps/one.png", x:0.8, y:1.4, height:15.1},
	};

	var arr = {};
	for(var segName in lines) {
		var line = document.createElementNS(svgNS, "image");
		
		var segment = lines[segName];
		line.setAttributeNS('http://www.w3.org/1999/xlink','href', BASEPATH+"/"+segment.img);
		line.setAttributeNS(null,"height", segment.height);
		line.setAttributeNS(null, 'visibility', 'visible');
		line.setAttributeNS(null,"x", x+segment.x);
		line.setAttributeNS(null,"y", y+segment.y);
		line.setAttribute("unselectable", "on");
		line.setAttribute("class", "unselectable");
		line.setAttributeNS(null, "opacity", 0);
		
		root.appendChild(line);
		arr[segName] = set7SegWriter(line);
	}

	return arr;
}




