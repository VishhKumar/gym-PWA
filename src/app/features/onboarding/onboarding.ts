import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserProfile } from '../../core/models/gym.models';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.scss',
})
export class Onboarding implements OnInit {
  private fb = inject(FormBuilder).nonNullable;
  private userService = inject(UserService);
  private router = inject(Router);

  onboardingForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    gender: ['male' as UserProfile['gender'], Validators.required],
    age: [25, [Validators.required, Validators.min(12), Validators.max(90)]],
    heightCm: [175, [Validators.required, Validators.min(100), Validators.max(250)]],
    weightKg: [70, [Validators.required, Validators.min(30), Validators.max(250)]],
    targetWeightKg: [70, [Validators.min(30), Validators.max(250)]],
    goal: ['recomposition' as UserProfile['goal'], Validators.required],
    activityLevel: ['moderate' as UserProfile['activityLevel'], Validators.required],
  });

  async ngOnInit() {
    // Fetch existing profile data from Dexie/UserService on load
    const existingProfile = await this.userService.loadUserProfile();
    if (existingProfile) {
      this.onboardingForm.patchValue({
        name: existingProfile.name ?? '',
        gender: existingProfile.gender ?? 'male',
        age: existingProfile.age ?? 25,
        heightCm: existingProfile.heightCm ?? 175,
        weightKg: existingProfile.weightKg ?? 70,
        targetWeightKg: existingProfile.targetWeightKg ?? 70,
        goal: existingProfile.goal ?? 'recomposition',
        activityLevel: existingProfile.activityLevel ?? 'moderate',
      });
    }
  }

  async onSubmit() {
    if (this.onboardingForm.invalid) return;

    const rawValues = this.onboardingForm.getRawValue();

    await this.userService.saveProfile({
      ...rawValues,
      updatedAt: new Date().toISOString(),
    });

    this.router.navigate(['/dashboard']);
  }
}