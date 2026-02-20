# Capacitor

## Overview
Capacitor converts web apps to native iOS/Android apps with access to native device APIs.

## Setup

```bash
npm install @capacitor/core @capacitor/cli
npx cap init "My App" com.mycompany.myapp --web-dir dist

npm install @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android
```

## capacitor.config.ts

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mycompany.myapp',
  appName: 'My App',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
```

## Native Plugins

```typescript
import { Camera, CameraResultType } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { Storage } from '@capacitor/preferences';
import { PushNotifications } from '@capacitor/push-notifications';

// Camera
async function takePicture() {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.DataUrl,
  });
  return image.dataUrl;
}

// Location
async function getCurrentLocation() {
  const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
  return { lat: position.coords.latitude, lng: position.coords.longitude };
}

// Secure Storage
await Storage.set({ key: 'authToken', value: token });
const { value } = await Storage.get({ key: 'authToken' });

// Push Notifications
await PushNotifications.requestPermissions();
await PushNotifications.register();
PushNotifications.addListener('registration', ({ value: token }) => {
  // Send token to server
  fetch('/api/push/register', { method: 'POST', body: JSON.stringify({ token }) });
});
```

## Build & Deploy

```bash
# Build web app first
npm run build

# Sync to native projects
npx cap sync

# Open in Xcode / Android Studio
npx cap open ios
npx cap open android
```

## Live Reload During Development

```typescript
// capacitor.config.ts
const config: CapacitorConfig = {
  server: {
    url: 'http://192.168.1.100:3000', // your local IP
    cleartext: true,
  },
};
```

## Best Practices
- Always call `cap sync` after adding plugins or building
- Use `@capacitor/preferences` (not localStorage) for persistent storage
- Test on real devices — simulators miss camera, GPS, push notification behaviors
- Handle permissions gracefully with fallback UI

## Resources
- [Capacitor docs](https://capacitorjs.com/docs)
