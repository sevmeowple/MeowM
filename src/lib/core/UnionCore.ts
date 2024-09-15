import { GetLinked } from '$lib/utils/web';
import { storeManager } from '$lib/stores/DataStore';
import WebSocket from '@tauri-apps/plugin-websocket';
import LinkStore from '$lib/stores-tauri/LinkStore';

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
	mode: 'show' | 'hide'; //show表示白名单，hide表示黑名单
	// 唯一标识
	id: string;
	link_status: boolean;
	// 链接地址
	link_url: string;
	ws?: WebSocket;
	// 链接
	Init(): void;
	Link(): void;
	DisLink(): void;
	Show(id: string): void; //白名单模式下的显示
	Hide(id: string): void; //黑名单模式下的隐藏
	Add(id: string): void;
	Remove(id: string): void;
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
		this.mode = woke_type;
		this.id = id;
		this.link_url = link_url;
		this.show = [];
		this.hide = [];
	}

	Init(): void {
		// Load data from store
		//先检查是否存在该id的store
		LinkStore.getChatLink(this.id).then((link) => {
			console.log(link);
			if (link) {
				this.show = link.show;
				this.hide = link.hide;
			} else {
				LinkStore.setChatLink(this.id, this);
			}
			LinkStore.getChatLink(this.id).then((link) => {
				console.log(link);
			});
		});
	}

	DataUpdate(baseData: BaseChat): void {
		if (this.mode === 'show') {
			// 处理白名单模式
			if (this.show && this.show.includes(baseData.session_id)) {
				console.log(this.show);
				console.log(baseData.session_id);
				console.log(baseData);
				storeManager.updateStore(this.id, baseData);
			}
		} else if (this.mode === 'hide') {
			// 处理黑名单模式
			if (!this.hide || !this.hide.includes(baseData.session_id)) {
				console.log(this.hide);
				console.log(baseData.session_id);
				console.log(baseData);
				storeManager.updateStore(this.id, baseData);
			}
		}
		// Save data to store
		LinkStore.setChatLink(this.id, this);
		LinkStore.getChatLink(this.id).then((link) => {
			console.log(link);
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

	Show(id: string) {
		if (this.mode === 'show') {
			if (!this.show) {
				this.show = [];
			}
			this.show.push(id);
			// 显式添加来触发响应式
			this.show = this.show;
		} else {
			// 如果是黑名单模式,应该先从黑名单中删除
			if (this.hide) {
				this.hide = this.hide.filter((item) => item !== id);
				this.hide = this.hide;
			}
		}
	}

	Hide(id: string) {
		if (this.mode === 'hide') {
			if (!this.hide) {
				this.hide = [];
			}
			this.hide.push(id);
			// 显式添加来触发响应式
			this.hide = this.hide;
		} else {
			// 如果是白名单模式,应该先从白名单中删除
			if (this.show) {
				this.show = this.show.filter((item) => item !== id);
				this.show = this.show;
			}
		}
	}

	Add(id: string) {
		if (this.mode === 'show') {
			this.Show(id);
		} else {
			this.Hide(id);
		}
	}

	Remove(id: string) {
		if (this.mode === 'show') {
			if (this.show) {
				this.Hide(id);
			}
		} else {
			if (this.hide) {
				this.Show(id);
			}
		}
	}

	RenderData(baseData: BaseChat) {}
}

export type { BaseData, BaseChat };

export { BaseChatLink, patch };
