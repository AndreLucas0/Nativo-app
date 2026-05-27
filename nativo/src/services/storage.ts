import * as SecureStore from 'expo-secure-store';

import { STORAGE_KEYS } from '@/src/constants/storage';
import { User } from '@/src/types/user';

export async function saveAccessToken(token: string) {
  await SecureStore.setItemAsync(
    STORAGE_KEYS.ACCESS_TOKEN,
    token
  );
}

export async function saveRefreshToken(token: string) {
  await SecureStore.setItemAsync(
    STORAGE_KEYS.REFRESH_TOKEN,
    token
  );
}

export async function getAccessToken() {
  return SecureStore.getItemAsync(
    STORAGE_KEYS.ACCESS_TOKEN
  );
}

export async function getRefreshToken() {
  return SecureStore.getItemAsync(
    STORAGE_KEYS.REFRESH_TOKEN
  );
}

export async function saveUser(user: User) {
  await SecureStore.setItemAsync(
    STORAGE_KEYS.USER,
    JSON.stringify(user)
  );
}

export async function getUser(): Promise<User | null> {
  const user = await SecureStore.getItemAsync(
    STORAGE_KEYS.USER
  );

  if (!user) {
    return null;
  }

  return JSON.parse(user);
}

export async function clearSession() {
  await SecureStore.deleteItemAsync(
    STORAGE_KEYS.ACCESS_TOKEN
  );

  await SecureStore.deleteItemAsync(
    STORAGE_KEYS.REFRESH_TOKEN
  );

  await SecureStore.deleteItemAsync(
    STORAGE_KEYS.USER
  );
}