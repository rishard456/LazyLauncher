# LazyLauncher

A truly offline app launcher that looks and feels like a real phone OS! Install apps once, run them forever - completely offline. Think of it as your own mini app ecosystem that works without any internet connection.

## Features

### 🚀 TRUE Offline Functionality
- **Complete Offline Mode**: Once installed, apps run 100% offline from local storage
- **No Internet Required**: All app files, assets, and data stored locally
- **App Store**: Browse and discover apps from a curated collection
- **One-Time Download**: Install apps once, use them forever offline
- **QR Code Scanner**: Scan Expo QR codes to instantly install apps
- **Persistent Storage**: Each app has its own isolated data storage
- **Floating Home Button**: Movable home button overlay to navigate back from any app

### 🎨 Real Phone OS Experience
- **Grid-Based Launcher**: App icons arranged in a grid like iOS/Android
- **Large Clock Widget**: Beautiful time and date display on home screen
- **Search Bar**: Quick app search (ready for implementation)
- **Dock**: Persistent bottom dock with quick access to key apps
- **Status Bar**: Time, network, and battery indicators
- **System Apps Section**: Dedicated area for system utilities
- **Smooth Animations**: Native-like transitions and interactions

### 💾 Storage & Management
- Local file system storage for app data
- App metadata management
- Install/uninstall functionality
- Persistent app storage with AsyncStorage
- Individual app data isolation

### 🔒 Permissions
The app includes all necessary permissions similar to Expo:
- Camera (for QR scanning)
- Internet (for downloading apps)
- Storage (for offline app files)
- Location (for apps that need it)
- Network state access

## Project Structure

```
LazyLauncher/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AppCard.tsx      # App display card
│   │   ├── FloatingHomeButton.tsx  # Movable home button
│   │   └── ProgressBar.tsx  # Download progress indicator
│   ├── screens/             # App screens
│   │   ├── HomeScreen.tsx   # Main launcher screen
│   │   ├── AppStoreScreen.tsx      # App store listing
│   │   ├── QRScannerScreen.tsx     # QR code scanner
│   │   └── AppRunnerScreen.tsx     # App runtime environment
│   ├── services/            # Business logic
│   │   ├── storage.ts       # File and data storage
│   │   └── appManager.ts    # App installation & management
│   ├── navigation/          # Navigation configuration
│   │   └── AppNavigator.tsx # React Navigation setup
│   ├── constants/           # App constants
│   │   ├── theme.ts         # UI theme and styling
│   │   └── index.ts         # General constants
│   └── types/               # TypeScript type definitions
│       └── index.ts         # App interfaces and types
├── App.tsx                  # Root component
├── app.json                 # Expo configuration
├── package.json             # Dependencies
└── tsconfig.json            # TypeScript configuration
```

## How It Works

### 1. App Discovery
- Open the **App Store** from the dock or home screen
- Browse available apps with beautiful card layouts
- View app details, descriptions, versions, and authors
- See which apps are already installed

### 2. TRUE Offline Installation
When you tap "Install" on an app:
1. **Downloads ALL Files**: App manifest, bundles, and assets are downloaded
2. **Stores Locally**: Everything saved to device file system
3. **Creates Storage**: Dedicated data directory for app persistence
4. **Registers App**: App added to launcher with metadata
5. **100% Offline Ready**: App can now run without any internet

Files downloaded and stored:
- `index.html` - Main app file
- `bundle.js` - App JavaScript bundle (if available)
- `manifest.json` - App metadata and configuration
- `metadata.json` - LazyLauncher app information
- `data/` - App-specific persistent storage
- `assets/` - Images, fonts, and other resources

### 3. Running Apps OFFLINE
- Apps load from `file://` protocol (LOCAL FILES ONLY)
- Runs in isolated WebView environment
- Each app has its own storage via `window.LazyStorage` API
- Floating home button always accessible
- **Zero internet requests** - everything runs locally

### 4. App Data Persistence
Apps can save data using the injected `LazyStorage` API:
```javascript
// Save data
window.LazyStorage.save('user_settings', { theme: 'dark' });

// Load data
const settings = window.LazyStorage.load('user_settings');

// Remove data
window.LazyStorage.remove('user_settings');

// Clear all app data
window.LazyStorage.clear();
```

### 5. QR Code Installation
1. Tap the Scanner icon in the dock or home screen
2. Point camera at an Expo QR code
3. Confirm installation when prompted
4. App downloads all files and assets
5. Ready to run 100% offline!

## Installation & Setup

### Prerequisites
- Node.js 18+ installed
- Expo CLI installed globally
- iOS Simulator (for iOS) or Android Emulator/Device

### Install Dependencies
```bash
npm install
```

### Run the App

**iOS:**
```bash
npm run ios
```

**Android:**
```bash
npm run android
```

**Web (for testing):**
```bash
npm run web
```

## Key Technologies

- **React Native**: Cross-platform mobile framework
- **Expo**: Development and build tooling
- **TypeScript**: Type-safe development
- **React Navigation**: Native navigation with stack-based routing
- **Expo Camera**: QR code scanning for app installation
- **Expo FileSystem**: Complete local file storage system
- **AsyncStorage**: Persistent key-value storage for app metadata
- **React Native WebView**: Offline app runtime with file:// protocol
- **React Native Reanimated**: Smooth animations for launcher
- **React Native Gesture Handler**: Touch interactions and draggable UI

## Offline Architecture

### File System Structure
```
apps/
├── app-id-1/
│   ├── index.html          # Main app file
│   ├── bundle.js           # App bundle (if available)
│   ├── manifest.json       # Expo manifest
│   ├── metadata.json       # LazyLauncher metadata
│   ├── data/               # App persistent storage
│   │   └── storage.json    # App data
│   └── assets/             # Images, fonts, etc.
├── app-id-2/
│   └── ...
```

### Storage Layers
1. **File System** (Expo FileSystem): Complete app bundles and assets
2. **AsyncStorage**: App metadata, installed apps list
3. **WebView LocalStorage**: Per-app data persistence
4. **Isolated Storage**: Each app has its own data directory

### Offline Guarantees
- ✅ Apps load from local file system only
- ✅ No network requests after installation
- ✅ All assets and resources stored locally
- ✅ Persistent data survives app restarts
- ✅ Works in airplane mode
- ✅ Complete isolation between apps

## App Store Configuration

The app store currently uses mock data defined in `src/constants/index.ts`. To connect to a real API:

1. Update `MOCK_APP_STORE_APPS` or replace with API calls
2. Modify `AppStoreScreen.tsx` to fetch from your backend
3. Ensure app manifests follow the `AppManifest` interface

## Development

### Adding New Apps to the Store
Edit `src/constants/index.ts` and add to `MOCK_APP_STORE_APPS`:

```typescript
{
  id: 'unique-app-id',
  name: 'App Name',
  description: 'App description',
  icon: '🎯',  // Emoji icon
  version: '1.0.0',
  author: 'Author Name',
  bundleUrl: 'https://expo.dev/@username/app',
  isInstalled: false,
}
```

### Customizing the Theme
Modify colors, spacing, and typography in `src/constants/theme.ts`:

```typescript
export const COLORS = {
  primary: '#6366f1',     // Change primary color
  background: '#0f172a',  // Change background
  // ... more colors
};
```

## Permissions Explained

### Android
- **CAMERA**: Required for QR code scanning
- **INTERNET**: Download apps from the internet
- **READ/WRITE_EXTERNAL_STORAGE**: Store app files locally
- **ACCESS_NETWORK_STATE**: Check connectivity
- **SYSTEM_ALERT_WINDOW**: Floating home button overlay
- **ACCESS_FINE/COARSE_LOCATION**: For apps that need location

### iOS
- **NSCameraUsageDescription**: QR code scanning
- **NSPhotoLibraryUsageDescription**: App asset management
- **NSLocationWhenInUseUsageDescription**: Location services for apps

## Architecture Highlights

### Storage Service
Manages file system operations and app data persistence:
- Creates isolated directories for each app
- Handles app metadata storage
- Provides CRUD operations for installed apps

### App Manager
Handles app lifecycle:
- Download and installation logic
- QR code manifest parsing
- Uninstallation and cleanup
- Progress tracking for downloads

### Floating Home Button
- Fully draggable and movable
- Snaps to screen edges
- Always accessible from any running app
- Uses gesture handlers for smooth interactions

## Future Enhancements

- [ ] App update mechanism
- [ ] Search and filtering in App Store
- [ ] App categories and collections
- [ ] User ratings and reviews
- [ ] Real-time app sync
- [ ] Push notifications for app updates
- [ ] App screenshots and previews
- [ ] Multi-language support
- [ ] App permissions management
- [ ] Cloud backup for installed apps

## Troubleshooting

### Camera permissions not working
- Ensure you've granted camera permissions in device settings
- Rebuild the app after adding camera permissions

### Apps not installing
- Check internet connectivity
- Verify the QR code contains a valid manifest URL
- Check console logs for detailed error messages

### Floating button not showing
- Check if the button is hidden behind other elements
- Verify the app is running (not in loading state)

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for learning and development.

## Author

Created with ❤️ by LazyDev Team

---

**Note**: This is a demonstration project showcasing offline app launcher capabilities. For production use, implement proper security measures, error handling, and app validation.
