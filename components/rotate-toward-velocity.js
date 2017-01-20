/* global AFRAME, THREE */

/**
 
 */
AFRAME.registerComponent('rotate-toward-velocity', {
    schema: {},
    tick: function(time, delta) {
        var body = this.el.body;
        var obj3D = this.el.object3D;
        var aimP = new THREE.Vector3();
        var velocity = new THREE.Vector3();
        velocity.copy(body.velocity);
        aimP.copy(body.position).sub(velocity);
        obj3D.lookAt(aimP);
        body.quaternion.copy(obj3D.quaternion);
    },
    drawDebugLookAt: function(aimP) {
        // for visualizing the lookat
        // geometry = new THREE.BoxGeometry( 0.1,0.1,0.1);
        // material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
        // mesh = new THREE.Mesh( geometry, material );
        // mesh.position.copy(aimP);
        // var scene = document.getElementById('scene').object3D;
        // scene.add( mesh );
    }

});