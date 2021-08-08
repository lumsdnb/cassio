<script>
    export let itemName
    export let itemDescription
</script>
<section class="collectible-info" >
  <button on:click>X</button>
    <h2 id="collectible-info-title">item {itemName}</h2>
    <div class="circle">yo</div>
    <article>
      <img
        class="collectible-info-image"
        src="https://source.unsplash.com/random/200×200"
        alt="imag"
      />
      <p id="collectible-info-text">{itemDescription}</p>
    </article>
</section>

<style>
  .collectible-info{
    background-color: var(--white);
    margin: 1rem;
    padding: 1rem;
    border-radius: 0.15rem;
    filter: drop-shadow(3px 3px 5px rgba(0, 0, 0, 0.419));
    overflow: scroll;
  }
  .collectible-info>button{
    position: absolute;
    right: 1rem;
    top: 1rem;
    padding: 2rem;
  }
</style>