export interface DiscOption {
  trait: string;
  text: string;
}

export interface DiscQuestion {
  id: number;
  scenario: string;
  options: DiscOption[];
}

export interface DiscResultDto {
  scoreD: number;
  scoreI: number;
  scoreS: number;
  scoreC: number;
  percentD: number;
  percentI: number;
  percentS: number;
  percentC: number;
  primaryType: string;
  title: string;
  overview: string;
  strengths: string[];
  weaknesses: string[];
  suitableCareers: string[];
  communicationAdvice: string;
}

export interface MbtiQuestion {
  id: number;
  dimension: string;
  prompt: string;
  optionA: string;
  valueA: string;
  optionB: string;
  valueB: string;
}

export interface MbtiResultDto {
  code: string;
  title: string;
  nickname: string;
  overview: string;
  scoreE: number;
  scoreI: number;
  scoreS: number;
  scoreN: number;
  scoreT: number;
  scoreF: number;
  scoreJ: number;
  scoreP: number;
  strengths: string[];
  weaknesses: string[];
  suitableCareers: string[];
  compatibleTypes: string[];
}
