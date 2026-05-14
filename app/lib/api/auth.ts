export interface RequestCodeRequest {
  email: string;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export interface RegisterRequest {
  firstName: string;
  email?: string;
  phone?: string;
  birthday?: string;
  gender?: 'male' | 'female' | string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface LoginEcpRequest {
  cms: string;
  data: string,
  bin?: string;
}

export interface LoginPasswordRequest {
  identifier: string;
  password: string;
}

export interface LoginPasswordResponse {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id: number;
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
    id: number;
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
    id: number;
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
    id: number;
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
    const response = await fetch(`${NPS_API_URL}/auth/registration`, {
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
        error: data.error || 'Registration failed',
        message: data.message || data.error || 'Ошибка регистрации. Попробуйте позже.'
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
      message: 'Ошибка соединения. Проверьте интернет и попробуйте снова.'
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
        error: data.error || 'Failed to send code',
        message: data.message || data.error || 'Не удалось отправить код. Попробуйте позже.'
      };
    }

    return {
      success: true,
      message: data.message || 'Код отправлен на вашу почту'
    };

  } catch (error) {
    return {
      success: false,
      error: 'Network error',
      message: 'Ошибка соединения. Проверьте интернет и попробуйте снова.'
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
        error: data.error || 'Login failed',
        message: data.message || data.error || 'Неверный email/ИИН или пароль'
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
      message: 'Ошибка соединения. Проверьте интернет и попробуйте снова.'
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
        error: data.error || 'Invalid code',
        message: data.message || data.error || 'Неверный код. Попробуйте снова.'
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
      message: 'Ошибка соединения. Проверьте интернет и попробуйте снова.'
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
        error: data.error || 'Login failed',
        message: data.message || data.error || 'Ошибка входа через ЭЦП. Попробуйте снова.'
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
      message: 'Ошибка соединения. Проверьте интернет и попробуйте снова.'
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
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user_id');
      }
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
  let token = getAuthToken();
  if (!token) {
    if (typeof window !== 'undefined') {
      removeAuthToken();
      removeRefreshToken();
      localStorage.removeItem('user_id');
    }
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    return response;
  }

  if (isTokenExpired()) {
    const refreshResult = await refreshAccessToken();

    if (refreshResult.success && refreshResult.accessToken) {
      token = refreshResult.accessToken;
    } else {
      if (typeof window !== 'undefined') {
        removeAuthToken();
        removeRefreshToken();
        localStorage.removeItem('user_id');
        window.location.href = '/auth/login';
      }
      throw new Error('Session expired');
    }
  }

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
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
        removeAuthToken();
        removeRefreshToken();
        localStorage.removeItem('user_id');
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
    const maxAge = 60 * 60 * 24 * 7; 
    document.cookie = `access_token=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }
}

export function storeRefreshToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('refresh_token', token);
    const maxAge = 60 * 60 * 24 * 30;
    document.cookie = `refresh_token=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }
}

export function storeUserId(userId: number): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_id', String(userId));
  }
}

export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

export function getTokenExp(): number | null {
  const token = getAuthToken();
  if (!token) return null;

  const decoded = parseJWT(token);
  return decoded?.exp ? decoded.exp * 1000 : null;
}

export function isTokenExpired(): boolean {
  const exp = getTokenExp();
  if (!exp) return true;
  return Date.now() >= exp;
}

export function isAuthenticated(): boolean {
  const token = getAuthToken();
  if (!token || token.length === 0) {
    return false;
  }

  const decoded = parseJWT(token);
  if (!decoded || !decoded.exp) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  const isExpired = decoded.exp <= now;

  return !isExpired;
}

export function getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
}

export function isRefreshTokenExpired(): boolean {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return true;

  const decoded = parseJWT(refreshToken);
  if (!decoded || !decoded.exp) return true;

  return Date.now() >= decoded.exp * 1000;
}

export function parseJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

export function getCurrentUserId(): number | null {
  const token = getAuthToken();
  if (!token) {
    return null;
  }

  const decoded = parseJWT(token);
  if (!decoded) {
    return null;
  }

  const userId = decoded.userId || decoded.user_id || decoded.sub || decoded.id || decoded.user?.id;

  return userId ? parseInt(String(userId)) : null;
}

export function getCurrentUserRole(): string | null {
  const token = getAuthToken();
  if (!token) {
    return null;
  }

  const decoded = parseJWT(token);
  if (!decoded) {
    return null;
  }

  return decoded.role || null;
}

export function isAdmin(): boolean {
  const role = getCurrentUserRole();
  return role === 'admin';
}

export function removeAuthToken(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        document.cookie = 'access_token=; path=/; max-age=0; SameSite=Lax';
    }
}

export async function forgotPassword(email: string): Promise<RequestCodeResponse> {
  try {
    const response = await fetch(`${NPS_API_URL}/auth/forgot-password`, {
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
        error: data.error || 'Failed to send code',
        message: data.message || data.error || 'Не удалось отправить код. Попробуйте позже.'
      };
    }

    return {
      success: true,
      message: data.message || 'Код отправлен на вашу почту'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Network error',
      message: 'Ошибка соединения. Проверьте интернет и попробуйте снова.'
    };
  }
}

export async function resetPassword(email: string, code: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const response = await fetch(`${NPS_API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code, newPassword }),
      credentials: 'include',
    });
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Reset failed',
        message: data.message || data.error || 'Не удалось сбросить пароль. Проверьте код и попробуйте снова.'
      };
    }

    return {
      success: true,
      message: data.message || 'Пароль успешно изменён'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Network error',
      message: 'Ошибка соединения. Проверьте интернет и попробуйте снова.'
    };
  }
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const response = await fetchWithAuth(`${NPS_API_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Change failed',
        message: data.message || data.error || 'Не удалось изменить пароль. Проверьте текущий пароль.'
      };
    }

    return {
      success: true,
      message: data.message || 'Пароль успешно изменён'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Network error',
      message: 'Ошибка соединения. Проверьте интернет и попробуйте снова.'
    };
  }
}

export async function sendVerifyEmail(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const response = await fetchWithAuth(`${NPS_API_URL}/auth/verify-email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Send failed',
        message: data.message || data.error || 'Не удалось отправить код. Попробуйте позже.'
      };
    }

    return {
      success: true,
      message: data.message || 'Код отправлен на вашу почту'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Network error',
      message: 'Ошибка соединения. Проверьте интернет и попробуйте снова.'
    };
  }
}

export async function verifyEmailWithPassword(email: string, code: string, password?: string): Promise<{ success: boolean; message?: string; error?: string; accessToken?: string; refreshToken?: string }> {
  try {
    const response = await fetchWithAuth(`${NPS_API_URL}/auth/verify-email/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code, ...(password && { password }) }),
    });
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Verify failed',
        message: data.message || data.error || 'Не удалось подтвердить email. Проверьте код и попробуйте снова.'
      };
    }

    return {
      success: true,
      message: data.message || 'Email успешно подтверждён',
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Network error',
      message: 'Ошибка соединения. Проверьте интернет и попробуйте снова.'
    };
  }
}

export function removeRefreshToken(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('refresh_token');
        document.cookie = 'refresh_token=; path=/; max-age=0; SameSite=Lax';
    }
}

export interface CompleteRegistrationRequest {
  firstName: string;
  lastName: string;
  phone: string;
  birthday: string;
  gender: 'male' | 'female';
  emailCode: string;
  email: string;
  password?: string;
  ecpSignature?: string;
  ecpData?: string;
  iin?: string;
}

export interface CompleteRegistrationResponse {
  success: boolean;
  message?: string;
  error?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id: number;
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  };
}

export async function completeRegistration(data: CompleteRegistrationRequest): Promise<CompleteRegistrationResponse> {
  try {
    const response = await fetch(`${NPS_API_URL}/auth/register/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    const responseData = await response.json();

    if (!response.ok) {
      let errorMessage = responseData.message || responseData.error || 'Не удалось завершить регистрацию. Попробуйте позже.';

      if (response.status === 400) {
        if (responseData.message?.includes('уже зарегистрирован') || responseData.error?.includes('уже зарегистрирован')) {
          errorMessage = responseData.message || 'Пользователь с таким email уже зарегистрирован';
        }
      }

      return {
        success: false,
        error: responseData.error || 'Registration failed',
        message: errorMessage
      };
    }

    return {
      success: true,
      message: responseData.message || 'Регистрация успешно завершена',
      accessToken: responseData.accessToken,
      refreshToken: responseData.refreshToken,
      user: responseData.user,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Network error',
      message: 'Ошибка соединения. Проверьте интернет и попробуйте снова.'
    };
  }
}