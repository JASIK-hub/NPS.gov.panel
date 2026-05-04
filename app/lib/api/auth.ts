export interface RequestCodeRequest {
  email: string;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone?: string;
  gender?: 'male' | 'female' | string;
  password: string;
}

export interface LoginEcpRequest {
  cms: string;
  data: string,
  bin?: string;
}

export interface LoginPasswordRequest {
  email: string;
  password: string;
}

export interface LoginPasswordResponse {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
  error?: string;
  message?: string;
}

export interface LoginEcpResponse {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
  error?: string;
  message?: string;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  error?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
}

export interface RequestCodeResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface VerifyCodeResponse {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
  error?: string;
  message?: string;
}

const NPS_API_URL = process.env.NEXT_PUBLIC_NPS_API_URL;

export async function register(credentials: RegisterRequest): Promise<RegisterResponse> {
  try {
    const response = await fetch(`${NPS_API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Registration failed',
        message: data.error || 'Ошибка регистрации'
      };
    }

    return {
      success: true,
      message: data.message || 'Регистрация выполнена успешно',
      user: data.user
    };

  } catch (error) {
    return {
      success: false,
      error: 'Network error',
      message: 'Ошибка соединения. Попробуйте позже.'
    };
  }
}

export async function requestCode(email: string): Promise<RequestCodeResponse> {
  try {
    const response = await fetch(`${NPS_API_URL}/auth/send-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Failed to send code',
        message: data.error || 'Ошибка отправки кода'
      };
    }

    return {
      success: true,
      message: data.message || 'Код отправлен на email'
    };

  } catch (error) {
    return {
      success: false,
      error: 'Network error',
      message: 'Ошибка соединения. Попробуйте позже.'
    };
  }
}

export async function loginPassword(credentials: LoginPasswordRequest): Promise<LoginPasswordResponse> {
  try {
    const response = await fetch(`${NPS_API_URL}/auth/login/password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Login failed',
        message: data.error || 'Неверный email или пароль'
      };
    }

    return {
      success: true,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user,
      message: 'Вход выполнен успешно'
    };

  } catch (error) {
    return {
      success: false,
      error: 'Network error',
      message: 'Ошибка соединения. Попробуйте позже.'
    };
  }
}

export async function loginWithCode(email: string, code: string): Promise<VerifyCodeResponse> {
  try {
    const response = await fetch(`${NPS_API_URL}/auth/login/code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Invalid code',
        message: data.error || 'Неверный код'
      };
    }

    return {
      success: true,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user,
      message: 'Вход выполнен успешно'
    };

  } catch (error) {
    return {
      success: false,
      error: 'Network error',
      message: 'Ошибка соединения. Попробуйте позже.'
    };
  }
}

export async function loginEcp(credentials: LoginEcpRequest): Promise<LoginEcpResponse> {
  try {
    const response = await fetch(`${NPS_API_URL}/auth/login/ecp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Login failed',
        message: data.error || 'Ошибка входа через ЭЦП'
      };
    }

    return {
      success: true,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user,
      message: 'Вход выполнен успешно'
    };

  } catch (error) {
    return {
      success: false,
      error: 'Network error',
      message: 'Ошибка соединения. Попробуйте позже.'
    };
  }
}

export async function verifyCode(credentials: VerifyCodeRequest): Promise<VerifyCodeResponse> {
  try {
    const response = await fetch(`${NPS_API_URL}/auth/code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });
    
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Invalid code',
        message: data.error || 'Неверный код'
      };
    }

    return {
      success: true,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user,
      message: 'Вход выполнен успешно'
    };

  } catch (error) {
    return {
      success: false,
      error: 'Network error',
      message: 'Ошибка соединения. Попробуйте позже.'
    };
  }
}

export async function logout(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetchWithAuth(`${NPS_API_URL}/auth/logout`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    removeAuthToken();
    removeRefreshToken();

    return {
      success: true,
      message: 'Выход выполнен успешно'
    };

  } catch (error) {
    removeAuthToken();
    removeRefreshToken();
    return {
      success: false,
      message: 'Ошибка при выходе'
    };
  }
}

export async function refreshAccessToken(): Promise<{ success: boolean; accessToken?: string; refreshToken?: string }> {
  try {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      return { success: false };
    }

    const response = await fetch(`${NPS_API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      removeAuthToken();
      removeRefreshToken();
      return { success: false };
    }

    const data = await response.json();

    if (data.accessToken) {
      storeAuthToken(data.accessToken);
    }

    if (data.refreshToken) {
      storeRefreshToken(data.refreshToken);
    }

    return {
      success: true,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };

  } catch (error) {
    removeAuthToken();
    removeRefreshToken();
    return { success: false };
  }
}

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAuthToken();

  const headers = {
    ...options.headers,
    ...(token && { 'Authorization': `Bearer ${token}` }),
    'Content-Type': 'application/json',
  };

  let response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (response.status === 401) {
    const refreshResult = await refreshAccessToken();

    if (refreshResult.success && refreshResult.accessToken) {
      const newHeaders = {
        ...options.headers,
        'Authorization': `Bearer ${refreshResult.accessToken}`,
        'Content-Type': 'application/json',
      };

      response = await fetch(url, {
        ...options,
        headers: newHeaders,
        credentials: 'include',
      });
    } else {
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      throw new Error('Session expired');
    }
  }

  return response;
}

export async function fetchWithAuthJson<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetchWithAuth(url, options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export function storeAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
    document.cookie = `access_token=${token}`;
  }
}

export function storeRefreshToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('refresh_token', token);
    document.cookie = `refresh_token=${token}`;
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

export function isAuthenticated(): boolean {
  const token = getAuthToken();
  return !!token && token.length > 0;
}

export function getRefreshToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refresh_token');
  }
  return null;
}

export function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    document.cookie = 'access_token=';
  }
}

export function removeRefreshToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('refresh_token');
    document.cookie = 'refresh_token=';
  }
}