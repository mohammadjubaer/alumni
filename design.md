# IIUC Alumni App - Design Document

## Overview

The IIUC Alumni App is a mobile platform designed to connect alumni, current students, and administrators of IIUC. The app facilitates alumni verification, job opportunities sharing, mentorship advice, and direct communication between members.

## Design Principles

- **Mobile-First**: Optimized for portrait orientation (9:16) and one-handed usage
- **iOS-Native Feel**: Follows Apple Human Interface Guidelines (HIG)
- **Accessibility**: Clear navigation, readable text, intuitive interactions
- **Performance**: Smooth scrolling, responsive interactions, minimal load times
- **Modern Aesthetic**: Clean typography, spacious layouts, consistent color scheme

## Color Palette

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| Primary | #0066CC | #5BA3FF | Buttons, highlights, active states |
| Background | #FFFFFF | #0F0F0F | Screen backgrounds |
| Surface | #F5F5F5 | #1A1A1A | Cards, elevated surfaces |
| Foreground | #1A1A1A | #FFFFFF | Primary text |
| Muted | #666666 | #999999 | Secondary text, labels |
| Border | #E0E0E0 | #333333 | Dividers, borders |
| Success | #34C759 | #30B0C0 | Success states, verified badges |
| Warning | #FF9500 | #FFB340 | Warnings, pending states |
| Error | #FF3B30 | #FF453A | Errors, delete actions |

## Screen List

### Authentication Screens
1. **Splash Screen** - App logo and loading indicator
2. **Login Screen** - Email/password login with Firebase
3. **Sign Up Screen** - Registration for new users
4. **Role Selection Screen** - Choose between General User or Alumni

### General User Screens
5. **Home Screen** - Feed of alumni posts (jobs, advice), search bar
6. **Search Screen** - Advanced search for alumni, posts, jobs
7. **Alumni Directory** - Browse verified alumni profiles
8. **Alumni Detail Screen** - View alumni profile, contact options
9. **Post Detail Screen** - View full post (job or advice)
10. **Profile Screen** - General user profile, submission history
11. **Notifications Screen** - Alerts for profile updates, new posts

### Alumni Screens
12. **Alumni Home Screen** - Dashboard with stats, pending submissions
13. **Create Post Screen** - Compose job opportunity or advice post
14. **My Posts Screen** - View and manage published posts
15. **Alumni Profile Screen** - Edit profile, view contact requests
16. **Contact Requests Screen** - Manage incoming contact requests
17. **Messages Screen** - Direct messaging with other alumni/users

### Admin Screens
18. **Admin Dashboard** - Overview of pending submissions, user reports
19. **Pending Submissions Screen** - Review and approve/reject alumni submissions
20. **User Management Screen** - View all users, block/unblock users
21. **Reports Screen** - View reported content and users
22. **Analytics Screen** - Stats on alumni, posts, engagement

## Primary Content and Functionality

### Home Screen (General User)
- **Header**: Search bar with filters (Alumni, Jobs, Advice)
- **Content**: Feed of posts from alumni (jobs, advice)
- **Post Card**: Alumni name, post type, title, excerpt, date, engagement metrics
- **Functionality**: Tap post to view details, like/save posts, report inappropriate content

### Alumni Directory
- **Header**: Search bar, filter by department/graduation year
- **Content**: Grid/list of verified alumni profiles
- **Alumni Card**: Profile photo, name, department, graduation year, job title, verified badge
- **Functionality**: Tap to view profile, request direct contact

### Alumni Detail Screen
- **Header**: Profile photo, name, verified badge
- **Content**: 
  - Bio/about section
  - Department, graduation year, current company
  - Contact information (if public)
  - Posts by this alumni
- **Actions**: Request contact, send message, report profile

### Create Post Screen (Alumni)
- **Post Type Selector**: Toggle between "Job Opportunity" and "Advice"
- **Job Opportunity Form**:
  - Title, company, position level
  - Description, requirements, salary range (optional)
  - Application link/email
- **Advice Post Form**:
  - Title, category (career, education, life)
  - Content/advice text
  - Tags
- **Actions**: Preview, publish, save as draft

### Admin Dashboard
- **Stats Cards**: Total users, pending submissions, reported content
- **Quick Actions**: View pending submissions, manage users, view reports
- **Recent Activity**: Latest submissions, reports, user actions

### User Management Screen
- **User List**: Searchable list of all users
- **User Card**: Name, email, role, status (active/blocked), join date
- **Actions**: View profile, block/unblock, delete account, send message

## Key User Flows

### Flow 1: General User Registration and Profile Submission
1. User opens app → Splash screen
2. Tap "Sign Up" → Sign Up screen
3. Enter email, password, name, graduation year, department
4. Select "General User" role
5. Verify email
6. Submit alumni information (optional)
7. Admin reviews and approves
8. User becomes Alumni after approval
9. Access Alumni features (posting, messaging)

### Flow 2: Alumni Posting Job Opportunity
1. Alumni opens app → Alumni Home screen
2. Tap "Create Post" → Create Post screen
3. Select "Job Opportunity"
4. Fill in job details (title, company, description, requirements)
5. Add optional salary range and application link
6. Tap "Publish"
7. Post appears in feed, general users can view and apply

### Flow 3: General User Searching for Alumni
1. User opens app → Home screen
2. Tap search bar → Search screen
3. Type alumni name or department
4. Browse results
5. Tap alumni profile → Alumni Detail screen
6. View profile, request contact
7. Admin approves contact request
8. User can message alumni

### Flow 4: Admin Reviewing Submissions
1. Admin opens app → Admin Dashboard
2. Tap "Pending Submissions" → Pending Submissions screen
3. View submission details
4. Tap "Approve" or "Reject"
5. If approved, user becomes Alumni
6. If rejected, user receives notification with reason

### Flow 5: Admin Blocking User
1. Admin opens app → Admin Dashboard
2. Tap "User Management" → User Management screen
3. Search for user
4. Tap user card → User Detail screen
5. Tap "Block User"
6. Confirm action
7. User is blocked, cannot access app

## Navigation Structure

```
Root
├── Auth Stack
│   ├── Splash
│   ├── Login
│   ├── Sign Up
│   └── Role Selection
├── General User Tabs
│   ├── Home
│   ├── Search
│   ├── Alumni Directory
│   ├── Profile
│   └── Notifications
├── Alumni Tabs
│   ├── Home (Alumni)
│   ├── Create Post
│   ├── My Posts
│   ├── Messages
│   └── Profile (Alumni)
└── Admin Tabs
    ├── Dashboard
    ├── Pending Submissions
    ├── User Management
    ├── Reports
    └── Analytics
```

## Interaction Patterns

### Press Feedback
- **Buttons**: Scale to 0.97 + light haptic feedback
- **List Items**: Opacity to 0.7 on press
- **Icons**: Opacity to 0.6 on press

### Loading States
- **Skeleton Loaders**: Show placeholder cards while loading
- **Progress Indicators**: Circular progress for file uploads
- **Refresh**: Pull-to-refresh on list screens

### Empty States
- **No Results**: Icon + message + action button
- **No Posts**: "No posts yet. Check back later."
- **No Notifications**: "You're all caught up!"

## Responsive Design

- **Padding**: 16px standard, 12px compact, 20px spacious
- **Typography**: 
  - Headings: 28px (H1), 24px (H2), 20px (H3)
  - Body: 16px (regular), 14px (secondary)
  - Small: 12px (captions)
- **Touch Targets**: Minimum 44px height for buttons and tappable elements
- **Spacing**: Consistent 8px grid for margins and padding

## Accessibility

- **Color Contrast**: WCAG AA compliant (4.5:1 for text)
- **Text Scaling**: Support system font size preferences
- **Keyboard Navigation**: All interactive elements keyboard accessible
- **Screen Reader**: Proper labels and descriptions for all elements
- **Haptic Feedback**: Optional, respects system settings
