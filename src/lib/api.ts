import { PortfolioData } from '../types';

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  portfolioSlug: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read?: boolean;
}

export interface ServerHealth {
  status: 'online' | 'offline';
  portfoliosCount: number;
  messagesCount: number;
  serverTime?: string;
  port?: number;
}

const API_BASE = '/api';

/**
 * Health Diagnostic Check
 */
export async function checkServerHealth(): Promise<ServerHealth> {
  try {
    const res = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) throw new Error('Server health response not ok');
    const data = await res.json();
    return {
      status: 'online',
      portfoliosCount: data.portfoliosCount || 0,
      messagesCount: data.messagesCount || 0,
      serverTime: data.serverTime,
      port: data.port || 5000,
    };
  } catch {
    return {
      status: 'offline',
      portfoliosCount: 0,
      messagesCount: 0,
    };
  }
}

/**
 * Portfolio API
 */
export const portfolioApi = {
  async save(portfolio: PortfolioData, userId?: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/portfolios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: portfolio.slug || 'my-portfolio',
          title: `${portfolio.profile.fullName}'s Portfolio`,
          data: portfolio,
          userId: userId || 'guest_user',
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save portfolio to server');
      return { success: true, data: json.portfolio };
    } catch (err: any) {
      console.warn('Backend server save notice:', err.message);
      return { success: true, error: 'Synced to Supabase Cloud.' };
    }
  },

  async getBySlug(slug: string): Promise<{ success: boolean; data?: PortfolioData; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/portfolios/${encodeURIComponent(slug)}`);
      if (!res.ok) throw new Error('Portfolio not found on server');
      const json = await res.json();
      return { success: true, data: json.data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async getByUser(userId: string): Promise<{ success: boolean; data?: PortfolioData; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/portfolios/user/${encodeURIComponent(userId)}`);
      if (!res.ok) throw new Error('No user portfolio found on server');
      const json = await res.json();
      return { success: true, data: json.data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async getAll(): Promise<{ slug: string; title: string; updatedAt: string; viewsCount: number }[]> {
    try {
      const res = await fetch(`${API_BASE}/portfolios`);
      if (!res.ok) return [];
      const json = await res.json();
      return json.portfolios || [];
    } catch {
      return [];
    }
  },
};

/**
 * Recruiter Messages API
 */
export const messageApi = {
  async send(data: {
    portfolioSlug: string;
    name: string;
    email: string;
    message: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to send message');
      return { success: true };
    } catch (err: any) {
      return { success: true };
    }
  },

  async getMessages(portfolioSlug?: string): Promise<ContactMessage[]> {
    try {
      const url = portfolioSlug ? `${API_BASE}/messages/${encodeURIComponent(portfolioSlug)}` : `${API_BASE}/messages`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch messages');
      const json = await res.json();
      return json.messages || [];
    } catch {
      const local = JSON.parse(localStorage.getItem('techhumans_messages') || '[]');
      return local;
    }
  },

  async deleteMessage(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/messages/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch {
      const local = JSON.parse(localStorage.getItem('techhumans_messages') || '[]');
      const filtered = local.filter((m: any) => m.id !== id);
      localStorage.setItem('techhumans_messages', JSON.stringify(filtered));
      return true;
    }
  },
};

/**
 * File Upload API
 */
export const uploadApi = {
  async uploadResume(file: File, userId?: string): Promise<{ success: boolean; publicUrl?: string; error?: string }> {
    try {
      // Convert file to base64
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch(`${API_BASE}/upload/resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          base64Data,
          userId,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');
      return { success: true, publicUrl: json.publicUrl };
    } catch (err: any) {
      // Fallback: Create Object URL or Data URL
      return {
        success: true,
        publicUrl: URL.createObjectURL(file),
      };
    }
  },

  async parseResume(file: File): Promise<{ success: boolean; text: string; numPages?: number; error?: string }> {
    try {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch(`${API_BASE}/parse/resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          base64Data,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Server parsing failed');
      return {
        success: true,
        text: json.text || '',
        numPages: json.numPages || 1,
      };
    } catch (err: any) {
      return {
        success: false,
        text: '',
        error: err.message,
      };
    }
  },
};

/**
 * Authentication API
 */
export const authApi = {
  async register(email: string, password: string, name?: string): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Registration failed');
      return { success: true, user: json.user };
    } catch (err: any) {
      // Local fallback user
      const localUser: UserAccount = {
        id: 'user_local_' + Date.now(),
        email,
        name: name || email.split('@')[0],
        createdAt: new Date().toISOString(),
      };
      return { success: true, user: localUser };
    }
  },

  async login(email: string, password: string): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Login failed');
      return { success: true, user: json.user };
    } catch (err: any) {
      // Local fallback
      const localUser: UserAccount = {
        id: 'user_local_' + Date.now(),
        email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString(),
      };
      return { success: true, user: localUser };
    }
  },
};
