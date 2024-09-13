import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { BaseChat } from '$lib/core/UnionCore';

class StoreManager {
    private stores: { [key: string]: Writable<BaseChat[]> } = {};
    private maxItems: number;

    constructor(maxItems: number = 1000) {
        this.maxItems = maxItems;
    }

    // 添加新的 store
    addStore(name: string): void {
        if (!this.stores[name]) {
            this.stores[name] = writable<BaseChat[]>([]);
        } else {
            console.warn(`Store with name "${name}" already exists.`);
        }
    }

    // 获取现有的 store
    getStore(name: string): Writable<BaseChat[]> | undefined {
        return this.stores[name];
    }

    // 删除现有的 store
    removeStore(name: string): void {
        if (this.stores[name]) {
            delete this.stores[name];
        } else {
            console.warn(`Store with name "${name}" does not exist.`);
        }
    }

    // 更新 store 数据
    updateStore(name: string, newData: BaseChat): void {
        const store = this.stores[name];
        if (store) {
            store.update((data) => {
                data.push(newData);
                if (data.length > this.maxItems) {
                    data.shift(); // 移除最旧的数据
                }
                return data;
            });
        } else {
            console.warn(`Store with name "${name}" does not exist.`);
        }
    }
}

// 创建 StoreManager 实例，设置上限为 1000 个数据
const storeManager = new StoreManager(1000);

export { storeManager };