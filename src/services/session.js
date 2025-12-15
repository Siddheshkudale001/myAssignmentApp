//MIGHT NOT BE IN USE ANYMORE
// src/services/session.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = "APP_USER";

export async function saveUserSession(user) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(user));
  } catch (e) {
    return null;
  }
}

export async function getUserSession() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export async function clearUserSession() {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (e) {
    return null;
  }
}
