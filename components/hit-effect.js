AFRAME.registerComponent('hit-effect', {
  schema: {duration: {type:'int', default:500}},
  init: function () {
    var el = this.el;
    setTimeout(function(){
      if (el.parentNode) { el.parentNode.removeChild(el); }
    }, this.data.duration);
  }
});
