export type Farmer = {
  name: string;
  phone: string;
  state: string;
  district: string;
  village: string;
  cropType: string;
};

export type AnalysisResult = {
  id: string;
  photoDataUri: string;
  problemIdentified: string;
  confidencePercentage: number;
  suggestedAction: string;
  explanation: string;
  timestamp: Date;
};
