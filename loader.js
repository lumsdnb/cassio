window.onload = function (params) {
    window.addEventListener('camera-init', function () {
        console.log("camera initialized");
        document.querySelector('.loader').remove();
    });
};