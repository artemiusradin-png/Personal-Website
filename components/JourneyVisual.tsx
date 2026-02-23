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
};

type JourneyVisualProps = {
  stage: JourneyStage;
  allStages: JourneyStage[];
};

type ViewState = {
  center: [number, number];
  zoom: number;
};

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

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

export default function JourneyVisual({ stage, allStages }: JourneyVisualProps) {
  const isWorldStage = stage.id === "whats-next";
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
    () => allStages.map((item) => [item.lng, item.lat] as [number, number]),
    [allStages],
  );
  const activeStageIndex = useMemo(
    () => allStages.findIndex((item) => item.id === stage.id),
    [allStages, stage.id],
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
    isDesktop && stage.country === "Canada" && !isWorldStage ? 0.9 : 0;
  const targetZoom = isWorldStage
    ? 1.05
    : clamp(stage.zoom - 4 - locationZoomOffset - desktopCanadaZoomOffset, 1.8, 4);
  const desktopCanadaLngShift =
    isDesktop && !isWorldStage
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
    () => (isWorldStage ? ([0, 15] as [number, number]) : ([stage.lng + desktopCanadaLngShift, stage.lat] as [number, number])),
    [desktopCanadaLngShift, isWorldStage, stage.lng, stage.lat],
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
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="rgba(120, 120, 120, 0.5)"
                  stroke="rgba(0, 0, 0, 0.35)"
                  strokeWidth={0.6}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: "rgba(140, 140, 140, 0.6)" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {!isWorldStage && (
            <Line
              coordinates={routeCoords}
              fill="none"
              className="route-line"
            />
          )}

          {allStages.map((item, index) => {
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

          {!isWorldStage && (
            <Marker coordinates={stageCenter}>
              <g className="focus-marker">
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
