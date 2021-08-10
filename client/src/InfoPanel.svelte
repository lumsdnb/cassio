<script>
    export let itemName
    export let itemDescription
    export let src
</script>
<section class="collectible-info" >
  <button on:click>X</button>
    <h2 id="collectible-info-title">{itemName}</h2>
    <!-- <div class="circle">yo</div> -->
    <article>
      <img
        class="collectible-info-image"
        {src}
        alt={`${itemName} image`}
      />
      <p id="collectible-info-text">{itemDescription}</p>
    </article>
</section>

<style>
  .collectible-info{
    background-color: var(--white);
    margin: 0;
    padding: 1rem;
    max-width: 100%;
    border-radius: 0.15rem;
    filter: drop-shadow(3px 3px 5px rgba(0, 0, 0, 0.419));
    overflow: scroll;
  }
  .collectible-info>button{
    position: absolute;
    right: 1rem;
    top: 1rem;
    font-size: 1.5rem;
    padding: 1rem;
  }

  .collectible-info>article>p::first-letter {
  font-size: 350%;
  font-family: 'eckmann';
  color: #333333;
}
.collectible-info>article{
  max-width: 90vw;
}
</style>