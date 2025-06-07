AFRAME.registerComponent('game-features', {
  init: function () {
    this.fire = false;
    this.night = false;
    var scene = this.el;
    var self = this;
    document.addEventListener('keydown', function (e) {
      if (e.key === 'f') { self.fire = !self.fire; }
      if (e.key === 'n') { self.toggleNight(); }
      if (e.key === 't') { self.teleport(); }
    });
  },
  toggleNight: function () {
    this.night = !this.night;
    var sky = document.getElementById('sky');
    if (!sky) return;
    if (this.night) {
      sky.setAttribute('material', 'shader: skyGradient; colorTop: #000015; colorBottom: #000000');
    } else {
      sky.setAttribute('material', 'shader: skyGradient; colorTop: #353449; colorBottom: #BC483E');
    }
  },
  teleport: function () {
    var camera = document.querySelector('[camera]');
    if (camera) { camera.setAttribute('position', {x:0, y:1.6, z:-5}); }
  }
});
