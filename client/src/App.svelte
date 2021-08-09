<script>
  import { fade } from 'svelte/transition';
  import InfoPanel from './InfoPanel.svelte';
  let showInfoPanel = false;
  let showCameraScene = false;
  let currentSelectedItem = 0;


  function addScene() {
    // adds arjs iframe to scene or removes it if button is pressed again
    console.log('loading cam');
    if (!document.querySelector('.camera-scene')) {
      //if not in vr mode, start cam etc
      showCameraScene = true;
      var scene = document.createElement('iframe');
      scene.classList.add('camera-scene');
      scene.setAttribute('src', './assets/ar.html');
      scene.setAttribute('height', '100vh');
      document.querySelector('body').appendChild(scene);

      // toggle camera button
      document.getElementById('open-eye-icon').classList.remove('--hidden');
      document.getElementById('closed-eye-icon').classList.add('--hidden');
    } else {
      // otherwise hide it
      showCameraScene = false;
      document.querySelector('.camera-scene').remove();

      // toggle camera button
      document.getElementById('open-eye-icon').classList.add('--hidden');
      document.getElementById('closed-eye-icon').classList.remove('--hidden');
    }
  }

  function loadItemInfo(e) {
    const infoPanel = document.getElementById('collectible-info');
    const infoPanelText = document.getElementById('collectible-info-text');
    const infoPanelTitle = document.getElementById('collectible-info-title');
    //get dom node
    console.log(e.target.classList);
    //check if item was found
    if (e.target.classList.contains('--found')) {
      //if yes, load content of triggered collectible into panel
      console.log('has been found already');
      infoPanelTitle.innerHTML = itemText[e.target.dataset.id - 1].name;
      infoPanelText.innerHTML = itemText[e.target.dataset.id - 1].text; // here
      //and then show it to user
      infoPanel.classList.remove('--hidden');
    }
    console.log('click');
  }

  const hideInfo = () => {
    showInfoPanel = false;
  };
  const handleAddScene = () => {
    showInfoPanel = false;
    document.getElementById('open-eye-icon').classList.remove('--hidden');
    document.getElementById('closed-eye-icon').classList.remove('--hidden');

    hideInfo();
    addScene();
  };

  const itemText = [
    {
      name: 'triangulis',
      text: 'Triangulis  nennt sich die Welt der Dreieckspersonen. In dieser Welt wird nichts zu zweit getan, sondern alles zu dritt erledigt, so gibt es auch das ja, das nein und das, wer weiß?. Ja, selbst beim Fußball spielen drei Teams gegeneinander. Der tag hat drei Phasen, den Aufgang der ersten sonne, die Phase in der beide Sonnen zu sehen sind und die letzte Phase in der nur eine der beiden sonnen zu sehen ist. Welt 1 besser bekannt als Trianga (oder Azurien) leben sehr besondere Lebewesen. Sie sind Dreiecke. Da der Planet seine Stern sehr eng umkreist, haben sich auf dieser sumpfigen Wasserwelt Lebewesen in dreieckiger Form gebildet. Sie währen nie auf den Gedanken gekommen, eine Frage nach einem Ja oder einem Nein zu stellen, viel mehr würden sie dich aus 3 verschiedenen Kontexten heraus nach der cleversten Lösung nach einem Problem fragen. Die Trainguilaner betreiben uns fremden Koitus. Sie ... tedraeder etc. Schenekel in der länge verändern ... Extrem krasse lebewesen aus formen die man aus drei-ecken bilden kann. Sie Leben alle in frieden und es gibt ein gleich Gewicht zwischen den verschiedenen Lebensformen: 3 Ecke sind für die Fortpflanzung zu ständig. Die 4 Ecke, sind die Gebäudebauer und Architekten 5 ecke sind richtige Profis in der Küche und in vielen handwerklichen dingen6 ecke sind optimal zu verteidigungszwecken gegen Asteroiden - sie können nämlich fliegen da sie sechs Flügel habenJedes Lebewesen, egal in welcher form es geboren wird, kann zurück in das Dreiecksstadium fallen, wenn es sich fortpflanzen mag.',
    },
    {
      name: 'itemzwo',
      text: 'die geschichte von itemzwei',
    },
    {
      name: 'item333',
      text: 'nummer 3 auch am start',
    },
    {
      name: 'vier',
      text: 'item 4 ist hier',
    },
    {
      name: 'fuenf',
      text: 'item 5 ist hier so und macht so text',
    },
    {
      name: '66',
      text: 'item 6 ist hier so und macht so text',
    },
    {
      name: '77777',
      text: 'item 7 ist hier so und macht so text',
    },
    {
      name: 'acht',
      text: 'achtsam und so',
    },
    {
      name: 'neun',
      text: 'neun ist ne gute zahl',
    },
  ];

  const foundItems=[0,0,0,0,0,0,0]

  // Get index of found marker sent from iFrame
  window.addEventListener('message', function(e) {
    const data = e.data;
    foundItems[e.data]=1
  console.log('marker ' + e.data);    
});

  function testFn() {
    if (this.classList.contains('--found')) {
      console.log('unlocked');
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
    <div class="overlay" transition:fade={{ duration: 200 }}>
      <InfoPanel
        itemName={itemText[currentSelectedItem].name}
        itemDescription={itemText[currentSelectedItem].text}
        on:click={hideInfo}
      />
    </div>
    {:else}
  <p class="intro-paragraph">
    Als ich hier gelandet bin, sind mir ein paar Geschichten aus dem Rucksack
    gefallen. Sie haben sich in verschiedenen Dimensionen versteckt.
  </p>

  <h2>bisher gefunden:</h2>
  <section class="collectibles">
    {#each itemText as items, i}
      <button
        on:click={testFn}
        data-id={i + 1}
        class={`item${i + 1} collectible ${foundItems[i] ==1 ? '--found' : ''}`}>❉</button
      >
    {/each}
    <!-- <button data-id="2" class="item2 collectible">❉</button>
        <button data-id="3" class="item3 collectible">❉</button>
        <button data-id="4" class="item4 collectible">❉</button>
        <button data-id="5" class="item5 collectible">❉</button>
        <button data-id="6" class="item6 collectible">❉</button>
        <button data-id="7" class="item7 collectible --found">❉</button>
        <button data-id="8" class="item8 collectible">❉</button>
        <button data-id="9" class="item9 collectible">❉</button>
        <button data-id="10" class="item10 collectible">❉</button>
        <button data-id="11" class="item11 collectible">❉</button>
        <button data-id="12" class="item12 collectible">❉</button> -->
  </section>
  {/if}
</main>
<footer>
  <button
    id="camera-toggle-button"
    class="camera-toggle-button"
    on:click={handleAddScene}
  >
    
  <svg
      id="open-eye-icon"
      class="--hidden"
      width="90"
      height="90"
      viewBox="0 0 90 62"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M45 61.9167C37.7561 62.0069 30.5871 60.4435 24.0385 57.3455C18.9624 54.8687 14.4042 51.4482 10.6074 47.2666C6.58575 42.9432 3.41916 37.8974 1.27501 32.3957L0.833344 31L1.29709 29.6044C3.44278 24.1075 6.60255 19.063 10.6118 14.7334C14.4073 10.5522 18.9639 7.13176 24.0385 4.65461C30.5872 1.55671 37.7561 -0.0066891 45 0.0833621C52.2439 -0.00653365 59.4128 1.55686 65.9615 4.65461C71.0377 7.13119 75.5959 10.5517 79.3926 14.7334C83.4219 19.051 86.5895 24.0984 88.725 29.6044L89.1667 31L88.7029 32.3957C81.7741 50.4324 64.3194 62.223 45 61.9167ZM45 8.9167C29.9651 8.44557 16.1654 17.1984 10.1834 31C16.1645 44.8025 29.9648 53.5557 45 53.0834C60.0346 53.5533 73.8336 44.8009 79.8166 31C73.8424 17.1917 60.0376 8.43563 45 8.9167ZM45 44.25C38.6282 44.2922 33.1164 39.8217 31.8426 33.5784C30.5688 27.335 33.8889 21.0626 39.768 18.6054C45.647 16.1481 52.4431 18.1923 55.9911 23.4851C59.539 28.7779 58.8479 35.841 54.3413 40.3457C51.8738 42.8423 48.5102 44.2481 45 44.25Z"
        fill="black"
      />
    </svg>
    <svg
      id="closed-eye-icon"
      width="90"
      height="90"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g data-name="Layer 2">
        <g data-name="eye-off-2">
          <rect width="24" height="24" opacity="0" />
          <path
            d="M17.81 13.39A8.93 8.93 0 0 0 21 7.62a1 1 0 1 0-2-.24 7.07 7.07 0 0 1-14 0 1 1 0 1 0-2 .24 8.93 8.93 0 0 0 3.18 5.77l-2.3 2.32a1 1 0 0 0 1.41 1.41l2.61-2.6a9.06 9.06 0 0 0 3.1.92V19a1 1 0 0 0 2 0v-3.56a9.06 9.06 0 0 0 3.1-.92l2.61 2.6a1 1 0 0 0 1.41-1.41z"
          />
        </g>
      </g>
    </svg>
  </button>
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
