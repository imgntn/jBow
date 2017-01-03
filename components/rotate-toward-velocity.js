/* global AFRAME, THREE */

/**
 
 */
AFRAME.registerComponent('rotate-toward-velocity', {
      schema: {},

      tick: function(time, delta) {
        var body = this.el.body;
        var obj3D = this.el.object3D;

        var aimP = new THREE.Vector3();
        aimP.copy(body.position).sub(body.velocity).negate();
        obj3D.lookAt(aimP);
        body.quaternion.copy(obj3D.quaternion);
      }

      });