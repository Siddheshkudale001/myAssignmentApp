
import AsyncStorage from '@react-native-async-storage/async-storage';
const KEY = 'APP_USER';

export async function saveUserSession(user) {
  await AsyncStorage.setItem(KEY, JSON.stringify(user));
}
export async function clearUserSession() {
  await AsyncStorage.removeItem(KEY);
}
export async function getUserSession() {
  const json = await AsyncStorage.getItem(KEY);
  return json ? JSON.parse(json) : null;
}
