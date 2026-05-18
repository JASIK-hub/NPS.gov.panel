# Система переводов (i18n)

## Структура

```
app/lib/locales/
├── ru.json           # Русские переводы
├── kz.json           # Казахские переводы
└── useTranslations.ts # Хук для использования
```

## Использование в компонентах

```tsx
import { useTranslations } from '@/app/lib/locales/useTranslations';

const MyComponent = () => {
  const { t, lang } = useTranslations();

  return (
    <div>
      <h1>{t('header.title')}</h1>
      <p>{t('common.description')}</p>
    </div>
  );
};
```

## Категории переводов

- `header` - Хедер сайта
- `hero` - Герой секция главной страницы
- `footer` - Футер сайта
- `surveyCard` - Карточка опроса
- `survey` - Форма голосования
- `surveysPage` - Страница всех опросов
- `analytics` - Страница аналитики
- `profile` - Профиль пользователя
- `stats` - Статистические блоки
- `common` - Общие фразы

## Добавление нового перевода

1. Добавь ключ в оба файла `ru.json` и `kz.json`:
```json
{
  "mySection": {
    "myKey": "Мой текст"
  }
}

{
  "mySection": {
    "myKey": "Менің мәтінім"
  }
}
```

2. Используй в компоненте:
```tsx
{t('mySection.myKey')}
```

## Обновлённые компоненты

- ✅ header.tsx
- ✅ footer.tsx
- ✅ heroSection.tsx
- ✅ surveyCard.tsx
- ✅ surveyVotingForm.tsx
- ✅ surveys/page.tsx
- ✅ analytics/page.tsx
- ✅ profile/page.tsx
