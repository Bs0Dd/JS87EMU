function uniqueFromTwoArrays(arr1, arr2) {
	var output = [];
	for(var x = 0; x < arr1.length; x++)
		if(output.indexOf(arr1[x]==-1)) output.push(arr1[x]);

	for(var x = 0; x < arr2.length; x++)
		if(output.indexOf(arr2[x]==-1)) output.push(arr2[x]);

	return output;
}

function keysRead() {

	var ks = 0;

	for (let i=0; i < uniquesPressed.length; i++) {
		var k = (uniquesPressed[i] in keyTable)?keyTable[uniquesPressed[i]]:keyTable["nokey"];
		ks |= k;
	}
	
	return ks;
}

var keyboardMapping = {
	ij:0x51,
	c:0x57,
	y:0x45,
	k:0x52,
	e:0x54,
	n:0x59,
	g:0x55,
	sh:0x49,
	sha:0x4f,
	z:0x50,
	h:0xdb,

	f:0x41,
	yi:0x53,
	v:0x44,
	a:0x46,
	p:0x47,
	r:0x48,
	o:0x4a,
	l:0x4b,
	d:0x4c,
	zh:0x3b,
	ie:0xde,
	
	ya:0x5a,
	ch:0x58,
	s:0x43,
	m:0x56,
	i:0x42,
	t:0x4e,
	mznk:0x4d,
	b:0xbc,
	yu:0xbe,

	jo:0xc0,
	
	spc:0x20,
	eq:0x0d,

	ud:0x08,
	si:0x2e,
	vv:0x2d,

	n1:0x31,
	n2:0x32,
	n3:0x33,
	n4:0x34,
	n5:0x35,
	n6:0x36,
	n7:0x37,
	n8:0x38,
	n9:0x39,
	n0:0x30,
	
	admem:0x3d,
	sbmem:0xad,
	
	sp:0xdc,
	rmem:0xdd,

	left:0x23,
	rght:0x22,
	fun:0x10,
	up:0x26,
	dwn:0x28,

	diam:0x11,
	vn:0x24,

	red:0x27,
	rback:0x25,
	key:0x21,

	clr:0x75,
	sk:0x76,

	perc:0x78,
	sqrt:0x77,

	updw:0xbf,
	mstt:0x1b,

	kart:0x72,
	pam:0x71,
	tel:0x70,

	onoff: 0x73
};

var numpadKeyboardMapping = {
	n1:0x61,
	n2:0x62,
	n3:0x63,
	n4:0x64,
	n5:0x65,
	n6:0x66,
	n7:0x67,
	n8:0x68,
	n9:0x69,
	n0:0x60,

	add:0x6b,
	sub:0x6d,
	mul:0x6a,
	div:0x6f,
	dot:0x6c
}

var keyTable = {
	nokey: 0b0000000000000,
	//       2109876543210
    //       111

	off:   0b0000000000011,
	n0:    0b0000000000101,
	n1:    0b0000000001001,
	ud:    0b0000000010001,
	g:     0b0000000100001,
	z:     0b0000001000001,
	m:     0b0000010000001,
	s:     0b0000100000001,
	c:     0b0001000000001,
	on:    0b0010000000001,
	mznk:  0b0100000000001,
	mstt:  0b1000000000001,

	tel:   0b0000000000110,
	pam:   0b0000000001010,
	up:    0b0000000010010,
	b:     0b0000000100010,
	jo:    0b0000001000010,
	k:     0b0000010000010,
	p:     0b0000100000010,
	f:     0b0001000000010,
	fun:   0b0010000000010,
	sha:   0b0100000000010,
	ya:    0b1000000000010,

	red:   0b0000000001100,
	rback: 0b0000000010100,
	a:     0b0000000100100,
	e:     0b0000001000100,
	ij:    0b0000010000100,
	o:     0b0000100000100,
	y:     0b0001000000100,
	vv:    0b0010000000100,
	sh:    0b0100000000100,
	yu:    0b1000000000100,
	
	dot:   0b0000000011000,
	v:     0b0000000101000,
	zh:    0b0000001001000,
	l:     0b0000010001000,
	r:     0b0000100001000,
	h:     0b0001000001000,
	vn:    0b0010000001000,
	yi:    0b0100000001000,
	spc:   0b1000000001000,

	d:     0b0000000110000,
	i:     0b0000001010000,
	n:     0b0000010010000,
	t:     0b0000100010000,
	ch:    0b0001000010000,
	si:    0b0010000010000,
	ie:    0b0100000010000,
	diam:  0b1000000010000,

	perc:  0b0000001100000,
	sqrt:  0b0000010100000,
	sk:    0b0000100100000,
	dwn:   0b0001000100000,
	updw:  0b0010000100000,
	kart:  0b0100000100000,
	key:   0b1000000100000,

	sp:    0b0000011000000,
	div:   0b0000101000000,
	n9:    0b0001001000000,
	n8:    0b0010001000000,
	n7:    0b0100001000000,
	clr:   0b1000001000000,

	rmem:  0b0000110000000,
	mul:   0b0001010000000,
	n6:    0b0010010000000,
	n5:    0b0100010000000,
	n4:    0b1000010000000,

	sbmem: 0b0001100000000,
	sub:   0b0010100000000,
	n3:    0b0100100000000,
	n2:    0b1000100000000,

	add:   0b0101000000000,
	eq:    0b1001000000000,

	rght:  0b0110000000000,
	left:  0b1010000000000,

	admem: 0b1100000000000,


	init:  0b1010101110000,
	shkey: 0b1010110110000,
	egg:   0b1000111100010,
	unkf:  0b1000111110000
};



var faceKeys = {

	tel:{type:0, posCode:0x00},
	pam:{type:0, posCode:0x01},
	up:{type:0, posCode:0x02},
	rback:{type:0, posCode:0x03},
	red:{type:0, posCode:0x04},
	
	kart:{type:0, posCode:0x10},
	updw:{type:0, posCode:0x11},
	dwn:{type:0, posCode:0x12},
	left:{type:0, posCode:0x13},
	rght:{type:0, posCode:0x14},

	key:{type:0, posCode:0x20},

	clr:{type:2, posCode:0x01},
	sk:{type:2, posCode:0x02},
	sqrt:{type:2, posCode:0x03},
	perc:{type:2, posCode:0x04},
	
	n7:{type:2, posCode:0x10},
	n8:{type:2, posCode:0x11},
	n9:{type:2, posCode:0x12},
	div:{type:2, posCode:0x13},
	sp:{type:2, posCode:0x14},

	n4:{type:2, posCode:0x20},
	n5:{type:2, posCode:0x21},
	n6:{type:2, posCode:0x22},
	mul:{type:2, posCode:0x23},
	rmem:{type:2, posCode:0x24},

	n1:{type:2, posCode:0x30},
	n2:{type:2, posCode:0x31},
	n3:{type:2, posCode:0x32},
	sub:{type:2, posCode:0x33},
	sbmem:{type:2, posCode:0x34},

	n0:{type:2, posCode:0x40},
	dot:{type:2, posCode:0x41},
	eq:{type:2, posCode:0x42},
	add:{type:2, posCode:0x43},
	admem:{type:2, posCode:0x44},
	
	vv:{type:1, posCode:0x00},
	fun:{type:1, posCode:0x01},
	vn:{type:1, posCode:0x02},
	ud:{type:1, posCode:0x03},
	si:{type:1, posCode:0x04},

	a:{type:1, posCode:0x10},
	b:{type:1, posCode:0x11},
	v:{type:1, posCode:0x12},
	g:{type:1, posCode:0x13},
	d:{type:1, posCode:0x14},

	e:{type:1, posCode:0x20},
	jo:{type:1, posCode:0x21},
	zh:{type:1, posCode:0x22},
	z:{type:1, posCode:0x23},
	i:{type:1, posCode:0x24},

	ij:{type:1, posCode:0x30},
	k:{type:1, posCode:0x31},
	l:{type:1, posCode:0x32},
	m:{type:1, posCode:0x33},
	n:{type:1, posCode:0x34},

	o:{type:1, posCode:0x40},
	p:{type:1, posCode:0x41},
	r:{type:1, posCode:0x42},
	s:{type:1, posCode:0x43},
	t:{type:1, posCode:0x44},

	y:{type:1, posCode:0x50},
	f:{type:1, posCode:0x51},
	h:{type:1, posCode:0x52},
	c:{type:1, posCode:0x53},
	ch:{type:1, posCode:0x54},

	sh:{type:1, posCode:0x60},
	sha:{type:1, posCode:0x61},
	yi:{type:1, posCode:0x62},
	mznk:{type:1, posCode:0x63},
	ie:{type:1, posCode:0x64},

	yu:{type:1, posCode:0x70},
	ya:{type:1, posCode:0x71},
	spc:{type:1, posCode:0x72},
	mstt:{type:1, posCode:0x73},
	diam:{type:1, posCode:0x74},

	on:{type:3, posCode:0x00},
	off:{type:3, posCode:0x01}
};

var blockTypes = [
	{off_x:51, mul_x:63.7, off_y:334, mul_y:53},
	{off_x:418, mul_x:63.7, off_y: 153, mul_y:63.7},
	{off_x:51, mul_x:63.7, off_y:435, mul_y:53},
	{off_x:474, mul_x:127, off_y:68, mul_y:0},
];
