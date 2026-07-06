import { storage } from "@/src/utils/storage";

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || "https://tone-reply-2.preview.emergentagent.com";

class ApiService {
  private baseUrl: string;

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

  async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = await this.getToken();
    const headers = new Headers(options.headers || {});
    
    headers.set("Content-Type", "application/json");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMsg = "Something went wrong";
      try {
        const errJson = await response.json();
        errorMsg = errJson.detail || errJson.message || errorMsg;
      } catch (e) {
        // use status text if parsing json fails
        errorMsg = response.statusText || errorMsg;
      }
      throw new Error(errorMsg);
    }

    try {
      return await response.json();
    } catch (e) {
      return null;
    }
  }

  async get(endpoint: string): Promise<any> {
    return this.request(endpoint, { method: "GET" });
  }

  async post(endpoint: string, body: any): Promise<any> {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async delete(endpoint: string): Promise<any> {
    return this.request(endpoint, { method: "DELETE" });
  }
}

export const api = new ApiService();
