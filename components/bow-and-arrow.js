/* global AFRAME */

/**
 */
AFRAME.registerComponent('bow-and-arrow', {
  // schema: {},
  init: function() {
    this.arrow = null;
    this.primaryHand = null;

    var entity = document.createElement('a-entity');
    entity.id = "bow";
    entity.setAttribute('obj-model', 'obj: #bow-obj; mtl: #bow-mtl')
    entity.setAttribute('scale', '0.1 0.1 0.1');
    this.el.appendChild(entity);
    this.bow = entity;

    this.spawnArrow = this.spawnArrow.bind(this);
    this.shootArrow = this.shootArrow.bind(this);
    this.setPrimaryHand = this.setPrimaryHand.bind(this);
    this.freeHands = this.freeHands.bind(this);
    var arrow = document.getElementById('preShotArrow');
    entity.appendChild(arrow);
    this.preShotArrow = arrow;

    this.forceThreshold = 0.25;
    this.shotMultiplier = 50;
    this.cooldown = 500;
    this.lastShot = Date.now();

    this.zeroVec = new THREE.Vector3(0, 0, 0);
    this.zeroQuat = new THREE.Quaternion(0, 0, 0, 1);

    this.offsets = {
      bowTop: {
        x: 0,
        y: 0,
        z: 0
      },
      bowBottom: {
        x: 0,
        y: 0,
        z: 0
      }
      arrowBack: {
        x: 0,
        y: 0,
        z: 0
      }
    }

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
      this.hideArrow();
    }

  },

  spawnArrow: function(evt) {
    if (this.canShoot === false || this.primaryHand === null || this.primaryHand === evt.detail.hand) {
      return;
    }

    var bow = this.bow;

    var bowPosition = bow.object3D.getWorldPosition();
    this.preShotArrow.setAttribute('visible', '')
    this.playSound('draw_string_sound', bowPosition)
    this.aiming = true;
  },

  shootArrow: function(evt) {

    var _t = this;

    var sinceLastShot = Math.abs(this.lastShot - Date.now());

    //dont shoot if its the trigger on the primary hand
    if (sinceLastShot < this.cooldown || this.primaryHand === null || this.primaryHand === evt.detail.hand) {
      return;
    }

    var force = this.getShotForce();
    if (force < this.forceThreshold) {
      this.enableShot();
      this.hideArrow();
      this.aiming = false;
      return;
    }

    var scene = document.getElementById('scene');

    var bow = this.bow;

    var bowPosition = bow.object3D.getWorldPosition();

    var arrow = scene.components.pool__arrow.requestEntity();

    arrow.className = "arrow";

    arrow.addEventListener('collide', function(e) {
      _t.handleArrowCollision(e, arrow);
    })

    arrow.addEventListener('body-played', function(e) {

      console.log('arrowbody', arrow.body.shapes)

      arrow.body.velocity.copy(_t.zeroVec);
      arrow.body.angularVelocity.copy(_t.zeroVec);
      arrow.body.fixedRotation = true;
      arrow.body.updateMassProperties();
      arrow.body.position.copy(bowPosition);
      arrow.setAttribute('position', bowPosition);
      var bowRotation = bow.object3D.getWorldQuaternion();
      arrow.body.quaternion.copy(bowRotation);
      var shotDirection = bow.object3D.getWorldDirection();
      shotDirection.negate();
      shotDirection.multiplyScalar(force * _t.shotMultiplier);
      arrow.setAttribute('rotate-toward-velocity', '');
      arrow.body.applyImpulse(
        new CANNON.Vec3().copy(shotDirection),
        new CANNON.Vec3().copy(this.object3D.getWorldPosition())
      );

      //console.log('shotinfo2',arrow.body)


    })


    //for debugging arrow shot direction
    // var arrowHelper = new THREE.ArrowHelper(shotDirection, bowPosition, 5, 0x884400);
    // scene.object3D.add(arrowHelper)

    arrow.play();

    this.playSound('arrow_release_sound', bowPosition)

    this.vibrateController();
    this.hideArrow();
    this.lastShot = Date.now();
    this.aiming = false();
  },

  getShotForce: function() {
    //measure the distance between the arrow hand and the nock

    var nock = this.bow;
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

    var arrowHand = document.getElementById(handSelector).object3D

    var matrixWorld = arrowHand.matrixWorld;
    var arrowHandPosition = new THREE.Vector3();
    arrowHandPosition.setFromMatrixPosition(matrixWorld);

    var difference = nockPosition.distanceTo(arrowHandPosition);

    return difference;
  },

  hideArrow: function() {
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

  playSound: function(soundId, position) {
    if (typeof soundId !== 'string' || soundId === null) {
      return;
    }
    if (position === null) {
      return;
    }
    var sound = document.getElementById(soundId);
    sound.setAttribute('position', position);
    sound.components.sound.playSound()
      // console.log('playing sound', soundId, position)
  },

  handleArrowCollision: function(e, arrow) {

    //should try to see if cannon differentiates between start collision etc.
    // but if u return to pool to soon, crash
    // so gotta set a timeout
    // but many collisions can happen before that timeout.
    if (arrow.getAttribute('didCollide') === 'yes') {
      return
    } else {
      arrow.setAttribute('didCollide', 'yes')
    }

    // arrow.removeAttribute('rotate-toward-velocity');
    this.playSound('arrow_impact_sound', arrow.getAttribute('position'))
    var scene = document.getElementById('scene');

    setTimeout(function removeArrow() {
      arrow.setAttribute('shape:box')
      arrow.setAttribute('didCollide', 'no')
      console.log('ARROW AT REMOVE', arrow)
      scene.components.pool__arrow.returnEntity(arrow);
    }, 0)

    //console.log('Arrow has collided with body #' + e.detail.body.id);

    // e.detail.target.el; // Original entity (playerEl).
    // e.detail.body.el; // Other entity, which playerEl touched.
    // e.detail.contact; // Stats about the collision (CANNON.ContactEquation).
    // e.detail.contact.ni; // Normal (direction) of the collision (CANNON.Vec3).
  },

  tick: function() {

    if (this.aiming === true) {
      this.moveArrowBack();
      this.updateMeshLine();
    }
  },

  updateMeshLine: function() {
    if (this.bowLine === null) {
      this.bowLine = document.getElementById('bowLine')
    }

    var topOfBow;
    var backOfArrow;
    var bottomOfBow;

    var pathString = topOfBow.x + topOfBow.y + topOfBow.z + "," + backOfArrow.x + backOfArrow.y + backOfArrow.z + "," + bottomOfBow.x + bottomOfBow.y + bottomOfBow.z;

    this.bowLine.setAttribute('meshline', 'path', pathString);

  },

  moveArrowBack: function() {
    var arrowPosition = this.preShotArrow.getAttribute('position');
    var force = this.getShotForce();
    arrowPosition.z = -force;
    this.preShotArrow.setAttribute('position', arrowPosition);
  }

});