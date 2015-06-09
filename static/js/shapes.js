/**
 * @author: Weidong Yang
 * @author: Travis Bennett
 */

var Shapes = function () {

};

Shapes.prototype.plusGeometry = function (w, h, thickness, radius, depth) {

    var rectangleW = new THREE.Shape();
    var x = w;
    var y = ((h - thickness) / 2) - h / 2;
    var width = w;
    var height = thickness;
    rectangleW.moveTo(x + radius, y);
    rectangleW.lineTo(x + width - radius, y);
    rectangleW.quadraticCurveTo(x + width, y, x + width, y + radius);
    rectangleW.lineTo(x + width, y + height - radius);
    rectangleW.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    rectangleW.lineTo(x + radius, y + height);
    rectangleW.quadraticCurveTo(x, y + height, x, y + height - radius);
    rectangleW.lineTo(x, y + radius);
    rectangleW.quadraticCurveTo(x, y, x + radius, y);

    var rectangleH = new THREE.Shape();
    var x = ((w - thickness) / 2) + w;
    var y = -h / 2;
    var width = thickness;
    var height = h;
    rectangleH.moveTo(x + radius, y);
    rectangleH.lineTo(x + width - radius, y);
    rectangleH.quadraticCurveTo(x + width, y, x + width, y + radius);
    rectangleH.lineTo(x + width, y + height - radius);
    rectangleH.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    rectangleH.lineTo(x + radius, y + height);
    rectangleH.quadraticCurveTo(x, y + height, x, y + height - radius);
    rectangleH.lineTo(x, y + radius);
    rectangleH.quadraticCurveTo(x, y, x + radius, y);

    var extrudeSettings = {amount: depth}; // bevelSegments: 2, steps: 2 , bevelSegments: 5, bevelSize: 8, bevelThickness:5
    extrudeSettings.bevelEnabled = false;

    return new THREE.ExtrudeGeometry([rectangleW, rectangleH], extrudeSettings);
};

Shapes.prototype.circlePlusGeometry = function (w, h, thickness, radius, depth) {

    var rectangleW = new THREE.Shape();
    var x = -(w / 2);
    var y = ((h - thickness) / 2) - h / 2;
    var width = w;
    var height = thickness;
    rectangleW.moveTo(x + radius, y);
    rectangleW.lineTo(x + width - radius, y);
    rectangleW.quadraticCurveTo(x + width, y, x + width, y + radius);
    rectangleW.lineTo(x + width, y + height - radius);
    rectangleW.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    rectangleW.lineTo(x + radius, y + height);
    rectangleW.quadraticCurveTo(x, y + height, x, y + height - radius);
    rectangleW.lineTo(x, y + radius);
    rectangleW.quadraticCurveTo(x, y, x + radius, y);

    var rectangleH = new THREE.Shape();
    var x = ((w - thickness) / 2) - (w / 2);
    var y = -h / 2;
    var width = thickness;
    var height = h;
    rectangleH.moveTo(x + radius, y);
    rectangleH.lineTo(x + width - radius, y);
    rectangleH.quadraticCurveTo(x + width, y, x + width, y + radius);
    rectangleH.lineTo(x + width, y + height - radius);
    rectangleH.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    rectangleH.lineTo(x + radius, y + height);
    rectangleH.quadraticCurveTo(x, y + height, x, y + height - radius);
    rectangleH.lineTo(x, y + radius);
    rectangleH.quadraticCurveTo(x, y, x + radius, y);

    var radius = w * 0.65;
    var thickness = 5;

    //circle
    var moveX = radius;
    var arcX = 0;
    var arcShape = new THREE.Shape();
    arcShape.moveTo(moveX, 0);
    arcShape.absarc(arcX, 0, radius, 0, Math.PI * 2, false);

    var holePath = new THREE.Path();
    holePath.moveTo(moveX, 0);
    holePath.absarc(arcX, 0, radius - thickness, 0, Math.PI * 2, true);
    arcShape.holes.push(holePath);

    var extrudeSettings = {amount: depth}; // bevelSegments: 2, steps: 2 , bevelSegments: 5, bevelSize: 8, bevelThickness:5
    extrudeSettings.bevelEnabled = false;

    return new THREE.ExtrudeGeometry([rectangleW, rectangleH, arcShape], extrudeSettings);
};

Shapes.prototype.chatBubbleGeometry = function (radius, depth, style) {

    var arcShape = new THREE.Shape();
    var triangle = new THREE.Shape();
    if (style == "left") {
        arcShape.absarc(radius, radius / 0.825, radius, 0, Math.PI * 2, false);//aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise

        triangle.moveTo(radius / 4, 0);
        triangle.lineTo(radius / 2, radius);
        triangle.moveTo(radius, radius);
        triangle.lineTo(radius, radius / 3);
    } else if (style == "right") {
        arcShape.absarc(radius, radius / 0.825, radius, 0, Math.PI * 2, false);//aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise

        triangle.moveTo(radius, radius * 0.35);
        triangle.lineTo(radius * 1.75, 0);
        triangle.moveTo(radius * 1.54, radius);
        triangle.lineTo(radius, radius);
    }

    var extrudeSettings = {amount: depth}; // bevelSegments: 2, steps: 2 , bevelSegments: 5, bevelSize: 8, bevelThickness:5
    extrudeSettings.bevelEnabled = false;

    return new THREE.ExtrudeGeometry([arcShape, triangle], extrudeSettings);
};

Shapes.prototype.circle = function (radius, depth) {

    //circle
    var arcShape = new THREE.Shape();
    arcShape.moveTo(radius, 0);
    arcShape.absarc(0, 0, radius, 0, Math.PI * 2, false);

    var holePath = new THREE.Path();
    holePath.moveTo(radius, 0);
    holePath.absarc(0, 0, radius - 0.15, 0, Math.PI * 2, true);
    arcShape.holes.push(holePath);

    var extrudeSettings = {amount: depth}; // bevelSegments: 2, steps: 2 , bevelSegments: 5, bevelSize: 8, bevelThickness:5
    extrudeSettings.bevelEnabled = false;

    return new THREE.ExtrudeGeometry([arcShape], extrudeSettings);
};

Shapes.prototype.disc = function (radius, depth) {
    //circle
    var moveX = radius;
    var arcX = 0;
    var arcShape = new THREE.Shape();
    arcShape.moveTo(moveX, 0);
    arcShape.absarc(arcX, 0, radius, 0, Math.PI * 2, false);

    var extrudeSettings = {amount: depth}; // bevelSegments: 2, steps: 2 , bevelSegments: 5, bevelSize: 8, bevelThickness:5
    extrudeSettings.bevelEnabled = false;

    return new THREE.ExtrudeGeometry([arcShape], extrudeSettings);
};

Shapes.prototype.roundedGeometry = function (w, h, radius) {
    var roundedRect = new THREE.Shape();
    roundedRect.moveTo(radius, 0);
    roundedRect.lineTo(w - radius, 0);
    roundedRect.quadraticCurveTo(w, 0, w, radius);
    roundedRect.lineTo(w, h - radius);
    roundedRect.quadraticCurveTo(w, h, w - radius, h);
    roundedRect.lineTo(radius, h);
    roundedRect.quadraticCurveTo(0, h, 0, h - radius);
    roundedRect.lineTo(0, radius);
    roundedRect.quadraticCurveTo(0, 0, radius, 0);

    var extrudeSettings = {amount: 0.1}; // bevelSegments: 2, steps: 2 , bevelSegments: 5, bevelSize: 8, bevelThickness:5
    extrudeSettings.bevelEnabled = false;

    return new THREE.ExtrudeGeometry(roundedRect, extrudeSettings);
};

Shapes.prototype.tagGeometry = function (w, h, yRaise, radius) {
    var roundedRect = new THREE.Shape();
    roundedRect.moveTo(radius, yRaise);
    roundedRect.lineTo((w / 6) * 2, yRaise);
    roundedRect.lineTo((w / 6) * 3, 0);
    roundedRect.lineTo((w / 6) * 4, yRaise);
    roundedRect.lineTo(w - radius, yRaise);
    roundedRect.quadraticCurveTo(w, yRaise, w, radius + yRaise);
    roundedRect.lineTo(w, (h + yRaise) - radius);
    roundedRect.quadraticCurveTo(w, h + yRaise, w - radius, h + yRaise);
    roundedRect.lineTo(radius, h + yRaise);
    roundedRect.quadraticCurveTo(0, h + yRaise, 0, (h + yRaise) - radius);
    roundedRect.lineTo(0, radius + yRaise);
    roundedRect.quadraticCurveTo(0, yRaise, radius, yRaise);

    var extrudeSettings = {amount: 0.1}; // bevelSegments: 2, steps: 2 , bevelSegments: 5, bevelSize: 8, bevelThickness:5
    extrudeSettings.bevelEnabled = false;

    return new THREE.ExtrudeGeometry(roundedRect, extrudeSettings);
};

Shapes.prototype.squareGeometry = function (w, h, radius, depth) {
    var roundedRect = new THREE.Shape();
    roundedRect.moveTo(0, 0);
    roundedRect.lineTo(w, 0);
    roundedRect.lineTo(w, h);
    roundedRect.lineTo(0, h);
    roundedRect.lineTo(0, 0);

    var extrudeSettings = {amount: depth}; // bevelSegments: 2, steps: 2 , bevelSegments: 5, bevelSize: 8, bevelThickness:5
    extrudeSettings.bevelEnabled = false;

    return new THREE.ExtrudeGeometry(roundedRect, extrudeSettings);
};

Shapes.prototype.squareTagGeometry = function (w, h, yRaise, radius, depth) {
    var roundedRect = new THREE.Shape();
    roundedRect.moveTo(0, yRaise);
    roundedRect.lineTo((w / 6) * 2, yRaise);
    roundedRect.lineTo((w / 6) * 3, 0);
    roundedRect.lineTo((w / 6) * 4, yRaise);
    roundedRect.lineTo(w, yRaise);

    roundedRect.lineTo(w, (h + yRaise));

    roundedRect.lineTo(0, h + yRaise);

    roundedRect.lineTo(0, yRaise);


    var extrudeSettings = {amount: depth}; // bevelSegments: 2, steps: 2 , bevelSegments: 5, bevelSize: 8, bevelThickness:5
    extrudeSettings.bevelEnabled = false;

    return new THREE.ExtrudeGeometry(roundedRect, extrudeSettings);
};

Shapes.prototype.thoughtGeometry = function (w, h, radius) {
    var roundedRect = new THREE.Shape();
    roundedRect.moveTo(radius, 0);
    roundedRect.lineTo(w - radius, 0);
    roundedRect.quadraticCurveTo(w, 0, w, radius);
    roundedRect.lineTo(w, h - radius);
    roundedRect.quadraticCurveTo(w, h, w - radius, h);
    roundedRect.lineTo(radius, h);
    roundedRect.quadraticCurveTo(0, h, 0, h - radius);
    roundedRect.lineTo(0, radius);
    roundedRect.quadraticCurveTo(0, 0, radius, 0);

    var extrudeSettings = {amount: 0.1}; // bevelSegments: 2, steps: 2 , bevelSegments: 5, bevelSize: 8, bevelThickness:5
    extrudeSettings.bevelEnabled = false;

    return new THREE.ExtrudeGeometry(roundedRect, extrudeSettings);
};

Shapes.prototype.heartGeometry = function () {
    var x = 0, y = 0;

    var heartShape = new THREE.Shape();
    var scale = 0.05;
    heartShape.moveTo(25 * scale, 25 * scale);
    heartShape.bezierCurveTo(25 * scale, 25 * scale, 20 * scale, 0 * scale, 0 * scale, 0 * scale);
    heartShape.bezierCurveTo(-30 * scale, 0 * scale, -30 * scale, 35 * scale, -30 * scale, 35 * scale);
    heartShape.bezierCurveTo(-30 * scale, 55 * scale, -10 * scale, 77 * scale, 25 * scale, 95 * scale);
    heartShape.bezierCurveTo(60 * scale, 77 * scale, 80 * scale, 55 * scale, 80 * scale, 35 * scale);
    heartShape.bezierCurveTo(80 * scale, 35 * scale, 80 * scale, 0 * scale, 50 * scale, 0 * scale);
    heartShape.bezierCurveTo(35 * scale, 0 * scale, 25 * scale, 25 * scale, 25 * scale, 25 * scale);

    var extrudeSettings = {amount: 0.1}; // bevelSegments: 2, steps: 2 , bevelSegments: 5, bevelSize: 8, bevelThickness:5
    extrudeSettings.bevelEnabled = false;

    return new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
};

Shapes.prototype.arrowGeometry = function (w, h, depth) {
    var arrowhead = new THREE.Shape();

    arrowhead.moveTo(0, 0);
    arrowhead.lineTo(w / 2, h / 2);
    arrowhead.lineTo(-w / 2, h / 2);

    var arrowshaft = new THREE.Shape();
    arrowshaft.moveTo(w / 5 - w / 2, h / 2);
    arrowshaft.lineTo((w - w / 5) - w / 2, h / 2);
    arrowshaft.lineTo((w - w / 5) - w / 2, h);
    arrowshaft.lineTo((w / 5) - w / 2, h);

    var extrudeSettings = {amount: depth}; // bevelSegments: 2, steps: 2 , bevelSegments: 5, bevelSize: 8, bevelThickness:5
    extrudeSettings.bevelEnabled = false;

    return new THREE.ExtrudeGeometry([arrowhead, arrowshaft], extrudeSettings);
}

Shapes.prototype.targetGeometry = function (outerRadius, innerRadius, thickness, depth) {

    //circle
    var circleShape = new THREE.Shape();
    circleShape.moveTo(outerRadius, 0);
    circleShape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);

    var holePath = new THREE.Path();
    holePath.moveTo(outerRadius, 0);
    holePath.absarc(0, 0, outerRadius - thickness, 0, Math.PI * 2, true);
    circleShape.holes.push(holePath);

    var discShape = new THREE.Shape();
    discShape.moveTo(innerRadius, 0);
    discShape.absarc(0, 0, innerRadius, 0, Math.PI * 2, false);

    var extrudeSettings = {amount: depth}; // bevelSegments: 2, steps: 2 , bevelSegments: 5, bevelSize: 8, bevelThickness:5
    extrudeSettings.bevelEnabled = false;

    return new THREE.ExtrudeGeometry([circleShape, discShape], extrudeSettings);
};


Shapes.prototype.assignUVs = function (geometry) {
    geometry.computeBoundingBox();

    var max = geometry.boundingBox.max;
    var min = geometry.boundingBox.min;

    var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
    var range = new THREE.Vector2(max.x - min.x, max.y - min.y);

    geometry.faceVertexUvs[0] = [];
    var faces = geometry.faces;

    for (var i = 0; i < geometry.faces.length; i++) {

        var v1 = geometry.vertices[faces[i].a];
        var v2 = geometry.vertices[faces[i].b];
        var v3 = geometry.vertices[faces[i].c];

        geometry.faceVertexUvs[0].push([
            new THREE.Vector2(( v1.x + offset.x ) / range.x, ( v1.y + offset.y ) / range.y),
            new THREE.Vector2(( v2.x + offset.x ) / range.x, ( v2.y + offset.y ) / range.y),
            new THREE.Vector2(( v3.x + offset.x ) / range.x, ( v3.y + offset.y ) / range.y)
        ]);

    }

    geometry.uvsNeedUpdate = true;
};

