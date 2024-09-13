<script lang="ts">
	import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
	import { onMount } from 'svelte';

	import Damuku from '$lib/components/damuku.svelte';
	import DamukuT from '$lib/components/damukuT.svelte';

	import { invoke } from '@tauri-apps/api/core';
const appWindow = getCurrentWebviewWindow()

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

<main class="box container flex justify-center items-center">
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

	<div class="container_body">
		<div class="title"><p class="title-p">MeowQ Space</p></div>
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

	.titlebar {
		height: 30px;
		background: #329ea3;
		user-select: none;
		display: flex;
		justify-content: flex-end;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		border-radius: 10px;
	}

	.titlebar-button {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		width: 30px;
		height: 30px;
		margin-right: 1rem;
	}

	.titlebar-button:hover {
		background: #5bbec3;
		color: #329ea3;
	}
</style>
