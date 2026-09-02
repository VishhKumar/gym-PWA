import { Injectable, signal, computed, inject } from '@angular/core';
import { BodycraftDatabase } from './db.service';
import { UserProfile, MacroTargets } from '../models/gym.models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private db = inject(BodycraftDatabase);

  userProfile = signal<UserProfile | null>(null);

  macroTargets = computed<MacroTargets | null>(() => {
    const profile = this.userProfile();
    if (!profile) return null;
    return this.calculateMacros(profile);
  });

  constructor() {
    this.loadUserProfile();
  }

  async loadUserProfile(): Promise<UserProfile | null> {
    const profiles = await this.db.userProfiles.toArray();
    if (profiles.length > 0) {
      this.userProfile.set(profiles[0]);
      return profiles[0];
    }
    return null;
  }

  async saveProfile(profile: UserProfile) {
    await this.db.userProfiles.clear();
    await this.db.userProfiles.add(profile);
    this.userProfile.set(profile);
  }

  private calculateMacros(profile: UserProfile): MacroTargets {
    let bmr = (10 * profile.weightKg) + (6.25 * profile.heightCm) - (5 * profile.age);
    bmr += profile.gender === 'male' ? 5 : profile.gender === 'female' ? -161 : 0;

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };

    let tdee = bmr * (activityMultipliers[profile.activityLevel] || 1.2);

    if (profile.goal === 'weight_loss') tdee -= 500;
    if (profile.goal === 'muscle_gain') tdee += 300;

    const dailyCalories = Math.round(tdee);
    const proteinGrams = Math.round(profile.weightKg * 2.0);
    const fatsGrams = Math.round((dailyCalories * 0.25) / 9);
    const carbsGrams = Math.round((dailyCalories - (proteinGrams * 4 + fatsGrams * 9)) / 4);

    return { dailyCalories, proteinGrams, carbsGrams, fatsGrams };
  }
}