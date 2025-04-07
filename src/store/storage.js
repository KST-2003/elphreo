import { Storage } from '@capacitor/storage';

export const setToken = async (token) => {
  await Storage.set({ key: 'auth_token', value: token });
};

export const getToken = async () => {
  const result = await Storage.get({ key: 'auth_token' });
  return result.value;
};

export const removeToken = async () => {
  await Storage.remove({ key: 'auth_token' });
};

export const setJustLoggedIn = async () => {
  await Storage.set({ key: 'just_logged_in', value: 'true' });
};

export const getJustLoggedIn = async () => {
  const result = await Storage.get({ key: 'just_logged_in' });
  return result.value === 'true';
};

export const clearJustLoggedIn = async () => {
  await Storage.remove({ key: 'just_logged_in' });
};
