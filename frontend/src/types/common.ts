// Multi-language text type (matches backend JSONB)
export type MultiLangText = {
  th?: string;
  en: string;  // Required - default language
  de?: string;
  [key: string]: string | undefined;
};

// Helper function to get localized text
export function getLocalizedText(
  text: MultiLangText | undefined,
  locale: string,
  fallback = ''
): string {
  if (!text) return fallback;

  // Try requested locale
  if (text[locale]) return text[locale];

  // Fallback to English
  if (text.en) return text.en;

  // Return first available
  for (const lang in text) {
    if (text[lang]) return text[lang];
  }

  return fallback;
}

// API Response types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role?: Role;
  email_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions?: Record<string, any>;
}

// Auth types
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}
