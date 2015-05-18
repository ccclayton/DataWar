
/**
 @author: Weidong Yang, extending from David Piegza implementation

 Implements a graph structure.
 Consists of Graph, Nodes and Edges.


 Nodes:
 Create a new Node with an id. A node has the properties
 id, position and data.

 Example:
 node = new Node(1);
 node.position.x = 100;
 node.position.y = 100;
 node.data.title = "Title of the node";

 The data property can be used to extend the node with custom
 informations. Then, they can be used in a visualization.


 Edges:
 Connects two nodes together.

 Example:
 edge = new Edge(node1, node2);

 An edge can also be extended with the data attribute. E.g. set a
 type like "friends", different types can then be drawn in different ways.


 Graph:

 Parameters:
 options = {
    limit: <int>, maximum number of nodes
  }

 Methods:
 addNode(node) - adds a new node and returns true if the node has been added,
 otherwise false.
 getNode(node_id) - returns the node with node_id or undefined, if it not exist
 addEdge(node1, node2) - adds an edge for node1 and node2. Returns true if the
 edge has been added, otherwise false (e.g.) when the
 edge between these nodes already exist.

 reached_limit() - returns true if the limit has been reached, otherwise false

 */
"use strict";
function Graph(options) {
    this.options = options || {};
    this.nodeSet = {};
    this.nodes = [];
    this.edges = [];
    this.layout;
    this.scene = null;


    if(options!=undefined && options.scene!=undefined) this.scene = options.scene;
    Node.prototype.scene = this.scene;
    Edge.prototype.scene = this.scene;
}
var geometries = [];


Graph.prototype.getOldestNode=function(){
    var n=this.nodes[0];
    for(i=0; i<this.nodes.length; i++){
        if(this.nodes[i].data.date < n.data.date)
            n=this.nodes[i];
    }
    return n;
};

Graph.prototype.getNewestNode=function(){
    var n=this.nodes[0];
    for(i=0; i<this.nodes.length; i++){
        if(this.nodes[i].data.date > n.data.date)
            n=this.nodes[i];
    }
    return n;
};

Graph.prototype.timeSpan=function(){
    var nOld = this.getOldestNode();
    var nNew = this.getNewestNode();
    var span = nNew.data.date - nOld.data.date;
    //console.log("Graph nodes time span is: "+Math.round(span/60000 * 10)/10+"min");
    return span;
};

Graph.prototype.removeOldestNode=function(){
    this.removeNode(this.getOldestNode());
};

Graph.prototype.removeNode = function(node){
    //remove all edges connected to node. delete from this.edges.
    var that = this;
    this.layout.stop_calculating();
    this.nodes.splice(this.nodes.indexOf(node), 1);
    node.connectedEdges.forEach(function(e){
        // debugger;
        that.removeEdge(e, node); //pass current node in to edge to avoid change current node state
    });
    node.kill();
    delete this.nodeSet[node.id];
    this.layout.start_calculating();
};

Graph.prototype.removeAllNodes=function(){
    while(this.nodes.length>0){
        this.removeNode(this.nodes[0]);
    }
};

Graph.prototype.removeAllEdges = function(){
    while(this.edges.length>0){
        this.removeEdge(this.edges[0]);
    }
}

Graph.prototype.removeEdge = function(edge, n_request){
    this.edges.splice(this.edges.indexOf(edge), 1);
    edge.kill(n_request);
}

Graph.prototype.addNode = function(node) {
    if(this.nodeSet[node.id] == undefined && !this.reached_limit()) {
        this.nodeSet[node.id] = node;
        this.nodes.push(node);
        return true;
    }
    return false;
};

Graph.prototype.getNode = function(node_id) {
    return this.nodeSet[node_id];
};

Graph.prototype.addEdge = function(source, target) {
    var edge = new Edge(source, target);
    this.edges.push(edge);
    source.connectedEdges.push(edge);
    target.connectedEdges.push(edge);
    return edge;
};

//For box graph, we separate edges by their log weight, 1, 2, 4, 8, 16, 32 ,...
Graph.prototype.addEdgeWithLogWeight = function(source, target, wgt) {
    if(source.addConnectedTo(target) === true) {
        var edge = new Edge(source, target);
        edge.log_weight = wgt;
        this.edges.push(edge);
        return true;
    }
    return false;
};

Graph.prototype.reached_limit = function() {
    if(this.options.limit != undefined)
        return this.options.limit <= this.nodes.length;
    else
        return false;
};

Graph.prototype.kill = function(){
    this.nodes.length = 0;
    this.edges.length = 0;
    for(var node in this.nodeSet){
        if(this.nodeSet.hasOwnProperty(node)){
            delete this.nodeSet[node];
        }
    }
};

function Node(node_id) {
    this.id = node_id;
    this.nodesTo = [];
    this.nodesFrom = [];
    this.connectedEdges= [];
    this.position = null; //use THREE.Vector3
    this.data = {};
    this.geometry = null;
    this.desired_y = null;
}

Node.prototype.kill = function(){
    var that = this;
    this.scene.remove(this.data.draw_object);
    this.connectedEdges.length = 0;
    this.nodesTo.length = 0;
    this.nodesFrom.length = 0;
    delete this.nodesTo;
    delete this.nodesFrom;
    delete this.position;
    delete this.data;
};

Node.prototype.clearEdgeReference = function(edge){
    var idx = this.connectedEdges.indexOf(edge);
    if(idx>-1)
        this.connectedEdges.splice(idx, 1);
};

Node.prototype.addConnectedTo = function(node) {
    if(this.connectedTo(node) === false) {
        this.nodesTo.push(node);
        return true;
    }
    return false;
};


Node.prototype.connectedTo = function(node) {
    for(var i=0; i < this.nodesTo.length; i++) {
        var connectedNode = this.nodesTo[i];
        if(connectedNode.id == node.id) {
            return true;
        }
    }
    return false;
};

Node.prototype.addConnectedFrom = function(node) {
    if(this.connectedFrom(node) === false) {
        this.nodesFrom.push(node);
        return true;
    }
    return false;
};


Node.prototype.connectedFrom = function(node) {
    for(var i=0; i < this.nodesFrom.length; i++) {
        var connectedNode = this.nodesFrom[i];
        if(connectedNode.id == node.id) {
            return true;
        }
    }
    return false;
};



Node.prototype.show=function(){

};

Node.prototype.hide=function(){

};


function Edge(source, target) {
    this.source = source;
    this.target = target;
    this.data = {};
    this.geometries = [];
    this.line = null;
};

Edge.prototype.kill=function(n_request){ //to avoid self referencing loop, we pass in node that issue the request
    // debugger;
    var that=this;
    this.scene.remove(this.data.draw_object);
    if(n_request != this.source)
        this.source.clearEdgeReference(that);
    if(n_request != this.target)
        this.target.clearEdgeReference(that);
    delete this.data;
}

//Changed by Colin Clayton
Edge.prototype.draw=function(options){
    material = new THREE.LineBasicMaterial({ linewidth: options.linewidth, transparent: true, opacity:options.opacity, color:parseInt(options.color.substr(1),16)});
    //material.transparent = false;
    material.side = THREE.DoubleSide;
    material.needsUpdate = true;
    // material = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 1, linewidth: 1 , vertexColors: THREE.VertexColors});

    var tmp_geo = new THREE.Geometry();
    //console.log("target mesh pos = " + this.target.mesh.position.x + " " + this.target.mesh.position.y);
    tmp_geo.vertices.push(this.source.mesh.position); // was data.draw_object.position
    tmp_geo.vertices.push(this.target.mesh.position);
    this.line = new THREE.Line( tmp_geo, material, THREE.LinePieces );
    this.line.geometry.verticesNeedUpdate = true;
    this.line.geometry.elementsNeedUpdate = true;
    // line = new THREE.Line( tmp_geo, material );
    // var tmpBufferGeo = THREE.BufferGeometryUtils.fromGeometry( tmp_geo );
    // line = new THREE.Line( tmpBufferGeo, material, THREE.LinePieces );


    this.line.scale.x = this.line.scale.y = this.line.scale.z = 1;
    this.line.originalScale = 0.1;


    //this.data.draw_object = line;

    //this.geometries.push(tmp_geo);  //TODO: NEED TO FIX THIS!!
    // bufferGeometries.push(tmpBufferGeo);

    scene.add( this.line );
};

Edge.prototype.show=function(){

};

Edge.prototype.hide=function(){

};




