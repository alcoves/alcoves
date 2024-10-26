<script lang="ts">
  let title = "Home";

  const updateTitle = () => {
    title = "New Title";
  };
</script>

<h1>Welcome to {title}</h1>
<p>
  Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the
  documentation
</p>
<button class="btn" on:click={updateTitle}>Click me</button>
<input class="input" type="text" bind:value={title} />
