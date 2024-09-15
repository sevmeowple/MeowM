// 该文件作用：用于存储chatlink实例，以及chatlink的状态
// 方便再次打开app时，恢复chatlink的状态

import { Store } from '@tauri-apps/plugin-store';
import type { BaseChatLink } from '$lib/core/UnionCore';

interface LinkStoreItem {
	name: string;
	instance: BaseChatLink;
}

class LinkStore {
	private static instance: LinkStore;
	private store: Store;

	private constructor() {
		this.store = new Store('chatLinks');
	}

	// 获取单例实例
	public static getInstance(): LinkStore {
		if (!LinkStore.instance) {
			LinkStore.instance = new LinkStore();
		}
		return LinkStore.instance;
	}

	// 为实例chatlink分配一个store,id为chatlink的id
	// 保存chatlink的状态
	public async setChatLink(name: string, instance: BaseChatLink): Promise<void> {
		await this.store.set(name, { name, instance });
	}

	// 获取chatlink实例
	public async getChatLink(name: string): Promise<BaseChatLink | undefined> {
		const links = await this.store.get<LinkStoreItem>(name);
		return links?.instance;
	}
}

export default LinkStore.getInstance();
