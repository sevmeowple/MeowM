import WebSocket from '@tauri-apps/plugin-websocket';
import { storeManager } from '$lib/stores/DataStore';

import type { BaseChat } from '$lib/core/UnionCore';

// 通信
async function GetLinked(
	url: string,
	toBaseData: (data: any) => BaseChat,
	onConnected: () => void,
	DataUpdate: (baseData: BaseChat) => void
) {
	const ws = await WebSocket.connect(url);
	onConnected();
	ws.addListener((msg) => {
		// console.log(msg);
		let data;
		// const data = JSON.parse(msg.data);
		if (msg.type === 'Text') {
			try {
				data = JSON.parse(msg.data);
				const baseData = toBaseData(data);
				DataUpdate(baseData);
			} catch (e) {
				console.error(e);
				console.log('something wrong');
				console.log(msg);
			}
		}
	});

	return ws;
}

export { GetLinked };
