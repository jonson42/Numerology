export interface ArrowItem {
  code: string;
  name: string;
  isStrength: boolean;
  meaning: string;
}

export interface BirthChartGridData {
  birthDateCounts: Record<number, number>;
  nameCounts: Record<number, number>;
  combinedCounts: Record<number, number>;
  strengthArrows: ArrowItem[];
  weaknessArrows: ArrowItem[];
  isolatedNumbers: number[];
}

export interface PeakMilestone {
  peakIndex: number;
  value: number;
  milestoneAge: number;
  milestoneYear: number;
  title: string;
  description: string;
}

export interface ChallengeMilestone {
  challengeIndex: number;
  value: number;
  title: string;
  description: string;
}

export interface PyramidPeakData {
  peaks: PeakMilestone[];
  challenges: ChallengeMilestone[];
}

export interface PersonalCycleYear {
  year: number;
  personalYearNumber: number;
  phase: string;
  description: string;
  isCurrentYear: boolean;
}

export interface IndicatorResult {
  code: string;
  name: string;
  value: string;
  numericValue: number;
  category: string;
  isVipOnly: boolean;
  summary: string;
  contentHtml: string;
  isLocked: boolean;
}

export interface NumerologyMetrics {
  lifePathNumber: number;
  destinyNumber: number;
  soulUrgeNumber: number;
  personalityNumber: number;
  birthdayNumber: number;
  attitudeNumber: number;
  maturityNumber: number;
  balanceNumber: number;
  rationalThoughtNumber: number;
  subconsciousSelfNumber: number;
  passionNumbers: number[];
  karmicLessonNumbers: number[];
  karmicDebtNumbers: string[];
  personalYearNumber: number;
  personalMonthNumber: number;
  personalDayNumber: number;
  birthChartGrid: BirthChartGridData;
  pyramidPeaks: PyramidPeakData;
  lifeCycleWave: PersonalCycleYear[];
  detailedIndicators: IndicatorResult[];
}

export interface LookupReportDto {
  id: string;
  fullName: string;
  birthDate: string;
  birthTime?: string;
  gender?: string;
  serviceType: number;
  shareToken: string;
  isVipView: boolean;
  metrics: NumerologyMetrics;
  createdAt: string;
}
