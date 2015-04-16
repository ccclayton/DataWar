
function TweetPanel(tweet,position) //don't need scene anymore
// Need to add physics.
{
	return this.NewTweet(tweet, position);
}



TweetPanel.prototype.NewTweet = function(tweet,position){

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

	tweetMesh.position.set(position.x,position.y,position.z);
	tweetMesh._dirtyPosition = true;

	return tweetMesh;
};


