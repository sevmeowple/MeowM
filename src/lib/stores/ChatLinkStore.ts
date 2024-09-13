// src/ChatLinkStore.ts
import { get, writable } from 'svelte/store';
import type { BaseChatLink } from '$lib/core/UnionCore';

interface ChatLinkInfo {
    name: string;
    status: string;
    instance: BaseChatLink;
}

interface ChatLinksStore {
    [key: string]: ChatLinkInfo;
}

const chatLinks = writable<ChatLinksStore>({});

// selfStatus 用于表示整个 chatLinks 是否为空
const selfStatus = writable<boolean>(false);

// 注册 ChatLink 实例
export function registerChatLink(name: string, link: BaseChatLink) {
    link.Init();
    link.Link();
    chatLinks.update((links) => {
        links[name] = {
            name,
            status: 'connected', // 假设初始状态为 connected
            instance: link
        };
        updateSelfStatus(links);
        return links;
    });
}

// 更新 ChatLink 状态
export function updateChatLinkStatus(name: string, status: string) {
    chatLinks.update((links) => {
        if (links[name]) {
            links[name].status = status;
        }
        updateSelfStatus(links);
        return links;
    });
}

// 获取特定的 ChatLink 实例
export function getChatLink(name: string): BaseChatLink | undefined {
    const links = get(chatLinks);
    return links[name]?.instance;
}

// 更新 selfStatus
function updateSelfStatus(links: ChatLinksStore) {
    selfStatus.set(Object.keys(links).length > 0);
}

export { chatLinks, selfStatus,type ChatLinkInfo, type ChatLinksStore };