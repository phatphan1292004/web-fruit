import store from "../../../integrations/store";

export type ApiUser = {
  id?: number;
  firebaseUid?: string;
  displayName?: string;
  name?: string;
  email?: string;
  phone?: string;
  birthday?: string;
  gender?: string;
  memberSince?: number;
  avatarUrl?: string;
  avatar?: string;
  createdAt?: string;
};

export async function fetchUserByFirebaseUid(firebaseUid: string) {
  return store.get<ApiUser>(`/users/${firebaseUid}`);
}
