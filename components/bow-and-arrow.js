/* global AFRAME */

/**
 */
AFRAME.registerComponent('bow-and-arrow', {
  // schema: {},
  init: function() {
    console.log('init bow')
    this.arrow = null;

    var entity = document.createElement('a-entity');
    entity.id = "bow";
    entity.setAttribute('obj-model', 'obj: #bow-obj; mtl: #bow-mtl')
    entity.setAttribute('scale', '0.1 0.1 0.1');
    entity.setAttribute('rotation', '0 0 0');
    this.el.appendChild(entity);
    this.onTriggerDown = this.onTriggerDown.bind(this);
    this.onTriggerUp = this.onTriggerUp.bind(this);
  },

  play: function() {
    var el = this.el;
    el.addEventListener('spawnArrow', this.spawnArrow);
    el.addEventListener('shootArrow', this.shootArrow);

  },

  pause: function() {
    var el = this.el;
    el.removeEventListener('spawnArrow', this.spawnArrow);
    el.removeEventListener('shootArrow', this.shootArrow);

  },
  onTriggerUp: function(evt) {

    console.log('trigger up event', evt);

    var vector = new THREE.Vector3(); // create once and reuse it!

    this.el.object3D.getWorldDirection(vector);

    console.log('vector at trigger up', vector)
  },

  onTriggerDown: function(evt) {
    console.log('trigger down event', evt);

  },


  shootArrow: function(evt) {
    this.arrow.body.applyImpulse(
      /* impulse */
      new CANNON.Vec3(0, 1, -1),
      /* world position */
      new CANNON.Vec3().copy(arrow.getAttribute('position'))
    );

  },

  spawnArrow: function() {
    var _t = this;
    var el = this.el;
    var entity = document.createElement('a-entity');
    entity.setAttribute('obj-model', 'obj: #arrow-obj; mtl: #arrow-mtl')

    var matrixWorld = el.object3D.matrixWorld;
    var position = new THREE.Vector3();
    var rotation = el.getAttribute('rotation');
    var entityRotation;

    position.setFromMatrixPosition(matrixWorld);
    entity.setAttribute('position', position);

    // Have the spawned entity face the same direction as the entity.
    // Allow the entity to further modify the inherited rotation.
    entity.addEventListener('loaded', function() {
      entityRotation = entity.getAttribute('rotation');
      entity.setAttribute('rotation', {
        x: entityRotation.x + rotation.x,
        y: entityRotation.y + rotation.y,
        z: entityRotation.z + rotation.z
      });
    });

    el.appendChild(entity);

    _t.arrow = entity;

    entity.addEventListener('collide', function(e) {
      handleArrowCollision(e);
    });

  },

  handleArrowCollision: function(e) {
    var _t = this;
    console.log('Arrow has collided with body #' + e.detail.body.id);

    e.detail.target.el; // Original entity (playerEl).
    e.detail.body.el; // Other entity, which playerEl touched.
    e.detail.contact; // Stats about the collision (CANNON.ContactEquation).
    e.detail.contact.ni; // Normal (direction) of the collision (CANNON.Vec3).
  },

  getShotForce: function() {
    //measure the distance between the arrow hand and the nock
    var arrowHandPosition;
    var nockPosition;

    var difference = nockPosition.distanceTo(arrowHandPosition);

    return difference;
  },

  tick: function() {

  },

});

// quat example
//http://jsfiddle.net/steveow/9a5465p6/12/


// vibrateController: function() {
//   var gamepads = navigator.getGamepads();
//   for (var i = 0; i < gamepads.length; ++i) {
//     var gamepad = gamepads[i];
//     // The array may contain undefined gamepads, so check for that as
//     // well as a non-null pose.
//     if (gamepad) {
//       if (gamepad.pose)


//         if ("hapticActuators" in gamepad && gamepad.hapticActuators.length > 0) {
//         for (var j = 0; j < gamepad.buttons.length; ++j) {
//           if (gamepad.buttons[j].pressed) {
//             // Vibrate the gamepad using to the value of the button as
//             // the vibration intensity.
//             gamepad.hapticActuators[0].pulse(gamepad.buttons[j].value, 100);
//             break;
//           }
//         }
//       }
//     }
//   }

// }