import store, { storeClient } from '../../integrations/store';

export function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
}

const setupAuth = () => {
  const uid = readCookie('userId');
  if (uid) {
    storeClient.defaults.headers.common['x-user-uid'] = uid;
  }
};

export type ChatMessage = {
  _id: string;
  customerId: string;
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'admin' | 'staff';
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type Conversation = {
  customerId: string;
  lastMessage: {
    content: string;
    senderId: string;
    senderName: string;
    senderRole: 'customer' | 'admin' | 'staff';
    createdAt: string;
  };
  customer?: {
    displayName: string;
    avatarUrl?: string;
    email: string;
    role: string;
  };
};

export function fetchChatHistory(customerId: string): Promise<ChatMessage[]> {
  setupAuth();
  return store.get<ChatMessage[]>(`/chat/history/${customerId}`).then((res) => res || []);
}

export function fetchConversations(): Promise<Conversation[]> {
  setupAuth();
  return store.get<Conversation[]>('/chat/conversations').then((res) => res || []);
}
