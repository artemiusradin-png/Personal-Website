"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Marker,
  Line,
  Sphere,
  ZoomableGroup,
} from "react-simple-maps";

type JourneyStage = {
  id: string;
  navLabel: string;
  year: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  zoom: number;
  mapImage?: string;
};

type JourneyVisualProps = {
  stage: JourneyStage;
  allStages: JourneyStage[];
  assetBasePath: string;
};

function mapAssetSrc(assetBasePath: string, filename: string) {
  if (assetBasePath) {
    return `${assetBasePath.replace(/\/$/, "")}/${filename}`;
  }
  return `/${filename}`;
}

type ViewState = {
  center: [number, number];
  zoom: number;
};

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const IRVG_STAGE_IDS = new Set(["2024-irvg", "2024-irvg-projects"]);
const HIDDEN_ROUTE_STAGE_IDS = new Set(["2024-irvg-projects"]);
const IRVG_HIGHLIGHT_COUNTRIES = new Set([
  "Canada",
  "New Zealand",
  "United States of America",
  "Ukraine",
  // Some map atlases model Crimea as a separate region; treat it as Ukraine for IRVG highlights.
  "Crimea",
  "Germany",
  "India",
  "Indonesia",
  "Israel",
  "South Africa",
  "United Kingdom",
]);
const CRIMEA_FEATURE = {
  rsmKey: "crimea-highlight",
  type: "Feature",
  properties: { name: "Crimea" },
  geometry: {
    type: "Polygon",
    coordinates: [[
      // Perekop isthmus (NW)
      [32.68, 46.05],
      [33.1, 46.15],
      [33.65, 46.1],
      // Sivash coast east
      [34.2, 46.02],
      [34.8, 45.9],
      [35.3, 45.78],
      // Arabat spit / NE coast
      [35.6, 45.62],
      [36.2, 45.5],
      [36.55, 45.35],
      // Kerch peninsula
      [36.65, 45.1],
      [36.5, 44.85],
      // SE coast
      [36.1, 44.7],
      [35.5, 44.55],
      [34.9, 44.42],
      // Cape Sarych (southernmost ~44.38°N)
      [33.73, 44.38],
      // SW coast
      [33.4, 44.45],
      [33.0, 44.6],
      [32.75, 44.78],
      // Cape Tarkhankut (W, ~45.35°N)
      [32.49, 45.35],
      [32.55, 45.7],
      [32.62, 45.9],
      // Close back to Perekop
      [32.68, 46.05],
    ]],
  },
} as const;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const normalizeLng = (lng: number) => {
  if (lng > 180) return lng - 360;
  if (lng < -180) return lng + 360;
  return lng;
};

const shortestLngDelta = (fromLng: number, toLng: number) => {
  let delta = toLng - fromLng;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return delta;
};

const isEuropeCorridor = (center: [number, number]) => {
  const [lng, lat] = center;
  return lat >= 44 && lat <= 56 && lng >= 5 && lng <= 33;
};

function renderMapPhoto({
  stageId,
  href,
  width,
  height,
  radius,
}: {
  stageId: string;
  href: string;
  width: number;
  height: number;
  radius: number;
}) {
  const clipId = `map-focus-photo-${stageId}`;

  return (
    <>
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="0" width={width} height={height} rx={radius} />
        </clipPath>
      </defs>
      <rect
        x="-1"
        y="-1"
        width={width + 2}
        height={height + 2}
        rx={Math.max(radius - 1, 2)}
        fill="rgba(255, 255, 255, 0.92)"
        opacity="0.18"
      />
      <image
        href={href}
        x="0"
        y="0"
        width={width}
        height={height}
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${clipId})`}
      />
    </>
  );
}

export default function JourneyVisual({
  stage,
  allStages,
  assetBasePath,
}: JourneyVisualProps) {
  const isWorldStage = stage.id === "whats-next";
  const isIrvgStage = IRVG_STAGE_IDS.has(stage.id);
  const isPortraitFocusPhoto = stage.id === "2025-warsaw";
  const [isDesktop, setIsDesktop] = useState(false);
  const isWorldStageRef = useRef(isWorldStage);
  const worldPanActiveRef = useRef(false);
  const autoPanLngRef = useRef(0);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1100px)");
    const update = () => setIsDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    isWorldStageRef.current = isWorldStage;
    if (isWorldStage) {
      worldPanActiveRef.current = false;
      autoPanLngRef.current = viewRef.current.center[0];
    } else {
      worldPanActiveRef.current = false;
    }
  }, [isWorldStage]);

  const routeCoords = useMemo(
    () =>
      allStages
        .filter((item) => !HIDDEN_ROUTE_STAGE_IDS.has(item.id))
        .map((item) => [item.lng, item.lat] as [number, number]),
    [allStages],
  );
  const activeStageIndex = useMemo(
    () => allStages.findIndex((item) => item.id === stage.id),
    [allStages, stage.id],
  );
  const irvgProjectPreviews = useMemo(
    () => [
      {
        id: "irvg-ukraine",
        coordinates: [31, 49] as [number, number],
        image: "irvg-ukraine-page.png",
        width: isDesktop ? 52 : 38,
        height: isDesktop ? 72 : 52,
        translate: (isDesktop ? [-26, -82] : [-14, -58]) as [number, number],
      },
      {
        id: "irvg-israel",
        coordinates: [35.1, 31.2] as [number, number],
        image: "irvg-israel-page.png",
        width: isDesktop ? 50 : 36,
        height: isDesktop ? 68 : 50,
        translate: (isDesktop ? [-12, -72] : [-20, -52]) as [number, number],
      },
      {
        id: "irvg-germany",
        coordinates: [10.5, 51.1] as [number, number],
        image: "irvg-germany-page.png",
        width: isDesktop ? 50 : 36,
        height: isDesktop ? 68 : 50,
        translate: (isDesktop ? [-58, -74] : [-36, -54]) as [number, number],
      },
    ],
    [isDesktop],
  );

  const locationZoomOffset =
    stage.city === "Vancouver"
      ? 0.9
      : stage.country === "Hong Kong SAR"
        ? 1.15
        : stage.country === "Canada"
          ? 0.45
          : 0;
  const desktopCanadaZoomOffset =
    isDesktop && stage.country === "Canada" && !isWorldStage && !isIrvgStage ? 0.9 : 0;
  const targetZoom = isWorldStage
    ? 1.05
    : isIrvgStage
      ? 1.02
      : clamp(stage.zoom - 4 - locationZoomOffset - desktopCanadaZoomOffset, 1.8, 4);
  const focusPhotoWidth = isPortraitFocusPhoto
    ? isDesktop
      ? 31
      : 24
    : isDesktop
      ? 40
      : 30;
  const focusPhotoHeight = isPortraitFocusPhoto
    ? isDesktop
      ? 44
      : 34
    : isDesktop
      ? 31
      : 23;
  const focusPhotoRadius = isPortraitFocusPhoto ? (isDesktop ? 5 : 4) : isDesktop ? 6 : 4;
  const focusPhotoTranslate = isPortraitFocusPhoto
    ? isDesktop
      ? "translate(10, -58)"
      : "translate(8, -44)"
    : isDesktop
      ? "translate(10, -48)"
      : "translate(8, -34)";
  const desktopCanadaLngShift =
    isDesktop && !isWorldStage && !isIrvgStage
      ? stage.city === "Vancouver"
        ? 14
        : stage.country === "Canada"
          ? -12
          : 0
      : 0;
  const stageCenter = useMemo(
    () => [stage.lng, stage.lat] as [number, number],
    [stage.lng, stage.lat],
  );
  const targetCenter = useMemo(
    () =>
      isWorldStage
        ? ([0, 15] as [number, number])
        : isIrvgStage
          ? ([0, 16] as [number, number])
          : ([stage.lng + desktopCanadaLngShift, stage.lat] as [number, number]),
    [desktopCanadaLngShift, isIrvgStage, isWorldStage, stage.lng, stage.lat],
  );

  const [view, setView] = useState<ViewState>({
    center: targetCenter,
    zoom: targetZoom,
  });
  const viewRef = useRef(view);
  const targetRef = useRef<ViewState>({ center: targetCenter, zoom: targetZoom });
  const velocityRef = useRef({ lng: 0, lat: 0, zoom: 0 });
  const frameRef = useRef(0);
  const lastTsRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const zoomHopTimeoutRef = useRef<number | null>(null);
  const previousTargetCenterRef = useRef(targetCenter);

  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  useEffect(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    lastTsRef.current = 0;

    const animate = (now: number) => {
      const last = lastTsRef.current || now;
      const dt = clamp((now - last) / 1000, 0.001, 0.05);
      lastTsRef.current = now;

      if (isWorldStageRef.current && worldPanActiveRef.current) {
        const panSpeedDegPerSec = 8.5;
        autoPanLngRef.current = normalizeLng(autoPanLngRef.current + panSpeedDegPerSec * dt);

        const nextView = {
          center: [autoPanLngRef.current, 15] as [number, number],
          zoom: 1.05,
        };

        setView(nextView);
        viewRef.current = nextView;
        frameRef.current = window.requestAnimationFrame(animate);
        return;
      }

      const current = viewRef.current;
      const target = targetRef.current;
      const velocity = velocityRef.current;

      const deltaLng = shortestLngDelta(current.center[0], target.center[0]);
      const deltaLat = target.center[1] - current.center[1];
      const deltaZoom = target.zoom - current.zoom;

      const errorMagnitude = Math.max(
        Math.abs(deltaLng) * 0.8,
        Math.abs(deltaLat),
        Math.abs(deltaZoom) * 10,
      );
      const spring = clamp(23 + errorMagnitude * 3.2, 23, 42);
      const damping = Math.exp(-10.8 * dt);
      const follow = clamp(0.07 + dt * 0.9, 0.07, 0.13);

      velocity.lng = (velocity.lng + deltaLng * spring * dt) * damping;
      velocity.lat = (velocity.lat + deltaLat * spring * dt) * damping;
      velocity.zoom = (velocity.zoom + deltaZoom * spring * dt) * damping;

      const nextView = {
        center: [
          normalizeLng(current.center[0] + deltaLng * follow + velocity.lng * dt),
          current.center[1] + deltaLat * follow + velocity.lat * dt,
        ] as [number, number],
        zoom: clamp(current.zoom + deltaZoom * follow + velocity.zoom * dt, 1, 12),
      };

      const nearCenter =
        Math.abs(deltaLng) < 0.02 && Math.abs(deltaLat) < 0.02;
      const nearZoom = Math.abs(deltaZoom) < 0.01;
      const slowVelocity =
        Math.abs(velocity.lng) < 0.03 &&
        Math.abs(velocity.lat) < 0.03 &&
        Math.abs(velocity.zoom) < 0.03;

      if (isWorldStageRef.current && nearCenter && nearZoom && slowVelocity) {
        worldPanActiveRef.current = true;
        autoPanLngRef.current = target.center[0];
      }

      if (nearCenter && nearZoom && slowVelocity) {
        velocityRef.current = { lng: 0, lat: 0, zoom: 0 };
        setView(target);
        viewRef.current = target;
      } else {
        setView(nextView);
        viewRef.current = nextView;
      }

      frameRef.current = window.requestAnimationFrame(animate);
    };

    frameRef.current = window.requestAnimationFrame(animate);
    return () => {
      if (zoomHopTimeoutRef.current !== null) {
        window.clearTimeout(zoomHopTimeoutRef.current);
      }
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      isAnimatingRef.current = false;
    };
  }, []);

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (zoomHopTimeoutRef.current !== null) {
      window.clearTimeout(zoomHopTimeoutRef.current);
      zoomHopTimeoutRef.current = null;
    }

    if (reduceMotion) {
      const next = { center: targetCenter, zoom: targetZoom };
      targetRef.current = next;
      velocityRef.current = { lng: 0, lat: 0, zoom: 0 };
      setView(next);
      viewRef.current = next;
      worldPanActiveRef.current = isWorldStage;
      return;
    }

    if (isWorldStage) {
      targetRef.current = { center: targetCenter, zoom: targetZoom };
      return;
    }

    const current = viewRef.current;
    const previousTargetCenter = previousTargetCenterRef.current;
    previousTargetCenterRef.current = targetCenter;

    const travel = Math.hypot(
      Math.abs(shortestLngDelta(current.center[0], targetCenter[0])) * 0.75,
      Math.abs(targetCenter[1] - current.center[1]),
    );
    const isIntraEuropeTransition =
      isEuropeCorridor(previousTargetCenter) && isEuropeCorridor(targetCenter);
    const shouldHop =
      !isIntraEuropeTransition &&
      (travel > 2 || Math.abs(targetZoom - current.zoom) > 0.35);

    if (!shouldHop) {
      if (isIntraEuropeTransition) {
        velocityRef.current.zoom = 0;
      }
      targetRef.current = { center: targetCenter, zoom: targetZoom };
      return;
    }

    const hopDepth = clamp(0.65 + travel * 0.04, 0.65, 2.0);
    const hopZoom = clamp(Math.min(current.zoom, targetZoom) - hopDepth, 1.5, 4);
    targetRef.current = { center: targetCenter, zoom: hopZoom };

    const hopMs = Math.round(clamp(240 + travel * 10, 240, 560));
    zoomHopTimeoutRef.current = window.setTimeout(() => {
      targetRef.current = { center: targetCenter, zoom: targetZoom };
      zoomHopTimeoutRef.current = null;
    }, hopMs);
  }, [isWorldStage, targetCenter, targetZoom]);

  return (
    <div
      className="visual-map"
      role="img"
      aria-label={`Journey focus: ${stage.city}, ${stage.country}`}
    >
      <ComposableMap
        width={1000}
        height={520}
        projection="geoMercator"
        projectionConfig={{
          scale: 150,
          center: [0, 15],
        }}
        className="world-svg"
      >
        <ZoomableGroup center={view.center} zoom={view.zoom} minZoom={1} maxZoom={12}>
          <Sphere
            fill="rgba(245, 245, 245, 0.95)"
            stroke="rgba(0, 0, 0, 0.08)"
            strokeWidth={0.5}
          />

          <Graticule
            stroke="rgba(0, 0, 0, 0.12)"
            strokeWidth={0.5}
            step={[30, 15]}
          />

          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = (
                  geo.properties as { name?: string } | undefined
                )?.name;
                const isIrvgHighlight =
                  isIrvgStage &&
                  countryName != null &&
                  IRVG_HIGHLIGHT_COUNTRIES.has(countryName);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={
                      isIrvgHighlight
                        ? "rgba(19, 63, 108, 0.78)"
                        : "rgba(120, 120, 120, 0.5)"
                    }
                    stroke={
                      isIrvgHighlight
                        ? "rgba(255, 248, 238, 0.95)"
                        : "rgba(0, 0, 0, 0.35)"
                    }
                    strokeWidth={isIrvgHighlight ? 1 : 0.6}
                    style={{
                      default: { outline: "none" },
                      hover: {
                        outline: "none",
                        fill: isIrvgHighlight
                          ? "rgba(197, 141, 77, 0.9)"
                          : "rgba(140, 140, 140, 0.6)",
                      },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {isIrvgStage && (
            <>
              <Geography
                geography={CRIMEA_FEATURE}
                fill="rgba(19, 63, 108, 0.78)"
                stroke="rgba(255, 248, 238, 0.95)"
                strokeWidth={1}
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none", fill: "rgba(197, 141, 77, 0.9)" },
                  pressed: { outline: "none" },
                }}
              />
              {irvgProjectPreviews.map((preview) => (
                <Marker key={preview.id} coordinates={preview.coordinates}>
                  <g
                    transform={`translate(${preview.translate[0]}, ${preview.translate[1]})`}
                    className="map-focus-photo"
                  >
                    {renderMapPhoto({
                      stageId: preview.id,
                      href: mapAssetSrc(assetBasePath, preview.image),
                      width: preview.width,
                      height: preview.height,
                      radius: 6,
                    })}
                  </g>
                </Marker>
              ))}
            </>
          )}

          {!isWorldStage && !isIrvgStage && (
            <Line
              coordinates={routeCoords}
              fill="none"
              className="route-line"
            />
          )}

          {!isIrvgStage && allStages
            .filter((item) => !HIDDEN_ROUTE_STAGE_IDS.has(item.id))
            .map((item, index) => {
            if (item.id === "whats-next") return null;
            const isActive = item.id === stage.id;
            const isVisited = activeStageIndex >= 0 && index < activeStageIndex;
            return (
              <Marker
                key={item.id}
                coordinates={[item.lng, item.lat]}
                title={`${item.year}: ${item.city}, ${item.country}`}
              >
                <circle
                  r={isActive ? 3.2 : 2.3}
                  className={`route-dot ${isActive ? "active" : ""}`}
                  fill={isActive ? "#1a1a1a" : isVisited ? "#4a4a4a" : "#888"}
                  stroke="#fff"
                  strokeWidth={1}
                  opacity={isActive ? 1 : isVisited ? 0.9 : 0.75}
                />
              </Marker>
            );
          })}

          {!isWorldStage && !isIrvgStage && (
            <Marker coordinates={stageCenter}>
              <g className="focus-marker">
                {stage.mapImage ? (
                  <g
                    transform={focusPhotoTranslate}
                    className="map-focus-photo"
                  >
                    {renderMapPhoto({
                      stageId: stage.id,
                      href: mapAssetSrc(assetBasePath, stage.mapImage),
                      width: focusPhotoWidth,
                      height: focusPhotoHeight,
                      radius: focusPhotoRadius,
                    })}
                  </g>
                ) : null}
                <circle r={4.2} fill="#fff" stroke="#1a1a1a" strokeWidth={1.4} />
                <circle
                  r={6.8}
                  fill="none"
                  stroke="rgba(0, 0, 0, 0.25)"
                  strokeWidth={1.4}
                  className="pulse"
                />
              </g>
            </Marker>
          )}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}
