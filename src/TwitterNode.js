var geomFlag;//global
function TwitterNode(username,geometry,geometryType,position,mass) 

{
	this.username = username;
	this.geometry = geometry;
	this.geometryType = geometryType;
	this.position = position;
	this.mass = mass;

	if((this.geometryType == null && this.geometry == null) || (this.geometryType.toUpperCase() == "default".toUpperCase() && this.geometry == null)){
		this.geomFlag = 0; //Default
	}
	else if(this.geometryType.toUpperCase() == "Cube".toUpperCase() || this.geometryType.toUpperCase() == "Box".toUpperCase()){
		this.geomFlag = 2; //CubeGeometry, BoxGeometry, BoxMesh
	}
	else if(this.geometryType.toUpperCase() == "Sphere".toUpperCase()){
		this.geomFlag = 3; //SphereGeometry, SphereMesh
	}
	else if(this.geometryType.toUpperCase() == "Cylinder".toUpperCase() || this.geometryType.toUpperCase() == "Cone".toUpperCase() || this.geometryType.toUpperCase() == "Capsule".toUpperCase()){
		this.geomFlag = 4; //CylinderGeometry, ConeMesh,CapsuleMesh
	}
	else if(this.geometryType.toUpperCase() == "Convex".toUpperCase()){
		this.geomFlag = 5; //ConvexMesh
	}
	else if(this.geometryType.toUpperCase() == "Concave".toUpperCase()){
		this.geomFlag = 6; //ConcaveMesh
	}
	else{
		this.geomFlag = 1;

	}

	//console.log(geomFlag); //Debugging.

	return this.createNode(this.username,this.geometry,this.geometryType,this.position,this.mass); //returns Node "object".

}

TwitterNode.prototype.createNode = function(username,geometry,geometryType,position,mass){

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

	//NEED A SWITCH CASE FOR CASE OF DIFFERENT TYPES OF GEOMETRY/Meshes
	var mesh;
	switch(geomFlag){
	case 1:
		alert("Error at creation of node.");
		break;
	case 2:
		mesh = new Physijs.BoxMesh(
				geometry,
				Physijs.createMaterial(
						new THREE.MeshBasicMaterial( {map: tweeterTexture, side: THREE.DoubleSide} ), 0.9, 0
						), mass
				);
		break;
	case 3:
		mesh = new Physijs.SphereMesh(
				geometry,
				Physijs.createMaterial(
						new THREE.MeshBasicMaterial( {map: tweeterTexture, side: THREE.DoubleSide} ), 0.9, 0
						), mass
				);

		break;
	case 4:    //NEED TO FIX PHYSICS. CYLINDER WILL CURRENTLY FALL OVER AND ROLL AWAY.
		mesh = new Physijs.CylinderMesh(
				geometry,
				Physijs.createMaterial(
						new THREE.MeshBasicMaterial( {map: tweeterTexture, side: THREE.DoubleSide} ), 0.9, 0
						), mass
				);      
		break;
	case 5:
		mesh = new Physijs.ConvexMesh(
				geometry,
				Physijs.createMaterial(
						new THREE.MeshBasicMaterial( {map: tweeterTexture, side: THREE.DoubleSide} ), 0.9, 0
						), mass
				); 
		break;
	case 6:
		mesh = new Physijs.ConcaveMesh(
				geometry,
				Physijs.createMaterial(
						new THREE.MeshBasicMaterial( {map: tweeterTexture, side: THREE.DoubleSide} ), 0.9, 0
						), mass
				); 
		break;
	default:
		geometry = new THREE.SphereGeometry( 6, 32, 32);
		mesh = new Physijs.ConcaveMesh(
				geometry,
				Physijs.createMaterial(
						new THREE.MeshBasicMaterial( {map: tweeterTexture, side: THREE.DoubleSide} ), 0.9, 0
						), mass
				); 

		break;
	}
	mesh.position.set(position.x,position.y,position.z);
	mesh._dirtyPosition = true;

	return mesh;
}


TwitterNode.prototype.getPosition = function(){
	return this.position;
}

