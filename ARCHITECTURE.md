# IIUC Alumni App - Architecture & Setup Guide

## Project Overview

The IIUC Alumni App is a modern mobile application built with React Native (Expo) and Firebase, designed to connect alumni, current students, and administrators. The app facilitates alumni verification, job opportunities sharing, mentorship advice, and direct communication.

## Tech Stack

- **Frontend**: React Native with Expo SDK 54
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: React Context + AsyncStorage (local), Firebase Firestore (cloud)
- **Authentication**: Firebase Authentication
- **Backend**: Firebase Cloud Functions (optional)
- **Database**: Firestore (NoSQL)
- **Storage**: Firebase Storage for images

## Project Structure

```
iiuc-alumni-app/
├── app/                          # Expo Router navigation
│   ├── _layout.tsx              # Root layout with auth provider
│   ├── (tabs)/                  # Tab-based navigation
│   │   ├── _layout.tsx          # Tab configuration
│   │   ├── home.tsx             # Alumni feed screen
│   │   ├── alumni.tsx           # Alumni directory
│   │   ├── index.tsx            # Search/explore screen
│   │   ├── profile.tsx          # User profile
│   │   └── admin-dashboard.tsx  # Admin panel
│   ├── auth/                    # Authentication screens
│   │   ├── _layout.tsx          # Auth layout
│   │   ├── login.tsx            # Login screen
│   │   └── signup.tsx           # Sign up screen
│   └── oauth/                   # OAuth callback
├── components/                   # Reusable components
│   ├── ui/                      # Base UI components
│   │   ├── button.tsx           # Button component
│   │   ├── card.tsx             # Card component
│   │   ├── input.tsx            # Input component
│   │   └── icon-symbol.tsx      # Icon mapping
│   ├── post-card.tsx            # Post display component
│   ├── alumni-card.tsx          # Alumni profile card
│   ├── submission-card.tsx      # Admin submission review
│   ├── screen-container.tsx     # SafeArea wrapper
│   └── haptic-tab.tsx           # Tab with haptics
├── lib/                         # Core logic and utilities
│   ├── auth-context.tsx         # Authentication context
│   ├── data-service.ts          # Firestore operations
│   ├── firebase-config.ts       # Firebase configuration
│   ├── theme-provider.tsx       # Theme context
│   ├── utils.ts                 # Utility functions
│   ├── trpc.ts                  # tRPC client
│   └── _core/                   # Internal utilities
├── hooks/                       # Custom React hooks
│   ├── use-auth.ts              # Auth hook
│   ├── use-colors.ts            # Theme colors hook
│   └── use-color-scheme.ts      # Dark mode detection
├── constants/                   # App constants
│   └── theme.ts                 # Theme configuration
├── assets/                      # Images and icons
│   └── images/
│       ├── icon.png             # App icon
│       ├── splash-icon.png      # Splash screen
│       └── favicon.png          # Web favicon
├── design.md                    # UI/UX design document
├── todo.md                      # Development tasks
├── app.config.ts                # Expo configuration
├── tailwind.config.js           # Tailwind configuration
├── theme.config.js              # Theme tokens
└── package.json                 # Dependencies

```

## Data Models

### Users Collection
```typescript
{
  uid: string;
  email: string;
  displayName: string;
  role: 'general' | 'alumni' | 'admin';
  status: 'active' | 'blocked' | 'pending';
  department?: string;
  graduationYear?: number;
  profilePhoto?: string;
  bio?: string;
  currentCompany?: string;
  jobTitle?: string;
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

### Posts Collection
```typescript
{
  id: string;
  authorId: string;
  authorName: string;
  type: 'job' | 'advice';
  title: string;
  content: string;
  tags: string[];
  likes: number;
  saves: number;
  // Job-specific fields
  company?: string;
  position?: string;
  level?: string;
  requirements?: string;
  salaryRange?: string;
  applicationLink?: string;
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

### Alumni Submissions Collection
```typescript
{
  id: string;
  userId: string;
  email: string;
  displayName: string;
  department: string;
  graduationYear: number;
  currentCompany?: string;
  jobTitle?: string;
  bio?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: 'general' | 'admin';
  reviewedBy?: string;
  rejectionReason?: string;
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

### Contact Requests Collection
```typescript
{
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
  createdAt: timestamp;
  respondedAt?: timestamp;
}
```

### Reports Collection
```typescript
{
  id: string;
  reportedUserId?: string;
  reportedPostId?: string;
  reportedBy: string;
  reason: string;
  description: string;
  status: 'pending' | 'resolved' | 'dismissed';
  action?: string;
  createdAt: timestamp;
  resolvedAt?: timestamp;
}
```

## User Roles & Permissions

### General User
- View alumni feed (jobs and advice)
- Search alumni directory
- Submit alumni information (pending admin review)
- View alumni profiles (public information)
- Like and save posts
- Request contact with alumni
- Receive notifications

### Alumni
- All general user permissions
- Create job opportunity posts
- Create advice posts
- Edit/delete own posts
- Receive contact requests
- Direct messaging with other users
- View analytics on own posts

### Admin (Departmental)
- All alumni permissions
- Review alumni submissions
- Approve/reject submissions
- View submitted alumni information
- Block/unblock users
- Moderate reported content
- View department-specific analytics

### Super Admin
- All admin permissions
- Manage all users globally
- Create/manage other admins
- View system-wide analytics
- Configure app settings

## Authentication Flow

1. **Splash Screen**: App initializes, checks for existing session
2. **Login/Sign Up**: User enters credentials or creates account
3. **Role Selection**: New users select initial role (General User)
4. **Dashboard**: User routed to appropriate dashboard based on role
5. **Session Persistence**: Auth state saved to AsyncStorage

## State Management

### Local State (AsyncStorage)
- User authentication state
- User profile data
- Saved posts
- Draft posts

### Global State (Context)
- Authentication context (`AuthProvider`)
- Theme context (`ThemeProvider`)
- User role and permissions

### Server State (Firestore)
- Posts and comments
- Alumni submissions
- Contact requests
- Reports and moderation data
- User profiles (synced)

## Key Features

### 1. Alumni Verification System
- General users submit alumni information
- Admins review and approve/reject submissions
- Approved users gain alumni status and posting privileges
- Rejection includes reason notification

### 2. Post System
- **Job Opportunities**: Alumni post job openings with details
- **Advice Posts**: Alumni share career/life advice
- Posts include tags, engagement metrics (likes/saves)
- Search and filter by type, tags, author

### 3. Alumni Directory
- Browse verified alumni
- Filter by department and graduation year
- Search by name, company, or position
- Request direct contact
- View public profiles

### 4. Admin Dashboard
- Overview statistics
- Pending submissions queue
- Reported content review
- User management and blocking
- Analytics and insights

### 5. Direct Messaging
- Alumni-to-user conversations
- Real-time message delivery
- Message history persistence
- Read receipts

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm/pnpm
- Expo CLI (`npm install -g expo-cli`)
- Firebase project with Firestore enabled
- iOS/Android development environment (optional for native builds)

### Installation

1. **Clone and install dependencies**
```bash
cd iiuc-alumni-app
pnpm install
```

2. **Configure Firebase**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Copy credentials to `lib/firebase-config.ts`

3. **Set environment variables**
```bash
# Create .env.local
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. **Start development server**
```bash
pnpm dev
```

5. **Open in Expo Go**
   - Scan QR code with Expo Go app on iOS/Android
   - Or open in web browser at `http://localhost:8081`

## Firebase Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
      allow write: if request.auth.token.role == 'admin';
    }

    // Posts collection
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth.token.role == 'alumni';
      allow update, delete: if request.auth.uid == resource.data.authorId;
      allow update, delete: if request.auth.token.role == 'admin';
    }

    // Alumni submissions
    match /alumni_submissions/{submissionId} {
      allow read: if request.auth.token.role == 'admin';
      allow create: if request.auth != null;
      allow update: if request.auth.token.role == 'admin';
    }

    // Contact requests
    match /contact_requests/{requestId} {
      allow read: if request.auth.uid in resource.data.participants;
      allow create: if request.auth != null;
      allow update: if request.auth.uid in resource.data.participants;
    }

    // Messages
    match /messages/{conversationId}/messages/{messageId} {
      allow read: if request.auth.uid in get(/databases/$(database)/documents/messages/$(conversationId)).data.participants;
      allow create: if request.auth != null;
    }

    // Reports
    match /reports/{reportId} {
      allow read: if request.auth.token.role == 'admin';
      allow create: if request.auth != null;
    }
  }
}
```

## Development Workflow

1. **Create feature branch**
```bash
git checkout -b feature/feature-name
```

2. **Make changes and test**
```bash
pnpm dev
# Test in Expo Go or web
```

3. **Run linting and type checking**
```bash
pnpm lint
pnpm check
```

4. **Commit and push**
```bash
git add .
git commit -m "feat: add feature description"
git push origin feature/feature-name
```

5. **Create pull request and merge**

## Deployment

### Web Deployment
```bash
pnpm build
# Deploy dist folder to hosting service
```

### Mobile Deployment
```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

## Performance Optimization

- Use `FlatList` for long lists (never `ScrollView` with `.map()`)
- Implement pagination for large datasets
- Lazy load images with `expo-image`
- Use React Query for server state management
- Memoize expensive computations with `useMemo`
- Profile with React DevTools Profiler

## Security Best Practices

- Never commit Firebase credentials
- Use environment variables for sensitive data
- Validate input on client and server
- Implement rate limiting on API endpoints
- Use HTTPS for all communications
- Sanitize user-generated content
- Implement proper authentication and authorization
- Regular security audits

## Troubleshooting

### App won't start
- Clear cache: `expo start --clear`
- Reinstall dependencies: `rm -rf node_modules && pnpm install`
- Check Node version: `node --version` (should be 18+)

### Firebase connection issues
- Verify credentials in `firebase-config.ts`
- Check Firestore rules allow your operations
- Ensure Firebase project is properly configured

### Navigation not working
- Check route names match file structure
- Verify `_layout.tsx` files are in place
- Clear Expo cache and rebuild

## Contributing

1. Follow the existing code style
2. Write meaningful commit messages
3. Test changes thoroughly
4. Update documentation as needed
5. Submit pull requests with clear descriptions

## License

This project is proprietary and confidential to IIUC.

## Support

For issues or questions, contact the development team or submit an issue on the project repository.
