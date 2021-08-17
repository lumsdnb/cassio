<script>
  import { fade, slide, fly } from 'svelte/transition';
  import InfoPanel from './InfoPanel.svelte';
  import CameraButton from "./CameraButton.svelte"
  let showInfoPanel = false;
  let showCameraScene = false;
  let currentSelectedItem = 0;
  let currentItem;

  //text of items that gets shown in the info panels
  const itemText = [
    {
      name: 'Triangulis',
      text: 'Triangulis  nennt sich die Welt der Dreieckspersonen. In dieser Welt wird nichts zu zweit getan, sondern alles zu dritt erledigt, so gibt es auch das ja, das nein und das, wer weiß?. Ja, selbst beim Fußball spielen drei Teams gegeneinander. Der tag hat drei Phasen, den Aufgang der ersten sonne, die Phase in der beide Sonnen zu sehen sind und die letzte Phase in der nur eine der beiden sonnen zu sehen ist. <p> Welt 1 besser bekannt als Trianga (oder Azurien) leben sehr besondere Lebewesen. Sie sind Dreiecke. Da der Planet seine Stern sehr eng umkreist, haben sich auf dieser sumpfigen Wasserwelt Lebewesen in dreieckiger Form gebildet. Sie währen nie auf den Gedanken gekommen, eine Frage nach einem Ja oder einem Nein zu stellen, viel mehr würden sie dich aus 3 verschiedenen Kontexten heraus nach der cleversten Lösung nach einem Problem fragen. </p> Die Trainguilaner betreiben uns fremden Koitus. Sie ... tedraeder etc. Schenekel in der länge verändern ... Extrem krasse lebewesen aus formen die man aus drei-ecken bilden kann. Sie Leben alle in frieden und es gibt ein gleich Gewicht zwischen den verschiedenen Lebensformen: 3 Ecke sind für die Fortpflanzung zu ständig. Die 4 Ecke, sind die Gebäudebauer und Architekten 5 ecke sind richtige Profis in der Küche und in vielen handwerklichen dingen 6 ecke sind optimal zu verteidigungszwecken gegen Asteroiden - sie können nämlich fliegen da sie sechs Flügel habenJedes Lebewesen, egal in welcher form es geboren wird, kann zurück in das Dreiecksstadium fallen, wenn es sich fortpflanzen mag.',
      icon: '▲'
    },
    {
      name: '',
      text: 'manche dinge gehen besser gemeinsam..',
      icon: 'G'
    },
    {
      name: 'Kleine Stadt',
      text: 'Die kleinste Stadt, die ich je gesehen habe, war auf Planet bla. Die Leute und ihre Häuser sind so klein, dass sie von Feinden meistens einfach übersehen werden.',
      icon: '🔍'
    },
    {
      name: 'uhren',
      text: 'es scheint, als sei die Zeit stehen geblieben',
      icon: '🕐'
    },
    {
      name: 'Einzeller',
      text: 'Hallo, ich bin ein großer Einzeller. Ich bin so groß wie ihr, aber ihr seid so viele..',
      icon: '🦠'
    },
    {
      name: 'Wasserplanet',
      text: 'Als ich auf einer meiner Wurmlochreisen mit einem Wal zusammengestossen bin, hat es mich richtig aus den Socken gehauen',
      icon: '🌊'
    },
    {
      name: 'bild am toilettelhaus',
      text: 'kaka lol',
      icon: '💩'
    },
    {
      name: 'pflanze',
      text: 'gustav',
      icon: '🌱'
    },
    {
      name: '3 Siebe',
      text: 'du bist hier',
      icon: '🔮'
    },
    {
      name: 'das grosse feuer',
      text: 'Dieser baum hat gebrannt',
      icon: '🔥'
    },
    {
      name: 'chakren',
      text: 'text zu chakren, evtl muss da ne andere datenstruktur rein',
      icon: '🙏'
    },
  ];
  let foundItems=[0,0,0,0,0,0,0,0,0,0,0]
  let foundChakras=[0,0,0,0,0,0,0]
  let currentIsInteractable=false

  function toggleARScene() {
    //get screen size for iframe
  let width = window.innerWidth
              || document.documentElement.clientWidth
              || document.body.clientWidth;
  let height = window.innerHeight
              || document.documentElement.clientHeight
              || document.body.clientHeight;

    // adds arjs iframe to scene or removes it if button is pressed again
    if (!document.getElementById('ar-frame')) {
      //if not in vr mode, start cam etc
      console.log('loading cam');
      showCameraScene = true;
      var scene = document.createElement('iframe');
      scene.id = 'ar-frame';
      scene.setAttribute('src', './assets/ar.html');
      scene.setAttribute('height', `${height}px`);
      scene.setAttribute('width', `${width}px`);
      document.querySelector('body').appendChild(scene);

    } else {
      document.getElementById('ar-frame').remove()
    }
  }
  
  const hideInfo = () => {
    showInfoPanel = false;
    window.scrollTo(0,0)
  };
  const handleAddScene = () => {
    window.scrollTo(0,0)
    hideInfo();
    toggleARScene();
  };


  // --------------- Get index of found marker sent from iFrame ---------------
  window.addEventListener('message', (e)=> {
    let data = e.data;
    console.log('marker ' + data);
    
    //regular marker check   
    if (data.slice(0, 6)=="normal") {
     data = data.slice(7) // TODO: muss fuer 2stellige zahlen anders
     // check off item in dom
     document
      .querySelector(`.item${data}`)
      .classList.add('--found'); 
     foundItems[data]=1
     currentIsInteractable=false
     currentSelectedItem=data;
     currentItem=itemText[data]
     showInfoPanel=true ; 
     toggleARScene();
   }
   //interactable
   if (data.slice(0,1)=="i") {
      currentSelectedItem = data.slice(2);
      currentIsInteractable=true
      currentItem={
      name: '..?',
      text: ''
    },
      showInfoPanel = true;
      toggleARScene();
    }
   // clocks
   if (data.slice(0,1)=="u") {
      currentSelectedItem = data.slice(-1) -1;
      currentIsInteractable=false
      showInfoPanel = true;
      toggleARScene();
    }
    //chakra marker detection
    if(data.slice(0, 6)=="chakra"){
      const chakraID = data.slice(-1) -1;
      currentIsInteractable=false
      currentSelectedItem=10
      foundChakras[chakraID]=1
      showInfoPanel = true;
      toggleARScene();
    }
    });
    
  function loadItemFromButton() {
    if (this.classList.contains('--found')) {
      console.log('unlocked');

      currentItem=itemText[this.dataset.id -1]
      currentSelectedItem = this.dataset.id - 1;
      showInfoPanel = true;
    }
    console.log(this);
  }
</script>

<header class="banner-img">
  <h1>Cassiopeias Saga</h1>
</header>

<main>
  {#if showInfoPanel}
  
  <div transition:fade={{ duration: 100 }}>
      <InfoPanel
      itemName={currentItem.name}
      itemDescription={currentItem.text}
      on:click={hideInfo}
      src={`./assets/item${currentSelectedItem}/title-image.png`}
      />
    </div>

    {:else}
  <div out:slide={{ duration: 200 }} in:fly={{y:-100, duration: 300}}>
    <p class="intro-paragraph">
      Als ich hier gelandet bin, sind mir ein paar Geschichten aus dem Rucksack
      gefallen. Sie haben sich in verschiedenen Dimensionen versteckt.
    </p>
    <h2>bisher gefunden:</h2>
    <section class="collectibles">
      {#each itemText as items, i}
        <button
          on:click={loadItemFromButton}
          data-id={i + 1}
          class={`item${i + 1} collectible ${foundItems[i] ==1 ? '--found' : '--found'}`}>{itemText[i].icon}</button
        >
      {/each}
    </section>
  </div>
  {/if}
</main>
<footer>
  <CameraButton on:click={handleAddScene} isInAR={showCameraScene}/>
</footer>

<style>
  .banner-img {
  background: url('../assets/banner.jpg');
  height: 10vh;
  width: 100vw;
  user-select: none;
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Do not repeat the image */
  background-size: cover; /* Resize the background image to cover the entire container */
  display: flex;
  align-items: center;justify-content: center;
}

.banner-img > h1 {
  font-size: 2rem;
}

</style>
