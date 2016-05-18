//points.js

Game.points = []; //contains the kinds of points you can get
Game.pointsByName = [];
Game.points.addPoint = function(p){
	Game.points.push(p); // p is passed by reference. which is cool.
	Game.pointsByName[p.name] = p;
};
Game.points.find = function(n){
	if(Game.pointsByName[n] != undefined){
		return Game.pointsByName[n];
	}
	return false;
}

Game.points.earn = function(name, num){
	var i = Game.points.find(name);
	if(i) {
		i.add(num);
	} else {
		Game.failure("finding " + name + " points");
		Game.achievo.earn("Missing Point");
		if(!(name == "Bug")){Game.points.earn("Bug",1);};
		if(!(name == "Missing")){Game.points.earn("Missing", num);};
	};
};
Game.points.spend = function(name, num){
	var i = Game.points.find(name);
	if(i) {
		return i.spend(num);
	} else {
		Game.achievo.earn("Missing Point");
		return false;
	};
};


var loadPoints = function(){
	//A closure, to keep temp functions out of namespace.
	var newPoint = function(name){
		Game.points.addPoint(new GamePoint(name));
	};
	var pointList = [
		//important points
		"Total","Hook","Spent","Random",
		//more points
		"Gold","Fire","Color","Achievo","Upgrade","Building","Prestige","Research","Fail","Time","Hammer","Bug",
		"Click","Keyboard","Wave"
	];
	pointList.forEach(newPoint);
	//Important/edited points
	Game.points["Total"].add = function(num){this.value += num;};
	Game.points["Total"].recalculate = function(){
		var total = 0;
		for(var i = 0; i < Game.points.length; i++){
			if(Game.points[i].name == "Total"){continue;};
			total += Game.points[i].value;
		};
		Game.points["Total"].value = total;
	};
	Game.points["Hook"].updateName = function(){ return (this.value + " Hook" + ((this.value == 1) ? "" : "s"));};

	//More points
	Game.points["Gold"].updateName = function(){return (this.value + " Gold Bar" + ((this.value == 1) ? "" : "s"));};
	Game.points["Gold"].colorlist = ["#FFFF00"];

	Game.points["Fire"].firecolors = ["#FF0000", "#FF1500", "#FF2A00","#FF4000","#FF5500","#FF6A00","#FF8000","#FF9500","#FFAA00","#FFBF00","#FFD500","#FFEA00","#FFFF00"];
	Game.points["Fire"].updateName = function(){
		this.colorlist = (this.value < 0) ? ["#666666"] : this.firecolors; //Update the colorlist
		return (Math.abs(this.value) + " Fire" + ((Math.abs(this.value) == 1) ? "" : "s") + ((this.value < 0) ? " Extinguished" : " Started"));};

	Game.points["Color"].updateName = function(){
		this.colorlist = (this.value < 0) ? ["#666666"] : Game.colors;
		return (Math.abs(this.value) + " Color" + ((Math.abs(this.value) == 1) ? "" : "s") + ((this.value < 0) ? " Enslaved" : " Rescued"));};

	Game.points["Wave"].updateName = function(){
		this.colorlist = ["#0000FF", "#0015FF", "#002AFF", "#0040FF", "#0055FF", "#006AFF","#0080FF"];
		return (this.value + " Wave" + ((this.value == 1) ? "" : "s") + " Washed");};

	Game.points["Time"].updateName = function(){return (this.value + " Time Nugget" + ((this.value == 1) ? "" : "s"));};

	Game.points["Hammer"].updateName = function(){return (this.value + " Hammer" + ((this.value == 1) ? "" : "s"));}

	Game.points["Bug"].updateName = function(){return (this.value + " Bug" + ((this.value == 1) ? "" : "s"));}
	Game.points["Bug"].colorlist = ["#66FF00"];
};
loadPoints();