<script>
  import * as Card from "$lib/components/ui/card";
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";

  let email = "";
  let password = "";

  async function handleSubmit(event) {
    event.preventDefault();
    const response = await fetch("https://api.example.com/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      // Handle successful response
      console.log("Sign up successful");
    } else {
      // Handle error response
      console.error("Sign up failed");
    }
  }
</script>

<Card.Root>
  <Card.Header>
    <h3 class="text-xl">Log In</h3>
  </Card.Header>

  <Card.Content>
    <form class="flex flex-col gap-2" on:submit={handleSubmit}>
      <Input
        class="w-72"
        placeholder="Email"
        bind:value={email}
        type="email"
        required
      />
      <Input
        placeholder="Password"
        bind:value={password}
        type="password"
        required
      />
      <Button
        type="submit"
        class="mt-4 bg-slate-800 text-white py-2 px-4 rounded"
      >
        Log in
      </Button>
      <a
        href="/signup"
        class="flex justify-center text-blue-500 hover:underline"
      >
        Or create an account
      </a>
    </form>
  </Card.Content>
</Card.Root>
