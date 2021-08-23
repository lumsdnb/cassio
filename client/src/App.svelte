<script>
  import { fade, slide, fly } from 'svelte/transition';
  import InfoPanel from './InfoPanel.svelte';
  import CameraButton from "./CameraButton.svelte"
  let showInfoPanel = false;
  let showCameraScene = false;
  let currentSelectedItem = 0;
  let currentItem;
  let youWon=false

  //text of items that gets shown in the info panels
  const itemText = [
    {
      name: 'Triangulis',
      text: 'Triangulis ist die Welt der Dreiecke. In dieser Welt wird nichts zu zweit getan, sondern alles mindestens zu dritt erledigt. Ja selbst beim Fußball spielen drei Teams gegeneinander. Auf den Spielplätzen wird zu dritt gewippt und zu fünft geschaukelt. So gibt es auch das ja, das nein und das <i> wer weiß?</i>. <br>Zudem hat der Tag drei Phasen, den Aufgang der ersten Sonne, die Phase in der beide Sonnen am Himmel stehen und den Untergang der zweiten Sonne, bei der folglich nur ein Stern am Himmel glüht. <br> Bei der ganzen Romantik muss ich natürlich auch die Romantik erwähnen, die bei den Triangulianern nur zu dritt auf fruchtbaren Boden fallen kann.',
      icon: '▲'
    },
    {
      name: 'Die Kopianer',
      text: 'Herzlichen Glückwunsch. Ihr habt soeben an einem Ritual der Kopianer teilgenommen. <br><br> Aber was sind Kopianer? <br><br> Die Kopianer entstanden aus den Trümmern einer zerstörten Welt. Bis zur letzten Generation vor ihrer Zeit kümmerten die Bewohner sich stets darum, jeden einzelnen, eigenen Gedanken voreinander zu verstecken und zu verheimlichen. Nichts wurde geteilt, keine Geschenke wurden gemacht, selbst die täglichen Nachrichten berichteten immer nur das Gleiche. <br> Um einen fremden Gedanken zu fassen, musste man ihn entweder selber denken, oder käuflich erwerben. <br><br> Das ganze spitzte sich immer weiter zu, bis der Druck alles zu Verheimlichen auf jeden Einzelnen so hoch wurde, dass das große Schweigen begann. Diese beißende Stille hielt keine fünf Wochen und es eskalierte.<br><br> Alle vereinsamten dadurch, im Straßenverkehr blinkte keiner mehr, bis schließlich die Kraftwerkarbeiter mit dem Bus nicht mehr zur Arbeit kamen. So manövrierte sich ihre Gesellschaft in einen Apfel-Strudel des Chaos. Zuckersüß, weil jeder alleine war, zugleich furchtbar, weil jeder alleine war.<br><br> In aller Dunkelheit und Ruhe entwickelte sich nie dagewesene Musik. Diese fiel ein wie ein Virus. <br><br> In weniger als 24h verbreitete sich die simpelste und langsamste aller Schwingungen. Das Besondere an dieser Musik war, dass sie frei von allen Regeln, kostenlos und beliebig oft vervielfältigbar verschenkt wurde. Die Zeit des Teilens war geboren. Als Grundprinzip des neuen Miteinanders galt nun die Regel, jedes Wissen darf und kann von jedem kostenfrei kopiert werden.',
      icon: '🖧'
    },
    {
      name: 'Masken',
      text: '',
      icon: '🎭'
    },
    {
      name: 'Einzeller',
      text: 'Hallo, ich bin ein großer Einzeller. Ich bin so groß wie ihr, aber ihr seid so viele..',
      icon: '🦠'
    },
    {
      name: 'Das Wurmloch',
      text: '',
      icon: '🌌'
    },
    {
      name: 'bild am toilettelhaus',
      text: '',
      icon: '💩'
    },
    {
      name: 'Die Stimme der Pflanzen',
      text: 'Auf einer ihrer Reisen durch ferne Galaxien machte Cassiopeia auf dem Waldplaneten Aryoban halt. Das dort ansässige Volk der Snuwmis, lebte seit vielen Jahrtausenden friedlich im Einklang mit der Natur. Sie hatten über die Zeit eine tiefe Verbindung zu den Tieren und Pflanzen des Planeten aufgebaut und gelernt diese zu verstehen. Noch während Cassiopeia auf dem Planeten verteilte wurde diese Harmonie, vom Einfall  bösartigen Schurkulus Käfer tief erschüttert. Die Snuwmis wussten keine geeignete Antwort auf die Plage. Deshalb half Cassiopeia ihnen dabei Geräte zu bauen, mit denen sie den Pflanzen Stimmen geben konnten. Da sie die Pflanzen jetzt verstehen konnten, viel es den Snuwmis leicht herauszufinden was ihnen für die Bekämpfung der Schurkulus Käfer fehlte. Und so konnte dank Cassiopeias Hilfe die Käfer erfolgreich und die Flucht geschlagen werden. Eines dieser mysteriösen Geräte nahm Cassiopeia mit um euch, die ihr sie an dem ihr liebsten Ort besucht, die Stimmen der Pflanzen zu zeigen.',
      icon: '🌱'
    },
    {
      name: 'Vernetzte Stadt',
      text: '',
      icon: '🏙️'
    },
    {
      name: 'das ende vom anfang',
      text: 'Es schien, als sei die Zeit stehen geblieben...',
      icon: '🕐'
    },
  ];

  const clockText=[
    {
      name: 'Uhr 1/4',
      text: '',
      icon: '🕐'
    },
    {
      name: 'Uhr 2/4',
      text: '',
      icon: '🕐'
    },
    {
      name: 'Uhr 3/4',
      text: '',
      icon: '🕐'
    },
    {
      name: 'Uhr 4/4',
      text: '',
      icon: '🕐'
    },
  ]
  const maskText=[
    {
      name: 'Maske 1/2',
      text: '',
      icon: ''
    },
    {
      name: 'Maske 2/2',
      text: '',
      icon: ''
    },
  ]

  let foundItems=[0,0,0,0,0,0,0,0,0]
  // let foundChakras=[0,0,0,0,0,0,0]
  let foundClocks=[0,0,0,0]
  let foundMasks=[0,0]
  let currentIsInteractable=false

  

  let showPartialInfo=false

  // TODO: impl local storage fully
  const storeLocalData=()=> {
  localStorage.setItem(`foundItems`, JSON.stringify(foundItems));
  localStorage.setItem(`foundMasks`, JSON.stringify(foundMasks));
  localStorage.setItem(`foundClocks`, JSON.stringify(foundClocks));
  // localStorage.setItem(`foundChakras`, JSON.stringify(foundChakras));
}

// if (localStorage.foundItems) {
//   let objList = localStorage.getItem('myLibrary');
//   objList = JSON.parse(objList);
//   objList.forEach((book) => {
//     let b = Object.create(book);
//     book.isPrototypeOf(b);
//     myLibrary.push(b);
//   });
//   renderBooks();
//   console.log('loaded');
// }


function hideARScene(){
  document.getElementById('ar-frame').remove()
}

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

    hideARScene();
    let data = e.data;
    console.log('marker ' + data);
    //regular marker check   
    if (data.slice(0, 6)=="normal") {
     data = data.slice(7)
     // check off item in dom
    //  document
    //   .querySelector(`.item${data}`)
    //   .classList.add('--found'); 
     foundItems[data]=1
     currentIsInteractable=false
     currentSelectedItem=data;
     currentItem=itemText[data]
     showInfoPanel=true ; 
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
      
    }
   // clocks
   if (data.slice(0,1)=="u") {
      const index = data.slice(2)
      currentSelectedItem = index+10;
      foundClocks[index]=1
      console.log(foundClocks);
      currentItem=clockText[index],
      currentIsInteractable=false
      showInfoPanel = true;
    }
    // masks
   if (data.slice(0,1)=="m") {
     const index = data.slice(2)
      currentSelectedItem = index+10;
      foundMasks[index]=1
      console.log(foundMasks);
      currentItem=maskText[index],
      currentIsInteractable=false
      showInfoPanel = true;
    }
    //chakra marker detection
    if(data.slice(0, 6)=="chakra"){
      const chakraID = data.slice(-1)
      currentIsInteractable=false
      currentSelectedItem=10
      foundChakras[chakraID]=1
      showInfoPanel = true;
    }

    // awful code here
    if (foundClocks[0]==1&& foundClocks[1]==1 && foundClocks[2]==1&&foundClocks[3]==1){
      foundItems[8]=1
    }
    if (foundMasks[0]==1 && foundMasks[1]==1) {
      foundItems[2]=1
    }
    if(foundItems.every( i => i === 1 )){
      youWon=true
    }
  });
    
  function loadItemFromButton() {
    if (this.classList.contains('--found')) {
      currentItem=itemText[this.dataset.id -1]
      currentSelectedItem = this.dataset.id - 1;
      showInfoPanel = true;
    }
    console.log(this);
  }
</script>

<header class="banner-img">
  <h1>Cassiopeias Schatzsuche</h1>
</header>

<main>
  {#if showInfoPanel}
  
  <div transition:fade={{ duration: 100 }}>
      <InfoPanel
      itemName={currentItem.name}
      itemDescription={currentItem.text}
      on:click={hideInfo}
      {currentSelectedItem}
      />
    </div>

    {:else}
    
  <div out:slide={{ duration: 200 }} in:fly={{y:-100, duration: 300}}>
    <p class="intro-paragraph">
      Auf dem Gelände haben sich ein paar meiner Geschichten versteckt.
    </p>
    <h2>bisher gefunden:</h2>
    <section class="collectibles">
      {#each itemText as items, i}
        <button
          on:click={loadItemFromButton}
          data-id={i + 1}
          class={`item${i + 1} collectible ${foundItems[i] ==1 ? '--found' : '--hidden'}`}>{itemText[i].icon}</button
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
