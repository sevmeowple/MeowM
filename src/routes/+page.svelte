<script lang="ts">
	import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
	import { onMount } from 'svelte';

	import DamukuT from '$lib/components/damukuT.svelte';

	import { fetch } from '@tauri-apps/plugin-http';
	import { invoke } from '@tauri-apps/api/core';
	import RSSParser from 'rss-parser';
	let feed = [];
	let rssURL = 'https://hellogithub.com/rss';

	const appWindow = getCurrentWebviewWindow();

	let iftop: boolean = false;
	onMount(() => {
		appWindow.setTitle('Settings');
	});
	async function get() {
		try {
			const response = await fetch(rssURL);
			const text = await response.text();
			const parser = new DOMParser();
			const xmlDoc = parser.parseFromString(text, 'text/xml');
			console.log(xmlDoc);
			feed = Array.from(xmlDoc.querySelectorAll('item')).map((item) => ({
				title: item.querySelector('title').textContent,
				link: item.querySelector('link').textContent
			}));
		} catch (error) {
			console.error('RSS 解析错误:', error);
		}
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
		<!-- <div class="content">
			<button on:click={get}>获取</button>
			{#if feed.length}
				<ul>
					{#each feed as item}
						<li>
							<a href={item.link}>{item.title}</a>
						</li>
					{/each}
				</ul>
			{/if}
		</div> -->
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
