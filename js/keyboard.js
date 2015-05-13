var init_keys = function(renderDom) {
	// only on keydown + no repeat
	var scope = this;
	var wasPressed	= {};

	this.keyboard = new THREEx.KeyboardState(renderDom);
	
	window.addEventListener('keydown', function(event){
		if( scope.keyboard.eventMatches(event, '0') && !wasPressed['0'] ){
			console.log("Playing track 0");
			document.getElementById('inst').style.display='none';
			chooseSong(0);
			pointCloud2.subtractor = 150;
			wasPressed['0'] = true;
		}
		if( scope.keyboard.eventMatches(event, '1') && !wasPressed['1'] ){
			console.log("Playing track 1");
			document.getElementById('inst').style.display='none';
			chooseSong(1);
			pointCloud2.subtractor = 150;
			wasPressed['1'] = true;
		}
		if( scope.keyboard.eventMatches(event, '2') && !wasPressed['2'] ){
			console.log("Playing track 2");
			document.getElementById('inst').style.display='none';
			chooseSong(2);
			pointCloud2.subtractor = 110;
		}
		if( scope.keyboard.eventMatches(event, '3') && !wasPressed['3'] ){
			console.log("Playing track 3");
			document.getElementById('inst').style.display='none';
			chooseSong(3);
			pointCloud2.subtractor = 150;
			pointCloud2.divisor = .5
		}
		if( scope.keyboard.eventMatches(event, '4') && !wasPressed['4'] ){
			console.log("Playing track 4");
			document.getElementById('inst').style.display='none';
			chooseSong(4);
			pointCloud2.subtractor = 100;
		}
		if( scope.keyboard.eventMatches(event, 'm') && !wasPressed['m'] ){
			console.log("Stoping music");
			stop();
		}
		if( scope.keyboard.eventMatches(event, 'x') && !wasPressed['x'] ){
			console.log("Increasing tweets");
			maxTweets += 10;
		}
		if ( scope.keyboard.eventMatches(event, 'q') && !wasPressed['q'] ){
			pointCloud2.animation++;
			if (pointCloud2.animation == 4) {
				pointCloud2.animation = 0;
			}
		}
	});
	
	// listen on keyup to maintain ```wasPressed``` array
	window.addEventListener('keyup', function(event){
		if( scope.keyboard.eventMatches(event, '0')){
			wasPressed['0'] = false;
		}
		if( scope.keyboard.eventMatches(event, '1')){
			wasPressed['1'] = false;
		}
		if( scope.keyboard.eventMatches(event, '2')){
			wasPressed['2'] = false;
		}
		if( scope.keyboard.eventMatches(event, '3')){
			wasPressed['3'] = false;
		}
		if( scope.keyboard.eventMatches(event, '4')){
			wasPressed['4'] = false;
		}
		if( scope.keyboard.eventMatches(event, 'm')){
			wasPressed['m'] = false;
		}
		if( scope.keyboard.eventMatches(event, 'x')){
			wasPressed['x'] = false;
		}
		if( scope.keyboard.eventMatches(event, 'q')){
			wasPressed['q'] = false;
		}
	})
};