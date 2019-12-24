//randomental_base.js

/**
Overly ambitious, for now.
The game itself
Inspired by sandcastlebuilder
made by Forest Sweeney
(see the bottom of gfx.js for /u/neurofluxation's input via his tutorial on the subject)
**/

// raw, miscellaneous, not game altering data
//Black, crimson, red, orange, yellow, yellowgreen, green, greenblue, cyan, lightblue, blue, grey, white.
// 13 colors, 12 for the stack, [0-12], [0-11]
var Game = {};
Game.colornames 	= ["black", "crimson", "red", "orange", "yellow", "yellowgreen", "green", "greenblue", "cyan", "lightblue", "blue", "grey", "white"]
Game.stackcolors 	= [0x000000,0x800000,0xFF0000,0xFF8000,0xFFFF00,0x80FF00,0x00FF00,0x00FF80,0x00FFFF,0x0080FF,0x0000FF,0x808080,0xFFFFFF];
Game.colors 		= Game.stackcolors;
Game.colorblind 	= [0x000000,0x151515,0x2A2A2A,0x404040,0x555555,0x6A6A6A,0x808080,0x959595,0xAAAAAA,0xBFBFBF,0xD5D5D5,0xEAEAEA,0xFFFFFF];
Game.textcolors 	= [0xFFFFFF,0xFFFFFF,0xFFFFFF,0x000000,0x000000,0x000000,0x000000,0x000000,0x000000,0x000000,0xFFFFFF,0x000000,0x000000];

//Main game components
//This holds a stack of GameEvents to be ran at the specified interval.
Game.stack = [];

//Accepts a GameEvent
Game.stack.add = function(ge){ //Returns whether it was put on the stack or not.
	console.log("Tock");
	if(this.length >= this.maxLength){Game.points.add("Fail",1); return false;};
	for(var i = 0; i< this.length; i++){
		if(this[i].priority <= ge.priority){
			this.splice(i,0,ge); //This should sort them with the lowest priority as the last one, but only _initially_
			break;
		};
	};
	return true;
};
//Exectutes the top of the stack.
Game.stack.run = function(){
	console.log("Tick");
	if(Game.stack.length > 0){(Game.stack.pop())();}
};
/*
//This is theoretically checking for a certain event.
Game.stack.contains = function(a){
	for(var i = 0; i < Game.stack.length; i++){if(Game.stack[i] == a){return true;}};
	return false;
};
*/
Game.stack.maxLength = 12; //The stack will need a scrollbar.

Game.timer = {
	lastTime:new Date(),
	speed:20736, //ms, 12^4
	start:function(){Game.timer.lastTime = new Date();},
	tick:function(){
		var curTime = new Date();
		if(curTime - Game.timer.lastTime >= Game.timer.speed){
			Game.timer.lastTime = new Date();
			Game.stack.run();
		};
	},
	display:function(){
		var ratio = ((new Date()) - this.lastTime) / this.speed;
		gfxEngine.Rect()
	},
	color:"#FFFFFF"
}; // dates... BAH

// Needs mouse/keyboard listeners to add click/keyboard points

Game.log = ["Log Created!"]; //Test if the log exists first.
Game.log.maxLength = 12; //Arbitraryyyyyy
Game.log.write = function(words){
	Game.log.push(words);
	if(Game.log.length >= Game.log.maxlength){
		for(var i = Game.log.length; i > Game.log.maxLength; i--) {
			Game.log.shift();
		}			
	}
}

Game.anytime = []; //This game is kinda slow, so some things can be done 'anytime'.
Game.loop = function(){
	if(Game.pause.level <= 0){Game.timer.tick();};
	if((Game.pause.value || Game.blurry) && (Game.anytime.length > 0)){(Game.anytime.shift())();};//Oh this is mean. Muahaha. Although not too mean.
	var loop = setTimeout(Game.loop,12); //This is the func that never ends
	return;
};
Game.init = [Game.timer.start]; // A list of functions, really should start with loading your last save, but... whatever.
Game.init.push(Game.loop); //this should be the second to last one on the init stack, right before we start the timer.
Game.init.run = function(){
	var j = Game.init.length; //the current length, so that we only do it j times.
	for(var i = 1; i <= j; i++){ //explicit, as the order matters.
		(Game.init.shift())();
	};
};
Game.init.push(function(){gfxEngine.init(); setTimeout(gfxEngine.init,1728)}); // just important that it gets done before the Game starts running, so doing it twice.
Game.handleClick = function(m){
	Game.points.earn("Click",1);
	//check which boxes it falls in, either the main/sub Bars or main/subArea.
	gfxEngine.handleClick(m); //Because they aren't html elements, we have to capture the mouse into the right area. The gfx will handle that.
}
testClick = function(m){
	var x = m.pageX;
	var y = m.pageY;
	console.log("("+x+","+y+")");
}
//jQuery interaction
$("body").on('click',Game.handleClick);