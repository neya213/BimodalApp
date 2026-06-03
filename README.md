🛠️ Phase 1: Machine Level Dependencies
Before touching your code, your Windows machine needs the foundational toolings to talk to Android devices and build applications.

1. Node.js & NPM
If you don't have Node installed, download the LTS (Long Term Support) version from the official Node.js website. This automatically installs npm.

2. Java Development Kit (JDK 17)
Android builds require Java. Download and install OpenJDK 17 (or Eclipse Temurin 17).

⚠️ Important: Do not get Java 21+ unless specifically required, as older Gradle systems used by mobile frameworks can sometimes conflict with it.

3. Android Studio (For Local Testing/Emulators)
If you want to run your app on your computer via an emulator, download and install Android Studio. During installation, make sure to check:

Android SDK

Android SDK Platform (matching your target, e.g., API 35 or 36)

Android Virtual Device (Emulator)

📦 Phase 2: Project Architecture Reset
Open your project folder (C:\Users\clarence\CODEX\BimodalApp) in VS Code and run this single, clean dependency stack inside your terminal to install the correct project versions:

PowerShell
# 1. Clean out the local machine's installation caches
npm cache clean --force

# 2. Reinstall the core framework structural engine
npm install expo@^56.0.0 react@19.2.3 react-native@0.85.3 --save-exact --force

# 3. Reinstall types and compiler support configurations
npm install @types/react@~19.2.10 typescript@~5.9.2 --save-exact --force

# 4. Generate a clean, error-free TypeScript config file
npx expo customize tsconfig.json

# 5. Automatically install and repair matching secondary native libraries
npx expo install --fix
🚀 Phase 3: EAS Build Setup (For generating the Android App)
Now we install the global cloud-compiler toolchain so you can bundle the app into a downloadable file.

PowerShell
# 1. Install the Expo Application Services CLI globally on your PC
npm install -g eas-cli

# 2. Log in to your Expo Developer Account 
eas login

# 3. Link this local project directory to your Expo cloud dashboard
eas project:init
📱 Phase 4: Trigger Your First Android Build
Once all of the above is in place, you are ready to compile. Run this command to build a downloadable .apk file that you can immediately send to your phone:

PowerShell
eas build --profile preview --platform android
