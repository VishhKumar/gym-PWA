import { Component, inject, signal } from '@angular/core';
import { WorkoutService, PresetRoutine } from '../../core/services/workout.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ExerciseLog } from '../../core/models/gym.models';

@Component({
  selector: 'app-workout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workout.html',
  styleUrl: './workout.scss',
})
export class Workout {
  workoutService = inject(WorkoutService);

  activeSession = this.workoutService.activeSession;
  timerSeconds = this.workoutService.timerSeconds;
  timerActive = this.workoutService.timerActive;
  presetRoutines = this.workoutService.presetRoutines;

  // Custom Routine / Exercise creation state
  showAddRoutineModal = signal<boolean>(false);
  newRoutineName = '';
  newMuscleGroup = 'Full Body';
  
  // Custom exercise logging state
  showAddExerciseModal = signal<boolean>(false);
  newExerciseName = '';
  newExerciseTargetGroup = 'Chest';

  // Routine triggers
  startRoutine(routine: PresetRoutine) {
    this.workoutService.startRoutine(routine);
  }

  toggleSet(exerciseIndex: number, setIndex: number) {
    this.workoutService.toggleSetCompletion(exerciseIndex, setIndex);
  }

  finishWorkout() {
    this.workoutService.finishWorkout();
  }

  dismissTimer() {
    this.workoutService.stopRestTimer();
  }

  // Point #4: Custom Routine Creation
  openAddRoutineModal() {
    this.showAddRoutineModal.set(true);
  }

  closeAddRoutineModal() {
    this.showAddRoutineModal.set(false);
    this.newRoutineName = '';
  }

  createCustomRoutine() {
    if (!this.newRoutineName.trim()) return;

    const newRoutine: PresetRoutine = {
      name: this.newRoutineName,
      muscleGroups: this.newMuscleGroup,
      exercises: [ // <--- Changed from defaultExercises to exercises
        {
          exerciseId: crypto.randomUUID(),
          exerciseName: 'Bench Press',
          muscleGroup: 'Chest',
          sets: [
            { setNumber: 1, reps: 10, weightKg: 60, completed: false },
            { setNumber: 2, reps: 8, weightKg: 70, completed: false }
          ]
        }
      ]
    };

    this.workoutService.presetRoutines.push(newRoutine);
    this.startRoutine(newRoutine);
    this.closeAddRoutineModal();
  }

  // Point #4: Adding dynamic exercise to active session
  openAddExerciseModal() {
    this.showAddExerciseModal.set(true);
  }

  closeAddExerciseModal() {
    this.showAddExerciseModal.set(false);
    this.newExerciseName = '';
  }

  addExerciseToSession() {
    const session = this.activeSession();
    if (!session || !this.newExerciseName.trim()) return;

    const newExercise: ExerciseLog = {
      exerciseId: crypto.randomUUID(),
      exerciseName: this.newExerciseName,
      muscleGroup: this.newExerciseTargetGroup,
      sets: [
        { setNumber: 1, reps: 10, weightKg: 20, completed: false },
        { setNumber: 2, reps: 10, weightKg: 20, completed: false },
        { setNumber: 3, reps: 10, weightKg: 20, completed: false }
      ]
    };

    session.exercises.push(newExercise);
    this.closeAddExerciseModal();
  }

  addSetToExercise(exerciseIndex: number) {
    const session = this.activeSession();
    if (!session) return;

    const exercise = session.exercises[exerciseIndex];
    const newSetNumber = exercise.sets.length + 1;
    const lastSet = exercise.sets[exercise.sets.length - 1];

    exercise.sets.push({
      setNumber: newSetNumber,
      reps: lastSet ? lastSet.reps : 10,
      weightKg: lastSet ? lastSet.weightKg : 20,
      completed: false
    });
  }
}