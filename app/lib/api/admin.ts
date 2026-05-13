import { fetchWithAuth } from './auth';

const NPS_API_URL = process.env.NEXT_PUBLIC_NPS_API_URL;

export interface AdminSurvey {
  id: number;
  createdAt: string;
  title: string;
  description: string;
  subTitle: string;
  organization: {
    id: number;
    name: string;
  };
  vote: Array<{
    id: number;
    user: {
      id: number;
      email: string;
      name?: string;
    };
    option: {
      id: number;
      title: string;
    };
  }>;
  options: Array<{
    id: number;
    title: string;
  }>;
  type: string;
  region: {
    id: number;
    name: string;
    code: string;
  } | null;
  executionStatus: 'implemented' | 'in progress' | 'cancelled';
  finalDecision: string | null;
  votedCount: number;
  startDate: string;
  validUntil: string;
  isActive: boolean;
}

export interface CreateSurveyRequest {
  title: string;
  description: string;
  region?: string;
  type: string;
  startDate: string;
  validUntil: string;
  options: string[];
}

export interface UpdateSurveyRequest {
  executionStatus?: 'implemented' | 'in progress' | 'cancelled';
  finalDecision?: string;
}

export async function getAllAdminSurveys(): Promise<AdminSurvey[]> {
  try {
    const response = await fetchWithAuth(`${NPS_API_URL}/admin/surveys`);
    if (!response.ok) {
      throw new Error('Failed to fetch surveys');
    }

    const data = await response.json();
    return data
  } catch (error) {
    return [];
  }
}

export async function createAdminSurvey(
  data: CreateSurveyRequest,
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const response = await fetchWithAuth(`${NPS_API_URL}/admin/survey`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Ошибка при создании опроса',
      };
    }

    return {
      success: true,
      message: 'Опрос создан успешно',
    };
  } catch (error) {
    return {
      success: false,
      error: 'Ошибка соединения. Попробуйте позже.',
    };
  }
}

export async function updateAdminSurvey(
  id: number,
  data: UpdateSurveyRequest,
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const response = await fetchWithAuth(`${NPS_API_URL}/admin/survey/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Ошибка при обновлении опроса',
      };
    }

    return {
      success: true,
      message: 'Опрос обновлен успешно',
    };
  } catch (error) {
    return {
      success: false,
      error: 'Ошибка соединения. Попробуйте позже.',
    };
  }
}

export async function deleteAdminSurvey(
  id: number,
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const response = await fetchWithAuth(`${NPS_API_URL}/admin/survey/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Ошибка при удалении опроса',
      };
    }

    return {
      success: true,
      message: 'Опрос удален успешно',
    };
  } catch (error) {
    return {
      success: false,
      error: 'Ошибка соединения. Попробуйте позже.',
    };
  }
}

export interface AdminStats {
  activeSurveys: number;
  draftSurveys: number;
  completedSurveys: number;
  totalVotes: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  try {
    const response = await fetchWithAuth(`${NPS_API_URL}/admin/stats`);

    if (!response.ok) {
      return {
        activeSurveys: 0,
        draftSurveys: 0,
        completedSurveys: 0,
        totalVotes: 0,
      };
    }

    return response.json();
  } catch (error) {
    return {
      activeSurveys: 0,
      draftSurveys: 0,
      completedSurveys: 0,
      totalVotes: 0,
    };
  }
}

export interface ParticipationStat {
  groupName: string;
  count: number;
}

export async function getAdminParticipationStats(): Promise<ParticipationStat[]> {
  try {
    const response = await fetchWithAuth(`${NPS_API_URL}/admin/participation-stats`);

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch (error) {
    return [];
  }
}
