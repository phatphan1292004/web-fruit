import store, { storeClient } from '../../../integrations/store';
import { readCookie } from './products';

export interface BackendUser {
  _id: string;
  firebaseUid: string;
  displayName: string;
  email: string;
  gender?: string;
  birthDay?: string;
  avatarUrl?: string;
  active: boolean;
  role: 'customer' | 'admin' | 'staff';
  createdAt?: string;
  updatedAt?: string;
}

const setupAuth = () => {
  const uid = readCookie('userId');
  if (uid) {
    storeClient.defaults.headers.common['x-user-uid'] = uid;
  }
};

export async function fetchAdminUsers(): Promise<BackendUser[]> {
  setupAuth();
  const res = await store.get<BackendUser[]>('/users');
  return res || [];
}

export async function updateAdminUserRole(
  firebaseUid: string,
  role: 'customer' | 'admin' | 'staff'
): Promise<BackendUser | null> {
  setupAuth();
  return store.patch<BackendUser, { role: string }>(`/users/${firebaseUid}/role`, { role });
}

export async function updateAdminUserStatus(
  firebaseUid: string,
  active: boolean
): Promise<BackendUser | null> {
  setupAuth();
  return store.patch<BackendUser, { active: boolean }>(`/users/${firebaseUid}/status`, { active });
}

export async function deleteAdminUser(firebaseUid: string): Promise<any> {
  setupAuth();
  return store.del(`/users/${firebaseUid}`);
}
