//data.js
//Miscellaneous data, some of which is important.

gfxEngine.gui.mainTab = gfxEngine.gui.locations.mainBar.newTab();
gfxEngine.gui.options = gfxEngine.gui.mainTab.newSub();
gfxEngine.gui.achievos = gfxEngine.gui.mainTab.newSub();
gfxEngine.gui.log = gfxEngine.gui.mainTab.newSub();
gfxEngine.gui.pause = gfxEngine.gui.mainTab.newSub();

gfxEngine.gui.mainTab.desc = "Main";
gfxEngine.gui.options.desc = "Options";
gfxEngine.gui.achievos.desc = "Achievos";
gfxEngine.gui.log.desc = "Log";
gfxEngine.gui.pause.desc = "Pause";

gfxEngine.gui.locations["resources"].display = function (){
	this.displayBackground();
	this.textSize = 12;
	var dy = 0;
	for(var i = 0; i < Game.points.length; i++){
		Game.points[i].updateName();
		if(Game.points[i].show()){
			gfxEngine.ColoredText(Game.points[i].updateName(), this.pos[0]+this.textSize,this.pos[1]+this.textSize+dy,"Arial",this.textSize,Game.points[i].colorlist);
			dy = dy + this.textSize;
		}
	}
}

gfxEngine.gui.locations["timer"].display = function(){
	this.displayBackground();
	var dy = this.pos[3]*(1-(((new Date()) - Game.timer.lastTime)/Game.timer.speed));
	var base = this.pos[1] + this.pos[3];
	gfxEngine.Rect(this.pos[0],this.pos[1] + dy,this.pos[2],base - dy,Game.timer.color); 
}

//Pause is not essential.
Game.pause = {}; //empty definition to define object properties.
Game.pause.level = 0;
Game.pause.words = ["STOP!","No seriously, stop pressing that.","Is this game frozen?","The game is paused. Just letting you know."]; //use these in the notification instead.
Game.pause.f = function(){
	if(Game.points.getPoint("Time").value < Game.points.getPoint("Time").maximum){
		Game.pause.level++;
		Game.points.earn("Time",1);
		if(Game.pause.level <= 4){
			gfxEngine.notification(Game.pause.words[Game.pause.level - 1]);
		}
		else{gfxEngine.notification(Game.pause.words[Math.round(Math.random()*Game.pause.words.length)]) } //needs work
	} else {Game.failure("pausing");};
};
Game.pause.un = function(){
	if(Game.points.getPoint("Time").value > Game.points.getPoint("Time").minimum){
		Game.pause.level--;
		Game.points.earn("Time",-1);
		if(Game.points.getPoint("Time").value == 0)
			{gfxEngine.notification("HAMMERTIME!");
			Game.points.earn("Hammer",1);}
		else{gfxEngine.notification("Hammer...");}
	} else {Game.failure("unpausing");};
};

var sfxEngine = {};

Game.failure = function(words){
	gfxEngine.notification("Failed at "+words+"!");
	Game.points.earn("Fail",-1);
};