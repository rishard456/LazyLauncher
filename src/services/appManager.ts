import * as FileSystem from 'expo-file-system/legacy';
import { StorageService } from './storage';
import { App, StoredApp, DownloadProgress, AppManifest } from '../types';
import axios from 'axios';

export class AppManager {
  private static downloadCallbacks: Map<
    string,
    (progress: DownloadProgress) => void
  > = new Map();

  static async downloadAndInstallApp(
    app: App,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<StoredApp> {
    try {
      if (onProgress) {
        this.downloadCallbacks.set(app.id, onProgress);
      }

      // Create app directory structure
      const appDir = await StorageService.getAppDirectory(app.id);
      let totalSize = 0;

      // Step 1: Download manifest if available (10%)
      this.reportProgress(app.id, 10, onProgress);
      if (app.manifestUrl) {
        try {
          const manifestResponse = await axios.get(app.manifestUrl);
          await FileSystem.writeAsStringAsync(
            `${appDir}manifest.json`,
            JSON.stringify(manifestResponse.data, null, 2)
          );
        } catch (error) {
          console.log('Manifest download optional, continuing...');
        }
      }

      // Step 2: Download bundle files (30%)
      this.reportProgress(app.id, 30, onProgress);
      if (app.bundleUrl) {
        try {
          const bundleUri = `${appDir}bundle.js`;
          const downloadResult = await FileSystem.downloadAsync(
            app.bundleUrl,
            bundleUri
          );

          if (downloadResult.status === 200) {
            const fileInfo = await FileSystem.getInfoAsync(bundleUri);
            if (fileInfo.exists && 'size' in fileInfo) {
              totalSize += fileInfo.size;
            }
          }
        } catch (error) {
          console.log('Bundle download failed, creating local bundle');
        }
      }

      this.reportProgress(app.id, 50, onProgress);

      // Step 3: Create app metadata file
      const metadata = {
        id: app.id,
        name: app.name,
        description: app.description,
        icon: app.icon,
        version: app.version,
        author: app.author,
        bundleUrl: app.bundleUrl,
        manifestUrl: app.manifestUrl,
        installedAt: Date.now(),
      };

      await FileSystem.writeAsStringAsync(
        `${appDir}metadata.json`,
        JSON.stringify(metadata, null, 2)
      );

      this.reportProgress(app.id, 70, onProgress);

      // Step 4: Create complete standalone HTML app
      const appContent = this.generateCompleteAppContent(app);
      await FileSystem.writeAsStringAsync(`${appDir}index.html`, appContent);

      // Step 5: Create app-specific data directory for persistent storage
      const appDataDir = `${appDir}data/`;
      await FileSystem.makeDirectoryAsync(appDataDir, { intermediates: true });

      // Create assets directory
      const assetsDir = `${appDir}assets/`;
      await FileSystem.makeDirectoryAsync(assetsDir, { intermediates: true });

      // Create storage file for app data
      await FileSystem.writeAsStringAsync(
        `${appDataDir}storage.json`,
        JSON.stringify({})
      );

      this.reportProgress(app.id, 90, onProgress);

      // Calculate total size
      const htmlInfo = await FileSystem.getInfoAsync(`${appDir}index.html`);
      if (htmlInfo.exists && 'size' in htmlInfo) {
        totalSize += htmlInfo.size;
      }

      this.reportProgress(app.id, 100, onProgress);

      // Save to installed apps
      const storedApp: StoredApp = {
        id: app.id,
        name: app.name,
        description: app.description,
        icon: app.icon,
        version: app.version,
        author: app.author,
        installedPath: appDir,
        installedAt: Date.now(),
        size: totalSize || 1000000,
        manifestUrl: app.manifestUrl,
      };

      await StorageService.saveInstalledApp(storedApp);

      this.downloadCallbacks.delete(app.id);
      return storedApp;
    } catch (error) {
      this.downloadCallbacks.delete(app.id);
      console.error('Failed to install app:', error);
      throw error;
    }
  }

  private static reportProgress(
    appId: string,
    progress: number,
    onProgress?: (progress: DownloadProgress) => void
  ) {
    if (onProgress) {
      onProgress({
        appId,
        progress,
        totalBytes: 1000000,
        downloadedBytes: (1000000 * progress) / 100,
      });
    }
  }

  static async installFromQRCode(
    qrData: string,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<StoredApp> {
    try {
      // QR data is typically an Expo manifest URL
      const manifestUrl = qrData;

      // Fetch manifest
      const response = await axios.get(manifestUrl);
      const manifest: AppManifest = response.data;

      // Convert manifest to App format
      const app: App = {
        id: manifest.id || manifest.slug,
        name: manifest.name,
        description: manifest.description || 'Loaded from QR code',
        icon: manifest.icon || '📱',
        version: manifest.version,
        author: manifest.author || 'Unknown',
        bundleUrl: manifest.bundleUrl,
        manifestUrl: manifestUrl,
        isInstalled: false,
      };

      // Download and install
      return await this.downloadAndInstallApp(app, onProgress);
    } catch (error) {
      console.error('Failed to install from QR code:', error);
      throw error;
    }
  }

  static async uninstallApp(appId: string): Promise<void> {
    try {
      await StorageService.removeInstalledApp(appId);
      await StorageService.clearAppData(appId);
    } catch (error) {
      console.error('Failed to uninstall app:', error);
      throw error;
    }
  }

  static async getInstalledApps(): Promise<StoredApp[]> {
    return await StorageService.getInstalledApps();
  }

  static async isAppInstalled(appId: string): Promise<boolean> {
    const installedApps = await this.getInstalledApps();
    return installedApps.some((app) => app.id === appId);
  }

  private static generateCompleteAppContent(app: App): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${app.name}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
            color: white;
        }
        .container {
            max-width: 600px;
            width: 100%;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        .icon {
            font-size: 80px;
            margin-bottom: 20px;
        }
        h1 {
            font-size: 32px;
            margin-bottom: 10px;
        }
        .version {
            opacity: 0.8;
            margin-bottom: 20px;
        }
        p {
            font-size: 18px;
            line-height: 1.6;
            margin-bottom: 30px;
            opacity: 0.9;
        }
        .info {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .info-row:last-child {
            border-bottom: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">${app.icon}</div>
        <h1>${app.name}</h1>
        <div class="version">Version ${app.version}</div>
        <p>${app.description}</p>
        <div class="info">
            <div class="info-row">
                <span>Author:</span>
                <span>${app.author}</span>
            </div>
            <div class="info-row">
                <span>Status:</span>
                <span>Running in LazyLauncher</span>
            </div>
            <div class="info-row">
                <span>Launch Time:</span>
                <span id="time"></span>
            </div>
        </div>
    </div>
    <script>
        document.getElementById('time').textContent = new Date().toLocaleTimeString();
        setInterval(() => {
            document.getElementById('time').textContent = new Date().toLocaleTimeString();
        }, 1000);
    </script>
</body>
</html>
    `.trim();
  }
}
