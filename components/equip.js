/* global AFRAME */

/**
 * Handles events coming from the hand-controls.
 * Determines if the entity is grabbed or released.
 * Updates its position to move along the controller.
 */
AFRAME.registerComponent('grab', {
  init: function() {
    this.GRABBED_STATE = 'grabbed';
    this.equipped = false;
    // Bind event handlers
    this.onHit = this.onHit.bind(this);
    this.onGripOpen = this.onGripOpen.bind(this);
    this.onGripClose = this.onGripClose.bind(this);
    this.onTriggerDown = this.onTriggerDown.bind(this);
    this.onTriggerUp = this.onTriggerUp.bind(this);

  },

  play: function() {
    var el = this.el;
    el.addEventListener('hit', this.onHit);
    el.addEventListener('gripclose', this.onGripClose);
    el.addEventListener('gripopen', this.onGripOpen);
    el.addEventListener('thumbup', this.onGripClose);
    el.addEventListener('thumbdown', this.onGripOpen);
    el.addEventListener('pointup', this.onGripClose);
    el.addEventListener('pointdown', this.onGripOpen);
    el.addEventListener('triggerdown', this.onTriggerDown);
    el.addEventListener('triggerup', this.onTriggerUp);

  },

  pause: function() {
    var el = this.el;
    el.removeEventListener('hit', this.onHit);
    el.removeEventListener('gripclose', this.onGripClose);
    el.removeEventListener('gripopen', this.onGripOpen);
    el.removeEventListener('thumbup', this.onGripClose);
    el.removeEventListener('thumbdown', this.onGripOpen);
    el.removeEventListener('pointup', this.onGripClose);
    el.removeEventListener('pointdown', this.onGripOpen);
    el.removeEventListener('triggerdown', this.onTriggerDown);
    el.removeEventListener('triggerup', this.onTriggerUp);
  },

  onTriggerUp: function(evt) {
   
    console.log('trigger up event', evt);

    var vector = new THREE.Vector3(); // create once and reuse it!

    this.el.object3D.getWorldDirection(vector);

    //this will be the direction of the hand
    console.log('vector at trigger up', vector)
  },

  onTriggerDown: function(evt) {
    console.log('trigger down event', evt);
  },

  onGripClose: function(evt) {
    this.grabbing = true;
    delete this.previousPosition;
  },

  onGripOpen: function(evt) {
    var hitEl = this.hitEl;
    this.grabbing = false;
    if (!hitEl) {
      console.log('nothing to grab')
      return;
    }
    if (this.equipped === false) {
      this.equip(hitEl);
    } else {
      this.unEquip(hitEl);
    }
  },

  equip: function(hitEl) {
    console.log('should equip',hitEl)
    this.equipped = true;
    this.el.appendChild(hitEl);
    hitEl.setAttribute('position', '0 0 0');
  },
  unEquip: function(hitEl) {
  console.log('should unEquip',hitEl)

    document.querySelector('a-scene').appendChild(hitEl);
    var myRotation = this.el.getAttribute('rotation');
    hitEl.setAttribute('rotation', myRotation)
    var myPosition = this.el.getAttribute('position');
    hitEl.setAttribute('position', myPosition)
    hitEl.removeState(this.GRABBED_STATE);
    this.hitEl = undefined;
    this.equipped = false;
  },
  onHit: function(evt) {
    var hitEl = evt.detail.el;
    // If the element is already grabbed (it could be grabbed by another controller).
    // If the hand is not grabbing the element does not stick.
    // If we're already grabbing something you can't grab again.
    if (!hitEl || hitEl.is(this.GRABBED_STATE) || !this.grabbing || this.hitEl) {
      return;
    }
    hitEl.addState(this.GRABBED_STATE);
    this.hitEl = hitEl;
    this.el.appendChild(hitEl)

  },

  tick: function() {
    var hitEl = this.hitEl;
    var position;
    if (!hitEl) {
      return;
    }

  },

});