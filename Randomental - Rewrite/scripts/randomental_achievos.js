//randomental_achievos.js

Game.achievos = []; // Contains all the achievements, unearned and earned.
Game.achievosByName = [];
Game.achievos.earn = function(name){
	var a = Game.achievos.find(name);
	if(!a && (name != "Missing Achievo")){
		Game.failure("finding " + name + " achievo");
		Game.achievos.earn("Missing Achievo"); 
		Game.points.earn("Bug",1); 
		return;
	};
	a.earn();
};
Game.achievos.add = function(a){
	Game.achievos.push(a);
	Game.achievosByName[a.name] = a;
};
Game.achievos.find = function(n){
	if(Game.achievosByName[n] != undefined){
		return Game.achievosByName[n];
	}
	return false;
};
Game.achievos.unearn = function(name){
	var a = Game.achievos.find(name);
	if(!a) {return;};
	a.unearn();
};
Game.achievos.check = function(){
	Game.achievos.forEach(function(ach){
		ach.check();
	});
};
var loadAchievos = function(){
	var newAchievo = function(name, desc){
		Game.achievos.add(new GameAchievo(name,desc));
	};
	var capa = function(ptname, ptamt, achname, achdesc){ //Check Above Point Amount
		newAchievo(achname,achdesc);
		Game.achievos.find(achname).check = function(){if(Game.points.find(ptname).value > ptamt) {Game.achievos.earn(achname);}};
	}
	//some achievos
	newAchievo("Missing Achievo", "You found an achievo that was not implemented properly!");
	newAchievo("Missing Point", "You found a point that was not implemented properly! Or we missed the point of that point.");

	capa("Achievo",1,"First Achievo Point","You found an achievo point!");
	capa("Click",1,"First Click Point","You found a click point!");
	capa("Hammer",1,"First Hammer","You found a hammer!");
	capa("Bug",1,"First Bug","You found a bug!");
	capa("Time",1,"First Time Nugget","You found a time nugget!");
	capa("Prestige",1,"First Prestige Point","You found a prestige point!");
	capa("Fail",1,"First Fail Point","You found a fail point!");
};
loadAchievos();