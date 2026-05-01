export interface RequestCodeRequest {
  email: string;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export interface RequestCodeResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface VerifyCodeResponse {
  success: boolean;
  token?: string;
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
    console.error('Request code error:', error);
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
      token: data.token,
      refreshToken: data.refreshToken,
      user: data.user,
      message: 'Вход выполнен успешно'
    };

  } catch (error) {
    console.error('Verify code error:', error);
    return {
      success: false,
      error: 'Network error',
      message: 'Ошибка соединения. Попробуйте позже.'
    };
  }
}

export async function logout(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${NPS_API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    return {
      success: true,
      message: 'Выход выполнен успешно'
    };

  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      message: 'Ошибка при выходе'
    };
  }
}

export function storeAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

export function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
}