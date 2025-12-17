# 📱 React Native myAssignmentApp

A production-style **React Native CLI** application built with **Firebase Authentication**, **Firebase Database–backed user favorites**, and **Redux Toolkit** for app-level state orchestration. Designed with real-world patterns, auth-driven navigation, responsive layouts (portrait + landscape), and scalable architecture.

---

## 🧠 Architecture Overview

This app follows an **auth-first, Firebase-driven architecture** where Firebase is the single source of truth for user identity *and* user-owned data (favorites).

### Core Principles

* **Firebase Auth = single source of truth** for session & user identity
* **Favorites are user-scoped & persisted in Firebase DB** (not local-only)
* **Redux Toolkit orchestrates UI state**, not long-term user data
* **Navigation reacts to auth state**, never the opposite
* **Screens stay dumb**, logic lives in slices, listeners, and services
* **No manual session persistence** (Firebase handles it internally)
* **Responsive-first UI** (portrait + landscape supported)

---

## 🔄 App Flow (High Level)

1. App boots
2. Firebase restores auth state automatically
3. `onAuthStateChanged` fires via `authListener`
4. Auth state is synced into Redux (`authSlice`)
5. RootNavigator switches between:

**Auth Flow**

* Login
* Signup

**Main App Flow**

* Home
* Product List
* Favorites (user-specific)
* Profile (extended settings)

This prevents race conditions, stale sessions, and navigation hacks.

---

## ❤️ Favorites — How It Actually Works

Favorites are **no longer local-only**.

* Each user has their **own favorites stored in Firebase DB**
* Marking a product as favorite:

  * Requires authenticated user
  * Saves product under the user’s UID in Firebase
* Logging out does **not** clear favorites
* Logging in from another device restores favorites automatically

This makes the app multi-user safe and production-realistic.

---

## ⚙️ Setup Instructions

### Prerequisites

* Node.js (>= 18)
* npm or Yarn
* Android Studio / Xcode
* Proper React Native CLI environment

### Installation

```bash
npm install

# iOS only
cd ios && pod install && cd ..

# start metro
npm start

# run app
npm run android
npm run ios
```

---

## 🔐 Firebase Setup

1. Create a Firebase project
2. Enable **Email / Password Authentication**
3. Enable **Firebase Database** (Realtime DB or Firestore, as configured)
4. Register Android & iOS apps
5. Download:

   * `google-services.json`
   * `GoogleService-Info.plist`
6. Place files in correct native directories

### Auth Persistence

Firebase auth is initialized with persistent storage:

```js
initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
```

---

## 🔌 APIs & Tech Used

### Firebase

* **Firebase Authentication**

  * Email/Password login & signup
  * Persistent auth state
  * Profile updates

* **Firebase Database**

  * User-specific favorites storage
  * Sync across sessions & devices

### External API

* **Fake Store API**

  * Product listing
  * Categories & filtering
  * Product details

```text
https://fakestoreapi.com/products
```

---

## 🧠 State Management Strategy

### Redux Toolkit

* Auth state synced via `authSlice`
* UI-driven state (loading, flags, selections)
* Firebase remains the **data authority** for favorites

Redux is used intentionally — not abused as a database.

---

## 🗂️ Folder Structure

```text
src/
├── components/        # Reusable UI components
├── core/
│   └── firebase/
│       ├── authListener.js   # Central auth state listener
│       ├── favorites.js      # Firebase favorites CRUD
│       └── index.js          # Firebase initialization
├── navigation/        # RootNavigator, AuthFlow, stacks
├── screens/
│   ├── Auth/          # Login & Signup
│   ├── Home/
│   ├── Products/
│   ├── Favorites/
│   ├── Profile/       # Extended settings (About, License, etc.)
│   └── Splash/
├── store/
│   ├── slices/
│   │   └── authSlice.js
│   └── index.js
├── utils/             # Helpers, constants, validators
└── assets/            # Images & static assets
```

---

## 📱 UI & UX Improvements

* Full **landscape mode support**
* Responsive layouts across orientations
* Improved spacing & visual balance
* Extended profile settings (About, License, App info)

---

## ✅ Key Highlights

* Firebase-backed user favorites (multi-user safe)
* Auth-driven navigation architecture
* Redux Toolkit used with intent
* Responsive UI (portrait + landscape)
* Clean separation of concerns
* Scalable, production-style folder structure
* No auth race conditions or manual persistence

---

## 🚀 Possible Future Enhancements

* Offline-first favorites sync
* Avatar upload (Firebase Storage)
* Dark mode
* Product caching layer
* Firestore migration (if using RTDB)

---

Built with ❤️ using **React Native CLI**, **Firebase**, and real-world architectural patterns.
