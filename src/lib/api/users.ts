import { store } from '../../integrations';

export type UserRole = 'admin' | 'customer' | 'staff';

export type UserProfile = {
  _id: string;
  firebaseUid: string;
  displayName: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PromoteToAdminPayload = {
  firebaseUid?: string;
  email?: string;
};

export type PromoteToAdminResponse = {
  message: string;
  user: {
    firebaseUid: string;
    email: string;
    role: UserRole;
  };
};

export function getProfile(firebaseUid: string) {
  return store.get<UserProfile>(`/users/${firebaseUid}`);
}

export function promoteToAdmin(payload: PromoteToAdminPayload) {
  return store.post<PromoteToAdminResponse, PromoteToAdminPayload>('/users/make-admin', payload);
}

export function changeUserRole(firebaseUid: string, role: UserRole) {
  return store.patch<UserProfile, { role: UserRole }>(`/users/${firebaseUid}/role`, { role });
}
