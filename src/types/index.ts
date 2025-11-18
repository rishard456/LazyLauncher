export interface App {
  id: string;
  name: string;
  description: string;
  icon: string;
  version: string;
  author: string;
  bundleUrl?: string;
  manifestUrl?: string;
  isInstalled: boolean;
  isDownloading?: boolean;
  downloadProgress?: number;
  installedPath?: string;
  size?: number;
}

export interface AppManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  slug: string;
  sdkVersion?: string;
  platforms?: string[];
  bundleUrl: string;
  icon?: string;
  author?: string;
  dependencies?: { [key: string]: string };
}

export interface DownloadProgress {
  appId: string;
  progress: number;
  totalBytes: number;
  downloadedBytes: number;
}

export interface StoredApp {
  id: string;
  name: string;
  description: string;
  icon: string;
  version: string;
  author: string;
  installedPath: string;
  installedAt: number;
  size: number;
  manifestUrl?: string;
}
