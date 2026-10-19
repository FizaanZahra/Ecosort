const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  ecoPoints: number;
}

export interface WasteRecord {
  _id: string;
  wasteCategory:
    | "plastic"
    | "paper"
    | "metal"
    | "glass"
    | "cardboard"
    | "organic"
    | "e-waste"
    | "other";
  quantity: number;
  unit: string;
  binName?: string;
  pointsEarned: number;
  materialRecoveryScore: number;
  description?: string;
  disposalDate: string;
  createdAt: string;
}

export interface Bin {
  _id: string;
  binId: string;
  name: string;
  location: string;
  city?: string;
  area?: string;
  acceptedCategory: string;
  capacityKg: number;
  currentFillKg: number;
  simulatedFillPercentage: number;
  status: "Available" | "Almost Full" | "Full" | "Maintenance";
  lastUpdated: string;
}

export interface LocationGroup {
  city: string;
  areas: string[];
}

export interface DashboardStats {
  ecoPoints: number;
  totalWasteKg: number;
  totalContributions: number;
  materialRecoveryScore: number;
  categoryTotals: Record<string, number>;
  availableBinsCount: number;
  totalBinsCount: number;
}

export interface Reward {
  _id: string;
  title: string;
  description: string;
  category: "Coupons" | "Merchandise" | "Certificates" | "Sustainability";
  pointsCost: number;
  icon: string;
  voucherTemplate?: string;
  stock: number;
}

export interface Redemption {
  _id: string;
  reward?: Reward | { title?: string; icon?: string; description?: string };
  rewardTitle: string;
  category: string;
  pointsSpent: number;
  voucherCode: string;
  status: "Active" | "Claimed";
  expiresAt: string;
  createdAt: string;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  role: string;
  ecoPoints: number;
  totalWasteKg: number;
  totalContributions: number;
  rank: number;
  createdAt: string;
}

export interface AdminOverview {
  success: boolean;
  metrics: {
    totalUsers: number;
    totalWasteKg: number;
    totalBins: number;
    fullBins: number;
    almostFullBins: number;
    totalDisposalTransactions: number;
    categoryDistribution: Record<string, number>;
  };
  bins: Bin[];
  recentActivity: Array<WasteRecord & { user?: { name: string; email: string } }>;
}

export interface NotificationItem {
  _id: string;
  user?: string | null;
  city?: string | null;
  title: string;
  message: string;
  type: "DISPOSAL" | "POINTS" | "BIN_ALERT" | "SYSTEM" | "COLLECTION" | "ANNOUNCEMENT";
  read: boolean;
  createdAt: string;
}

// Token helper
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ecosort_token");
};

export const setToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("ecosort_token", token);
  }
};

export const removeToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("ecosort_token");
    localStorage.removeItem("ecosort_user");
  }
};

export const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("ecosort_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setStoredUser = (user: User): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("ecosort_user", JSON.stringify(user));
  }
};

// Generic request wrapper
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

// API methods grouped by domain
export const api = {
  // Auth
  auth: {
    register: (name: string, email: string, password: string) =>
      apiRequest<{ message: string; token: string; user: User }>("/users/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      }),
    login: (email: string, password: string) =>
      apiRequest<{ message: string; token: string; user: User }>("/users/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    adminLogin: (email: string, password: string) =>
      apiRequest<{ message: string; token: string; user: User }>("/users/admin-login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    getProfile: () => apiRequest<{ success: boolean; user: User }>("/users/profile"),
    updateProfile: (data: { name?: string; currentPassword?: string; newPassword?: string }) =>
      apiRequest<{ message: string; user: User }>("/users/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    getNotifications: () =>
      apiRequest<{
        success: boolean;
        notifications: NotificationItem[];
        unreadCount: number;
      }>("/users/notifications"),
    markNotificationRead: (id: string) =>
      apiRequest<{ success: boolean; notification: NotificationItem }>(
        `/users/notifications/${id}/read`,
        {
          method: "PATCH",
        }
      ),
    markAllNotificationsRead: () =>
      apiRequest<{ success: boolean; message: string }>("/users/notifications/read-all", {
        method: "PATCH",
      }),
  },

  // Users & Notifications
  users: {
    getNotifications: () =>
      apiRequest<{
        success: boolean;
        notifications: NotificationItem[];
        unreadCount: number;
      }>("/users/notifications"),
    markNotificationRead: (id: string) =>
      apiRequest<{ success: boolean; notification: NotificationItem }>(
        `/users/notifications/${id}/read`,
        {
          method: "PATCH",
        }
      ),
    markAllNotificationsRead: () =>
      apiRequest<{ success: boolean; message: string }>("/users/notifications/read-all", {
        method: "PATCH",
      }),
  },

  // Waste
  waste: {
    recordDisposal: (data: {
      wasteCategory: string;
      quantity: number;
      binId?: string;
      description?: string;
    }) =>
      apiRequest<{
        success: boolean;
        message: string;
        record: WasteRecord;
        pointsEarned: number;
        newTotalPoints: number;
        materialRecoveryScore: number;
      }>("/waste", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getHistory: (category?: string, page = 1, limit = 10) => {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (category && category !== "all") query.append("category", category);
      return apiRequest<{
        success: boolean;
        records: WasteRecord[];
        pagination: {
          totalRecords: number;
          totalPages: number;
          currentPage: number;
          limit: number;
        };
      }>(`/waste/history?${query.toString()}`);
    },
    getMRS: () =>
      apiRequest<{
        success: boolean;
        score: number;
        totalKg: number;
        breakdown: Record<string, { kg: number; weight: number }>;
        formulaExplanation: string;
        weights: Record<string, number>;
      }>("/waste/mrs"),
    getPointsHistory: () =>
      apiRequest<{
        success: boolean;
        transactions: Array<{
          _id: string;
          transactionType: string;
          pointsAmount: number;
          description: string;
          createdAt: string;
        }>;
        currentBalance: number;
      }>("/waste/points-history"),
    getLeaderboard: () =>
      apiRequest<{
        success: boolean;
        leaderboard: LeaderboardUser[];
        totalParticipants: number;
        currentUserRank: LeaderboardUser | null;
      }>("/waste/leaderboard"),
  },

  // Rewards Store
  rewards: {
    getAll: () =>
      apiRequest<{
        success: boolean;
        rewards: Reward[];
      }>("/rewards"),
    redeem: (id: string) =>
      apiRequest<{
        success: boolean;
        message: string;
        redemption: Redemption;
        newPointsBalance: number;
      }>(`/rewards/${id}/redeem`, {
        method: "POST",
      }),
    getMyRedemptions: () =>
      apiRequest<{
        success: boolean;
        redemptions: Redemption[];
      }>("/rewards/my-redemptions"),
  },

  // Bins
  bins: {
    getAll: (city?: string, area?: string) => {
      const params = new URLSearchParams();
      if (city && city !== "All") params.append("city", city);
      if (area && area !== "All") params.append("area", area);
      const query = params.toString() ? `?${params.toString()}` : "";
      return apiRequest<{
        success: boolean;
        bins: Bin[];
      }>(`/bins${query}`);
    },
    getLocations: () =>
      apiRequest<{
        success: boolean;
        locations: LocationGroup[];
      }>("/bins/locations"),
    getById: (id: string) => apiRequest<{ success: boolean; bin: Bin }>(`/bins/${id}`),
    simulateFill: (id: string, simulatedFillPercentage: number) =>
      apiRequest<{ success: boolean; message: string; bin: Bin }>(`/bins/${id}/simulate`, {
        method: "PATCH",
        body: JSON.stringify({ simulatedFillPercentage }),
      }),
    create: (data: {
      binId: string;
      name: string;
      location: string;
      city?: string;
      area?: string;
      acceptedCategory: string;
      capacityKg?: number;
      simulatedFillPercentage?: number;
    }) =>
      apiRequest<{ success: boolean; message: string; bin: Bin }>("/bins", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (
      id: string,
      data: {
        name?: string;
        location?: string;
        city?: string;
        area?: string;
        acceptedCategory?: string;
        capacityKg?: number;
        simulatedFillPercentage?: number;
        status?: string;
      }
    ) =>
      apiRequest<{ success: boolean; message: string; bin: Bin }>(`/bins/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    markCollected: (id: string) =>
      apiRequest<{ success: boolean; message: string; bin: Bin; notification: any }>(
        `/bins/${id}/collect`,
        {
          method: "POST",
        }
      ),
    delete: (id: string) =>
      apiRequest<{ success: boolean; message: string }>(`/bins/${id}`, {
        method: "DELETE",
      }),
  },

  // Dashboard
  dashboard: {
    getStats: () =>
      apiRequest<{
        success: boolean;
        stats: DashboardStats;
        recentActivity: WasteRecord[];
        user: { name: string; email: string; role: string };
      }>("/dashboard/stats"),
  },

  // Admin
  admin: {
    getOverview: () =>
      apiRequest<{
        success: boolean;
        metrics: {
          totalUsers: number;
          totalWasteKg: number;
          totalBins: number;
          fullBins: number;
          almostFullBins: number;
          totalDisposalTransactions: number;
          categoryDistribution: Record<string, number>;
        };
        bins: Bin[];
        recentActivity: Array<WasteRecord & { user?: { name: string; email: string } }>;
      }>("/admin/overview"),
    getUsers: () =>
      apiRequest<{
        success: boolean;
        users: Array<{
          id: string;
          name: string;
          email: string;
          role: "user" | "admin";
          ecoPoints: number;
          totalDisposals: number;
          createdAt: string;
        }>;
      }>("/admin/users"),
    updateRole: (userId: string, role: "user" | "admin") =>
      apiRequest<{ success: boolean; message: string; user: User }>(
        `/admin/users/${userId}/role`,
        {
          method: "PATCH",
          body: JSON.stringify({ role }),
        }
      ),
    updateUserRole: (userId: string, role: "user" | "admin") =>
      apiRequest<{ success: boolean; message: string; user: User }>(
        `/admin/users/${userId}/role`,
        {
          method: "PATCH",
          body: JSON.stringify({ role }),
        }
      ),
    updateUser: (
      userId: string,
      data: {
        name?: string;
        email?: string;
        role?: "user" | "admin";
        ecoPoints?: number;
      }
    ) =>
      apiRequest<{ success: boolean; message: string; user: User }>(`/admin/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    deleteUser: (userId: string) =>
      apiRequest<{ success: boolean; message: string }>(`/admin/users/${userId}`, {
        method: "DELETE",
      }),
    sendNotification: (data: {
      userId?: string;
      city?: string;
      title: string;
      message: string;
      type?: string;
    }) =>
      apiRequest<{ success: boolean; message: string; notification: NotificationItem }>(
        "/admin/notifications",
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      ),
    getWasteRecords: () =>
      apiRequest<{
        success: boolean;
        records: Array<WasteRecord & { user?: { name: string; email: string } }>;
      }>("/admin/waste-records"),
    deleteWasteRecord: (id: string) =>
      apiRequest<{ success: boolean; message: string }>(`/admin/waste-records/${id}`, {
        method: "DELETE",
      }),
    deleteRecord: (id: string) =>
      apiRequest<{ success: boolean; message: string }>(`/admin/waste-records/${id}`, {
        method: "DELETE",
      }),
    setupFirstAdmin: () =>
      apiRequest<{ success: boolean; message: string; user: User }>(
        "/admin/setup-first-admin",
        { method: "POST" }
      ),
  },
};
