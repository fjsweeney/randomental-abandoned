//gfx.js
//The base of showing stuff to the screen.
//This should be loaded before game.js is loaded, and after jquery.


//***I wrote this a long time ago, and haven't reviewed it.***

//gui constructors
var Button = function(){
	this.pos = [0,0,0,0]; //bounding box, x,y,width,height, not initially set because gui handles it
	this.action = function(){}; //what to do when clicked
	this.desc = "A button?"; //printed name
	this.tooltip = "???"; //showed when hovered
	this.foreground = "#000000";
	this.background = "#FFFFFF";
	this.hoverBackground = "#DCDCDC";
	this.hovered = false;
	this.handleClick = function(m){
		console.log(this.desc);
		this.action();
		}
	this.handleHover = function(m){
		this.hovered=true;
		}
	this.handleNotHovered = function(m){
		this.hovered=false;
	}
	this.textSize = 12;
	this.display = function(){
		gfxEngine.Rect(this.pos[0],this.pos[1],this.pos[2],this.pos[3],this.hovered? this.hoverBackground : this.background); //should check if I'm hovered...
		gfxEngine.Text(this.desc, this.pos[0]+ this.pos[2]/2,this.pos[1]+this.textSize,"Arial",this.textSize,this.foreground);
	};
	this.data = []; //used for tabs and subtabs.
};
var SubTab = function(){
	Button.apply(this,arguments);
	this.desc = "New SubTab";
	this.action = function(){
		gfxEngine.gui.locations.mainArea.fill(this.data); //Change the buttons on the main area to the buttons that the subtab has.
	};
}
SubTab.prototype = Object.create(Button.prototype);
SubTab.prototype.constructor = SubTab;
var Tab = function(){
	Button.apply(this,arguments);
	this.desc = "New Tab";
	this.action = function(){
		gfxEngine.gui.locations.subBar.fill(this.data); //Change the buttons on the subTab bar to the buttons that the tab has.
		//The main area still has the buttons from the last subtab press (which is acceptable)
	};
	this.data = [];
	this.newSub = function(){
		var n = new SubTab();
		this.data.push(n);
		return n;
	}
}
Tab.prototype = Object.create(Button.prototype);
Tab.prototype.constructor = Tab;
var GuiLocation = function(p,r,xs,ys,n,d){
	this.name =n;
	this.pos = p;
	this.width=p[2];
	this.height=p[3];
	this.ratio=[r[0],r[1]];
	this.xstart=xs;
	this.ystart =ys;
	this.next = d; //this is the list of names of the next elements to draw.
	this.buttons = []; //A list of buttons in the area.
	this.handleClick=function(m){ //if they overlap, click both
		for(var i = 0; i <this.buttons.length;i++){
			if(m.pageX >=this.buttons[i].pos[0] && m.pageX <=(this.buttons[i].pos[2]+this.buttons[i].pos[0])){
				if(m.pageY >=this.buttons[i].pos[1] && m.pageY <=(this.buttons[i].pos[3]+this.buttons[i].pos[1])){
					this.buttons[i].handleClick(m);
				};
			};
		};
	};
	this.handleHover=function(m){ //if they overlap, hover both
		for(var i = 0; i <this.buttons.length;i++){
			if(m.pageX >=this.buttons[i].pos[0] && m.pageX <=(this.buttons[i].pos[2]+this.buttons[i].pos[0]) &&
			   m.pageY >=this.buttons[i].pos[1] && m.pageY <=(this.buttons[i].pos[3]+this.buttons[i].pos[1])){
					this.buttons[i].handleHover(m);
			} else {
					this.buttons[i].handleNotHovered(m);
			};
		};
	};
	this.fill = function(b){ //a list of buttons, not just buttons.
		this.buttons = b;
		this.resize();
	};
	this.empty = function(){
		this.buttons = [];
		this.resize();
	};
	this.add = function(b){
		this.buttons.push(b);
		this.resize();
	}
	this.resize = function(){
		//handled by recalculate,
	};
	this.display = function(){ //display the buttons in me. Overwritten in Stack, timer, and logo, and resources
		this.displayBackground(); //display my background bounding box.
		for(var i = 0; i < this.buttons.length; i++){
			this.buttons[i].display(); //display my buttons.
		}
	};
	this.displayBackground = function(){
		var b = "#000000";
		switch(this.name){
			case "mainBar":
				b = "#ff0000";
				break;
			case "logo":
				b = "#ffff00";
				break;
			case "subBar":
				b = "#00FF00";
				break;
			case "mainArea":
				b = "#0000ff";
				break;
			case "timer":
				b = "#ff00ff";
				break;
			case "stack":
				b = "#00ffff";
				break;
			default:
				break;
		}
		gfxEngine.Rect(this.pos[0],this.pos[1],this.pos[2],this.pos[3],b);
	}
};

var gfxEngine = {};
gfxEngine.gui = {};
gfxEngine.phi = (1 + Math.sqrt(5))/2;

gfxEngine.gui.locations = []; //contains all the GuiLocations
gfxEngine.gui.locations.addLoc = function(item){
	gfxEngine.gui.locations[item.name] = item;
	gfxEngine.gui.locations.push(gfxEngine.gui.locations[item.name]);
};

// this gets the order of building for recalculating the layout.
gfxEngine.gui.locations.buildOrder = function(a, name){
	var loc = gfxEngine.gui.locations;
	a.push(loc[name]);
	for(var i = 0; i < loc[name].next.length; i++){
		gfxEngine.gui.locations.buildOrder(a, loc[name].next[i]);
	};
	return a;
};

//This makes the layout neater and tidier, autoadjusting and all that.
gfxEngine.gui.locations.recalculate = function(){
	var loc = gfxEngine.gui.locations;
	var w = gfxEngine.Canvas.width;
	var h = gfxEngine.Canvas.height;
	var l = 0;
	var t = 0;
	var a = loc.buildOrder([loc[0]],loc[0].next[0]); //a list, in order of what needs to be built. Since locations are passed by reference, this is okay.
	for(var i = 0; i < a.length; i++){
		a[i].width = (a[i].ratio[0] / 100) * w; //item width
		a[i].height = (a[i].ratio[1] / 100) * h; //item height
		if(a[i].xstart == "left"){a[i].pos[0] = l; a[i].pos[2] = a[i].width;} 
			else {a[i].pos[0] = loc[a[i].xstart].pos[0] + loc[a[i].xstart].width; a[i].pos[2] = a[i].width;}; //start from the loc a needs to start at.
		if(a[i].ystart == "top"){a[i].pos[1] = t; a[i].pos[3] = a[i].height;}
			else {a[i].pos[1] = loc[a[i].ystart].pos[1] + loc[a[i].ystart].height; a[i].pos[3] = a[i].height;};
	};
	var m = 3; //margin
	for(var i = 0; i < loc.length; i++){
		loc[i].width = loc[i].width - 2*m;
		loc[i].height = loc[i].height - 2*m;
		loc[i].pos[0] = loc[i].pos[0] + m;
		loc[i].pos[1] = loc[i].pos[1] + m;
		loc[i].pos[2] = loc[i].pos[2] - 2*m;
		loc[i].pos[3] = loc[i].pos[3] - 2*m;
	}
	for(var i = 0; i < loc.length; i++){
		loc[i].resize(); //everything has been resized! Just letting you know.
	}
};
gfxEngine.gui.locations.find = function(name){
	var loc = gfxEngine.gui.locations;
	var mainArea;
	for(var i = 0; i < loc.length; i++){
		if(loc[i][4] == name){return loc[i];};
		if(loc[i][4] == "mainArea"){mainArea = loc[i];};
	};
	return mainArea; //Default
};
gfxEngine.gui.locations.display = function(){
	for(var i = 0; i < gfxEngine.gui.locations.length; i++){
		gfxEngine.gui.locations[i].display();
	}
}

/****************************************************************************/
/****************************************************************************/
//Each location has a name, and can also be found by number.
gfxEngine.gui.locations.addLoc(new GuiLocation([0,0,32,32],[5,10],"left","top","logo",["mainBar"])); //This has to be added first.
gfxEngine.gui.locations.addLoc(new GuiLocation([32,0,600,32],[70,10],"logo","top","mainBar",["subBar","stack"]));
gfxEngine.gui.locations.addLoc(new GuiLocation([0,32,600,64],[75,10],"left","logo","subBar",["mainArea"]));
gfxEngine.gui.locations.addLoc(new GuiLocation([0,64,500,500],[35,80],"left","subBar","mainArea",["subArea"]));
gfxEngine.gui.locations.addLoc(new GuiLocation([600,0,700,600],[20,100],"mainBar","top","stack",["timer"]));
gfxEngine.gui.locations.addLoc(new GuiLocation([700,0,800,600],[5,100],"stack","top","timer",[]));
gfxEngine.gui.locations.addLoc(new GuiLocation([500,500,600,600],[20,80],"subArea","subBar","resources",[]));
gfxEngine.gui.locations.addLoc(new GuiLocation([400,400,500,500],[20,80],"mainArea","subBar","subArea",["resources"]));
/****************************************************************************/
/****************************************************************************/

gfxEngine.gui.locations.mainArea.resize = function(){
	var me = gfxEngine.gui.locations.mainArea;
	//h is less than l always. So sqrt(w*h/(phi*n)) is the h value. W*H/(phi*N)=l*h == A/(r*N)=a
	//TODO: is PHI going to work as a ratio?
	var h = Math.sqrt(me.width*me.height/(gfxEngine.phi*me.buttons.length));
	var l = gfxEngine.phi*h;
	var row = 0;
	var column =0;
	var m = 3;
	for(var i = 0; i < me.buttons.length;i++){
		//This should make the buttons fit.
		if((column+1)*l>=me.width){column = 0;row++;}
		me.buttons[i].pos[0] = me.pos[0]+column*l+m;
		me.buttons[i].pos[1] = me.pos[1]+row*h+m;
		me.buttons[i].pos[2] = l-2*m;
		me.buttons[i].pos[3] = h-2*m;
		column++;
	};
}
gfxEngine.gui.locations.mainBar.resize = function(){
	//The bar and the sub bar are pretty much equal.
	//They operate on a linear scale, so no rows, unlike mainArea.
	var me = gfxEngine.gui.locations.mainBar;
	var w = me.width/me.buttons.length;
	var m = 3;
	for(var i = 0; i<me.buttons.length; i++){
		me.buttons[i].pos = [me.pos[0] + w*i + m, me.pos[1]+m, w-2*m, me.height-2*m];
	}
}
gfxEngine.gui.locations.mainBar.newTab = function(){
	var n = new Tab();
	this.add(n);
	return n; 
}
gfxEngine.gui.locations.subBar.resize = function(){
	var me = gfxEngine.gui.locations.subBar;
	var w = me.width/me.buttons.length;
	var m = 3;
	for(var i = 0; i<me.buttons.length; i++){
		me.buttons[i].pos = [me.pos[0] + w*i + m, me.pos[1]+m, w-2*m, me.height-2*m];
	}
}
//gfxEngine.gui.locations.mainBar.buttons is where the main tabs are.
//gfxEngine.gui.locations.timer is where the timer is.
//gfxEngine.gui.locations.stack is where the stack is.
gfxEngine.handleClick = function(m){ //Since they aren't html elements, continue the capture.
	//Check all the _ACTIVE_ buttons' bounding boxes. They really really shouldn't overlap. Yet.
	//or redirect the click the the area, for the area to work on the click.
	var x = m.pageX;
	var y = m.pageY;
	var locs = gfxEngine.gui.locations;
	for(var i = 0; i<locs.length;i++){ //if they overlap, click both.
		if(locs[i].pos[0]<x && (locs[i].pos[0] + locs[i].pos[2])>x && locs[i].pos[1]<y && (locs[i].pos[1]+locs[i].pos[3])>y){
			locs[i].handleClick(m);
		}
	}
};
gfxEngine.handleHover = function(m){ //Since they aren't html elements, continue the capture.
	var x = m.pageX;
	var y = m.pageY;
	var locs = gfxEngine.gui.locations;
	for(var i = 0; i<locs.length;i++){ //HandleHover will check the bounding boxes.
		locs[i].handleHover(m);
	}
};
/***********************Needs work*********************************/
gfxEngine.notification = function(words){
	Game.log.write(words); //Put it in the log.
	console.log(words);
	//This brings up some sort of _non-invasive_ pop up, or goes in a notification log or something.
};
/*********************************************************/
gfxEngine.setFill = function(c){gfxEngine.Buffer.Context.fillStyle = c;}; //shortcuts.
gfxEngine.setStroke = function(c){gfxEngine.Buffer.Context.strokeStyle = c;};

gfxEngine.ColoredText = function(text,x,y,font,size,c){ //adapted gfxEngine.Text to accept a list of colors
	var dx = 0;
	for(var i = 0; i < text.length; i++){
		gfxEngine.Text(text[i],x+dx,y,font,size,c[Math.round(i*c.length/text.length)]);
		dx = dx + size/2;
	}
}
//All of the following was taken (and modified) from a js tutorial by /u/neurofluxation
gfxEngine.Rect = function(x,y,w,h,c) {
	gfxEngine.setFill(c);
	gfxEngine.Buffer.Context.fillRect(x,y,w,h);
};
gfxEngine.Text = function(text,x,y,font,size,c){ //This shortcut is more reasonable
	gfxEngine.setFill(c);
	gfxEngine.Buffer.Context.font = size + "px " + font;
	gfxEngine.Buffer.Context.fillText(text,x,y);
}
gfxEngine.Draw = function(){
	if(!Game.blurry){
		gfxEngine.Canvas.Context.drawImage(gfxEngine.Buffer,0,0);
		gfxEngine.Buffer.Context.clearRect(0,0,gfxEngine.Canvas.width,gfxEngine.Canvas.height); //clear the frame
		gfxEngine.setFill("#DCDCDC");
		gfxEngine.Rect(0,0,gfxEngine.Buffer.width,gfxEngine.Buffer.height);
		gfxEngine.gui.locations.display();
		
	}
	clearTimeout(gfxEngine.running);
	gfxEngine.running = setTimeout(function(){
			requestAnimFrame(gfxEngine.Draw,gfxEngine.Canvas)
	}, 1000/30);
};
gfxEngine.init = function(){

	gfxEngine.Canvas = $('#theDisplay')[0];
	var w = $(window).width()*.99;
    var h = $(window).height()*.99;

    $("#theDisplay").css("width", w + "px");
    $("#theDisplay").css("height", h + "px");
	gfxEngine.Canvas.width = w;
	gfxEngine.Canvas.height = h;
	
	gfxEngine.Canvas.Context = gfxEngine.Canvas.getContext('2d');
	
	gfxEngine.Buffer = document.createElement('canvas');
	gfxEngine.Buffer.Context = gfxEngine.Buffer.getContext('2d');
	gfxEngine.Buffer.width = w;
	gfxEngine.Buffer.height = h;
	
	gfxEngine.resize();
	gfxEngine.Draw();
	console.log("initialized!");
};
gfxEngine.resize = function(w,h){
	gfxEngine.Buffer.Context.textAlign = "center";
	gfxEngine.gui.locations.recalculate();
}

window.requestAnimFrame = (function(){ //This is a function to enable accessibility (work on multiple browsers).
	return window.requestAnimationFrame || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame || 
		window.oRequestAnimationFrame || 
		window.msRequestAnimationFrame || 
	function (callback, element){ //element is passed so that the function signatures match.
		fpsLoop = window.setTimeout(callback, 1000 / 30);
	};
}());
$(window).bind("resize", function(){
    var w = $(window).width() *.99;
    var h = $(window).height() *.99;
    $("#theDisplay").css("width", w + "px");
    $("#theDisplay").css("height", h + "px");
	gfxEngine.Canvas.width = w;
	gfxEngine.Canvas.height = h;
	gfxEngine.resize();
});