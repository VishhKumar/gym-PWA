export interface UserProfile {
  id?: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  heightCm: number;
  weightKg: number;
  targetWeightKg?: number;
  goal: 'weight_loss' | 'muscle_gain' | 'recomposition' | 'maintenance';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  updatedAt: string;
}

export interface MacroTargets {
  dailyCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
}

export interface ExerciseSet {
  setNumber: number;
  reps: number;
  weightKg: number;
  completed: boolean;
}

export interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;
  muscleGroup: string;
  sets: ExerciseSet[];
}

export interface WorkoutSession {
  id?: number;
  date: string;
  routineName: string;
  durationMinutes: number;
  exercises: ExerciseLog[];
  completed: boolean;
}
export type NutritionLog = DailyNutrition;

// Ensure MealLog interface is exported here
export interface MealLog {
  id: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
}

export interface DailyNutrition {
  date: string; // YYYY-MM-DD
  meals: MealLog[];
  waterMl: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
}

export interface CheckInRecord {
  id?: number;
  timestamp: string;
  memberId: string;
  memberName: string;
  status: 'approved' | 'denied';
}

export interface MembershipInfo {
  id?: number;
  tier: 'Basic' | 'Pro' | 'Elite';
  startDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'pending';
  autoRenew: boolean;
}