<script lang="ts">
    import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
    import { onMount } from 'svelte';

    import DamukuT from '$lib/components/damukuT.svelte';

    import { invoke } from '@tauri-apps/api/core';
    const appWindow = getCurrentWebviewWindow();

    let iftop: boolean = false;
    onMount(() => {
        appWindow.setTitle('Settings');
    });

    function top() {
        iftop = !iftop;
        invoke('set_window_on_top', { alwaysOnTop: iftop });
    }
</script>

<main class="box container flex justify-center items-center">
    <div class="container_body">
        <div class="title">
            <p class="title-p">MeowQ Space</p>
        </div>
        <div class="content">
            <DamukuT />
        </div>
    </div>
</main>

<style lang="postcss">
    .box {
        height: 100%;
        min-width: 100%;
        display: flex;
        flex-direction: column;
        background: rgba(0, 0, 0, 0); /* 透明背景 */
        border-radius: 5%;
    }

    /* body分titlebar的剩余空间 */
    .container_body {
        @apply grid grid-rows-2;
        margin-top: 30px;
        height: calc(100% - 30px);
        width: 100%;
        grid-template-rows: 10% 90%;
    }

    .title-p {
        /* 置顶 */
        @apply inline-grid;
        margin-top: 1%;
        margin-left: 2%;
        font-size: 1rem;
    }

    a {
        color: var(--color-primary);
    }

    a:hover {
        text-decoration: underline;
    }
</style>