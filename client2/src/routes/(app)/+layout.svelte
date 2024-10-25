<script>
    import "../../app.css";

    import DarkModeToggle from "$lib/components/DarkModeToggle.svelte";
    import { ModeWatcher } from "mode-watcher";
</script>

<div
    class="flex h-screen bg-slate-100 dark:bg-slate-900 light:text-slate-200 dark:text-slate-50"
>
    <ModeWatcher />

    <!-- Sidebar -->
    <aside class="w-48 bg-slate-800 dark:bg-slate-900 text-white flex-shrink-0">
        <div class="p-6 text-lg font-semibold">
            <a href="/" class="hover:text-blue-300">Alcoves</a>
        </div>
        <nav class="mt-10">
            <a href="/" class="block py-2.5 px-4 hover:bg-slate-700">Home</a>
            <a href="/test" class="block py-2.5 px-4 hover:bg-slate-700">Test</a
            >
        </nav>
    </aside>

    <div class="flex-1 flex flex-col">
        <!-- Topbar -->
        <header
            class="bg-slate-100 dark:bg-slate-950 shadow p-4 flex justify-between items-center"
        >
            <h1 class="text-xl font-bold dark:text-slate-50">Welcome</h1>
            <div class="flex items-center space-x-4">
                <DarkModeToggle />
            </div>
        </header>

        <!-- Content -->
        <main class="flex-1 p-6 overflow-y-auto bg-slate-100 dark:bg-slate-950">
            <slot />
        </main>
    </div>
</div>
