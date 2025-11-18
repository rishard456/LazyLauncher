import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { STORAGE_KEYS } from '../constants';
import { StoredApp, App } from '../types';

export class StorageService {
  private static appsDirectory = `${FileSystem.documentDirectory}apps/`;

  static async initialize() {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.appsDirectory);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.appsDirectory, {
          intermediates: true,
        });
      }
    } catch (error) {
      console.error('Failed to initialize storage:', error);
    }
  }

  static async getInstalledApps(): Promise<StoredApp[]> {
    try {
      const appsJson = await AsyncStorage.getItem(STORAGE_KEYS.INSTALLED_APPS);
      return appsJson ? JSON.parse(appsJson) : [];
    } catch (error) {
      console.error('Failed to get installed apps:', error);
      return [];
    }
  }

  static async saveInstalledApp(app: StoredApp): Promise<void> {
    try {
      const apps = await this.getInstalledApps();
      const existingIndex = apps.findIndex((a) => a.id === app.id);

      if (existingIndex >= 0) {
        apps[existingIndex] = app;
      } else {
        apps.push(app);
      }

      await AsyncStorage.setItem(
        STORAGE_KEYS.INSTALLED_APPS,
        JSON.stringify(apps)
      );
    } catch (error) {
      console.error('Failed to save installed app:', error);
      throw error;
    }
  }

  static async removeInstalledApp(appId: string): Promise<void> {
    try {
      const apps = await this.getInstalledApps();
      const filteredApps = apps.filter((a) => a.id !== appId);

      await AsyncStorage.setItem(
        STORAGE_KEYS.INSTALLED_APPS,
        JSON.stringify(filteredApps)
      );

      // Also remove app directory
      const appDir = `${this.appsDirectory}${appId}/`;
      const dirInfo = await FileSystem.getInfoAsync(appDir);
      if (dirInfo.exists) {
        await FileSystem.deleteAsync(appDir, { idempotent: true });
      }
    } catch (error) {
      console.error('Failed to remove installed app:', error);
      throw error;
    }
  }

  static async getAppDirectory(appId: string): Promise<string> {
    const appDir = `${this.appsDirectory}${appId}/`;
    const dirInfo = await FileSystem.getInfoAsync(appDir);

    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(appDir, { intermediates: true });
    }

    return appDir;
  }

  static async saveAppData(
    appId: string,
    key: string,
    data: any
  ): Promise<void> {
    try {
      const storageKey = `${STORAGE_KEYS.APP_DATA_PREFIX}${appId}:${key}`;
      await AsyncStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save app data:', error);
      throw error;
    }
  }

  static async getAppData(appId: string, key: string): Promise<any> {
    try {
      const storageKey = `${STORAGE_KEYS.APP_DATA_PREFIX}${appId}:${key}`;
      const data = await AsyncStorage.getItem(storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get app data:', error);
      return null;
    }
  }

  static async clearAppData(appId: string): Promise<void> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const appKeys = allKeys.filter((key) =>
        key.startsWith(`${STORAGE_KEYS.APP_DATA_PREFIX}${appId}:`)
      );
      await AsyncStorage.multiRemove(appKeys);
    } catch (error) {
      console.error('Failed to clear app data:', error);
      throw error;
    }
  }
}
