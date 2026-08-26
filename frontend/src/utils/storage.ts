import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage = {
  async secureGet(key: string, fallback: string | null = null): Promise<string | null> {
    try {
      const value = await SecureStore.getItemAsync(key);
      return value ?? fallback;
    } catch {
      return fallback;
    }
  },

  async secureSet(key: string, value: string): Promise<boolean> {
    try {
      await SecureStore.setItemAsync(key, value);
      return true;
    } catch {
      return false;
    }
  },

  async secureRemove(key: string): Promise<boolean> {
    try {
      await SecureStore.deleteItemAsync(key);
      return true;
    } catch {
      return false;
    }
  },

  async get(key: string, fallback: string | null = null): Promise<string | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ?? fallback;
    } catch {
      return fallback;
    }
  },

  async set(key: string, value: string): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },

  async remove(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
};
