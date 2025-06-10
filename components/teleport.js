AFRAME.registerComponent('teleport', {
  schema: {
    distance: {type: 'number', default: 3}
  },
  init: function () {
    this.onKeyDown = this.onKeyDown.bind(this);
    window.addEventListener('keydown', this.onKeyDown);
  },
  remove: function () {
    window.removeEventListener('keydown', this.onKeyDown);
  },
  onKeyDown: function (e) {
    if (e.key === 't' || e.key === 'T') {
      var dir = new THREE.Vector3();
      this.el.object3D.getWorldDirection(dir);
      dir.y = 0;
      dir.normalize();
      var pos = this.el.getAttribute('position');
      pos.x += dir.x * this.data.distance;
      pos.z += dir.z * this.data.distance;
      this.el.setAttribute('position', pos);
    }
  }
});
