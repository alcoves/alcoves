<script>
  import * as Card from "$lib/components/ui/card";
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
</script>

<Card.Root>
  <Card.Header>
    <h3 class="text-xl">Sign Up</h3>
  </Card.Header>

  <Card.Content>
    <form method="POST" class="flex flex-col gap-2">
      <Input
        class="w-72"
        required
        name="email"
        type="email"
        placeholder="Email"
      />
      <Input required name="password" type="password" placeholder="Password" />
      <button class="mt-4 bg-slate-800 text-white py-2 px-4 rounded">
        Sign Up
      </button>
    </form>
    <a
      href="/login"
      class="mt-2 flex justify-center text-blue-500 hover:underline"
    >
      Or log in
    </a>
  </Card.Content>
</Card.Root>
