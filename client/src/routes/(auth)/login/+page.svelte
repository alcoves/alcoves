<script>
  import { goto } from "$app/navigation";
  import { PUBLIC_ALCOVES_API_URL } from "$env/static/public";

  let email = "";
  let password = "";
  let errorMessage = "";
  let loading = false;

  let cardTitle = "Let's get logged in";
  let cardAction = "Log In";
  let alternateButtonText = "Or create an account";
  let alternateButtonLink = "/signup";

  async function handleSubmit() {
    loading = true;
    errorMessage = "";

    try {
      const response = await fetch(`${PUBLIC_ALCOVES_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Login successful:", data);
      goto("/");
    } catch (error) {
      console.error("Login Error:", error);
      errorMessage = "An error occurred during login";
    } finally {
      loading = false;
    }
  }
</script>

<div class="card bg-neutral text-neutral-content w-96">
  <div class="card-body items-center text-center">
    <h2 class="card-title">{cardTitle}</h2>
    <form on:submit|preventDefault={handleSubmit}>
      <div class="mt-2 card-actions justify-center">
        <input
          class="input w-full"
          required
          bind:value={email}
          name="email"
          type="email"
          placeholder="Email"
        />
        <input
          class="input w-full"
          required
          bind:value={password}
          name="password"
          type="password"
          placeholder="Password"
        />
        {#if errorMessage}
          <div class="text-red-500">{errorMessage}</div>
        {/if}
        <button
          class="btn w-full btn-primary mt-4"
          type="submit"
          disabled={loading}
        >
          {cardAction}
        </button>
        <a class="mt-2" href={alternateButtonLink}>{alternateButtonText}</a>
      </div>
    </form>
  </div>
</div>
