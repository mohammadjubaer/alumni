# IIUC Alumni App - Complete Setup & Integration Guide

## Quick Start

### 1. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a new project"
3. Enter project name: `iiuc-alumni`
4. Accept terms and create project
5. Wait for project to initialize

#### Enable Authentication
1. In Firebase Console, go to **Authentication**
2. Click **Get Started**
3. Enable **Email/Password** provider
4. Enable **Google** provider (optional)

#### Create Firestore Database
1. Go to **Firestore Database**
2. Click **Create Database**
3. Select **Start in production mode**
4. Choose region (e.g., `us-central1`)
5. Click **Create**

#### Get Firebase Credentials
1. Go to **Project Settings** (gear icon)
2. Click **Your apps** section
3. Click **Web** to create web app
4. Copy the config object
5. Update `lib/firebase-config.ts` with your credentials

### 2. Environment Configuration

Create `.env.local` file in project root:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=iiuc-alumni.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=iiuc-alumni
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=iiuc-alumni.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# App Configuration
EXPO_PUBLIC_APP_NAME=IIUC Alumni
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### 3. Install Dependencies

```bash
# Install all dependencies
pnpm install

# Or with npm
npm install
```

### 4. Start Development Server

```bash
# Start both Metro and API server
pnpm dev

# Or separately
pnpm dev:metro      # React Native development server
pnpm dev:server     # Backend API server
```

### 5. Test the App

#### Web Browser
- Open browser to `http://localhost:8081`
- Test login/signup flows

#### Mobile (Expo Go)
1. Install [Expo Go](https://expo.dev/go) on iOS/Android
2. Scan QR code from terminal
3. App opens in Expo Go

## Firebase Integration

### Initialize Firebase in App

The app uses a mock implementation with AsyncStorage for development. To integrate real Firebase:

1. **Install Firebase SDK**
```bash
pnpm add firebase
```

2. **Update `lib/firebase-config.ts`**
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

3. **Update `lib/auth-context.tsx`** to use Firebase Auth
```typescript
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebase-config';

// Replace mock implementations with Firebase calls
```

4. **Update `lib/data-service.ts`** to use Firestore
```typescript
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase-config';

// Replace AsyncStorage with Firestore operations
```

### Firestore Security Rules

Add these rules to Firestore in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null; // Public profile viewing
    }

    // Posts are readable by all authenticated users
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.authorId;
    }

    // Alumni submissions - only admins can read
    match /alumni_submissions/{submissionId} {
      allow read: if request.auth.token.role == 'admin';
      allow create: if request.auth != null;
      allow update: if request.auth.token.role == 'admin';
    }

    // Messages - only participants can read
    match /messages/{conversationId}/messages/{messageId} {
      allow read: if request.auth.uid in get(/databases/$(database)/documents/messages/$(conversationId)).data.participants;
      allow create: if request.auth != null;
    }

    // Reports - only admins can read
    match /reports/{reportId} {
      allow read: if request.auth.token.role == 'admin';
      allow create: if request.auth != null;
    }
  }
}
```

## User Roles Implementation

### Create Custom Claims with Cloud Functions

1. **Create Cloud Function** in Firebase Console:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.setUserRole = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { uid, role } = data;
  
  try {
    await admin.auth().setCustomUserClaims(uid, { role });
    return { success: true, message: `User role set to ${role}` };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
  // Set default role for new users
  await admin.auth().setCustomUserClaims(user.uid, { role: 'general' });
  
  // Create user document in Firestore
  await admin.firestore().collection('users').doc(user.uid).set({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || user.email.split('@')[0],
    role: 'general',
    status: 'active',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});
```

2. **Deploy Cloud Functions**
```bash
firebase deploy --only functions
```

## Admin Setup

### Create Super Admin User

1. **In Firebase Console:**
   - Go to Authentication → Users
   - Create new user with email/password
   - Note the UID

2. **Set Custom Claims:**
   - Go to Cloud Functions
   - Call `setUserRole` with UID and role `'admin'`
   - Or use Firebase Admin SDK

3. **Create Admin Document:**
```javascript
// In Firestore
/admins/{adminId}
{
  uid: "user_uid",
  email: "admin@iiuc.edu",
  type: "super", // or "departmental"
  department: "Computer Science", // for departmental admins
  permissions: ["manage_users", "review_submissions", "moderate_content"],
  createdAt: timestamp,
}
```

## Testing Workflows

### Test General User Flow
1. Sign up with email
2. Verify email (in dev, auto-verified)
3. View home feed
4. Search alumni
5. Submit alumni information
6. Wait for admin approval

### Test Alumni Flow
1. Admin approves submission
2. User role changes to "alumni"
3. Create job opportunity post
4. Create advice post
5. View post analytics

### Test Admin Flow
1. Login as admin user
2. Access admin dashboard
3. Review pending submissions
4. Approve/reject submissions
5. View reports and block users

## Deployment

### Web Deployment to Vercel

```bash
# Build for web
pnpm build

# Deploy to Vercel
vercel deploy dist
```

### Mobile Deployment to App Stores

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to stores
eas submit --platform ios --latest
eas submit --platform android --latest
```

## Troubleshooting

### Firebase Connection Issues

**Problem**: "Firebase not initialized"
- **Solution**: Verify credentials in `.env.local` match Firebase project

**Problem**: "Permission denied" errors
- **Solution**: Check Firestore security rules allow the operation

**Problem**: "User not found"
- **Solution**: Ensure user document exists in Firestore

### Authentication Issues

**Problem**: "Invalid email/password"
- **Solution**: Verify credentials are correct, check Firebase Auth settings

**Problem**: "Email already in use"
- **Solution**: Use different email or reset password

### Navigation Issues

**Problem**: "Route not found"
- **Solution**: Verify route names match file structure, check `_layout.tsx` files

**Problem**: "Auth state not persisting"
- **Solution**: Check AsyncStorage is working, verify auth context is wrapped

## Performance Optimization

### Database Optimization
- Create indexes for frequently queried fields
- Use pagination for large result sets
- Implement caching with React Query

### Image Optimization
- Compress images before upload
- Use appropriate image sizes for different screens
- Implement lazy loading

### Code Optimization
- Code split with dynamic imports
- Memoize expensive computations
- Use React DevTools Profiler

## Security Checklist

- [ ] Firebase credentials in environment variables
- [ ] Firestore rules properly configured
- [ ] Input validation on all forms
- [ ] Rate limiting on API endpoints
- [ ] HTTPS enabled for all connections
- [ ] User-generated content sanitized
- [ ] Authentication tokens properly managed
- [ ] Sensitive data encrypted
- [ ] Regular security audits scheduled
- [ ] Error messages don't expose sensitive info

## Next Steps

1. **Customize branding**
   - Update app name in `app.config.ts`
   - Replace logo in `assets/images/`
   - Update color scheme in `theme.config.js`

2. **Implement remaining features**
   - Direct messaging system
   - Push notifications
   - Image upload for profiles
   - Advanced search with filters

3. **Add analytics**
   - Firebase Analytics
   - User behavior tracking
   - Post performance metrics

4. **Set up monitoring**
   - Error tracking with Sentry
   - Performance monitoring
   - User session tracking

## Support & Resources

- [Expo Documentation](https://docs.expo.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native Documentation](https://reactnative.dev)
- [NativeWind Documentation](https://www.nativewind.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)

## Contact

For questions or issues, contact the development team.
