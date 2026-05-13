export interface UserStat{
    groupName:string,
    count:number
}

export interface SurveyTypeStat extends UserStat{}



const NPS_API_URL = process.env.NEXT_PUBLIC_NPS_API_URL;
export async function fetchAndMapStats(
  endpoint: string,
  keyName: string
): Promise<UserStat[]> {
  try {
    const response = await fetch(`${NPS_API_URL}/${endpoint}`, {
      next: { revalidate: 300 }
    });

    if (!response.ok) return [];

    const data = await response.json();
    return data.map((item: any) => ({
      groupName: item[keyName], 
      count: item.count
    }));
  } catch (error) {
    return [];
  }
}