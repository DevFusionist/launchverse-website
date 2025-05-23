export interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  priceRange: { min: number; max: number };
  duration: { min: number; max: number };
  durationUnit: string;
  isComingSoon: boolean;
  isActive: boolean;
  features: string[];
  createdAt: string;
  updatedAt: string;
}
