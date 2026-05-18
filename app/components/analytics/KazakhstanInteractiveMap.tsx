"use client";

import React, { useMemo, useState, useCallback } from 'react';
import * as d3 from 'd3-geo';
import geoDataRaw from '../../../public/kz.json';
import { RegionStats } from '@/app/lib/api/survey/surveys';
import {
  getDisplayName,
  findRegionByName,
  findParentRegion,
} from '@/app/lib/utils/regionMapper';
import { useTranslations } from '@/app/lib/locales/useTranslations';

interface GeoJsonProperties {
  id?: string;
  name?: string;
  [key: string]: any;
}

interface GeoJsonFeature {
  type: 'Feature';
  id?: string | number;
  properties?: GeoJsonProperties;
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: any;
  };
}

interface GeoJsonData {
  type: 'FeatureCollection';
  features: GeoJsonFeature[];
}

interface RegionWithStats {
  feature: GeoJsonFeature;
  stats?: { votes: number; activity: number };
  displayName: string;
  path?: string;
  colors: { fill: string; fillOpacity: number };
}

interface KazakhstanMapProps {
  stats?: RegionStats[];
}

const getActivityColor = (activity?: number): { fill: string; fillOpacity: number } => {
  if (!activity) return { fill: '#94a3b8', fillOpacity: 0.3 };
  if (activity >= 70) return { fill: '#1e3a8a', fillOpacity: 0.8 };
  if (activity >= 50) return { fill: '#3b82f6', fillOpacity: 0.7 };
  if (activity >= 30) return { fill: '#60a5fa', fillOpacity: 0.6 };
  return { fill: '#93c5fd', fillOpacity: 0.5 };
};

export const KazakhstanInteractiveMap: React.FC<KazakhstanMapProps> = ({ stats = [] }) => {
  const { t } = useTranslations();
  const [hoveredRegion, setHoveredRegion] = useState<RegionWithStats | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  const statsMap = useMemo(() => {
    const map = new Map<string, { votes: number; activity: number }>();
    const regionVotes = new Map<string, number>();
    stats.forEach(stat => {
      const parentRegion = findParentRegion(stat.name);
      if (parentRegion) {
        const currentVotes = regionVotes.get(parentRegion) || 0;
        regionVotes.set(parentRegion, currentVotes + stat.votes);
      }

      const regionName = findRegionByName(stat.name);
      if (regionName) {
        const currentVotes = regionVotes.get(regionName) || 0;
        regionVotes.set(regionName,stat.votes);
      }
    });

    const maxVotes = Math.max(...regionVotes.values(), 1);

    regionVotes.forEach((votes, regionName) => {
      const activity = Math.round((votes / maxVotes) * 100);
      map.set(regionName, { votes, activity });
    });

    return map;
  }, [stats, findParentRegion, findRegionByName]);

  const projection = useMemo(() => {
    const data = geoDataRaw as any;
    return d3.geoMercator().fitSize([800, 600], data);
  }, []);

  const pathGenerator = useMemo(() => d3.geoPath().projection(projection), [projection]);

  const data = geoDataRaw as GeoJsonData;

  const regionsWithStats = useMemo(() => {
    return data.features.map((feature) => {
      const nameEn = feature.properties?.name || '';
      const displayName = getDisplayName(nameEn);

      const regionStats = statsMap.get(nameEn);

      const colors = getActivityColor(regionStats?.activity);
      const path = pathGenerator(feature as any) || undefined;

      return {
        feature,
        stats: regionStats,
        displayName,
        path,
        colors,
      };
    });
  }, [data.features, statsMap, pathGenerator, getDisplayName]);

  const handleMouseEnter = useCallback((region: RegionWithStats, event: React.MouseEvent<SVGPathElement>) => {
    setHoveredRegion(region);
    const rect = (event.target as SVGPathElement).getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredRegion(null);
    setTooltipPosition(null);
  }, []);

  return (
    <div className="relative w-full">
      <svg viewBox="0 0 800 600" className="w-full h-auto drop-shadow-lg">
        <rect x="0" y="0" width="800" height="600" fill="#f8fafc" rx="8" />

        <g>
          {regionsWithStats.map((region) => {
            const isHovered = hoveredRegion?.displayName === region.displayName;

            return (
              <path
                key={region.feature.id || region.displayName}
                d={region.path}
                fill={isHovered ? '#1e293b' : region.colors.fill}
                fillOpacity={isHovered ? 0.9 : region.colors.fillOpacity}
                stroke="#475569"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={(e) => handleMouseEnter(region, e)}
                onMouseLeave={handleMouseLeave}
              />
            );
          })}
        </g>
      </svg>

      {hoveredRegion && tooltipPosition && (
        <div
          className="fixed z-50 bg-white p-4 rounded-xl shadow-lg border min-w-[220px] pointer-events-none"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y - 10}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="text-sm font-bold text-gray-900 mb-2">{hoveredRegion.displayName}</div>
          {hoveredRegion.stats ? (
            <div className="space-y-1">
              <div className="text-xs text-gray-500 flex justify-between">
                <span>{t('analytics.participants')}:</span>
                <span className="ml-2 font-medium">{hoveredRegion.stats.votes.toLocaleString()}</span>
              </div>
              <div className="text-xs text-gray-500 flex justify-between">
                <span>{t('analytics.activity')}:</span>
                <span className="ml-2 font-medium">{hoveredRegion.stats.activity}%</span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-400">{t('analytics.noData')}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default KazakhstanInteractiveMap;
