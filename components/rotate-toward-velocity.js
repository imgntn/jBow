/* global AFRAME, THREE */

/**

 */
AFRAME.registerComponent('rotate-toward-velocity', {
  schema: {
  },

  init: function () {

  },

  update: function () {

  },

  tick:function(time,delta){
    var body = this.el.body;
    console.log('body is::',body)

    var velocityCannon =  body.velocity;
    var quatCannon = body.quaternion;
    var velocityThree = new THREE.Vector3();
    velocityThree.copy(velocityCannon)
    var quatThree = new THREE.Quaternion();
    quatThree.copy(quatCannon)
    var vFrom;
    var vTo;

    quatThree.setFromUnitVectors(vFrom,vTo)
// if (dir != Vector3.zero) {
//     transform.rotation = Quaternion.Slerp(
//         transform.rotation,
//         Quaternion.LookRotation(dir),
//         Time.deltaTime * rotationSpeed
//     );
// }

    // transform.rotation = Quaternion.LookRotation(vel);

    //         myArrow.transform.forward =
    // Vector3.Slerp(myArrow.transform.forward, myArrow.rigidbody.velocity.normalized, Time.deltaTime);

  }
});
