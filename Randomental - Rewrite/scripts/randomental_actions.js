//randomental_actions.js

Game.actions = []; //Contains all the gameactions.
Game.actionsByName = [];

Game.actions.run = function(name){
	Game.stack.add(Game.actions.getAction(name));
};

Game.actions.add = function(a){
	Game.actions.push(a); // p is passed by reference. which is cool.
	Game.actionsByName[a.name] = a;
};

Game.actions.find = function(n){
	if(Game.actionsByName[n] != undefined){
		return Game.actionsByName[n];
	}
	return false;
};