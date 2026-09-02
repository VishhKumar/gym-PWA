import { Component, inject, signal } from '@angular/core';
import { NutritionService } from '../../core/services/nutrition.service';
import { UserService } from '../../core/services/user.service';
import { MealLog } from '../../core/models/gym.models';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nutrition',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nutrition.html',
  styleUrl: './nutrition.scss',
})
export class Nutrition {
  nutritionService = inject(NutritionService);
  userService = inject(UserService);

  dailyLog = this.nutritionService.dailyLog;
  macroTargets = this.userService.macroTargets;

  showAddMealModal = signal<boolean>(false);

  mealCategory: MealLog['category'] = 'lunch';
  foodName = '';
  calories: number | null = null;
  proteinGrams: number | null = null;
  carbsGrams: number | null = null;
  fatsGrams: number | null = null;

  openAddMealModal(category?: MealLog['category']) {
    if (category) {
      this.mealCategory = category;
    }
    this.showAddMealModal.set(true);
  }

  closeAddMealModal() {
    this.showAddMealModal.set(false);
    this.resetForm();
  }

  get isFormInvalid(): boolean {
    return !this.foodName.trim() || !this.calories || this.calories <= 0;
  }

  async submitMeal() {
    if (this.isFormInvalid) return;

    const newMeal: MealLog = {
      id: crypto.randomUUID(),
      category: this.mealCategory,
      name: this.foodName,
      calories: Number(this.calories),
      proteinGrams: Number(this.proteinGrams || 0),
      carbsGrams: Number(this.carbsGrams || 0),
      fatsGrams: Number(this.fatsGrams || 0)
    };

    await this.nutritionService.addMeal(newMeal);

    this.resetForm();
    this.showAddMealModal.set(false);
  }

  async deleteMeal(mealId: string) {
    if (this.nutritionService.removeMeal) {
      await this.nutritionService.removeMeal(mealId);
    } else {
      const log = this.dailyLog();
      if (!log) return;
      log.meals = log.meals.filter(m => m.id !== mealId);
      log.totalCalories = log.meals.reduce((sum, m) => sum + m.calories, 0);
    }
  }

  addWater(amountMl: number) {
    this.nutritionService.addWater(amountMl);
  }

  private resetForm() {
    this.foodName = '';
    this.calories = null;
    this.proteinGrams = null;
    this.carbsGrams = null;
    this.fatsGrams = null;
    this.mealCategory = 'lunch';
  }
}