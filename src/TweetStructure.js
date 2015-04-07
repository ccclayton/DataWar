
function TweetStructure(scene)
{
	this.scene = scene;
}

	TweetStructure.prototype.constructBase = function(username,x,y,z){
		
		var num = Math.random();
		var canvas = document.createElement( 'canvas' );
		var context = canvas.getContext( '2d' );
		context.fillStyle = "white";
		context.font = "bold 16px Arial";

			context.fillText("@"+username,10,50); //Will eventually be parsed usernames.
			context.textAlign = 'center';
			var tweeterTexture = new THREE.Texture( canvas );
			tweeterTexture.needsUpdate = true;

			//Create Physijs object out of canvas. This will hold the username of the Tweet.
			var canvasMesh = new Physijs.SphereMesh(
				new THREE.SphereGeometry( 6, 32, 32),
				Physijs.createMaterial(
					new THREE.MeshBasicMaterial( {map: tweeterTexture, side: THREE.DoubleSide} ), 0.8, 0
					), 1000000
				);
			

			scene.add(canvasMesh);
			canvasMesh.position.set(x,y,z);
			canvasMesh.__dirtyPosition = true; 
			

			
     

	};

	TweetStructure.prototype.CreateTweetPanel = function(tweet,x,y,z){

		var num = Math.random();
		var canvas = document.createElement( 'canvas' );
		var context = canvas.getContext( '2d' );
		context.fillStyle = "white";
		context.font = "14px Times";

		context.fillText(tweet,40,50); //Will eventually be parsed usernames.
		context.textAlign = 'center';
		var tweetText = new THREE.Texture( canvas );
		tweetText.needsUpdate = true;

		//Create Physijs object out of canvas. This will hold the username of the Tweet.
		var tweetMesh = new Physijs.BoxMesh(
			new THREE.CubeGeometry(50, 12, 1),
				Physijs.createMaterial(
			new THREE.MeshBasicMaterial( {map: tweetText, side: THREE.DoubleSide} ), 0.8, 0
			), 0
			);
			
		scene.add(tweetMesh);
		tweetMesh.position.set(x,y + 30, z);
		tweetMesh.__dirtyPosition = true;
		

	};

	TweetStructure.prototype.CreateConnection = function(obj1,obj2){

		console.log(obj1.position);
		console.log(obj2.position);
		//var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 1.0 } ) );
		var material = new THREE.LineBasicMaterial({
		color: 0xffffff
		});

		var geometry = new THREE.Geometry();
		geometry.vertices.push(
			obj1.position, obj2.position
		);

	 var line = new THREE.Line( geometry, material );
	
	//line.verticesNeedUpdate = true;
	
	scene.add(line);
	line.position.set(obj1.position.x,obj2.position.y - obj1.position.y,obj1.position.z);
	}

