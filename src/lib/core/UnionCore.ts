import { GetLinked } from '$lib/utils/web';
import { storeManager } from '$lib/stores/DataStore';
import { type Writable } from 'svelte/store';
import WebSocket from '@tauri-apps/plugin-websocket';

import { init, classModule, propsModule, styleModule, eventListenersModule } from 'snabbdom';

const patch = init([classModule, propsModule, styleModule, eventListenersModule]);

interface BaseData {
	type: string;
	text?: string;
	img_file?: File;
	url?: string;
}

interface BaseChat {
	session_id: string;
	sender_id: string;
	message_type: string;
	sender_img_file?: File;
	sender_img_url?: string;
	sender_img_type?: string; //'file' | 'url'
	target_id?: string;
	raw: BaseData[];
}

interface BaseChatLink {
	// 可以用来屏蔽的字段
	hide?: string[];
	show?: string[];
	woke_type: 'show' | 'hide'; //show表示白名单，hide表示黑名单
	// 唯一标识
	id: string;
	link_status: boolean;
	// 链接地址
	link_url: string;
	store?: Writable<BaseChat[]>;
	ws?: WebSocket;
	// 链接
	Init(): void;
	Link(): void;
	DisLink(): void;
	Hide: () => void;
	DeHide: () => void;
	TypeChange: () => void;
	toBaseData(data: any): BaseChat;
	DataUpdate(baseData: BaseChat): void;
	RenderData(baseData: BaseChat): any;
	toBaseRaw(data: any[]): BaseData[];
}

// 具体实现BaseChatLink
class BaseChatLink implements BaseChatLink {
	link_status: boolean = false;

	constructor(woke_type: 'show' | 'hide', id: string, link_url: string) {
		this.woke_type = woke_type;
		this.id = id;
		this.link_url = link_url;
	}

	Init(): void {
		// 初始化store
		storeManager.addStore(this.id);
		this.store = storeManager.getStore(this.id);
		console.log(this.store);
	}

	DataUpdate(baseData: BaseChat): void {
		this.store?.update((data) => {
			data.push(baseData);
			return data;
		});
	}

	async Link() {
		this.ws = await GetLinked(
			this.link_url,
			this.toBaseData,
			() => {
				this.link_status = true;
			},
			this.DataUpdate.bind(this)
		);
	}

	async DisLink() {
		if (this.ws) {
			this.ws.disconnect();
		}
		this.link_status = false;
	}

	RenderData(baseData: BaseChat) {}
}

export type { BaseData, BaseChat };

export { BaseChatLink, patch };
