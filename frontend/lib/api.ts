/**
 * API client for backend communication
 */

// Use empty string for same-origin requests (via Next.js proxy)
// In production, set NEXT_PUBLIC_BACKEND_URL to actual backend URL if different
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Generic API fetch wrapper with credentials support
 * 
 * @param path - API endpoint path (e.g., "/auth/login")
 * @param init - Fetch options
 * @returns Parsed JSON response
 */
export async function api<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const url = `${BACKEND_URL}${path}`;
  
  const response = await fetch(url, {
    ...init,
    credentials: "include", // Important: include cookies for session auth
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store", // Disable caching for dynamic data
  });

  // Handle non-OK responses
  if (!response.ok) {
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    let errorData;
    
    try {
      errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {
      // If response is not JSON, use text
      try {
        errorMessage = await response.text();
      } catch {
        // Keep default error message
      }
    }
    
    throw new ApiError(errorMessage, response.status, errorData);
  }

  // Parse JSON response
  return response.json() as Promise<T>;
}

/**
 * API endpoints helpers
 */
export const authApi = {
  /**
   * Get Google OAuth login URL
   */
  async getLoginUrl(): Promise<{ auth_url: string }> {
    return api("/auth/login");
  },

  /**
   * Logout (clear session)
   */
  async logout(): Promise<{ ok: boolean }> {
    return api("/auth/logout", { method: "POST" });
  },

  /**
   * Get current user info
   */
  async getMe(): Promise<{ email: string; id: number }> {
    return api("/auth/me");
  },
};

export interface CalendarEvent {
  id: string;
  summary: string | null;
  start: string;
  end: string;
  attendees: string[];
  calendarId: string;
}

export interface EventsResponse {
  events: CalendarEvent[];
  nextPageToken?: string;
}

export const calendarApi = {
  /**
   * Fetch calendar events
   */
  async getEvents(params: {
    timeMin: string;
    timeMax: string;
    timezone?: string;
    pageToken?: string;
  }): Promise<EventsResponse> {
    const queryParams = new URLSearchParams({
      timeMin: params.timeMin,
      timeMax: params.timeMax,
      timezone: params.timezone || "Asia/Bangkok",
    });
    
    if (params.pageToken) {
      queryParams.append("pageToken", params.pageToken);
    }
    
    return api(`/api/events?${queryParams.toString()}`);
  },
};

