<script lang="ts">
	// import { QQChatLink } from '$lib/plugins/QQ';
	import { type BaseChat } from '$lib/core/UnionCore';
	import { onMount } from 'svelte';
	import { storeManager, type SignedChat } from '$lib/stores/DataStore';
	import { selfStatus } from '$lib/stores/ChatLinkStore';

	let box_section: HTMLElement;
	let store = storeManager.getStore();
	let chatstatus: boolean = false;
	let show: BaseChat[];
	// let QQ = new QQChatLink('hide', 'QQ', 'ws://127.0.0.1:3002');
	// QQ.Init();
	// QQ.Link();

	if (store) {
		store.subscribe((value) => {
			show = value;
			scrollChatBottom('smooth');
		});
	}

	if (selfStatus) {
		selfStatus.subscribe((value) => {
			chatstatus = value;
		});
	}

	function scrollChatBottom(behavior?: ScrollBehavior): void {
		if (box_section) {
			box_section.scrollTo({ top: box_section.scrollHeight, behavior });
		}
	}

	onMount(() => {
		if (box_section) {
			box_section.scrollTop = box_section.scrollHeight;
		}
		scrollChatBottom('smooth');
	});
</script>

{#if chatstatus}
	<div class="box">
		<section class="box_section" bind:this={box_section}>
			{#each show as item}
				<div class="box-msg">
					<div class="sender">
						{#if item.sender_img_type}
							{#if item.sender_img_type === 'file' && item.sender_img_file}
								<img
									class="sender-img"
									src={URL.createObjectURL(item.sender_img_file)}
									alt="头像"
								/>
							{:else if item.sender_img_type === 'url' && item.sender_img_url}
								<img class="sender-img" src={item.sender_img_url} alt="头像" />
							{/if}
						{/if}
						<p class="sender-id">{item.sender_id}</p>
					</div>
					<div class="messages">
						{#each item.raw as msg}
							{#if msg.type === 'text'}
								<p class="message-text message">{msg.text}</p>
							{:else if msg.type === 'image_url'}
								<img class="message-img message" src={msg.url} alt="图片走丢了" />
							{:else if msg.type === 'image_file' && msg.img_file}
								<img
									class="message-img message"
									src={URL.createObjectURL(msg.img_file)}
									alt="图片走丢了"
								/>
							{/if}
						{/each}
					</div>
				</div>
			{/each}
		</section>
	</div>
{:else}
	<div class="box">
		<section class="box_section" bind:this={box_section}>
			<div class="box-msg">
				<p>当前未连接任何信源</p>
				<p>请前往<a href="/settings">settings</a>进行连接</p>
			</div>
		</section>
	</div>
{/if}

<style lang="postcss">
	.box {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
		height: 100%;
		padding: 1rem;
		overflow-y: auto;
	}

	.box_section {
		@apply overflow-y-auto;
	}

	.box-msg {
		display: flex;
		flex-direction: column;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		padding: 1rem;
		margin-bottom: 0.5rem;
		border: 2px solid transparent;
		transition: border-color 0.3s ease;
	}

	.box-msg:hover {
		border-color: #007bff;
	}

	.sender-id {
		font-weight: bold;
		color: #333;
		margin-bottom: 0.5rem;
	}

	.sender-img {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		object-fit: cover;
		margin-bottom: 0.5rem;
	}

	.messages {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.message-text {
		background-color: #e0e0e0;
		border-radius: 8px;
		padding: 0.5rem;
		color: #333;
	}

	.message-img {
		width: 100px;
		height: 100px;
		border-radius: 8px;
		object-fit: cover;
	}
	.message {
		width: fit-content;
		height: inherit;
	}

	a {
		color: var(--color-primary);
	}

	a:hover {
		text-decoration: underline;
	}
</style>
