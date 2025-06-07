AFRAME.registerComponent('arrow-trail', {
  schema: {
    color: {type: 'color', default: '#ffa500'}
  },
  init: function () {
    this.points = [];
    this.trail = document.createElement('a-entity');
    this.trail.setAttribute('meshline', {
      lineWidth: 5,
      path: '',
      color: this.data.color
    });
    this.el.sceneEl.appendChild(this.trail);
  },
  tick: function () {
    var p = this.el.getAttribute('position');
    this.points.push(p.x + ' ' + p.y + ' ' + p.z);
    if (this.points.length > 20) { this.points.shift(); }
    this.trail.setAttribute('meshline', 'path', this.points.join(', '));
  },
  remove: function () {
    if (this.trail.parentNode) {
      this.trail.parentNode.removeChild(this.trail);
    }
  }
});
