import { Injectable, signal, inject } from '@angular/core';
import { BodycraftDatabase } from './db.service';
import { DailyNutrition, MealLog } from '../models/gym.models';

@Injectable({
  providedIn: 'root'
})
export class NutritionService {
  private db = inject(BodycraftDatabase);

  todayDate = new Date().toISOString().split('T')[0];
  
  // Current active day's log
  dailyLog = signal<DailyNutrition>({
    date: this.todayDate,
    meals: [],
    waterMl: 0,
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFats: 0
  });

  constructor() {
    this.loadTodayLog();
  }

  async loadTodayLog() {
    const existing = await this.db.dailyNutrition.get(this.todayDate);
    if (existing) {
      this.dailyLog.set(existing);
    } else {
      const initialLog: DailyNutrition = {
        date: this.todayDate,
        meals: [],
        waterMl: 0,
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFats: 0
      };
      await this.db.dailyNutrition.put(initialLog);
      this.dailyLog.set(initialLog);
    }
  }

  async addMeal(meal: MealLog) {
    const current = this.dailyLog();
    const updatedMeals = [...current.meals, meal];
    
    await this.updateLogState(current, updatedMeals);
  }

  async removeMeal(mealId: string) {
    const current = this.dailyLog();
    const updatedMeals = current.meals.filter(m => m.id !== mealId);

    await this.updateLogState(current, updatedMeals);
  }

  async addWater(amountMl: number = 250) {
    const current = this.dailyLog();
    const updatedLog: DailyNutrition = {
      ...current,
      waterMl: current.waterMl + amountMl
    };

    await this.db.dailyNutrition.put(updatedLog);
    this.dailyLog.set(updatedLog);
  }

  private async updateLogState(current: DailyNutrition, updatedMeals: MealLog[]) {
    const totalCalories = updatedMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
    const totalProtein = updatedMeals.reduce((acc, m) => acc + (m.proteinGrams || 0), 0);
    const totalCarbs = updatedMeals.reduce((acc, m) => acc + (m.carbsGrams || 0), 0);
    const totalFats = updatedMeals.reduce((acc, m) => acc + (m.fatsGrams || 0), 0);

    const updatedLog: DailyNutrition = {
      ...current,
      meals: updatedMeals,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFats
    };

    await this.db.dailyNutrition.put(updatedLog);
    this.dailyLog.set(updatedLog);
  }
}