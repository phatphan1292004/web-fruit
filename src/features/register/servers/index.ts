import { post } from "../../../integrations/store";

export type RegisterUserPayload = {
  firebaseUid: string;
  displayName: string;
  email: string;
};

export async function createUser(
  payload: RegisterUserPayload,
  token: string
) {
  return post(
    "/users",
    payload,
    undefined,
    undefined,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
