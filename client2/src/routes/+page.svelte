<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";

  let title = "Home"

  const updateTitle = () => {
    title = "New Title"
  }

</script>

<h1>Welcome to {title}</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<Button on:click={updateTitle}>Click me</Button>
<Input type='text' bind:value={title} />