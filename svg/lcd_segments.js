
// pretty self-explanatory, I think =)

var picSegs = [
	{addr:0x10, bit:2, img:"bitmaps/tel.png",  x:61.7, y:21.4, height:9.2},
	{addr:0x08, bit:4, img:"bitmaps/vv.png",  x:40.3, y:10.8, height:9},
	{addr:0x28, bit:4, img:"bitmaps/add.png",  x:144.2, y:21.3, height:7.3},
	{addr:0x28, bit:2, img:"bitmaps/mul.png",  x:131.3, y:21.3, height:7.3},
	{addr:0x28, bit:3, img:"bitmaps/sub.png",  x:144.2, y:11.1, height:7.3},
	{addr:0x28, bit:1, img:"bitmaps/div.png",  x:131.3, y:11.1, height:7.3},
	{addr:0x20, bit:4, img:"bitmaps/k.png",  x:120.8, y:20.8, height:7.3},
	{addr:0x20, bit:3, img:"bitmaps/p.png",  x:120.8, y:10.8, height:7.3},
	{addr:0x10, bit:1, img:"bitmaps/key.png",  x:61.7, y:10.8, height:9.2},
	{addr:0x10, bit:4, img:"bitmaps/pam.png",  x:78.8, y:21.4, height:9.2},
	{addr:0x10, bit:3, img:"bitmaps/kart.png",  x:78.8, y:10.8, height:9.2},
	{addr:0x00, bit:0, img:"bitmaps/fun.png",  x:8.8, y:21, height:9.3},
	{addr:0x00, bit:1, img:"bitmaps/arrl.png",  x:9.6, y:10.8, height:9},
	{addr:0x58, bit:4, img:"bitmaps/arrr.png",  x:247.2, y:10.8, height:9},
	{addr:0x18, bit:4, img:"bitmaps/red.png",  x:96.4, y:21.4, height:9.5},
	{addr:0x08, bit:2, img:"bitmaps/up.png",  x:25.7, y:26, height:4.7},
	{addr:0x08, bit:1, img:"bitmaps/down.png",  x:25.7, y:18.5, height:4.7},
	{addr:0x08, bit:3, img:"bitmaps/rang.png",  x:37.4, y:21.4, height:9},
	{addr:0x18, bit:3, img:"bitmaps/avto.png",  x:96.4, y:11.1, height:9},
];

var sevenSegsMapping = [
	{
		a:{addr:0x38, bit:1},
		b:{addr:0x38, bit:0},
		c:{addr:0x30, bit:4},
		d:{addr:0x30, bit:3},
		e:{addr:0x30, bit:2},
		f:{addr:0x30, bit:0},
		g:{addr:0x30, bit:1}
	},{
		a:{addr:0x40, bit:3},
		b:{addr:0x40, bit:2},
		c:{addr:0x40, bit:1},
		d:{addr:0x40, bit:0},
		e:{addr:0x38, bit:4},
		f:{addr:0x38, bit:2},
		g:{addr:0x38, bit:3}
	},{
		a:{addr:0x50, bit:0},
		b:{addr:0x48, bit:4},
		c:{addr:0x48, bit:3},
		d:{addr:0x48, bit:2},
		e:{addr:0x48, bit:1},
		f:{addr:0x40, bit:4},
		g:{addr:0x48, bit:0}
	},{
		a:{addr:0x50, bit:1},
	},{
		a:{addr:0x58, bit:3},
		b:{addr:0x58, bit:2},
		c:{addr:0x58, bit:1},
		d:{addr:0x58, bit:0},
		e:{addr:0x50, bit:4},
		f:{addr:0x50, bit:2},
		g:{addr:0x50, bit:3}
	}
];

var cursorShapes = {
	underscore:{or:[0,0,0,0,0,0,31], and:[0,0,0,0,0,0,31]},
	block:{or:[31,31,31,31,31,31,31], and:[31,31,31,31,31,31,31]},
	none:{or:[0,0,0,0,0,0,0], and:[31,31,31,31,31,31,31]}
};
