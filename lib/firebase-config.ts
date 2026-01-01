/**
 * Firebase Configuration
 * Initialize Firebase with your project credentials
 */

// Replace these with your Firebase project credentials
export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyDemoKey123456789",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "iiuc-alumni.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "iiuc-alumni",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "iiuc-alumni.appspot.com",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abc123def456",
};

/**
 * Firestore Collections Structure
 * 
 * users/
 *   - uid (doc)
 *     - email: string
 *     - displayName: string
 *     - role: 'general' | 'alumni' | 'admin'
 *     - status: 'active' | 'blocked' | 'pending'
 *     - department: string
 *     - graduationYear: number
 *     - profilePhoto: string (URL)
 *     - bio: string
 *     - createdAt: timestamp
 *     - updatedAt: timestamp
 * 
 * alumni_submissions/
 *   - submissionId (doc)
 *     - userId: string
 *     - email: string
 *     - displayName: string
 *     - department: string
 *     - graduationYear: number
 *     - currentCompany: string
 *     - jobTitle: string
 *     - bio: string
 *     - status: 'pending' | 'approved' | 'rejected'
 *     - submittedBy: 'general' | 'admin'
 *     - reviewedBy: string (admin uid)
 *     - rejectionReason: string
 *     - createdAt: timestamp
 *     - updatedAt: timestamp
 * 
 * posts/
 *   - postId (doc)
 *     - authorId: string
 *     - authorName: string
 *     - authorDepartment: string
 *     - type: 'job' | 'advice'
 *     - title: string
 *     - content: string
 *     - tags: string[]
 *     - likes: number
 *     - saves: number
 *     - comments: number
 *     - createdAt: timestamp
 *     - updatedAt: timestamp
 *     - (job specific)
 *     - company: string
 *     - position: string
 *     - level: string
 *     - requirements: string
 *     - salaryRange: string
 *     - applicationLink: string
 * 
 * messages/
 *   - conversationId (doc)
 *     - participants: string[] (uids)
 *     - lastMessage: string
 *     - lastMessageTime: timestamp
 *     - messages/
 *       - messageId (doc)
 *         - senderId: string
 *         - senderName: string
 *         - content: string
 *         - timestamp: timestamp
 *         - read: boolean
 * 
 * contact_requests/
 *   - requestId (doc)
 *     - fromUserId: string
 *     - toUserId: string
 *     - status: 'pending' | 'approved' | 'rejected'
 *     - message: string
 *     - createdAt: timestamp
 *     - respondedAt: timestamp
 * 
 * reports/
 *   - reportId (doc)
 *     - reportedUserId: string
 *     - reportedPostId: string
 *     - reportedBy: string
 *     - reason: string
 *     - description: string
 *     - status: 'pending' | 'resolved' | 'dismissed'
 *     - action: string (blocked, deleted, etc.)
 *     - createdAt: timestamp
 *     - resolvedAt: timestamp
 */
