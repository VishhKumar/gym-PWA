import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { BodycraftDatabase } from '../../core/services/db.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface WeeklyProgress {
  day: string;
  workoutMinutes: number;
  caloriesConsumed: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  userService = inject(UserService);
  private db = inject(BodycraftDatabase);

  userProfile = this.userService.userProfile;
  macroTargets = this.userService.macroTargets;

  weeklyData = signal<WeeklyProgress[]>([]);

  async ngOnInit() {
    await this.userService.loadUserProfile();
    await this.loadProgressData();
  }

  private async loadProgressData() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Fetch all logs from Dexie
    const workoutLogs = await this.db.workoutSessions.toArray();
    const nutritionLogs = await this.db.dailyNutrition.toArray();

    // Map current week's actual dates to align with Mon-Sun
    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday...
    const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);

    const progress: WeeklyProgress[] = days.map((day, index) => {
      const targetDate = new Date(monday);
      targetDate.setDate(monday.getDate() + index);
      const dateString = targetDate.toISOString().split('T')[0]; // YYYY-MM-DD

      // Find matching logs for this exact date
      const matchedWorkout = workoutLogs.find(w => w.date?.startsWith(dateString));
      const matchedNutrition = nutritionLogs.find(n => n.date === dateString);

      return {
        day,
        workoutMinutes: matchedWorkout ? matchedWorkout.durationMinutes : 0,
        caloriesConsumed: matchedNutrition ? matchedNutrition.totalCalories : 0,
      };
    });

    this.weeklyData.set(progress);
  }

  getCalorieBarHeight(calories: number): number {
    const target = this.macroTargets()?.dailyCalories || 2500;
    return Math.min(100, Math.round((calories / target) * 100));
  }

  getWorkoutBarHeight(mins: number): number {
    return Math.min(100, Math.round((mins / 90) * 100));
  }
}