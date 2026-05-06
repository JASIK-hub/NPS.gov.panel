import { SurveyEntity } from '../api/survey/surveys';

export function searchSurvey(survey: SurveyEntity, query: string): boolean {
  if (!query || query.trim() === '') return true;

  const searchQuery = query.toLowerCase().trim();

  // Search in title
  if (survey.title.toLowerCase().includes(searchQuery)) return true;

  // Search in description
  if (survey.description.toLowerCase().includes(searchQuery)) return true;

  // Search in organization name
  if (survey.organization?.name?.toLowerCase().includes(searchQuery)) return true;

  // Search in region
  if (survey.region?.name?.toLowerCase().includes(searchQuery)) return true;

  // Search in participant count
  if (survey.votedCount.toString().includes(searchQuery)) return true;

  // Search in dates (multiple formats)
  const startDate = new Date(survey.startDate);
  const endDate = new Date(survey.validUntil);

  // Format: dd.mm.yyyy
  const startDateNumeric = startDate.toLocaleDateString('ru-RU');
  const endDateNumeric = endDate.toLocaleDateString('ru-RU');

  // Format: d month yyyy (e.g., "1 мая 2026")
  const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
                       'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

  const formatDateText = (date: Date) => {
    return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  const startDateText = formatDateText(startDate);
  const endDateText = formatDateText(endDate);

  // Check all date formats
  if (startDateNumeric.includes(searchQuery) || endDateNumeric.includes(searchQuery) ||
      startDateText.includes(searchQuery) || endDateText.includes(searchQuery)) {
    return true;
  }

  return false;
}

export function filterSurveys(surveys: SurveyEntity[], query: string): SurveyEntity[] {
  return surveys.filter(survey => searchSurvey(survey, query));
}
