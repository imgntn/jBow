AFRAME.registerComponent('fire-arrow', {
  init: function () {
    var fire = document.createElement('a-sphere');
    fire.setAttribute('radius', '0.05');
    fire.setAttribute('color', '#FF4500');
    fire.setAttribute('material', 'emissive:#FF4500; emissiveIntensity:1; opacity:0.8; transparent:true');
    fire.setAttribute('position', '0 0 0');
    this.el.appendChild(fire);
    this.fire = fire;
  },
  remove: function () {
    if (this.fire && this.fire.parentNode) {
      this.fire.parentNode.removeChild(this.fire);
    }
  }
});
