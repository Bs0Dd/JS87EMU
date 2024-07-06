svgNS = "http://www.w3.org/2000/svg";

function composeGUI() {
	var root = createSVG(745,700,"background-color:gainsboro");
	
	createImageOn(root);
	createButtonsOn(root);
	
	return root;
}

function createSVG(w,h,style) {
	var svg = document.createElementNS(svgNS, "svg");
	svg.setAttributeNS(null,"width",  w);
	svg.setAttributeNS(null,"height", h);
	//svg.setAttributeNS(null,"style", style); // "background-color:gainsboro"
	
	return svg;
}

function createImageOn(svg){
	var svgimg = document.createElementNS(svgNS,'image');
	svgimg.setAttributeNS(null,'height','700');
	svgimg.setAttributeNS(null,'width','745');
	svgimg.setAttributeNS('http://www.w3.org/1999/xlink','href', `${BASEPATH}/bitmaps/face.png`);
	svgimg.setAttributeNS(null,'x','0');
	svgimg.setAttributeNS(null,'y','0');
	svgimg.setAttributeNS(null, 'visibility', 'visible');
	svg.append(svgimg);
}

function createButtonsOn(svg) {

	for(var keyKey in faceKeys) {
		var key = faceKeys[keyKey];	// no pun intended =)

		var g = document.createElementNS(svgNS, "g");
		g.setAttributeNS(null,"cursor","pointer");
		g.setAttributeNS(null,"id", keyKey);
		g.setAttributeNS(null,"class", "mk87btn");

		switch(key.type) {
			case 0: // small white thing with labels above
			{
				var rect = document.createElementNS(svgNS, "rect");
				var blockType = blockTypes[key.type];
				
				var x = blockType.off_x+blockType.mul_x*(key.posCode&0xf);
				var y = blockType.off_y+blockType.mul_y*((key.posCode>>4)&0xf);
				
				rect.setAttributeNS(null,"x",x);
				rect.setAttributeNS(null,"y",y);
				rect.setAttributeNS(null,"width",  42);
				rect.setAttributeNS(null,"height", 22);
				rect.setAttributeNS(null, "opacity", 0);

				svg.appendChild(rect);
				g.appendChild(rect);
				
				break;
			}
			case 1:		// black alpha buttons
			{
				var rect = document.createElementNS(svgNS, "rect");
				var blockType = blockTypes[key.type];
				
				var x = blockType.off_x+blockType.mul_x*(key.posCode&0xf);
				var y = blockType.off_y+blockType.mul_y*((key.posCode>>4)&0xf);
				
				rect.setAttributeNS(null,"x",x);
				rect.setAttributeNS(null,"y",y);
				rect.setAttributeNS(null,"width",  58);
				rect.setAttributeNS(null,"height", 58);
				rect.setAttributeNS(null, "opacity", 0);
				svg.appendChild(rect);
				g.appendChild(rect);
				
				break;
			}
			case 2: // numpad buttons
			{
				var rect = document.createElementNS(svgNS, "rect");
				var blockType = blockTypes[key.type];
				
				var x = blockType.off_x+blockType.mul_x*(key.posCode&0xf);
				var y = blockType.off_y+blockType.mul_y*((key.posCode>>4)&0xf);
				
				rect.setAttributeNS(null,"x",x);
				rect.setAttributeNS(null,"y",y);
				rect.setAttributeNS(null,"width",  42);
				rect.setAttributeNS(null,"height", 32);
				rect.setAttributeNS(null, "opacity", 0);

				svg.appendChild(rect);
				g.appendChild(rect);
				
				break;
			}
			case 3: // on/off buttons
			{
				var rect = document.createElementNS(svgNS, "rect");
				var blockType = blockTypes[key.type];
				
				var x = blockType.off_x+blockType.mul_x*(key.posCode&0xf);
				var y = blockType.off_y+blockType.mul_y*((key.posCode>>4)&0xf);
				
				rect.setAttributeNS(null,"x",x);
				rect.setAttributeNS(null,"y",y);
				rect.setAttributeNS(null,"width",  76);
				rect.setAttributeNS(null,"height", 48);
				rect.setAttributeNS(null, "opacity", 0);

				svg.appendChild(rect);
				g.appendChild(rect);
				
				break;
			}
			default:
			{
				console.log("unsupported type");
				break;
			}
		}
		// bind functions
		g.addEventListener("touchstart", GUIKeyPress, false);
		g.addEventListener("touchend", GUIKeyRelease, false);

		g.addEventListener("mousedown",GUIKeyPress, false);
		g.addEventListener("mouseup",GUIKeyRelease, false);
		g.addEventListener("mouseout",GUIKeyRelease, false);

		svg.appendChild(g);
	}
}
