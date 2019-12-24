//randomental_saveload.js
//Only loads the page, but should have the save functions too.

Game.init.push(function(){console.log("loaded!");});
$(document).ready( 
function(){
	Game.init.run();
}); //And loading is complete.