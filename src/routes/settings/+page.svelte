<script lang="ts">
	import { chatLinks, registerChatLink, selfStatus } from '$lib/stores/ChatLinkStore';
	import { QQChatLink } from '$lib/plugins/QQ';
	import { onMount } from 'svelte';
	interface Link {
		status: string;
		instance: QQChatLink;
	}

	let sStatus: boolean = false;
	let mode: 'show' | 'hide' = 'show';
	let name: string = 'QQ';
	let link: string = 'ws://127.0.0.1:3002';
	let links: { [key: string]: Link } = {};
	let newItem: string = '';
	function LinkQQ() {
		const QQ = new QQChatLink(mode, name, link);
		registerChatLink(name, QQ);
	}

	function AddItem() {
		links['QQ'].instance.Add(newItem);
		newItem = '';
	}

	function RemoveItem(item: string) {
		links['QQ'].instance.Remove(item);
	}

	onMount(() => {
		if (selfStatus) {
			selfStatus.subscribe((value) => {
				sStatus = value;
			});
		}
		chatLinks.subscribe((value) => {
			links = value;
		});
	});
</script>

<main class="container mx-auto flex flex-col justify-center items-center h-full p-4">
	{#if sStatus}
		<h1 class="text-3xl font-bold mb-4">Registered Sources</h1>
		<div class="tabs w-full max-w-md">
			{#each Object.keys(links) as key}
				<input type="radio" id={key} name="tab" class="hidden" checked={key === 'QQ'} />
				<label for={key} class="tab-label p-2 bg-gray-200 rounded-t cursor-pointer">{key}</label>
				<div class="tab-content p-4 border border-t-0 rounded-b">
					<p><strong>Status:</strong> {links[key].status}</p>
					<p><strong>Link:</strong> {links[key].instance.link_url}</p>
					<p><strong>Mode:</strong> {links[key].instance.mode}</p>
					<div class="flex gap-2 mt-4">
						<button class="p-2 bg-green-500 text-white rounded hover:bg-green-600">Connect</button>
						<button class="p-2 bg-red-500 text-white rounded hover:bg-red-600">Disconnect</button>
						<button class="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">Refresh</button
						>
					</div>
					<div class="mt-4 w-full">
						<h2 class="text-xl font-bold mb-2">
							{links[key].instance.mode === 'show' ? 'Whitelist' : 'Blacklist'}
						</h2>
						<button
							on:click={() =>
								(links[key].instance.mode = links[key].instance.mode === 'show' ? 'hide' : 'show')}
							class="p-2 bg-gray-500 text-white rounded mb-4"
						>
							切换到 {links[key].instance.mode === 'show' ? 'Blacklist' : 'Whitelist'}
						</button>

						<div class="flex gap-2 mb-4">
							<input
								type="text"
								bind:value={newItem}
								placeholder="输入新条目"
								class="p-2 border rounded flex-grow"
							/>
							<button
								on:click={AddItem}
								class="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">添加</button
							>
						</div>
						<ul>
							{#if links[key].instance.mode === 'show' && links[key].instance.show}
								{#each links[key].instance.show as item}
									<li class="flex justify-between items-center p-2 border-b">
										<span>{item}</span>
										<button
											on:click={() => RemoveItem(item)}
											class="text-red-500 hover:text-red-700">删除</button
										>
									</li>
								{/each}
							{:else if links[key].instance.mode === 'hide' && links[key].instance.hide}
								{#each links[key].instance.hide as item}
									<li class="flex justify-between items-center p-2 border-b">
										<span>{item}</span>
										<button
											on:click={() => RemoveItem(item)}
											class="text-red-500 hover:text-red-700">删除</button
										>
									</li>
								{/each}
							{/if}
						</ul>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<h1 class="text-3xl font-bold mb-4">Settings</h1>
		<h2 class="text-xl mb-4">
			<a href="/" class="text-blue-500 hover:underline">Home</a>
		</h2>
		<form on:submit|preventDefault={LinkQQ} class="flex flex-col gap-4 w-full max-w-md">
			<div class="flex flex-col">
				<label for="mode" class="mb-2 font-medium">Mode</label>
				<select id="mode" bind:value={mode} class="p-2 border rounded">
					<option value="show">Show</option>
					<option value="hide">Hide</option>
				</select>
			</div>
			<div class="flex flex-col">
				<label for="name" class="mb-2 font-medium">Name</label>
				<input id="name" type="text" bind:value={name} class="p-2 border rounded" required />
			</div>
			<div class="flex flex-col">
				<label for="link" class="mb-2 font-medium">Link</label>
				<input id="link" type="text" bind:value={link} class="p-2 border rounded" required />
			</div>
			<button type="submit" class="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
				>Link QQ</button
			>
		</form>
	{/if}
</main>

<style>
	.tabs {
		display: flex;
		flex-direction: column;
	}
	.tab-label {
		display: block;
		margin-bottom: -1px;
	}
	.tab-content {
		display: none;
	}
	input[type='radio']:checked + .tab-label + .tab-content {
		display: block;
	}
</style>
