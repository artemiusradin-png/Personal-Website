declare module "react-simple-maps" {
  import { FC, ReactNode } from "react";

  export interface ComposableMapProps {
    width?: number;
    height?: number;
    projection?: string | ((...args: unknown[]) => unknown);
    projectionConfig?: Record<string, unknown>;
    className?: string;
    children?: ReactNode;
  }

  export interface GeographiesProps {
    geography: string | object;
    parseGeographies?: (geos: unknown) => unknown;
    children: (props: {
      geographies: Array<{ rsmKey: string; [key: string]: unknown }>;
      outline?: unknown;
      borders?: unknown;
    }) => ReactNode;
  }

  export interface GeographyProps {
    geography: { rsmKey: string; [key: string]: unknown };
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    style?: Record<string, Record<string, string>>;
    className?: string;
  }

  export interface MarkerProps {
    coordinates: [number, number];
    children?: ReactNode;
    title?: string;
    className?: string;
    [key: string]: unknown;
  }

  export interface LineProps {
    coordinates?: Array<[number, number]>;
    from?: [number, number];
    to?: [number, number];
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
    fill?: string;
    className?: string;
  }

  export interface SphereProps {
    id?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    className?: string;
  }

  export interface GraticuleProps {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    step?: [number, number];
    className?: string;
  }

  export interface ZoomableGroupProps {
    center?: [number, number];
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    children?: ReactNode;
    className?: string;
  }

  export const ComposableMap: FC<ComposableMapProps>;
  export const Geographies: FC<GeographiesProps>;
  export const Geography: FC<GeographyProps>;
  export const Marker: FC<MarkerProps>;
  export const Line: FC<LineProps>;
  export const Sphere: FC<SphereProps>;
  export const Graticule: FC<GraticuleProps>;
  export const ZoomableGroup: FC<ZoomableGroupProps>;
}
