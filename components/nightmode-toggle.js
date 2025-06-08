AFRAME.registerComponent('nightmode-toggle', {
  init: function () {
    this.isNight = false;
    this.onKeyDown = this.onKeyDown.bind(this);
    window.addEventListener('keydown', this.onKeyDown);
    this.sky = document.getElementById('sky');
  },
  remove: function () {
    window.removeEventListener('keydown', this.onKeyDown);
  },
  onKeyDown: function (e) {
    if (e.key === 'n' || e.key === 'N') {
      this.toggleMode();
    }
  },
  toggleMode: function () {
    this.isNight = !this.isNight;
    if (!this.sky) return;
    if (this.isNight) {
      this.sky.setAttribute('material', {
        shader: 'skyGradient',
        colorTop: '#0a0d1a',
        colorBottom: '#011c35'
      });
    } else {
      this.sky.setAttribute('material', {
        shader: 'skyGradient',
        colorTop: '#353449',
        colorBottom: '#BC483E'
      });
    }
  }
});
