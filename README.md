# Globist Mobile App 🌐📱

Welcome to the **Globist Mobile Application** codebase! Built with **React Native (Expo)**, this repository is designed to be clean, modular, scalable, and junior-developer friendly.

---

## 📁 Directory Structure & Architecture

```text
mobile/
├── App.js                     # Main App Entrypoint & Root Providers
├── app.json                   # Expo Config
├── .eslintrc.js               # Industry Standard ESLint Rules
├── .prettierrc                # Code Formatting Rules
├── src/
│   ├── api/                   # Modular API Layer
│   │   ├── client.js          # Centralized Axios instance with auth interceptor
│   │   ├── auth.js            # Login, Signup, Session APIs
│   │   ├── trips.js           # Package & Booking APIs
│   │   ├── regions.js         # Region & Destination APIs
│   │   ├── reels.js           # Creator Reels APIs
│   │   └── index.js           # Re-exports all API services
│   ├── config/                # Central Configuration & Environment Settings
│   │   └── index.js           # Base URL detection, storage keys, constants
│   ├── components/            # Reusable UI Components
│   │   ├── Button.js
│   │   ├── Card.js
│   │   ├── Header.js
│   │   ├── Input.js
│   │   ├── ReelItem.js
│   │   └── Tag.js
│   ├── context/               # Global Application Contexts
│   │   └── AuthContext.js     # User authentication state provider
│   ├── hooks/                 # Custom React Hooks
│   │   └── useAuth.js         # Simplified hook for accessing Auth context
│   ├── navigation/            # React Navigation Setup
│   │   ├── AppNavigator.js    # Stack Navigation
│   │   └── BottomTabNavigator.js # Tab Bar Navigation
│   ├── screens/               # Screen Views
│   └── theme/                 # Design System Tokens
│       └── index.js           # Colors, Spacing, Typography, Radius
```

---

## ⚙️ Configuration & Security Management

All environment variables, API endpoints, and storage keys are managed centrally in `src/config/index.js`.

### Environment Variables

You can customize the API Base URL without modifying code by passing an environment variable:

```bash
# In terminal before running Expo:
EXPO_PUBLIC_API_URL=https://your-production-api.com/api npm start
```

### Storage Security

AsyncStorage keys are stored as constants in `STORAGE_KEYS` to avoid hardcoding strings or key collisions:

```js
import { STORAGE_KEYS } from '../config';

// Saving token securely
await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
```

---

## 🚀 How to Add a New Feature or API Endpoint

1. **Add your API function in `src/api/<module>.js`**:
   ```javascript
   import client from './client';

   export const getNewFeatureData = async () => {
     const response = await client.get('/new-endpoint');
     return response.data;
   };
   ```
2. **Export it in `src/api/index.js`**.
3. **Import and use it inside your component**:
   ```javascript
   import { getNewFeatureData } from '../api';
   import { useAuth } from '../hooks/useAuth';

   const { user } = useAuth();
   ```

---

## 🛠️ Code Quality & Formatting Commands

We enforce industry-standard ESLint and Prettier formatting across all files.

- **Check Code Linting**:
  ```bash
  npm run lint
  ```
- **Auto-Fix Lint Errors**:
  ```bash
  npm run lint:fix
  ```
- **Format Codebase**:
  ```bash
  npm run format
  ```

---

## 💡 Best Practices for Junior Developers

1. **Do Not Hardcode URLs or Keys**: Always import from `src/config`.
2. **Keep Screens Clean**: Place network requests inside `src/api/` modules, not inline in React UI components.
3. **Use the `useAuth` Hook**: Instead of importing `useContext(AuthContext)`, use `const { user, login, logout } = useAuth();`.
4. **Use Design System Tokens**: Always import `COLORS`, `SPACING`, and `TYPOGRAPHY` from `src/theme` for styling consistency.
