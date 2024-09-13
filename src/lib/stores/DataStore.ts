import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { BaseChat } from '$lib/core/UnionCore';

interface SignedChat extends BaseChat {
    source: string;
}

class StoreManager {
    private store: Writable<SignedChat[]> = writable<SignedChat[]>([]);
    private maxItems: number;

    constructor(maxItems: number = 1000) {
        this.maxItems = maxItems;
    }

    // 获取 store
    getStore(): Writable<SignedChat[]> {
        return this.store;
    }

    // 更新 store 数据
    updateStore(source: string, newData: BaseChat): void {
        this.store.update((data) => {
            data.push({ ...newData, source });
            if (data.length > this.maxItems) {
                data.shift(); // 移除最旧的数据
            }
            return data;
        });
    }
}

// 创建 StoreManager 实例，设置上限为 1000 个数据
const storeManager = new StoreManager(1000);

export { storeManager, type SignedChat };