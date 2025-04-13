export interface ElectionModel {
  id: string;
  title: string;
  englishTitle: string;
  startDate: string;
  countryCode: string;
  countryShortName: string;
  slug: string;
  shortDescription: string;
}

export interface ElectionDetailsModel {
  title: string;
  englishTitle: string;
  startDate: string;
  countryCode: string;
  countryShortName: string;
  gid0Data: GIDData[];
  gid1Data: GIDData[];
  gid2Data: GIDData[];
  gid3Data: GIDData[];
  gid4Data: GIDData[];
  // Add mapping for GID level labels
  gidLevelLabels: {
    gid0?: string;
    gid1?: string;
    gid2?: string;
    gid3?: string;
    gid4?: string;
  };

  // Add mapping for GID level maps
  gidLevelMaps: {
    gid0?: string;
    gid1?: string;
    gid2?: string;
    gid3?: string;
    gid4?: string;
  };
}

export interface GIDData {
  gid: string;
  gidName: string;
  numberOfPollingStations: number;
  quickReportsSubmitted: number;
  formSubmitted: number;
  psiSubmitted: number;
  numberOfQuestionsAnswered: number;
  numberOfFlaggedAnswers: number;
  observersWithForms: number;
  observersWithQuickReports: number;
  observersWithPSI: number;
  activeObservers: number;
  visitedPollingStations: number;
}

export interface FeatureShapeProperties {
  // GADM properties
  GID_3: string;
  GID_4: string;
  GID_0: string;
  COUNTRY: string;
  GID_1: string;
  NAME_1: string;
  NL_NAME_1: string;
  GID_2: string;
  NAME_2: string;
  NL_NAME_2: string;
  NAME_3: string;
  VARNAME_3: string;
  NL_NAME_3: string;
  TYPE_3: string;
  ENGTYPE_3: string;
  CC_3: string;
  HASC_3: string;
  // world json properties
  name: string;
  a3: string;
}

export interface FeatureShape {
  type: "Feature";
  id: string;
  geometry: { coordinates: [number, number][][]; type: "Polygon" };
  properties: FeatureShapeProperties;
}

export interface FeatureCollection {
  type: "FeatureCollection";
  features: FeatureShape[];
}

export type DataLevel = "level0" | "level1" | "level2" | "level3" | "level4";
