export interface RegionMapping {
  name: string;
  displayName: string;
  cities: string[];
}

export const REGION_MAPPING: RegionMapping[] = [
  {
    name: 'Akmola',
    displayName: 'Акмолинская',
    cities: ['Астана', 'Кокшетау', 'Косшы', 'Степногорск', 'Атбасар'],
  },
  {
    name: 'Aktobe',
    displayName: 'Актюбинская',
    cities: ['Актобе', 'Хромтау'],
  },
  {
    name: 'Almaty',
    displayName: 'Алматинская',
    cities: ['Талдыкорган', 'Алматы', 'Капчагай', 'Текели', 'Отеген батыр'],
  },
  {
    name: 'Atyrau',
    displayName: 'Атырауская',
    cities: ['Атырау', 'Кулсары'],
  },
  {
    name: 'West Kazakhstan',
    displayName: 'Западно-Казахстанская',
    cities: ['Уральск', 'Аксай'],
  },
  {
    name: 'Zhambyl',
    displayName: 'Жамбылская',
    cities: ['Тараз', 'Каратау', 'Жанатас', 'Шымкент'],
  },
  {
    name: 'Karaganda',
    displayName: 'Карагандинская',
    cities: ['Караганда', 'Балхаш', 'Темиртау', 'Жезказган', 'Сатпаев', 'Шахтинск', 'Сарань', 'Абай'],
  },
  {
    name: 'Kostanay',
    displayName: 'Костанайская',
    cities: ['Костанай', 'Рудный', 'Лисаковск', 'Аркалык'],
  },
  {
    name: 'Kyzylorda',
    displayName: 'Кызылординская',
    cities: ['Кызылорда', 'Байконур', 'Аральск'],
  },
  {
    name: 'Mangystau',
    displayName: 'Мангистауская',
    cities: ['Актау', 'Жанаозен'],
  },
  {
    name: 'Pavlodar',
    displayName: 'Павлодарская',
    cities: ['Павлодар', 'Экибастуз', 'Аксу'],
  },
  {
    name: 'North Kazakhstan',
    displayName: 'Северо-Казахстанская',
    cities: ['Петропавловск'],
  },
  {
    name: 'East Kazakhstan',
    displayName: 'Восточно-Казахстанская',
    cities: ['Усть-Каменогорск', 'Семей', 'Риддер', 'Аягоз'],
  },
  {
    name: 'Turkestan',
    displayName: 'Туркестанская',
    cities: ['Туркестан', 'Кентау', 'Арысь'],
  },
  {
    name: 'Ulytau',
    displayName: 'Улытауская',
    cities: ['Жезказган', 'Сатпаев', 'Караганда', 'Улытау'],
  },
];

export interface CityMapping extends RegionMapping {
  parentRegion?: string;
}

export const SEPARATE_CITIES: CityMapping[] = [
  {
    name: 'Almaty (city)',
    displayName: 'Алматы',
    cities: [],
    parentRegion: 'Almaty',
  },
  {
    name: 'Astana',
    displayName: 'Астана',
    cities: [],
    parentRegion: 'Akmola',
  },
  {
    name: 'Shymkent (city)',
    displayName: 'Шымкент',
    cities: [],
    parentRegion: 'Turkestan',
  },
];

/**
 * Найти родительскую область для города
 * @param cityName - название города на русском
 * @returns имя области из GeoJSON или null
 */
export function findParentRegion(cityName: string): string | null {
  const normalized = cityName.toLowerCase().trim();

  for (const region of REGION_MAPPING) {
    for (const city of region.cities) {
      if (city.toLowerCase() === normalized) {
        return region.name;
      }
    }
  }

  for (const city of SEPARATE_CITIES) {
    if (city.displayName.toLowerCase() === normalized) {
      return city.parentRegion || null;
    }
  }

  return null;
}

/**
 * Найти регион по названию (область или город)
 * @param name - название на русском
 * @returns имя региона из GeoJSON или null
 */
export function findRegionByName(name: string): string | null {
  const normalized = name.toLowerCase().trim();

  for (const city of SEPARATE_CITIES) {
    if (city.displayName.toLowerCase() === normalized) {
      return city.name;
    }
  }

  for (const region of REGION_MAPPING) {
    const regionName = region.displayName.toLowerCase();
    const regionWithArea = `${region.displayName} область`.toLowerCase();

    if (normalized === regionName || normalized === regionWithArea) {
      return region.name;
    }

    for (const city of region.cities) {
      if (city.toLowerCase() === normalized) {
        return region.name;
      }
    }
  }

  return null;
}

/**
 * Получить отображаемое имя региона
 * @param geoJsonName - имя из GeoJSON (английское)
 * @returns русское название для отображения
 */
export function getDisplayName(geoJsonName: string): string {
  for (const city of SEPARATE_CITIES) {
    if (city.name === geoJsonName) {
      return city.displayName;
    }
  }

  for (const region of REGION_MAPPING) {
    if (region.name === geoJsonName) {
      return region.displayName;
    }
  }

  return geoJsonName;
}

/**
 * Проверить является ли название городом
 * @param name - название на русском
 */
export function isCity(name: string): boolean {
  const normalized = name.toLowerCase().trim();

  for (const city of SEPARATE_CITIES) {
    if (city.displayName.toLowerCase() === normalized) {
      return true;
    }
  }

  for (const region of REGION_MAPPING) {
    for (const city of region.cities) {
      if (city.toLowerCase() === normalized) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Получить все регионы для отображения
 */
export function getAllRegions(): RegionMapping[] {
  return [...REGION_MAPPING, ...SEPARATE_CITIES];
}
