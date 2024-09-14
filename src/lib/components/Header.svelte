<!-- src/lib/components/Headbar.svelte -->
<script lang="ts">
    import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
    import { onMount } from 'svelte';
    import { invoke } from '@tauri-apps/api/core';

    const appWindow = getCurrentWebviewWindow();
    let iftop: boolean = false;

    onMount(() => {
        appWindow.setTitle('Settings');

        const minimizeButton = document.getElementById('titlebar-minimize');
        if (minimizeButton) {
            minimizeButton.addEventListener('click', () => appWindow.minimize());
        }

        const maximizeButton = document.getElementById('titlebar-maximize');
        if (maximizeButton) {
            maximizeButton.addEventListener('click', () => appWindow.toggleMaximize());
        }

        const closeButton = document.getElementById('titlebar-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => appWindow.close());
        }
    });

    function top() {
        iftop = !iftop;
        invoke('set_window_on_top', { alwaysOnTop: iftop });
    }
</script>

<div data-tauri-drag-region class="titlebar">
    <div class="titlebar-button">
        <a href="/settings">settings</a>
    </div>
    <div class="titlebar-button">
        <button on:click={top}>TOP</button>
    </div>

    <div class="titlebar-button" id="titlebar-minimize">
        <img src="https://api.iconify.design/mdi:window-minimize.svg" alt="minimize" />
    </div>
    <div class="titlebar-button" id="titlebar-maximize">
        <img src="https://api.iconify.design/mdi:window-maximize.svg" alt="maximize" />
    </div>
    <div class="titlebar-button" id="titlebar-close">
        <img src="https://api.iconify.design/mdi:close.svg" alt="close" />
    </div>
</div>

<style>
    .titlebar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #333;
        color: white;
        padding: 0.5rem;
    }

    .titlebar-button {
        margin: 0 0.5rem;
    }

    .titlebar-button img {
        width: 20px;
        height: 20px;
        cursor: pointer;
    }
</style>