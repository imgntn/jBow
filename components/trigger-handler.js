/* global AFRAME */

/**
 * Handles events coming from the hand-controls.
 * Determines if the entity is grabbed or released.
 * Updates its position to move along the controller.
 */
AFRAME.registerComponent('trigger-handler', {
  init: function() {
    // Bind event handlers
    this.onTriggerDown = this.onTriggerDown.bind(this);
    this.onTriggerUp = this.onTriggerUp.bind(this);
  },

  play: function() {
    var el = this.el;
    el.addEventListener('triggerdown', this.onTriggerDown);
    el.addEventListener('triggerup', this.onTriggerUp);

  },

  pause: function() {
    var el = this.el;
    el.removeEventListener('triggerdown', this.onTriggerDown);
    el.removeEventListener('triggerup', this.onTriggerUp);
  },

  onTriggerUp: function(evt) {

    console.log('trigger up event', evt);

    // var vector = new THREE.Vector3(); // create once and reuse it!

    // this.el.object3D.getWorldDirection(vector);

    // console.log('vector at trigger up', vector)
  },

  onTriggerDown: function(evt) {
    console.log('trigger down event', evt);

    // function handleHit (hitEl) {
    //   hitEl.emit('hit');
    //   hitEl.addState(self.data.state);
    //   self.el.emit('hit', {el: hitEl});
    // }

  },


  tick: function() {


  },

});