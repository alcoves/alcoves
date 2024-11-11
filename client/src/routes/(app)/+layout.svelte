<script lang="ts">
    import "../../app.css";
    import DarkModeToggle from "$lib/components/DarkModeToggle.svelte";
    import { user } from "$lib/stores/user";
    import { goto } from "$app/navigation";
    import { PUBLIC_ALCOVES_API_URL } from '$env/static/public'
    import Uploader from "$lib/components/Uploader.svelte";

    let { data, children } = $props();
    user.set(data.authenticatedUser);

    async function handleLogout() {
        try {
            const response = await fetch(
                `${PUBLIC_ALCOVES_API_URL}/api/auth/logout`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                },
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            goto("/login");
        } catch (error) {
            console.error("Login Error:", error);
        }
    }
</script>

<div class="flex h-screen bg-base-100 text-base-content">
    <!-- Sidebar -->
    <aside class="w-48 text-base-content flex-shrink-0">
        <div class="p-6 text-lg font-semibold">
            <a href="/" class="hover:text-primary">Alcoves</a>
        </div>
        <nav class="mt-10">
            <a href="/" class="block py-2.5 px-4 hover:bg-base-300">Home</a>
            <a href="/test" class="block py-2.5 px-4 hover:bg-base-300">Test</a>
        </nav>
    </aside>

    <div class="flex-1 flex flex-col">
        <!-- Topbar -->
        <div class="navbar bg-base-100">
            <div class="flex-1"></div>
            <div class="flex-none gap-2">
                <Uploader />
                <DarkModeToggle />
                <div class="dropdown dropdown-end">
                    <div
                        tabindex="0"
                        role="button"
                        class="btn btn-ghost btn-circle avatar"
                    >
                        <div class="w-10 rounded-full">
                            <img
                                alt="Tailwind CSS Navbar component"
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                            />
                        </div>
                    </div>
                    <ul
                        class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                    >
                        <li class="gap-2">
                            <button
                                type="button"
                                class="btn btn-sm"
                                onclick={handleLogout}
                            >
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Content -->
        <main class="flex-1 p-6 overflow-y-auto bg-base-100">
            {@render children()}
        </main>
    </div>
</div>
