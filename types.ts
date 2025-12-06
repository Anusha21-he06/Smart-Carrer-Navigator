export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  skills: string[];
  education: string;
  interests: string[];
  targetRole: string;
  resumeText?: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface SkillGapAnalysis {
  missingSkills: {
    name: string;
    priority: 'High' | 'Medium' | 'Low';
    estimatedHours: number;
  }[];
  matchScore: number;
  analysis: string;
}

export interface CareerMilestone {
  title: string;
  description: string;
  duration: string;
  resources: string[];
  type: 'course' | 'project' | 'certification';
}

export interface CareerPath {
  role: string;
  milestones: CareerMilestone[];
  salaryRange: string;
  outlook: string;
}

export interface TrendMetric {
  name: string;
  value: number;
}

export interface IndustryTrend {
  sector: string;
  demandScore: number;
  topSkills: string[];
  salaryGrowth: number;
  growthChart: TrendMetric[];
}