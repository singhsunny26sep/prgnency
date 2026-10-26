export interface PlanModule {
  title: string;
  description?: string;
}

export interface PlanOption {
  trimester: string;
  label: string;
  price: number;
  originalPrice?: number;
  durationInDays: number;
  isActive: boolean;
}

export interface PremiumFeatures {
  medicalCare?: string[];
  holisticWellness?: string[];
  birthPreparation?: string[];
  afterDelivery?: string[];
  premiumSupport?: string[];
}

export interface Plan {
  id: string;
  name: string;
  tier: string;
  subtitle: string;
  description?: string;
  duration: string;
  idealFor: string;
  badge?: string;
  isPopular: boolean;
  isFree: boolean;
  color: string;
  price: number;
  originalPrice?: number;
  plans: PlanOption[];
  modules: Array<string | PlanModule>;
  includes: string[];
  exclusiveBenefits: string[];
  premiumFeatures?: PremiumFeatures;
  displayOrder?: number;
  durationInDays?: number;
  benefits?: string[];
  limitations?: string[];
}
