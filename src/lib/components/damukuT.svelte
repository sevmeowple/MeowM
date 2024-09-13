<script lang="ts">
	import { QQChatLink } from '$lib/plugins/QQ';
	import { type BaseChat } from '$lib/core/UnionCore';
	import { onMount } from 'svelte';

	let box_section: HTMLElement;

	let show: BaseChat[];
	let QQ = new QQChatLink('hide', 'QQ', 'ws://127.0.0.1:3002');
	QQ.Init();
	QQ.Link();

	// 观察QQ的store是否有变化
	if (QQ.store) {
		QQ.store.subscribe((value) => {
			console.log(value);
			show = value;
			scrollChatBottom('smooth');
		});
	}

	function scrollChatBottom(behavior?: ScrollBehavior): void {
		if (box_section) {
			box_section.scrollTo({ top: box_section.scrollHeight, behavior });
		}
	}

	onMount(() => {});
</script>

<div class="box" bind:this={box_section}>
	{#each show as item}
		<div class="box-msg">
			<p>{item.sender_id}</p>
			{#each item.raw as msg}
				<p>{msg.data.text}</p>
			{/each}
		</div>
	{/each}
</div>

<style>
	.box {
		height: 100%;
	}
	.box-msg {
		margin-bottom: 0.5rem;
	}
</style>
