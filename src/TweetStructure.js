
function TweetStructure() //don't need scene anymore
							  // Need to add physics.
{
	
}

	//Make this more general like New Node or something.
	TweetStructure.prototype.constructBase = function(username, mass, x,y,z){
		
		//var num = Math.random();
		var canvas = document.createElement( 'canvas' );
		canvas.width = 1920;
    	canvas.height = 1080;
		var context = canvas.getContext( '2d' );
		
		context.fillStyle = "yellow";
		context.font = "bold 75px Arial";


			context.fillText("@"+username,300,500); //Will eventually be parsed usernames.
			context.textAlign = 'center';
			var tweeterTexture = new THREE.Texture( canvas );
			tweeterTexture.needsUpdate = true;
			tweeterTexture.magFilter = THREE.NearestFilter;
			tweeterTexture.minFilter = THREE.LinearMipMapLinearFilter;

			//Create Physijs object out of canvas. This will hold the username of the Tweet.
			var canvasMesh = new Physijs.SphereMesh(
				new THREE.SphereGeometry( 6, 32, 32),
				Physijs.createMaterial(
					new THREE.MeshBasicMaterial( {map: tweeterTexture, side: THREE.DoubleSide} ), 0.9, 0
					), mass
				);

			return canvasMesh;
		

	};

	TweetStructure.prototype.CreateTweetPanel = function(tweet,x,y,z){

		//var num = Math.random();
		var canvas = document.createElement( 'canvas' );

		 canvas.width = 1920;
    	canvas.height = 1080;

		var context = canvas.getContext( '2d' );
		context.fillStyle = "white";
		context.font = "90px Times";


		context.fillText(tweet,300,500); //Will eventually be parsed usernames.
		
		context.textAlign = 'center';
		var tweetText = new THREE.Texture( canvas );
		tweetText.magFilter = THREE.NearestFilter;
		tweetText.minFilter = THREE.LinearMipMapLinearFilter;
		tweetText.needsUpdate = true;

		//Create Physijs object out of canvas. This will hold the username of the Tweet.
		var tweetMesh = new Physijs.BoxMesh(
			new THREE.CubeGeometry(50, 12, 1),
				Physijs.createMaterial(
			new THREE.MeshBasicMaterial( {map: tweetText, side: THREE.DoubleSide} ), 0.8, 0
			), 0
			);
			
		return tweetMesh;
	};

	TweetStructure.prototype.CreateConnection = function(obj1,obj2){

		var material = new THREE.LineBasicMaterial({
		color: 0xffffff
		});

		var geometry = new THREE.Geometry();
		geometry.vertices.push(
			obj1.position, obj2.position
		);

	 	var line = new THREE.Line( geometry, material );
		return line;
	};

