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
    entity.setAttribute('rotation', '0 0 0 ');
    this.el.appendChild(entity);

    this.spawnArrow = this.spawnArrow.bind(this);
    this.shootArrow = this.shootArrow.bind(this);
    this.setPrimaryHand = this.setPrimaryHand.bind(this);
    this.freeHands = this.freeHands.bind(this);
    var arrow = document.getElementById('preShotArrow');
    entity.appendChild(arrow);
    this.preShotArrow = arrow;
    this.forceThreshold=0.2;
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
    this.primaryHandElement = document.getElementById(evt.detail.hand + 'Hand')
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

    this.preShotArrow.setAttribute('visible', true)

  },

  shootArrow: function(evt) {
    var _t = this;
    //dont shoot if its the trigger on the primary hand
    if (this.primaryHand === null || this.primaryHand === evt.detail.hand) {
      return;
    }
    var force = this.getShotForce();
    if (force < this.forceThreshold) {
      this.destroyArrow();
      return;
    }

    var scene = document.getElementById('scene');

    var bow = document.getElementById('bow');

    var bowPosition = bow.object3D.getWorldPosition();

    var arrow = scene.components.pool__arrow.requestEntity();

    arrow.className = "arrow";
    arrow.setAttribute('position', bowPosition);

    arrow.addEventListener('collide', function(e) {
      _t.handleArrowCollision(e, arrow);
    })

    arrow.addEventListener('body-loaded', function(e) {
      console.log('GOT A BODY NOW')
    })    

    var shotDirection = bow.object3D.getWorldDirection();

    shotDirection
      .negate()

    var arrowHelper = new THREE.ArrowHelper(shotDirection, bowPosition, 5, 0x884400);
    scene.object3D.add(arrowHelper)
     var bowRotation = bow.object3D.getWorldQuaternion();
     arrow.object3D.quaternion.copy(bowRotation)
     arrow.play();
     arrow.body.quaternion.copy(bowRotation)
    //    arrow.body.applyImpulse(
    //   /* impulse */
    //   new CANNON.Vec3().copy(shotDirection),
    //   /* world position */
    //   new CANNON.Vec3().copy(bowPosition)
    // );
            // arrow.setAttribute('rotate-toward-velocity', '')



    // console.log('shot info:', {
    //   shotDirection: shotDirection,
    //   bowPosition: bowPosition,
    //   force: force
    // })
    //arrow.play()
    console.log('arrow body?3',arrow.body)

    this.vibrateController();
    this.destroyArrow();

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
    this.preShotArrow.setAttribute('visible', false)

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
  handleArrowCollision: function(e, arrow) {
    console.log('Arrow has collided with body #' + e.detail.body.id);

    //should try to see if cannon differentiates between start collision etc.
    // but if u return to pool to soon, crash
    // so gotta set a timeout
    // but many collisions can happen before that timeout.
    if (arrow.getAttribute('didCollide') === 'yes') {
      console.log('already collided arrow')
      return
    } else {
      arrow.setAttribute('didCollide', 'yes')
    }

    var scene = document.getElementById('scene');
    arrow.removeAttribute('rotate-toward-velocity')
    arrow.removeAttribute('dynamic-body')

    setTimeout(function removeArrow() {
      arrow.setAttribute('didCollide', 'no')
      scene.components.pool__arrow.returnEntity(arrow);
    }, 0)

    // e.detail.target.el; // Original entity (playerEl).
    // e.detail.body.el; // Other entity, which playerEl touched.
    // e.detail.contact; // Stats about the collision (CANNON.ContactEquation).
    // e.detail.contact.ni; // Normal (direction) of the collision (CANNON.Vec3).
  },

  tester: function() {
    var spawnLocation = new THREE.Vector3(0, 1, 0);
    this.shootArrow();
  }


});


// quat example
//http://jsfiddle.net/steveow/9a5465p6/12/