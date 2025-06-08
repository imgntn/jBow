AFRAME.registerComponent('animated-target', {
  schema: {
    speed: {type: 'number', default: 30}
  },
  init: function () {
    this.rotation = this.el.getAttribute('rotation');
  },
  tick: function (time, delta) {
    if (!this.rotation) { this.rotation = {x:0,y:0,z:0}; }
    this.rotation.y += this.data.speed * delta / 1000;
    this.el.setAttribute('rotation', this.rotation);
    if (this.el.body) {
      this.el.body.position.copy(this.el.object3D.position);
      this.el.body.quaternion.copy(this.el.object3D.quaternion);
      this.el.body.velocity.set(0,0,0);
      this.el.body.angularVelocity.set(0,0,0);
    }
  }
});
