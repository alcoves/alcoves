<script lang="ts">
    import { page } from "$app/stores";
    import "../../app.css";
    import { QueryClientProvider } from "@tanstack/svelte-query";
    import DarkModeToggle from "$lib/components/DarkModeToggle.svelte";
    import { user } from "$lib/stores/user";
    import { goto } from "$app/navigation";
    import { PUBLIC_ALCOVES_API_URL } from "$env/static/public";
    import Uploader from "$lib/components/Uploader.svelte";
    import { queryClient } from "$lib/api";
    import { Film, Menu } from "lucide-svelte";
    import Websocket from "$lib/components/Websocket.svelte";

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

<QueryClientProvider client={queryClient}>
    <Websocket />
    <div class="flex h-screen bg-base-100 text-base-content">
        <!-- Sidebar -->
        <div class="drawer lg:drawer-open">
            <input id="my-drawer" type="checkbox" class="drawer-toggle" />
            <div class="drawer-content">
                <div class="flex-1 flex flex-col">
                    <!-- Topbar -->
                    <div class="navbar bg-base-100">
                        <div class="flex-1">
                            <label
                                for="my-drawer"
                                class="btn btn-primary drawer-button lg:hidden"
                            >
                                <Menu />
                            </label>
                        </div>
                        <div class="flex-none gap-2">
                            <Uploader />
                            <DarkModeToggle />
                            <div class="dropdown dropdown-end">
                                <div
                                    tabindex="0"
                                    role="button"
                                    class="btn btn-ghost btn-circle avatar placeholder"
                                >
                                    <div
                                        class="bg-neutral text-neutral-content w-10 rounded-full"
                                    >
                                        <span class="text-xl"
                                            >{$user?.email[0].toUpperCase()}</span
                                        >
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

            <div class="drawer-side">
                <label
                    for="my-drawer-2"
                    aria-label="close sidebar"
                    class="drawer-overlay"
                ></label>
                <ul
                    class="menu bg-base-200 text-base-content min-h-full w-80 p-4"
                >
                    <div class="p-6 text-lg font-semibold">
                        <a href="/" class="hover:text-primary">Alcoves</a>
                    </div>
                    <li>
                        <a href="/" class:active={$page.url.pathname == "/"}>
                            <Film class="w-5 h-5" />My Library</a
                        >
                    </li>
                </ul>
            </div>
        </div>
    </div>
</QueryClientProvider>
