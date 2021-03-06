//randomental_constructors.js

//Game Event: it goes on the stack.
var GameEvent = function(f,p,n){
	this.name = n;
	this.func = f;
	this.priority = p;
	this.foreground = Game.stackcolors[Game.stackcolors.length-p];
	this.background = Game.stackcolors[p];
	this.description = name;
	this.tooltip = function(){}; //Pop up a tooltip showing the description. Or just the text for the tooltip.
};

//GameHook: part of an GameAction, when you do the GameAction, the hooked GameAction follows automatically.
//TODO: Give hooks tooltips, so you know where it is hooked.
var GameHook = function(){
	this.action = null; //A GameAction
	this.working = false; //Is there a hook/unhook in progress?
	this.cost = 1;
	this.hook = function(a){
		if(!this.canHook()){Game.failure("Failed to hook!"); return;}
		this.working = true;
		Game.points.earn("Hook",-1*this.cost);
		Game.stack.add(function(){
			this.action = a;
			this.isHooked = true;
			this.working = false;
			//Add a notification of hookiness.
		}.bind(this));
	};
	this.canHook = function(){
		if(this.working) {return false;}
		if(this.isHooked) {return false;}
		if(!Game.points["Hook"].canSpend(this.cost)) {return false;}
	}
	this.canUnhook = function(){
		if(this.working) {return false;}
		if(!this.isHooked) {return false;}
		if(!Game.points["Hook"].canSpend(-1*this.cost)) {return false;}
	}
	this.unhook = function(){
		if(!this.canUnhook()){Game.failure("Failed to unhook!"); return;}
		this.working = true;
		Game.stack.add(function(){
			this.isHooked = false;
			this.action = null;
			Game.points.earn("Hook",this.cost);
			this.working = false;
			//Add a notification of hooklessness.
		}.bind(this));
	};
	this.isHooked = false;
};

//GameAction: It is something you click.
var GameAction = function(f,n){
	this.name = n;
	this.func = f;
	this.cost = {type:["Click"],amount:[1]};
	this.foreground = Game.stackcolors[Game.stackcolors.length-p];
	this.background = Game.stackcolors[p];
	this.available = true;
	this.description = name;
	this.tooltipText = function(){}; //Pop up a tooltip showing the cost and description. Or just the text for the tooltip.
	this.hook = new GameHook(null);
	this.generated = false; //if it is generated by an action, this should be set to true. So we can use other actions to delete them, hide them etc.
};

//GamePoint: it is a number that is displayed in the points area.
var GamePoint = function(n){
	this.name = n;
	this.value = 0;
	this.dispValue = function(){
		return (this.value + (this.maximum != Infinity ? "/" + this.maximum : ""));
	}
	this.updateName = function(){
		return (this.dispValue() + " " + this.name + " Point" + ((this.value == 1) ? "" : "s"));};
	this.update = [this.updateName];
	this.displayName = this.name + " Points";
	this.add = function(num){
		var prevalue = this.value;
		this.value += num;
		if(this.value>this.max){this.value=this.max;};
		if(this.value<this.min){this.value=this.min;};
		Game.points.earn("Total",(this.value-prevalue));
		this.update.forEach(function(action){action();});
	};
	this.spend = function(num){
		if(this.canSpend(num)) {
			this.add(-1*num);
		} else {
				Game.failure("Failed to spend your " + this.displayName);
				return false;
		};
		Game.points.add("Spent", num);
		return true;
	};
	this.canSpend = function(num){
		if(num > 0) {
			return ((this.value - this.min) >= num);
		} else {
			return ((this.max - this.value) >= -1*num);
		};
	};
	this.show = function(){
		return (this.value != 0);
	};
	this.minimum = -Infinity;
	this.maximum = Infinity;
	//this.max = Infinity;
	this.defaultcolorlist = ["#FFFFFF"];
	this.colorlist = this.defaultcolorlist;
};

//GameAchievo: it is a display item, like a GamePoint.
var GameAchievo = function(n, d){
	this.name = n;
	this.desc = d || "Earned for being awesome.";
	this.earn = function(){
		if(!this.earned){
			this.earned = true;
			gfxEngine.notification(this.name + "earned!");
			Game.points.earn("Achievo",worth);
		}
	};
	this.earned = false;
	this.unearn = function(){
		if(this.earned){
			this.earned = false;
			gfxEngine.notification(this.name + "unearned?");
			Game.points.earn("Achievo",unworth);
			Game.achievos.earn("Unearned Achievo")
		};
	};
	this.worth = 1;
	this.unworth = -1; //Mysterious plans lie ahead...
	this.buttonize = function(){
		var result = new Button();
		result.desc = name;
		result.tooltip = desc;
		return result;
	}
	//will earn or unearn achievos.
	this.check = function(){};
	this.permanent = false; //When prestiging, if permanent, the achievo will be re-earned.
	this.generated = false; //if this is generated by an action, allow for full-on deletion.
};