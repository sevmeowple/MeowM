import { BaseChatLink, type BaseChat } from '$lib/core/UnionCore';


// 扩展实现QQChatLink

// 定义消息发送者的结构
interface Sender {
	user_id: number;
	nickname: string;
	card: string;
	role: string;
}

// {
//     "self_id": 1259598502,
//     "user_id": 2125301305,
//     "time": 1725941716,
//     "message_id": 1477041363,
//     "real_id": 1477041363,
//     "message_seq": 1477041363,
//     "message_type": "group",
//     "sender": {
//         "user_id": 2125301305,
//         "nickname": "苍云古齿",
//         "card": "十年特厨不请自来（官  天驱＃9150）",
//         "role": "member"
//     },
//     "raw_message": "别炸我😭",
//     "font": 14,
//     "sub_type": "normal",
//     "message": [
//         {
//             "data": {
//                 "text": "别炸我😭"
//             },
//             "type": "text"
//         }
//     ],
//     "message_format": "array",
//     "post_type": "message",
//     "group_id": 835258191
// }

interface Say {
	text?: string;
	name?: string;
	qq?: string;
	file?: string;
	file_size?: string | number;
	url?: string;
	subtype?: number;
}

// 定义消息中的数据部分
interface MessageData {
	data: Say;
	file?: string;
	subType?: number;
	url?: string;
	file_size?: string | number;
	text?: string;
	id?: string | number;
	type: string; // 比如 "text", "face", "image" 等类型
}

// 定义整个消息的接口
interface Message {
	raw_info: any[];
	self_id: number;
	user_id: number;
	time: number;
	message_id: number;
	real_id?: number;
	message_seq: number;
	message_type: string; // 比如 "group"
	sender: Sender;
	raw_message: string;
	font: number;
	sub_type: string; // 比如 "normal"
	message: MessageData[]; // 消息体中的数据数组
	message_format: string; // "array"
	post_type: string; // 比如 "message"
	group_id?: number;
}

enum QQBaseChatType {
	normal = 'normal',
	poke = 'poke'
}

interface QQBaseChat extends BaseChat {
	message_type: QQBaseChatType;
}

class QQChatLink extends BaseChatLink {
	// QQChatLink 独有的toBaseData
	toBaseData(data: Message): BaseChat {
		if (data.message_type === 'group') {
			return {
				session_id: data.group_id?.toString() || '',
				sender_id: data.sender.card || data.sender.nickname || data.sender.user_id.toString(),
				message_type: data.sub_type,
				raw: data.message
			};
		} else if (data.message_type === 'private') {
			return {
				session_id: data.user_id.toString(),
				sender_id: data.sender.card || data.sender.nickname || data.sender.user_id.toString(),
				message_type: data.sub_type,
				raw: data.message
			};
		} else {
			return {
				session_id: '',
				sender_id: '',
				message_type: 'error',
				raw: []
			};
		}
	}

	RenderData(baseData: QQBaseChat) {
		
	}
}

export { QQChatLink };
