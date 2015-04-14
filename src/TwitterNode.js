	var geomFlag;//global
	function TwitterNode(username,geometry,geometryType,position,mass) 

	{
		
		if((geometryType == null && geometry == null) || (geometryType.toUpperCase() == "default".toUpperCase() && geometry == null)){
				geomFlag = 0; //Default
			}
			else if(geometryType.toUpperCase() == "Cube".toUpperCase() || geometryType.toUpperCase() == "Box".toUpperCase()){
			geomFlag = 2; //CubeGeometry, BoxGeometry, BoxMesh
		}
		else if(geometryType.toUpperCase() == "Sphere".toUpperCase()){
			geomFlag = 3; //SphereGeometry, SphereMesh
		}
		else if(geometryType.toUpperCase() == "Cylinder".toUpperCase() || geometryType.toUpperCase() == "Cone".toUpperCase() || geometryType.toUpperCase() == "Capsule".toUpperCase()){
			geomFlag = 4; //CylinderGeometry, ConeMesh,CapsuleMesh
		}
		else if(geometryType.toUpperCase() == "Convex".toUpperCase()){
			geomFlag = 5; //ConvexMesh
		}
		else if(geometryType.toUpperCase() == "Concave".toUpperCase()){
			geomFlag = 6; //ConcaveMesh
		}
		else{
			geomFlag = 1;

		}

		console.log(geomFlag); //Debugging.

		return this.createNode(username,geometry,geometryType,position); //returns Node "object".
		
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
			mass = 10000;
			mesh = new Physijs.ConcaveMesh(
				geometry,
				Physijs.createMaterial(
					new THREE.MeshBasicMaterial( {map: tweeterTexture, side: THREE.DoubleSide} ), 0.9, 0
					), mass
				); 

			break;
		}


		return mesh;
	}

	TwitterNode.prototype.setPosition = function(position){
		this.position = position;

	}

	TwitterNode.prototype.getPosition = function(){
		return this.position;
	}

