# 📱 React Native myAssignmentApp

A modern React Native CLI application featuring Firebase Authentication, Redux Toolkit state management, clean navigation flow, and scalable architecture. Built with production-ready patterns and a focus on performance, maintainability, and real-world practices.

---

## 🧠 Architecture Overview

This app follows a **Firebase-driven auth architecture** where Firebase Authentication is the single source of truth for user state.

### Key Principles

* **Redux Toolkit for global state** (liked / favorite products)
* **Firebase Auth = source of truth** for login/session
* **Navigation reacts to auth state** (not the other way around)
* **Screens stay dumb, logic stays centralized**
* **Firebase Auth = source of truth** for login/session
* **No manual session persistence** (Firebase handles persistence via AsyncStorage)
* **Navigation reacts to auth state** (not the other way around)
* **Screens stay dumb, logic stays centralized**

### App Flow (High Level)

1. App boots
2. Firebase restores auth state automatically
3. `onAuthStateChanged` emits user / null
4. RootNavigator switches between:

   * AuthFlow (Login / Signup)
   * Main App Screens:

     * Home
     * Product List
     * Favorites
     * Profile

This eliminates race conditions, stale state, and reload hacks.

---

## ⚙️ Setup Instructions

### Prerequisites

* Node.js (>= 18)
* Yarn or npm
* Android Studio / Xcode
* React Native CLI environment

### Installation

```bash
# install dependencies
npm install

# iOS only
cd ios && pod install && cd ..

# start metro
npm start

# run app
npm run android
npm run ios
```

### Firebase Setup

1. Create a Firebase project
2. Enable **Email/Password Authentication**
3. Add Android & iOS apps in Firebase console
4. Download:

   * `google-services.json`
   * `GoogleService-Info.plist`
5. Place them in correct native folders

Firebase Auth is initialized with persistent storage:

```js
initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
```

---

## 🔌 APIs Used

### Firebase

* **Firebase Authentication**

  * Email/Password login & signup
  * Persistent auth state
  * Profile updates (`updateProfile`, `updateEmail`)

### External APIs

* **Fake Store API**

  * Product listing, categories, and product details
  * Used for global search and category-based filtering
  * `https://fakestoreapi.com/products`

### State Management

* **Redux Toolkit**

  * Manages liked / favorite products globally
  * Allows add/remove favorites across screens
  * Ensures predictable state updates
* **Fake Store API**

  * Used for product listing
  * `https://fakestoreapi.com/products`

---

## 🗂️ Folder Structure Explanation

```text
src/
├── components/        # Reusable UI components (Button, Header, Inputs)
├── core/
│   └── firebase/      # Firebase config & auth instance
├── navigation/        # RootNavigator, AuthFlow, stacks
├── screens/
│   ├── Auth/          # Login & Signup screens
│   ├── Home/          # Home screen (banners, greetings)
│   ├── Products/      # Product list, search, categories, details
│   ├── Favorites/     # Liked / favorite products
│   ├── Profile/       # Profile settings screen
│   └── Splash/        # Splash screen
        # Splash screen
├── utils/             # Colors, spacing, helpers, validators
├── store/             # Redux Toolkit setup (future scalability)
└── assets/            # Images, banners, static assets
```

### Why this structure?

* **Scales well** as app grows
* **Clear separation of concerns**
* Firebase logic is isolated
* Navigation logic is centralized
* Screens stay readable and focused

---

## ✅ Key Highlights

* Firebase Auth persistence (no manual sessions)
* Redux Toolkit for favorites management
* Global product search functionality
* Horizontal category selection
* Realistic banners for improved UI/UX
* Clean auth-driven navigation
* Real-world error handling
* Scalable folder structure
* Production-ready patterns

---

## 🚀 Future Improvements

* Firestore-backed user profiles
* Avatar upload
* Dark mode support
* AuthContext abstraction
---

Built with ❤️ using React Native CLI & Firebase
