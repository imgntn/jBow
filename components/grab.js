/* global AFRAME */

/**
* Handles events coming from the hand-controls.
* Determines if the entity is grabbed or released.
* Updates its position to move along the controller.
*/
AFRAME.registerComponent('grab', {
  init: function () {
    this.GRABBED_STATE = 'grabbed';
    // Bind event handlers
    this.onHit = this.onHit.bind(this);
    this.onGripOpen = this.onGripOpen.bind(this);
    this.onGripClose = this.onGripClose.bind(this);
    // this.onTriggerDown = this.onTriggerDown.bind(this);
  },

  play: function () {
    var el = this.el;
    el.addEventListener('hit', this.onHit);
    el.addEventListener('gripclose', this.onGripClose);
    el.addEventListener('gripopen', this.onGripOpen);
    el.addEventListener('thumbup', this.onGripClose);
    el.addEventListener('thumbdown', this.onGripOpen);
    el.addEventListener('pointup', this.onGripClose);
    el.addEventListener('pointdown', this.onGripOpen);
    el.addEventListener('triggerdown',this.onTriggerDown);
    el.addEventListener('triggerup',this.onTriggerUp);

  },

  pause: function () {
    var el = this.el;
    el.removeEventListener('hit', this.onHit);
    el.removeEventListener('gripclose', this.onGripClose);
    el.removeEventListener('gripopen', this.onGripOpen);
    el.removeEventListener('thumbup', this.onGripClose);
    el.removeEventListener('thumbdown', this.onGripOpen);
    el.removeEventListener('pointup', this.onGripClose);
    el.removeEventListener('pointdown', this.onGripOpen);
    el.removeEventListener('triggerdown',this.onTriggerDown);
    el.removeEventListener('triggerup',this.onTriggerUp);
  },
  onTriggerUp:function(evt){
        console.log('trigger up event',evt);
        console.log('this',this.getAttribute('hand-controls'))
  },

  onTriggerDown:function(evt){
    console.log('trigger down event',evt);
  },

  onGripClose: function (evt) {
    this.grabbing = true;
    delete this.previousPosition;
  },

  onGripOpen: function (evt) {
    var hitEl = this.hitEl;
    this.grabbing = false;
    if (!hitEl) { return; }
    hitEl.removeState(this.GRABBED_STATE);
   
    var myPosition = this.el.getAttribute('position');
    var myRotation = this.el.getAttribute('rotation');
    var scene = document.querySelector('a-scene')
    this.hitEl.setAttribute('position',myPosition)
    this.hitEl.setAttribute('rotation',myRotation)
    scene.appendChild(this.hitEl);
    this.hitEl = undefined;
  },

  onHit: function (evt) {
    var hitEl = evt.detail.el;
    // If the element is already grabbed (it could be grabbed by another controller).
    // If the hand is not grabbing the element does not stick.
    // If we're already grabbing something you can't grab again.
    if (!hitEl || hitEl.is(this.GRABBED_STATE) || !this.grabbing || this.hitEl) { return; }
    hitEl.addState(this.GRABBED_STATE);
    this.hitEl = hitEl;
  
    this.el.appendChild(this.hitEl)
    this.hitEl.setAttribute('position','0 0 0 ')
  },

  tick: function () {
    var hitEl = this.hitEl;
    var position;
    if (!hitEl) { return; }
    // this.updateDelta(hitEl);
    // position = hitEl.getAttribute('position');
    // hitEl.setAttribute('position', {
    //   x: position.x + this.deltaPosition.x,
    //   y: position.y + this.deltaPosition.y,
    //   z: position.z + this.deltaPosition.z
    // });
    // rotation = hitEl.getAttribute('rotation');
    // hitEl.setAttribute('rotation', {
    //   x: rotation.x - this.deltaRotation.x,
    //   y: rotation.y - this.deltaRotation.y,
    //   z: rotation.z - this.deltaRotation.z
    // });


  },

  updateDelta: function (hitEl) {
    var currentPosition = this.el.getAttribute('position');
    var previousPosition = this.previousPosition || currentPosition;
    var deltaPosition = {
      x: currentPosition.x - previousPosition.x,
      y: currentPosition.y - previousPosition.y,
      z: currentPosition.z - previousPosition.z
    };
    this.previousPosition = currentPosition;
    this.deltaPosition = deltaPosition;

    var currentRotation = this.el.getAttribute('rotation');
    var objRotation =hitEl.getAttribute('rotation');
    var quat = new THREE.Quaternion();
    var euler = new THREE.Euler(currentRotation.x,currentRotation.y,currentRotation.z);
    quat.setFromEuler(euler);
    console.log('current quat is:',quat)
    var previousRotation = this.previousRotation || currentRotation;
    var deltaRotation = {
      x:  objRotation.x- currentRotation.x - previousRotation.x,
      y:  objRotation.y-currentRotation.y - previousRotation.y,
      z:  objRotation.z-currentRotation.z - previousRotation.z
    };
    this.previousRotation = currentRotation;
    this.deltaRotation= deltaRotation;



  }
});
