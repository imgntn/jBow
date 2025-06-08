/* global AFRAME */

/**
 * Simple component to provide visual feedback when hit by an arrow.
 * Changes the material color briefly when the `arrow-hit` event is received.
 */
AFRAME.registerComponent('hit-feedback', {
  schema: {
    duration: {type: 'int', default: 200},
    color: {type: 'color', default: '#FF0000'}
  },

  init: function () {
    this.onHit = this.onHit.bind(this);
    this.originalColor = null;
  },

  play: function () {
    this.el.addEventListener('arrow-hit', this.onHit);
  },

  pause: function () {
    this.el.removeEventListener('arrow-hit', this.onHit);
  },

  onHit: function () {
    if (!this.originalColor) {
      var material = this.el.getAttribute('material');
      if (material && material.color) {
        this.originalColor = material.color;
      } else {
        this.originalColor = null;
      }
    }
    this.el.setAttribute('material', 'color', this.data.color);
    var el = this.el;
    var original = this.originalColor;
    setTimeout(function () {
      if (original) {
        el.setAttribute('material', 'color', original);
      } else {
        el.removeAttribute('material');
      }
    }, this.data.duration);
  }
});
