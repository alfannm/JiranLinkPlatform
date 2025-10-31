# Capacitor Setup Guide for AppGallery Export

This guide will help you convert your React web app into an Android APK with HMS Core integration for publishing to Huawei AppGallery.

## Prerequisites

1. **Node.js** (v16 or higher)
2. **Android Studio** (latest version)
3. **Huawei Developer Account** (for AppGallery)
4. **HMS Core SDK** (will be integrated in Android Studio)

## Step 1: Install Capacitor

Run these commands in your project root:

```bash
# Install Capacitor core and CLI
npm install @capacitor/core @capacitor/cli

# Install Android platform
npm install @capacitor/android

# Install additional plugins
npm install @capacitor/geolocation @capacitor/app @capacitor/splash-screen
```

## Step 2: Update package.json

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "build": "vite build",
    "cap:init": "cap init",
    "cap:add:android": "cap add android",
    "cap:sync": "cap sync",
    "cap:open:android": "cap open android",
    "android:build": "npm run build && cap sync && cap open android"
  }
}
```

## Step 3: Initialize Capacitor

```bash
# Initialize Capacitor (if not already done)
npx cap init "Community Sharing" "com.yourcompany.sharingapp"

# Add Android platform
npx cap add android
```

## Step 4: Build Your React App

```bash
# Build the production version
npm run build

# Sync with Capacitor
npx cap sync
```

## Step 5: Configure Android Project for HMS Core

1. **Open Android Studio:**
```bash
npx cap open android
```

2. **Download HMS Core SDK:**
   - Visit [Huawei Developer Console](https://developer.huawei.com/consumer/en/)
   - Create a new app project
   - Download the `agconnect-services.json` file
   - Place it in `android/app/` directory

3. **Update `android/build.gradle`:**
```gradle
buildscript {
    repositories {
        google()
        mavenCentral()
        // Add Huawei Maven repository
        maven { url 'https://developer.huawei.com/repo/' }
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.0.0'
        // Add HMS Core Gradle plugin
        classpath 'com.huawei.agconnect:agcp:1.9.1.301'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
        // Add Huawei Maven repository
        maven { url 'https://developer.huawei.com/repo/' }
    }
}
```

4. **Update `android/app/build.gradle`:**
```gradle
apply plugin: 'com.android.application'
apply plugin: 'com.huawei.agconnect'

android {
    namespace "com.yourcompany.sharingapp"
    compileSdkVersion 33
    
    defaultConfig {
        applicationId "com.yourcompany.sharingapp"
        minSdkVersion 24
        targetSdkVersion 33
        versionCode 1
        versionName "1.0"
    }
    
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}

dependencies {
    implementation fileTree(dir: 'libs', include: ['*.jar'])
    implementation project(':capacitor-android')
    
    // HMS Core Location Kit
    implementation 'com.huawei.hms:location:6.11.0.300'
    
    // HMS Core Base SDK
    implementation 'com.huawei.hms:base:6.11.0.300'
    
    // Other dependencies as needed
}
```

## Step 6: Create HMS Location Service Plugin

Create a custom Capacitor plugin for HMS Location:

**File: `android/app/src/main/java/com/yourcompany/sharingapp/HMSLocationPlugin.java`**

```java
package com.yourcompany.sharingapp;

import android.Manifest;
import android.location.Location;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.huawei.hms.location.FusedLocationProviderClient;
import com.huawei.hms.location.LocationServices;

@CapacitorPlugin(
    name = "HMSLocation",
    permissions = {
        @Permission(strings = { Manifest.permission.ACCESS_FINE_LOCATION }),
        @Permission(strings = { Manifest.permission.ACCESS_COARSE_LOCATION })
    }
)
public class HMSLocationPlugin extends Plugin {
    
    private FusedLocationProviderClient fusedLocationClient;
    
    @Override
    public void load() {
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(getContext());
    }
    
    @PluginMethod
    public void getCurrentLocation(PluginCall call) {
        try {
            fusedLocationClient.getLastLocation()
                .addOnSuccessListener(location -> {
                    if (location != null) {
                        JSObject ret = new JSObject();
                        ret.put("latitude", location.getLatitude());
                        ret.put("longitude", location.getLongitude());
                        ret.put("accuracy", location.getAccuracy());
                        call.resolve(ret);
                    } else {
                        call.reject("Location not available");
                    }
                })
                .addOnFailureListener(e -> {
                    call.reject("Failed to get location", e);
                });
        } catch (Exception e) {
            call.reject("Error accessing location", e);
        }
    }
}
```

## Step 7: Register Plugin in MainActivity

**File: `android/app/src/main/java/com/yourcompany/sharingapp/MainActivity.java`**

```java
package com.yourcompany.sharingapp;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Register HMS Location Plugin
        registerPlugin(HMSLocationPlugin.class);
    }
}
```

## Step 8: Create TypeScript Interface for HMS Location

**File: `/services/hmsLocation.ts`**

```typescript
import { Capacitor } from '@capacitor/core';

interface LocationResult {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export const HMSLocation = {
  async getCurrentLocation(): Promise<LocationResult> {
    if (Capacitor.isNativePlatform()) {
      const { HMSLocation } = Capacitor.Plugins;
      return await HMSLocation.getCurrentLocation();
    } else {
      // Fallback for web
      return new Promise((resolve, reject) => {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
              });
            },
            (error) => reject(error)
          );
        } else {
          reject(new Error('Geolocation not supported'));
        }
      });
    }
  },
};
```

## Step 9: Update BrowsePage to Use HMS Location

Update the "Detect Nearby" button in `BrowsePage.tsx`:

```typescript
import { HMSLocation } from '../services/hmsLocation';

// In the component:
const handleDetectLocation = async () => {
  try {
    const location = await HMSLocation.getCurrentLocation();
    console.log('Location detected:', location);
    
    // Use location to filter nearby districts
    // You can implement reverse geocoding or distance calculation here
    toast.success(`Location detected: ${location.latitude}, ${location.longitude}`);
  } catch (error) {
    console.error('Location detection failed:', error);
    toast.error('Failed to detect location. Please enable location services.');
  }
};

// Update the button:
<Button 
  variant="outline"
  onClick={handleDetectLocation}
>
  <MapPin className="w-5 h-5" />
  Detect Nearby
</Button>
```

## Step 10: Build APK

### Debug Build (for testing):
1. Open Android Studio: `npx cap open android`
2. Click **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**
3. APK will be in `android/app/build/outputs/apk/debug/`

### Release Build (for AppGallery):
1. **Create a keystore:**
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. **Configure signing in `android/app/build.gradle`:**
```gradle
android {
    signingConfigs {
        release {
            storeFile file('path/to/my-release-key.keystore')
            storePassword 'your-store-password'
            keyAlias 'my-key-alias'
            keyPassword 'your-key-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

3. **Build release APK:**
   - In Android Studio: **Build** > **Generate Signed Bundle / APK**
   - Select **APK**
   - Choose your keystore and enter passwords
   - Select **release** build variant

## Step 11: Publishing to AppGallery

1. **Go to [AppGallery Connect](https://developer.huawei.com/consumer/en/service/josp/agc/index.html)**

2. **Create a new app:**
   - Enter app information
   - Upload your release APK
   - Add screenshots and descriptions
   - Fill in privacy policy and other required information

3. **Submit for review:**
   - Huawei will review your app (usually takes 3-5 business days)
   - Once approved, your app will be live on AppGallery

## Important Configuration Files

### AndroidManifest.xml Permissions

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

## Testing on Device

### Via USB:
```bash
# Enable USB debugging on your Huawei device
# Connect via USB
npx cap run android
```

### Via APK:
1. Build debug APK
2. Transfer to device
3. Enable "Install from Unknown Sources"
4. Install and test

## Troubleshooting

### Issue: Build fails with HMS dependencies
- Ensure you've added Huawei Maven repository to both root and app-level build.gradle
- Check that agconnect-services.json is in the correct location

### Issue: Location not working
- Check that location permissions are granted in device settings
- Verify HMS Core is installed on the test device
- Check logcat for error messages

### Issue: App crashes on startup
- Check MainActivity.java is properly configured
- Verify all plugins are registered correctly
- Check for missing dependencies

## Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [HMS Core Location Kit](https://developer.huawei.com/consumer/en/hms/huawei-locationkit/)
- [AppGallery Connect](https://developer.huawei.com/consumer/en/service/josp/agc/index.html)
- [Huawei Developer Forum](https://forums.developer.huawei.com/)

## Next Steps

1. Install Capacitor dependencies
2. Build your React app
3. Set up HMS Core in Android Studio
4. Test on a Huawei device
5. Build release APK
6. Submit to AppGallery

Good luck with your app! 🚀
