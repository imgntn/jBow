/* global AFRAME */

/**
 */
AFRAME.registerComponent('bow-and-arrow', {
  // schema: {},
  init: function() {
    console.log('init bow')
    this.arrow = null;
    this.primaryHand = null;

    var entity = document.createElement('a-entity');
    entity.id = "bow";
    entity.setAttribute('obj-model', 'obj: #bow-obj; mtl: #bow-mtl')
    entity.setAttribute('scale', '0.1 0.1 0.1');
    entity.setAttribute('rotation', '0 0 0');
    this.el.appendChild(entity);

    this.spawnArrow = this.spawnArrow.bind(this);
    this.shootArrow = this.shootArrow.bind(this);
    this.setPrimaryHand = this.setPrimaryHand.bind(this);
    this.freeHands = this.freeHands.bind(this);

  },

  play: function() {
    var el = this.el;
    el.addEventListener('spawnArrow', this.spawnArrow);
    el.addEventListener('shootArrow', this.shootArrow);
    el.addEventListener('setPrimaryHand', this.setPrimaryHand);
    el.addEventListener('freeHands', this.freeHands);
  },

  pause: function() {
    var el = this.el;
    el.removeEventListener('spawnArrow', this.spawnArrow);
    el.removeEventListener('shootArrow', this.shootArrow);
    el.removeEventListener('setPrimaryHand', this.setPrimaryHand);
    el.removeEventListener('freeHands', this.freeHands);
  },

  setPrimaryHand: function(evt) {
    this.primaryHand = evt.detail.hand;
    console.log('primaryHand is', this.primaryHand)
  },

  freeHands: function(evt) {
    if (this.primaryHand === null || this.primaryHand === evt.detail.hand) {
      this.primaryHand = null;
    }

  },


  spawnArrow: function(evt) {
    if (this.primaryHand === null || this.primaryHand === evt.detail.hand) {
      return;
    }
    console.log('SPAWN ARROW EVT', evt)

    var _t = this;


    var bow = document.querySelector('#bow')
    var el = bow;
    var entity = document.createElement('a-entity');
    entity.className = "arrow"
    var matrixWorld = el.object3D.matrixWorld;
    var position = new THREE.Vector3();
    var rotation = el.getAttribute('rotation');
    var entityRotation;

    position.setFromMatrixPosition(matrixWorld);
    console.log('position is:', position)

    // Have the spawned entity face the same direction as the entity.
    // Allow the entity to further modify the inherited rotation.
    entity.addEventListener('loaded', function() {
      console.log('entity loaded', entity)

      entity.setAttribute('obj-model', 'obj: #arrow-obj; mtl: #arrow-mtl')
      entity.setAttribute('scale', '0.05 0.05 0.05');
      entityRotation = entity.getAttribute('rotation');
      entity.setAttribute('rotation', {
        x: entityRotation.x + rotation.x,
        y: entityRotation.y + rotation.y,
        z: entityRotation.z + rotation.z
      });
    });

    var scene = document.querySelector('a-scene')

    bow.appendChild(entity);

    _t.arrowInBow = entity;

  },

  shootArrow: function(evt) {
    var _t=this;
    //dont shoot if its the trigger on the primary hand
    if (this.primaryHand === null || this.primaryHand === evt.detail.hand) {
      return;
    }
    var scene = document.getElementById('scene');
    var force = this.getShotForce();
    var bow = document.querySelector('#bow');

    // var arrow = document.createElement('a-entity');
    // arrow.className = "arrow"
    var matrixWorld = bow.object3D.matrixWorld;
    var bowPosition = new THREE.Vector3();
    bowPosition.setFromMatrixPosition(matrixWorld);

    var rotation = bow.getAttribute('rotation');

    var arrow = scene.components.pool__arrow.requestEntity();
    arrow.className = "arrow";
    arrow.setAttribute('position', bowPosition);

    var shotDirection = bow.object3D.getWorldDirection();
    shotDirection.normalize().negate();
    shotDirection.multiplyScalar(force * 30)

    console.log('shot info:', {
      shotDirection: shotDirection,
      bowPosition: bowPosition,
      force: force
    })

    arrow.addEventListener('collide', function(e) {
      _t.handleArrowCollision(e, arrow);
    })

    arrow.play()
    this.vibrateController();
    arrow.body.applyImpulse(
      /* impulse */
      new CANNON.Vec3().copy(shotDirection),
      /* world position */
      new CANNON.Vec3().copy(arrow.getAttribute('position'))
    );

    arrow.setAttribute('rotate-toward-velocity')


    bow.removeChild(this.arrowInBow);

  },

  getShotForce: function() {
    //measure the distance between the arrow hand and the nock

    var nock = document.querySelector("#bow");
    var nockObj = nock.object3D;

    var matrixWorld = nockObj.matrixWorld;
    var nockPosition = new THREE.Vector3();
    nockPosition.setFromMatrixPosition(matrixWorld);

    var arrowHandPosition;
    var handSelector;
    if (this.primaryHand === 'left') {
      handSelector = '#rightHand'
    }
    if (this.primaryHand === 'right') {
      handSelector = '#leftHand'
    }

    var arrowHand = document.querySelector(handSelector).object3D

    var matrixWorld = arrowHand.matrixWorld;
    var arrowHandPosition = new THREE.Vector3();
    arrowHandPosition.setFromMatrixPosition(matrixWorld);

    var difference = nockPosition.distanceTo(arrowHandPosition);
    console.log('difference::: ', difference);

    return difference;
  },

  destroyArrow: function() {
    //if shot is under minimum threshold for force, then just delete the arrow
  },

  tick: function() {
    //keep the arrow with the bow

  },

  vibrateController: function() {
    console.log('vibrate controller')
    var gamepads = navigator.getGamepads();
    for (var i = 0; i < gamepads.length; ++i) {
      var gamepad = gamepads[i];
      // The array may contain undefined gamepads, so check for that as
      // well as a non-null pose.
      if (gamepad) {
        if (gamepad.pose)

          console.log('vibrate controller 2')
        if ("hapticActuators" in gamepad && gamepad.hapticActuators.length > 0) {
           console.log('vibrate controller 3')
          for (var j = 0; j < gamepad.buttons.length; ++j) {
            if (gamepad.buttons[j].pressed) {
              console.log('vibrate controller 4')
                // Vibrate the gamepad using to the value of the button as
                // the vibration intensity.
              gamepad.hapticActuators[0].pulse(gamepad.buttons[j].value, 100);
              break;
            }
          }
        }
      }
    }

  },
 handleArrowCollision:function(e, arrow) {
  console.log('Arrow has collided with body #' + e.detail.body.id);

  //should try to see if cannon differentiates between start collision etc.
  // but if u return to pool to soon, crash
  // so gotta set a timeout
  // but many collisions can happen before that timeout.
   if(arrow.getAttribute('didCollide')==='yes'){
    console.log('already collided arrow')
    return
   }
  else{
    arrow.setAttribute('didCollide','yes')
  }

  var scene = document.getElementById('scene');
  arrow.removeAttribute('rotate-toward-velocity')
  arrow.removeAttribute('dynamic-body')

  setTimeout(function removeArrow() {
     arrow.setAttribute('didCollide','no')
    scene.components.pool__arrow.returnEntity(arrow);
  }, 0)

  // e.detail.target.el; // Original entity (playerEl).
  // e.detail.body.el; // Other entity, which playerEl touched.
  // e.detail.contact; // Stats about the collision (CANNON.ContactEquation).
  // e.detail.contact.ni; // Normal (direction) of the collision (CANNON.Vec3).
}


});


// quat example
//http://jsfiddle.net/steveow/9a5465p6/12/