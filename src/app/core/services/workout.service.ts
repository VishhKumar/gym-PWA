import { Injectable, signal, inject } from '@angular/core';
import { BodycraftDatabase } from './db.service';
import { WorkoutSession, ExerciseLog } from '../models/gym.models';

export interface PresetRoutine {
  name: string;
  muscleGroups: string;
  exercises: ExerciseLog[];
}

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private db = inject(BodycraftDatabase);

  // Active workout state using Signals
  activeSession = signal<WorkoutSession | null>(null);
  
  // Rest Timer State
  timerSeconds = signal<number>(0);
  timerActive = signal<boolean>(false);
  private timerInterval: any = null;

  // Preset Routines
  readonly presetRoutines: PresetRoutine[] = [
    {
      name: 'Push Day (Chest, Shoulders, Triceps)',
      muscleGroups: 'Chest / Shoulders / Arms',
      exercises: [
        {
          exerciseId: 'bench_press',
          exerciseName: 'Barbell Bench Press',
          muscleGroup: 'Chest',
          sets: [
            { setNumber: 1, reps: 10, weightKg: 60, completed: false },
            { setNumber: 2, reps: 8, weightKg: 70, completed: false },
            { setNumber: 3, reps: 6, weightKg: 75, completed: false }
          ]
        },
        {
          exerciseId: 'overhead_press',
          exerciseName: 'Standing Overhead Press',
          muscleGroup: 'Shoulders',
          sets: [
            { setNumber: 1, reps: 10, weightKg: 40, completed: false },
            { setNumber: 2, reps: 8, weightKg: 45, completed: false }
          ]
        }
      ]
    },
    {
      name: 'Pull Day (Back & Biceps)',
      muscleGroups: 'Back / Arms',
      exercises: [
        {
          exerciseId: 'deadlift',
          exerciseName: 'Conventional Deadlift',
          muscleGroup: 'Back',
          sets: [
            { setNumber: 1, reps: 5, weightKg: 100, completed: false },
            { setNumber: 2, reps: 5, weightKg: 120, completed: false }
          ]
        },
        {
          exerciseId: 'lat_pulldown',
          exerciseName: 'Lat Pulldown',
          muscleGroup: 'Back',
          sets: [
            { setNumber: 1, reps: 12, weightKg: 50, completed: false },
            { setNumber: 2, reps: 10, weightKg: 55, completed: false }
          ]
        }
      ]
    }
  ];

  startRoutine(routine: PresetRoutine) {
    const today = new Date().toISOString().split('T')[0];
    const newSession: WorkoutSession = {
      date: today,
      routineName: routine.name,
      durationMinutes: 0,
      exercises: JSON.parse(JSON.stringify(routine.exercises)),
      completed: false
    };
    this.activeSession.set(newSession);
  }

  toggleSetCompletion(exerciseIndex: number, setIndex: number) {
    const session = this.activeSession();
    if (!session) return;

    const updatedSession = { ...session };
    const targetSet = updatedSession.exercises[exerciseIndex].sets[setIndex];
    targetSet.completed = !targetSet.completed;

    this.activeSession.set(updatedSession);

    if (targetSet.completed) {
      this.startRestTimer(90); // Default 90s rest interval
    }
  }

  async finishWorkout() {
    const session = this.activeSession();
    if (!session) return;

    session.completed = true;
    await this.db.workoutSessions.add(session);
    this.activeSession.set(null);
    this.stopRestTimer();
  }

  // Rest Timer Controls
  startRestTimer(seconds: number) {
    this.stopRestTimer();
    this.timerSeconds.set(seconds);
    this.timerActive.set(true);

    this.timerInterval = setInterval(() => {
      const current = this.timerSeconds();
      if (current > 1) {
        this.timerSeconds.set(current - 1);
      } else {
        this.stopRestTimer();
        this.notifyTimerComplete();
      }
    }, 1000);
  }

  stopRestTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.timerActive.set(false);
    this.timerSeconds.set(0);
  }

  private notifyTimerComplete() {
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  }
}