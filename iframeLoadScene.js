function addScene() {
  console.log('loading cam');
  if (!document.querySelector('.camera-scene')) {
    var scene = document.createElement('iframe');
    scene.classList.add('camera-scene');
    scene.setAttribute('src', 'ar.html');
    scene.setAttribute('height', '100vh');
    document.querySelector('body').appendChild(scene);
    document.querySelector('.camera-toggle-button').innerHTML =
      '<p>kamera schliesen</p>';
  } else {
    document.querySelector('.camera-scene').remove();
    document.querySelector('.camera-toggle-button').innerHTML =
      '<p>Hinweise suchen</p>';
  }
}
