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
  gid0Code: string;
  gid0Data: GIDData[];
  gid1Data: GIDData[];
  gid2Data: GIDData[];
  gid3Data: GIDData[];
  gid4Data: GIDData[];
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

export interface FeatureShape {
  type: "Feature";
  id: string;
  geometry: { coordinates: [number, number][][]; type: "Polygon" };
  properties: { name: string; a3: string };
}

export interface FeatureCollection {
  type: "FeatureCollection";
  features: FeatureShape[];
}
