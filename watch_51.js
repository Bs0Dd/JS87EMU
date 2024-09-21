// Elektronika 51 watch simulator

// 2024 (c) Bs0Dd

svgNS = "http://www.w3.org/2000/svg";

function WATCH51(parentSVG) {
    this.svgNS = svgNS;
	var svg = document.createElementNS(this.svgNS, "svg");
	svg.setAttributeNS(null,"width",  79);
	svg.setAttributeNS(null,"height", 56);
	svg.setAttributeNS(null,"x",      254);
	svg.setAttributeNS(null,"y",      234);
	this.svg = svg;

	var r = document.createElementNS(this.svgNS, "rect");
	r.setAttributeNS(null,"x",      0);
	r.setAttributeNS(null,"y",      0);	
	r.setAttributeNS(null,"width",  79);
	r.setAttributeNS(null,"height", 56);
	r.setAttributeNS(null,"fill",   "#9ea197");
    svg.appendChild(r);

    w_createShadow(svg, 4.8, 4.5, 22.6, '/bitmaps/shadow_b_w.png');
    w_createShadow(svg, 43.8, 4.5, 22.6, '/bitmaps/shadow_b_w.png');
    w_createShadow(svg, 52.8, 34.2, 17, '/bitmaps/shadow_s_w.png');


    this.primSegs = [
        w_prim_create7SegDisplay(svg, 7.6, 4.1),
        w_prim_create7SegDisplay(svg, 24.6, 4.1),
        w_prim_create7SegDisplay(svg, 46.6, 4.1),
        w_prim_create7SegDisplay(svg, 63.6, 4.1),
    ];

    this.secSegs = [
        w_sec_create7SegDisplay(svg, 54.7, 34),
        w_sec_create7SegDisplay(svg, 68, 34),
    ];

    this.dot = w_createDot(svg, 37.3, 23, 3, 4);

    w_createTextField(svg, 7.6, 43.7, "П", 8);
    w_createTextField(svg, 13.6, 42, ".", 12);
    w_createTextField(svg, 20.6, 43.7, "С", 8);
    w_createTextField(svg, 27, 42, ".", 12);
    w_createTextField(svg, 33.6, 43.7, "П", 8);
    w_createTextField(svg, 40, 42, ".", 12);
    w_createTextField(svg, 46.6, 43.7, "В", 8);

    this.daysDots = []

    for (i=0; i < 7; i++){
        this.daysDots.push(w_createDot(svg, 6+(6.5*i), 46, 2.5, 4));
    }

    parentSVG.appendChild(svg);


    function w1touchs(evt) {
        if (evt.cancelable) evt.preventDefault();
        W51_bt1p = true;
        W51_bt1.setAttributeNS(null,"opacity",1);
    }

    function w1touche(evt) {
        if (evt.cancelable) evt.preventDefault();
        W51_bt1p = false;
        W51_bt1.setAttributeNS(null,"opacity",0);
    }

    var W51_bt1g = document.createElementNS(svgNS, "g");
	W51_bt1g.setAttributeNS(null,"cursor","pointer");

    var W51_bt1 = document.createElementNS(svgNS,'image');
	W51_bt1.setAttributeNS('http://www.w3.org/1999/xlink','href', `${BASEPATH}/bitmaps/watch_b.png`);
	W51_bt1.setAttributeNS(null,'x','381');
	W51_bt1.setAttributeNS(null,'y','221');
	W51_bt1.setAttributeNS(null, "opacity", 0);
	W51_bt1.setAttributeNS(null, 'visibility', 'visible');
	parentSVG.append(W51_bt1);
	W51_bt1g.appendChild(W51_bt1);

	W51_bt1g.addEventListener("touchstart", w1touchs, false);
	W51_bt1g.addEventListener("touchend", w1touche, false);

	W51_bt1g.addEventListener("mousedown",w1touchs, false);
	W51_bt1g.addEventListener("mouseup",w1touche, false);
	W51_bt1g.addEventListener("mouseout",w1touche, false);

	parentSVG.appendChild(W51_bt1g);


    function w2touchs(evt) {
        if (evt.cancelable) evt.preventDefault();
        W51_bt2p = true;
        W51_bt2.setAttributeNS(null,"opacity",1);
    }

    function w2touche(evt) {
        if (evt.cancelable) evt.preventDefault();
        W51_bt2p = false;
        W51_bt2.setAttributeNS(null,"opacity",0);
    }

    var W51_bt2g = document.createElementNS(svgNS, "g");
	W51_bt2g.setAttributeNS(null,"cursor","pointer");

    var W51_bt2 = document.createElementNS(svgNS,'image');
	W51_bt2.setAttributeNS('http://www.w3.org/1999/xlink','href', `${BASEPATH}/bitmaps/watch_b.png`);
	W51_bt2.setAttributeNS(null,'x','381');
	W51_bt2.setAttributeNS(null,'y','276');
	W51_bt2.setAttributeNS(null, "opacity", 0);
	W51_bt2.setAttributeNS(null, 'visibility', 'visible');
	parentSVG.append(W51_bt2);
	W51_bt2g.appendChild(W51_bt2);

	W51_bt2g.addEventListener("touchstart", w2touchs, false);
	W51_bt2g.addEventListener("touchend", w2touche, false);

	W51_bt2g.addEventListener("mousedown",w2touchs, false);
	W51_bt2g.addEventListener("mouseup",w2touche, false);
	W51_bt2g.addEventListener("mouseout",w2touche, false);

	parentSVG.appendChild(W51_bt2g);

    var W51_bt1p = false;
    var W51_bt2p = false;
    var W51_b1lock = false;
    var W51_b1lockt = 0;
    var W51_b2lock = false;

    var W51_mode = 0;
    var W51_hour = 0;
    var W51_minute = 0;
    var W51_second = 0;
    var W51_dayW = 0;
    var W51_day = 0;
    var W51_month = 0;
    var W51_year = 0;

    var W51_p_day = 0;
    var W51_herz2 = true;
    var W51_herz4 = true;
    var W51_m3tout = 0;

    var W51_motout = 0;
    var W51_edit = 0;


    this.getDays = function(month, editMode) {
        if (month == 2) {
            return (((W51_year % 4 == 0) || editMode) ? 29 : 28); //When editing - february always have 29 days 
        }
        else if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8
            || month == 10 || month == 12) {
                return 31
        }
        else {
            return 30;
        }
    }

    function setSeg(obj, typeS, num, seg, stat){
        var opc = stat ? 1 : 0;
        if (typeS) {
            obj.secSegs[num-1][seg].setAttributeNS(null, "opacity", opc);
        }
        else {
            obj.primSegs[num-1][seg].setAttributeNS(null, "opacity", opc);
        }
    }
    
    function setDot(obj, stat) {
        obj.dot.setAttributeNS(null, "fill", stat ? "black" : "#888984");
    }

    function setDayDot(obj, day, stat) {

        obj.daysDots[day].setAttributeNS(null, "fill", stat ? "black" : "#888984");
    }

    function segDigSet(obj, typeS, segn, dig) {
        var numbers = [
            [true, true, true, true, true, true, false],
            [false, true, true, false, false, false, false],
            [true, true, false, true, true, false, true],
            [true, true, true, true, false, false, true],
            [false, true, true, false, false, true, true],
            [true, false, true, true, false, true, true],
            [true, false, true, true, true, true, true],
            [true, true, true, false, false, false, false],
            [true, true, true, true, true, true, true],
            [true, true, true, true, false, true, true],
            [false, false, false, false, false, false, false]
        ];

        for (c=0; c<7; c++) {
            setSeg(obj, typeS, segn, c, numbers[dig][c]);
        }
    }

    function segNumSet(obj, typeS, segpair, number, leadz) {
        

        var frst = Math.floor(number / 10)

        if (leadz || frst != 0) {
            segDigSet(obj, typeS, 1+((segpair-1)*2), frst);
        }
        else {
            segDigSet(obj, typeS, 1+((segpair-1)*2), 10);
        }

        var lnum = Math.round(((number/10)-frst)*10);
        segDigSet(obj, typeS, 2+((segpair-1)*2), lnum);
    }

    function drawByMode(obj) {
        if (W51_mode == 0) {
            segNumSet(obj, false, 1, W51_hour, false);
            segNumSet(obj, false, 2, W51_minute, true);
            segNumSet(obj, true, 1, W51_day, false);
        }
        else if (W51_mode == 1) {
            segNumSet(obj, false, 1, W51_hour, false);
            segNumSet(obj, false, 2, W51_minute, true);
            segNumSet(obj, true, 1, W51_second, true);
        }
        else if (W51_mode == 2) {
            segNumSet(obj, false, 1, W51_day, false);
            segNumSet(obj, false, 2, W51_month, false);
            segNumSet(obj, true, 1, W51_year, true);
        }
    }

    function watchCnt(obj) {
            
            if (++W51_second == 60) {
                W51_second = 0;
                if (++W51_minute == 60) {
                    W51_minute = 0;
                    if (++W51_hour == 24) {
                        W51_hour = 0;
                        var days = obj.getDays(W51_month);
                        if (++W51_day >= days+1){
                            W51_day = 1;
                            if (++W51_month == 13) {
                                W51_month = 1;
                                if (++W51_year == 100) {
                                    W51_year = 0;
                                }
                            }
                        }
                    }
                }
            }

            if (W51_p_day != W51_day) {
                setDayDot(obj, W51_dayW, false);
                if (++W51_dayW == 7) {
                    W51_dayW = 0;
                }
                setDayDot(obj, W51_dayW, true);
                W51_p_day = W51_day;
            }

            if (W51_mode < 3) {
                if (W51_mode == 2){
                    if (--W51_m3tout == 0) {
                        W51_mode = 0;
                    }
                }
                drawByMode(obj);
            }
            else { 
                if (!(W51_mode == 4 && W51_edit == 1) && (--W51_motout == 0)) {
                    W51_mode-=3;
                    clearInterval(obj.editherz);
                    obj.editherz = null;
                    drawByMode(obj);
                    setDayDot(obj, W51_dayW, true);
                }
            }


    }

    function watchBut(obj){
        //console.log(W51_motout, W51_mode, W51_bt1p, W51_b1lockt, W51_m3tout)
        if (W51_mode < 3) {
            if (W51_bt1p && !W51_b1lock) {
                if (++W51_mode == 3) {
                    W51_mode = 0;
                }
                
                if (W51_mode == 2) {
                    W51_m3tout = 3;
                }
                else {
                    W51_m3tout = 0;
                }
                drawByMode(obj);
                watchDotUpd(obj);
                W51_b1lock = true;
            }
            else if (W51_bt1p && W51_b1lock & (W51_mode == 2)) {
                W51_m3tout = 3;
            }
            else if (!W51_bt1p && W51_b1lock) {
                W51_b1lock = false;
            }
            else if (W51_bt2p && !W51_b2lock) {
                W51_mode+=3;
                W51_edit=1;
                
                W51_motout = 12;
                if (W51_mode == 5) {
                    W51_m3tout = 3;
                }
                W51_b2lock = true;
                obj.editherz = setInterval(watchEditUpd, 250, obj);
            }
            else if (!W51_bt2p && W51_b2lock) {
                W51_b2lock = false;
            }
        }
        else {
            if (W51_bt2p && !W51_b2lock) {
                W51_motout = 12;
                if (++W51_edit == 5) {
                    W51_mode-=3;
                    clearInterval(obj.editherz);
                    drawByMode(obj);
                    setDayDot(obj, W51_dayW, true);
                    obj.editherz = null;
                }
                W51_b2lock = true;
            }
            else if (!W51_bt2p && W51_b2lock) {
                W51_b2lock = false;
            }
            else if(W51_bt1p && W51_b1lockt == 0) {
                if (W51_edit == 4) {
                    setDayDot(obj, W51_dayW, false);
                    W51_dayW = ((W51_dayW+1) == 7) ? 0 : W51_dayW+1;
                    W51_b1lockt = 50;
                    W51_motout = 12;
                }
                else if (W51_mode == 3) {
                    if (W51_edit == 1) {
                        W51_day = (W51_day+1 >= obj.getDays(W51_month, true)+1) ? 1 : W51_day+1;
                        W51_p_day = W51_day;
                    }
                    else if (W51_edit == 2) {
                        W51_minute = ((W51_minute+1) == 60) ? 0 : W51_minute+1;
                    }
                    else {
                        W51_hour = ((W51_hour+1) == 24) ? 0 : W51_hour+1;
                    }
                    W51_herz4 = false;
                    W51_b1lockt = W51_b1lock ? 10 : 100;
                    W51_motout = 12;
                }
                else if (W51_mode == 4) {
                    if (W51_edit == 1) {
                        clearInterval(obj.timer);
                        if (W51_second > 29) {
                            W51_second = 59;
                            watchCnt(obj);
                        }
                        else {
                            W51_second = 0;
                            drawByMode(obj);
                        }
                        W51_b1lockt = 0;
                        obj.timer = setInterval(watchCnt, 1000, obj);
                    }
                    else if (W51_edit == 2) {
                        W51_minute = ((W51_minute+1) == 60) ? 0 : W51_minute+1;
                        W51_motout = 12;
                        W51_b1lockt = W51_b1lock ? 10 : 100;
                    }
                    else {
                        W51_hour = ((W51_hour+1) == 24) ? 0 : W51_hour+1;
                        W51_motout = 12;
                        W51_b1lockt = W51_b1lock ? 10 : 100;
                    }
                    W51_herz4 = false;
                }
                else {
                    if (W51_edit == 1) {
                        W51_year = ((W51_year+1) == 100) ? 0 : W51_year+1;
                        // if (W51_month == 2 && W51_day > obj.getDays(W51_month)) {
                        //     W51_day = obj.getDays(W51_month);
                        //     W51_p_day = W51_day;
                        // } // not implemented in real clock
                    }
                    else if (W51_edit == 2) {
                        W51_month = ((W51_month+1) == 13) ? 1 : W51_month+1;
                        // var days = obj.getDays(W51_month);
                        // if (W51_day > days) {
                        //     W51_day = days;
                        //     W51_p_day = W51_day;
                        // } // not implemented in real clock
                    }
                    else {
                        W51_day = (W51_day+1 >= obj.getDays(W51_month, true)+1) ? 1 : W51_day+1;
                        W51_p_day = W51_day;
                    }
                    W51_herz4 = false;
                    W51_b1lockt = W51_b1lock ? 10 : 100;
                    W51_motout = 12;
                }
            }
            else if (W51_bt1p && W51_b1lockt > 0) {
                if (--W51_b1lockt == 0) {
                    W51_b1lock = true;
                }
            }
            else if (!W51_bt1p && W51_b1lockt > 0) {
                W51_b1lockt = 0;
                W51_b1lock = false;
            }
        }
    }

    function watchEditUpd(obj) {
        W51_herz4 = !W51_herz4
        var v1, v2, v3;

        if (W51_mode == 3) {
            v1 = [W51_hour, false];
            v2 = [W51_minute, true];
            v3 = [W51_day, false];
        }
        else if (W51_mode == 4) {
            v1 = [W51_hour, false];
            v2 = [W51_minute, true];
            v3 = [W51_second, true];
        }
        else if (W51_mode == 5) {
            v1 = [W51_day, false];
            v2 = [W51_month, false];
            v3 = [W51_year, true];
        }

        if (W51_edit == 3) {
            if (W51_herz4) {
                segNumSet(obj, false, 1, v1[0], v1[1]);
            }
            else {
                segDigSet(obj, false, 1, 10);
                segDigSet(obj, false, 2, 10);
            }

            segNumSet(obj, false, 2, v2[0], v2[1]);
            segNumSet(obj, true, 1, v3[0], v3[1]);
        }
        else if (W51_edit == 2) {
            if (W51_herz4) {
                segNumSet(obj, false, 2, v2[0], v2[1]);
            }
            else {
                segDigSet(obj, false, 3, 10);
                segDigSet(obj, false, 4, 10);
            }

            segNumSet(obj, false, 1, v1[0], v1[1]);
            segNumSet(obj, true, 1, v3[0], v3[1]);
        }
        else if (W51_edit == 1){
            if (W51_herz4) {
                segNumSet(obj, true, 1, v3[0], v3[1]);
            }
            else {
                segDigSet(obj, true, 1, 10);
                segDigSet(obj, true, 2, 10);
            }

            segNumSet(obj, false, 2, v2[0], v2[1]);
            segNumSet(obj, false, 1, v1[0], v1[1]);
        }
        else {
            segNumSet(obj, false, 1, v1[0], v1[1]);
            segNumSet(obj, false, 2, v2[0], v2[1]);
            segNumSet(obj, true, 1, v3[0], v3[1]);
            setDayDot(obj, W51_dayW, W51_herz4);
        }
        
    }

    function watchDotUpd(obj){
        W51_herz2 = !W51_herz2;
        if (W51_mode == 0 || W51_mode == 3) {
            setDot(obj, W51_herz2);
        }
        else if (W51_mode == 1 || W51_mode == 4) {
            setDot(obj, true);
        }
        else if (W51_mode == 2 || W51_mode == 5) {
            setDot(obj, false);
        }
    }

    this.run = function(setTime) {
        if (typeof setTime == "object") {
            W51_hour = setTime[0];
            W51_minute = setTime[1];
            W51_second = setTime[2]-1;
            W51_dayW = setTime[3];
            W51_day = setTime[4];
            W51_month = setTime[5];
            W51_year = setTime[6];
        }
        else if (typeof setTime == "number") {
            if (setTime < 0) {
                console.log("Negative difference! Are you time traveler?")
                return;
            }

            W51_second += Math.ceil(setTime/1000)-1;

            while (W51_second >= 60) {
                W51_second-=60;
                W51_minute++;
            }

            while (W51_minute >= 60) {
                W51_minute-=60;
                W51_hour++;
            }

            while (W51_hour >= 24) {
                W51_hour-=24;
                W51_day++;

                if (++W51_dayW == 7) {
                    W51_dayW = 0;
                }
            }

            while (W51_day > this.getDays(W51_month)) {
                W51_day-=this.getDays(W51_month);
                W51_month++;
            }

            while (W51_month > 12) {
                W51_month-=12;
                W51_year++;
            }

            while (W51_year >= 100) {
                W51_year-=100;
            }
        }
        else if (setTime != false) {
            var cdate = new Date();
            W51_hour = cdate.getHours();
            W51_minute = cdate.getMinutes();
            W51_second = cdate.getSeconds()-1;
            W51_dayW = cdate.getDay()-1;
            if (W51_dayW == -1) {W51_dayW = 6};
            W51_day = cdate.getDate();
            W51_month = cdate.getMonth()+1;
            W51_year = Number(cdate.getFullYear().toString().substring(2, 4));
        }  
        W51_p_day = W51_day;
        for (i=0; i<7; i++) {
            setDayDot(this, i, false);
        }  
        setDayDot(this, W51_dayW, true);
        watchCnt(this);
        watchDotUpd(this);
        this.timer = setInterval(watchCnt, 1000, this);
        this.buttons = setInterval(watchBut, 10, this);
        this.dotter = setInterval(watchDotUpd, 500, this);
    }

    this.stop = function() {
        clearInterval(this.timer);
        clearInterval(this.buttons);
        clearInterval(this.dotter);
        if (W51_mode > 2){
            clearInterval(this.editherz);
            this.editherz = null;
        }
        this.timer = null;
        this.buttons = null;
        this.dotter = null;

        return [W51_hour, W51_minute, W51_second, W51_dayW, W51_day, W51_month, W51_year]
    }

    this.reset = function() {
        W51_hour = 11;
        W51_minute = 11;
        W51_second = 10;
        W51_dayW = 0;
        W51_day = 11;
        W51_month = 11;
        W51_year = 11;
        W51_p_day = W51_day;

        if (W51_mode > 2) {
            W51_mode-=3;
            clearInterval(this.editherz);
            this.editherz = null;
        }

        for (i=0; i<7; i++) {
            setDayDot(this, i, false);
        }
        
        drawByMode(this);
        setDayDot(this, W51_dayW, true);
    }
}

function w_prim_create7SegDisplay(root, x, y) {

	var lines = {
		a:{img:"bitmaps/a.png", x:1, y:1, height:2.5},
		b:{img:"bitmaps/b.png", x:7.4, y:2.8, height:7.5},
		c:{img:"bitmaps/c.png", x:6.2, y:13, height:7.5},
		d:{img:"bitmaps/d.png", x:-1.5, y:19, height:2.5},
		e:{img:"bitmaps/e.png", x:-2.4, y:12.7, height:6.7},
		f:{img:"bitmaps/f.png", x:-0.8, y:3, height:6.7},
		g:{img:"bitmaps/g.png", x:1.2, y:10.4, height:2.5}
	};

	var arr = [];
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
		arr.push(line);
	}

	return arr;
}

function w_sec_create7SegDisplay(root, x, y) {

	var lines = {
        a:{img:"bitmaps/a.png", x:1, y:1, height:1.8},
		b:{img:"bitmaps/b.png", x:5.6, y:2, height:5.8},
		c:{img:"bitmaps/c.png", x:4.6, y:9.3, height:6},
		d:{img:"bitmaps/d.png", x:-0.7, y:13.8, height:1.8},
		e:{img:"bitmaps/e.png", x:-1.7, y:9.3, height:5.2},
		f:{img:"bitmaps/f.png", x:-0.5, y:2.2, height:5.2},
		g:{img:"bitmaps/g.png", x:1.2, y:7.8, height:1.8}
	};

	var arr = [];
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
		arr.push(line);
	}

	return arr;
}

function w_createDot(root, x, y, w, h) {
    var dot = document.createElementNS(svgNS, "rect");
	dot.setAttributeNS(null,"x",      x);
	dot.setAttributeNS(null,"y",      y);	
	dot.setAttributeNS(null,"width",  w);
	dot.setAttributeNS(null,"height", h);
	dot.setAttributeNS(null,"fill",   "#888984");
    root.appendChild(dot);

    return dot
}

function w_createTextField(root, x, y, text, size) {
	var txt = document.createElementNS(svgNS, "text");
	txt.setAttributeNS(null,"x", x);
	txt.setAttributeNS(null,"y", y);
	txt.setAttributeNS(null,"fill", "black");
	txt.setAttributeNS(null,"font-family","Arial");
	txt.setAttributeNS(null,"text-anchor","middle");
	txt.setAttributeNS(null,"font-size",size);
	var txtNode = document.createTextNode(text);
	txt.setAttribute("unselectable", "on");
	txt.setAttribute("class", "unselectable");
	txt.appendChild(txtNode);
	root.appendChild(txt);
	return(txt);
}

function w_createShadow(root, x, y, h, img) {
    var shad = document.createElementNS(svgNS, "image");
	shad.setAttributeNS('http://www.w3.org/1999/xlink','href', BASEPATH+"/"+img);
	shad.setAttributeNS(null,"height", h);
	shad.setAttributeNS(null, 'visibility', 'visible');
	shad.setAttributeNS(null,"x", x);
	shad.setAttributeNS(null,"y", y);
	shad.setAttribute("unselectable", "on");
	shad.setAttribute("class", "unselectable");
	root.appendChild(shad);
}