export interface Survey {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'closed';
  location: string;
  deadline: string;
  participants: number;
  participationPercentage: number;
}

interface SurveyEntity {
  id: number;
  createdAt: string;
  title: string;
  description: string;
  organization: any;
  vote: any[];
  options: any[];
  type: string;
  region: any;
  votedCount: number;
  startDate: string;
  validUntil: string;
  isActive: boolean;
}

const NPS_API_URL = process.env.NEXT_PUBLIC_NPS_API_URL;

function mapSurveyEntity(entity: SurveyEntity): Survey {
  return {
    id: String(entity.id),
    title: entity.title,
    description: entity.description,
    status: entity.isActive ? 'active' : 'closed',
    location: entity.region?.name || 'Вся РК',
    deadline: new Date(entity.validUntil).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    participants: entity.votedCount,
    participationPercentage: Math.min(100, Math.round((entity.votedCount / 1000) * 100))
  };
}

export async function getActiveSurveys(): Promise<Survey[]> {
  try {
    const response = await fetch(`${NPS_API_URL}/survey?isActive=true`, {
      next: { revalidate: 60 } // Cache for 1 minute instead of 5
    });

    if (!response.ok) {
      return [];
    }

    const data: SurveyEntity[] = await response.json();
    return data.map(mapSurveyEntity);
  } catch (error) {
    console.error('Error fetching active surveys:', error);
    return [];
  }
}

export async function getClosedSurveys(): Promise<Survey[]> {
  try {
    const response = await fetch(`${NPS_API_URL}/survey?isActive=false`, {
      next: { revalidate: 600 }
    });

    if (!response.ok) {
      return [];
    }

    const data: SurveyEntity[] = await response.json();

    return data.map(mapSurveyEntity);
  } catch (error) {
    return [];
  }
}

export async function getAllSurveys(): Promise<Survey[]> {
  try {
    const response = await fetch(`${NPS_API_URL}/survey`, {
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      return [];
    }

    const data: SurveyEntity[] = await response.json();
    return data.map(mapSurveyEntity);
  } catch (error) {
    return [];
  }
}
