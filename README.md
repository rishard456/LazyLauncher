# LazyLauncher

A modern, Expo-like offline app launcher for React Native that allows you to discover, install, and run apps completely offline - like a mini app ecosystem!

## Features

### 🚀 Core Functionality
- **App Store**: Browse and discover apps from a curated collection
- **Offline Installation**: Download and install apps for completely offline use
- **QR Code Scanner**: Scan Expo QR codes to instantly install apps
- **App Runtime**: Run installed apps in an isolated WebView environment
- **Floating Home Button**: Movable home button overlay to navigate back from any app

### 🎨 Modern UI/UX
- Beautiful, dark-themed interface with smooth animations
- Progress indicators for downloads and installations
- Card-based app listings with icons and metadata
- Bottom tab navigation for easy access
- Responsive and touch-optimized design

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
- Browse apps in the **App Store** tab
- View app details, descriptions, and metadata
- See which apps are already installed

### 2. Installation Process
When you tap "Install" on an app:
1. App metadata is fetched
2. Files are downloaded to local storage
3. Progress is shown in real-time
4. App is registered in the launcher
5. App becomes available to run offline

### 3. Running Apps
- Apps run in an isolated WebView environment
- Each app has its own storage space
- Floating home button allows quick navigation back
- Apps work completely offline once installed

### 4. QR Code Installation
1. Open the QR Scanner (camera icon)
2. Point at an Expo QR code
3. Confirm installation
4. App is downloaded and installed
5. Ready to run offline!

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
- **React Navigation**: Native navigation
- **Expo Camera**: QR code scanning
- **Expo FileSystem**: Local file storage
- **AsyncStorage**: Persistent key-value storage
- **React Native WebView**: App runtime environment
- **React Native Reanimated**: Smooth animations
- **React Native Gesture Handler**: Touch interactions

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
