import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Data Service - Handles all Firestore operations
 * Currently uses AsyncStorage for local storage
 * Can be replaced with Firebase Firestore in production
 */

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorDepartment?: string;
  type: "job" | "advice";
  title: string;
  content: string;
  tags: string[];
  likes: number;
  saves: number;
  comments: number;
  createdAt: number;
  updatedAt: number;
  // Job-specific fields
  company?: string;
  position?: string;
  level?: string;
  requirements?: string;
  salaryRange?: string;
  applicationLink?: string;
}

export interface AlumniSubmission {
  id: string;
  userId: string;
  email: string;
  displayName: string;
  department: string;
  graduationYear: number;
  currentCompany?: string;
  jobTitle?: string;
  bio?: string;
  status: "pending" | "approved" | "rejected";
  submittedBy: "general" | "admin";
  reviewedBy?: string;
  rejectionReason?: string;
  createdAt: number;
  updatedAt: number;
}

export interface ContactRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: "pending" | "approved" | "rejected";
  message?: string;
  createdAt: number;
  respondedAt?: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  read: boolean;
}

export interface Report {
  id: string;
  reportedUserId?: string;
  reportedPostId?: string;
  reportedBy: string;
  reason: string;
  description: string;
  status: "pending" | "resolved" | "dismissed";
  action?: string;
  createdAt: number;
  resolvedAt?: number;
}

class DataService {
  private prefix = "@alumni_app_";

  // Posts operations
  async createPost(post: Omit<Post, "id" | "likes" | "saves" | "comments" | "createdAt" | "updatedAt">): Promise<Post> {
    const newPost: Post = {
      ...post,
      id: `post_${Date.now()}`,
      likes: 0,
      saves: 0,
      comments: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const posts = await this.getPosts();
    posts.push(newPost);
    await AsyncStorage.setItem(`${this.prefix}posts`, JSON.stringify(posts));
    return newPost;
  }

  async getPosts(type?: "job" | "advice"): Promise<Post[]> {
    try {
      const data = await AsyncStorage.getItem(`${this.prefix}posts`);
      let posts: Post[] = data ? JSON.parse(data) : [];
      if (type) {
        posts = posts.filter((p) => p.type === type);
      }
      return posts.sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
      console.error("Failed to get posts:", error);
      return [];
    }
  }

  async getPostById(postId: string): Promise<Post | null> {
    try {
      const posts = await this.getPosts();
      return posts.find((p) => p.id === postId) || null;
    } catch (error) {
      console.error("Failed to get post:", error);
      return null;
    }
  }

  async updatePost(postId: string, updates: Partial<Post>): Promise<Post | null> {
    try {
      const posts = await this.getPosts();
      const index = posts.findIndex((p) => p.id === postId);
      if (index === -1) return null;

      posts[index] = { ...posts[index], ...updates, updatedAt: Date.now() };
      await AsyncStorage.setItem(`${this.prefix}posts`, JSON.stringify(posts));
      return posts[index];
    } catch (error) {
      console.error("Failed to update post:", error);
      return null;
    }
  }

  async deletePost(postId: string): Promise<boolean> {
    try {
      const posts = await this.getPosts();
      const filtered = posts.filter((p) => p.id !== postId);
      await AsyncStorage.setItem(`${this.prefix}posts`, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error("Failed to delete post:", error);
      return false;
    }
  }

  // Alumni submissions operations
  async createSubmission(submission: Omit<AlumniSubmission, "id" | "createdAt" | "updatedAt">): Promise<AlumniSubmission> {
    const newSubmission: AlumniSubmission = {
      ...submission,
      id: `submission_${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const submissions = await this.getSubmissions();
    submissions.push(newSubmission);
    await AsyncStorage.setItem(`${this.prefix}submissions`, JSON.stringify(submissions));
    return newSubmission;
  }

  async getSubmissions(status?: "pending" | "approved" | "rejected"): Promise<AlumniSubmission[]> {
    try {
      const data = await AsyncStorage.getItem(`${this.prefix}submissions`);
      let submissions: AlumniSubmission[] = data ? JSON.parse(data) : [];
      if (status) {
        submissions = submissions.filter((s) => s.status === status);
      }
      return submissions.sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
      console.error("Failed to get submissions:", error);
      return [];
    }
  }

  async approveSubmission(submissionId: string, adminId: string): Promise<AlumniSubmission | null> {
    try {
      const submissions = await this.getSubmissions();
      const index = submissions.findIndex((s) => s.id === submissionId);
      if (index === -1) return null;

      submissions[index] = {
        ...submissions[index],
        status: "approved",
        reviewedBy: adminId,
        updatedAt: Date.now(),
      };
      await AsyncStorage.setItem(`${this.prefix}submissions`, JSON.stringify(submissions));
      return submissions[index];
    } catch (error) {
      console.error("Failed to approve submission:", error);
      return null;
    }
  }

  async rejectSubmission(submissionId: string, adminId: string, reason: string): Promise<AlumniSubmission | null> {
    try {
      const submissions = await this.getSubmissions();
      const index = submissions.findIndex((s) => s.id === submissionId);
      if (index === -1) return null;

      submissions[index] = {
        ...submissions[index],
        status: "rejected",
        reviewedBy: adminId,
        rejectionReason: reason,
        updatedAt: Date.now(),
      };
      await AsyncStorage.setItem(`${this.prefix}submissions`, JSON.stringify(submissions));
      return submissions[index];
    } catch (error) {
      console.error("Failed to reject submission:", error);
      return null;
    }
  }

  // Contact requests operations
  async createContactRequest(request: Omit<ContactRequest, "id" | "createdAt">): Promise<ContactRequest> {
    const newRequest: ContactRequest = {
      ...request,
      id: `contact_${Date.now()}`,
      createdAt: Date.now(),
    };

    const requests = await this.getContactRequests();
    requests.push(newRequest);
    await AsyncStorage.setItem(`${this.prefix}contact_requests`, JSON.stringify(requests));
    return newRequest;
  }

  async getContactRequests(userId?: string, status?: string): Promise<ContactRequest[]> {
    try {
      const data = await AsyncStorage.getItem(`${this.prefix}contact_requests`);
      let requests: ContactRequest[] = data ? JSON.parse(data) : [];

      if (userId) {
        requests = requests.filter((r) => r.toUserId === userId);
      }
      if (status) {
        requests = requests.filter((r) => r.status === status);
      }

      return requests.sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
      console.error("Failed to get contact requests:", error);
      return [];
    }
  }

  async approveContactRequest(requestId: string): Promise<ContactRequest | null> {
    try {
      const requests = await this.getContactRequests();
      const index = requests.findIndex((r) => r.id === requestId);
      if (index === -1) return null;

      requests[index] = {
        ...requests[index],
        status: "approved",
        respondedAt: Date.now(),
      };
      await AsyncStorage.setItem(`${this.prefix}contact_requests`, JSON.stringify(requests));
      return requests[index];
    } catch (error) {
      console.error("Failed to approve contact request:", error);
      return null;
    }
  }

  // Reports operations
  async createReport(report: Omit<Report, "id" | "createdAt">): Promise<Report> {
    const newReport: Report = {
      ...report,
      id: `report_${Date.now()}`,
      createdAt: Date.now(),
    };

    const reports = await this.getReports();
    reports.push(newReport);
    await AsyncStorage.setItem(`${this.prefix}reports`, JSON.stringify(reports));
    return newReport;
  }

  async getReports(status?: string): Promise<Report[]> {
    try {
      const data = await AsyncStorage.getItem(`${this.prefix}reports`);
      let reports: Report[] = data ? JSON.parse(data) : [];
      if (status) {
        reports = reports.filter((r) => r.status === status);
      }
      return reports.sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
      console.error("Failed to get reports:", error);
      return [];
    }
  }

  async resolveReport(reportId: string, action: string): Promise<Report | null> {
    try {
      const reports = await this.getReports();
      const index = reports.findIndex((r) => r.id === reportId);
      if (index === -1) return null;

      reports[index] = {
        ...reports[index],
        status: "resolved",
        action,
        resolvedAt: Date.now(),
      };
      await AsyncStorage.setItem(`${this.prefix}reports`, JSON.stringify(reports));
      return reports[index];
    } catch (error) {
      console.error("Failed to resolve report:", error);
      return null;
    }
  }

  // Search operations
  async searchAlumni(query: string, filters?: { department?: string; graduationYear?: number }): Promise<any[]> {
    // This would search through alumni in the users collection
    // For now, returning empty array - to be implemented with Firebase
    return [];
  }

  async searchPosts(query: string, type?: "job" | "advice"): Promise<Post[]> {
    try {
      const posts = await this.getPosts(type);
      const lowerQuery = query.toLowerCase();
      return posts.filter(
        (p) =>
          p.title.toLowerCase().includes(lowerQuery) ||
          p.content.toLowerCase().includes(lowerQuery) ||
          p.tags.some((t) => t.toLowerCase().includes(lowerQuery)),
      );
    } catch (error) {
      console.error("Failed to search posts:", error);
      return [];
    }
  }
}

export const dataService = new DataService();
