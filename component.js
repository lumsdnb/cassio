AFRAME.registerComponent("load-camera", {

  init: function () {
    console.log("load camera");
    var data = this.data;
    var el = this.el;
    console.table(data, el);
  },
});
