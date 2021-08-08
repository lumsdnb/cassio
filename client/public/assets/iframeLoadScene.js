function addScene() {
  console.log('loading cam');
  if (!document.querySelector('.camera-scene')) {
    //if not in vr mode, start cam etc
    var scene = document.createElement('iframe');
    scene.classList.add('camera-scene');
    scene.setAttribute('src', 'ar.html');
    scene.setAttribute('height', '100vh');
    document.querySelector('body').appendChild(scene);

    // toggle camera button
    document.getElementById('open-eye-icon').classList.remove('--hidden');
    document.getElementById('closed-eye-icon').classList.add('--hidden');
  } else {
    document.querySelector('.camera-scene').remove();

    // toggle camera button
    document.getElementById('open-eye-icon').classList.add('--hidden');
    document.getElementById('closed-eye-icon').classList.remove('--hidden');
  }
}
