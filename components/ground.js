/* global AFRAME, THREE */

/**
 * Loads and setup ground model.
 */
AFRAME.registerComponent('ground', {
  init: function () {
    console.log('loading ground')
    var objectLoader;
    var object3D = this.el.object3D;
    var MODEL_URL = 'assets/models/ground.json';
    if (this.objectLoader) { 
 console.log('no object loader')
      return; }
    objectLoader = this.objectLoader = new THREE.ObjectLoader();
    objectLoader.crossOrigin = '';
    objectLoader.load(MODEL_URL, function (obj) {
      obj.children.forEach(function (value) {
        value.receiveShadow = true;
        value.material.shading = THREE.FlatShading;
      });
      object3D.add(obj);
    });
  }
});
