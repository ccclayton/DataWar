/**
 * @author:Travis Bennett
 */

"use strict";
var modelLoader = function (modelFiles, callback, scope) {

    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
        }
    };

    var onError = function (xhr) {
    };

    var loader;
    if (modelFiles[0].split('.').pop() == "obj") {
        THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
        loader = new THREE.OBJMTLLoader();
        loader.load(modelFiles[0], modelFiles[1], function (object) {
            callback(object, scope);
        }, onProgress, onError);
    }
    else if (modelFiles[0].split('.').pop() == "stl") {
        loader = new THREE.STLLoader();
        loader.load(modelFiles[0], function (event) {
            var geometry = event;
            var material = new THREE.MeshPhongMaterial();
            var stlmesh = new THREE.Mesh(geometry, material);
            callback(stlmesh, scope);
        }, onProgress, onError);
    }
};