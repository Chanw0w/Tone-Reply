import { storage } from "@/src/utils/storage";

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:8000";

interface ApiError {
  detail?: string;
  message?: string;
}

interface RequestConfig extends RequestInit {
  timeout?: number;
}

class ApiService {
  private baseUrl: string;
  private defaultTimeout: number = 30000;

  constructor() {
    this.baseUrl = `${EXPO_PUBLIC_BACKEND_URL}/api`;
  }

  async getToken(): Promise<string | null> {
    return await storage.secureGet("auth_token", null);
  }

  async setToken(token: string): Promise<boolean> {
    return await storage.secureSet("auth_token", token);
  }

  async removeToken(): Promise<boolean> {
    return await storage.secureRemove("auth_token");
  }

  async request<T>(endpoint: string, options: RequestConfig = {}): Promise<T> {
    const token = await this.getToken();
    const headers = new Headers(options.headers || {});
    
    headers.set("Content-Type", "application/json");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const { timeout = this.defaultTimeout, ...fetchOptions } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      if (!response.ok) {
        let errorMsg = "Something went wrong";
        try {
          const errJson: ApiError = await response.json();
          errorMsg = errJson.detail || errJson.message || errorMsg;
        } catch {
          errorMsg = response.statusText || errorMsg;
        }
        throw new Error(errorMsg);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }
      return null as T;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error("Request timed out");
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const api = new ApiService();
