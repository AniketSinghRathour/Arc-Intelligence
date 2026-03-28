export interface NewsEvent {
  date: string;
  title: string;
  summary: string;
  sentiment: number; // -1 to +1
  tag: 'bullish' | 'bearish' | 'neutral' | 'critical' | 'controversial';
}

export interface Entity {
  name: string;
  type: 'person' | 'company' | 'regulator' | 'institution';
  role: string;
  connections: Array<{
    label: string;
    target: string;
  }>;
}

export interface AnalysisResult {
  headline: string;
  summary: string;
  arcType: string;
  avgSentiment: number;
  events: NewsEvent[];
  entities: Entity[];
  altViewpoints: string[];
  futurePredictions: { implication: string; probability: string; timeframe: string }[];
  mermaidDiagram: string;
  scrapedAt: string;
  sourceUrl: string;
}

export interface AnalyzeRequest {
  url: string;
}

export interface AnalyzeResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
}
