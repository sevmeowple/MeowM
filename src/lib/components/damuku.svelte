<script lang="ts">
	import { onMount } from 'svelte';
	import { listen } from '@tauri-apps/api/event';
	import type { Event } from '@tauri-apps/api/event';
	import type { Message } from '$lib/types';
	interface HelloPayload {
		message: string;
	}
	let damukuMessages: Message[] = [];

	// 获取 box 容器的引用
	let box_section: HTMLElement;

	type AvatarCache = {
		[key: string]: HTMLImageElement;
	};
	// 缓存头像 URL
	let avatarCache: AvatarCache = {};
	listen('hello', (event: Event<HelloPayload>) => {
		const payload = event.payload as HelloPayload;
		const message: Message = JSON.parse(payload.message);

		// 过滤掉 post_type 为 meta_event 的数据
		if (message.post_type === 'meta_event') {
			return;
		}

		// 通过 splice() 删除最早的一条，并重新赋值
		if (damukuMessages.length >= 10) {
			damukuMessages.splice(0, 1); // 删除最早的一条
		}

		// 确保每次都创建一个新的数组引用
		damukuMessages = [...damukuMessages, message];
		damukuMessages =[...damukuMessages];
		// 滚动到底部
		scrollChatBottom('smooth');

		console.log(damukuMessages);
	});

	function scrollChatBottom(behavior?: ScrollBehavior): void {
		if (box_section) {
			box_section.scrollTo({ top: box_section.scrollHeight, behavior });
		}
	}

	onMount(() => {
		// 确保组件挂载后执行滚动操作
		if (box_section) {
			box_section.scrollTop = box_section.scrollHeight;
		}
	});
	// 获取头像 URL，并缓存图像
	function getAvatarUrl(message: Message): string {
		let url = '';

		// 根据消息类型生成 URL
		if (message.message_type === 'group') {
			url = `https://p.qlogo.cn/gh/${message.group_id}/${message.group_id}/0`;
		} else if (message.message_type === 'private') {
			url = `https://q1.qlogo.cn/g?b=qq&nk=${message.user_id}&s=100`;
		}

		// 如果缓存中已有图像，直接返回
		if (avatarCache[url]) {
			return avatarCache[url].src;
		}

		// 如果缓存中没有，则创建一个新的 Image 对象并预加载图像
		const img = new Image();
		img.src = url;

		// 在图像加载完成后将其缓存
		img.onload = () => {
			avatarCache[url] = img;
		};

		// 返回 URL，图像可能会在第一次渲染时加载
		return url;
	}
</script>

<!-- 通过 bind:this 获取 box 的 DOM 节点引用 -->
<div class="box">
	<section class="box_section" bind:this={box_section}>
		<!-- 循环渲染 damukuMessages -->
		{#each damukuMessages as message, i (message)}
			<div class="damuku">
				<div class="message-container">
					<!-- 动态拼接头像 URL，并使用缓存 -->
					<img src={getAvatarUrl(message)} alt="avatar" class="avatar" />
					<div class="sender">
						<!-- 如果是私聊用nickname -->
						{#if message.message_type === 'group'}
							{message.sender.card}
						{:else if message.message_type === 'private'}
							{message.sender.nickname}
						{/if}
					</div>
				</div>
				<p class="message-content">
					<!-- message.message是一个数组应该循环渲染,并且每个message的type有所不同 -->
					{#each message.message as msg, i (msg)}
						{#if msg.type === 'text'}
							{msg.data.text}
						{:else if msg.type === 'at'}
							@{msg.data.qq}
						{:else if msg.type === 'image'}
							<img src={msg.data.url} alt="image" />
						{/if}
					{/each}
				</p>
			</div>
		{/each}
	</section>
</div>

<style lang="postcss">
	.box {
		@apply grid grid-rows-[1fr_auto];
		height: 100%;
	}
	.box_section {
		@apply grid grid-flow-row max-h-[500px] p-4 overflow-y-auto space-y-4 scroll-smooth;
		/* 里面元素靠右对齐 */

		/* 里面元素靠右对齐 */
		& > .damuku {
			@apply justify-end;
		}
	}

	.damuku {
		@apply inline-block bg-black bg-opacity-70 text-white p-2 rounded-lg break-words;
		margin: 0.5rem 0;
		max-width: 400px;
		width: fit-content;
		height: fit-content;
		transition:
			background-color 0.3s ease,
			opacity 0.3s ease; /* 添加渐变效果 */
		margin-right: 0;
	}

	.damuku:hover {
		@apply bg-opacity-90;
	}

	.message-container {
		@apply flex items-center space-x-2; /* 使用 Flexbox 布局，使 img 和 sender 在同一排，并添加间距 */
	}

	.avatar {
		@apply w-10 h-10 rounded-full; /* 设置图像大小，并使其为圆形 */
	}

	.sender {
		@apply font-bold text-yellow-400;
	}

	.message-content {
		@apply mt-1;
	}
</style>
