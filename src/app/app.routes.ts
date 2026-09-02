import { Routes } from '@angular/router';
import { profileGuard } from './core/guards/profile.guard';

export const routes: Routes = [
    { 
    path: '', 
    redirectTo: 'dashboard', 
    pathMatch: 'full' 
  },
  { 
    path: 'onboarding', 
    loadComponent: () => import('./features/onboarding/onboarding').then(m => m.Onboarding) 
  },
  { 
    path: 'dashboard', 
    canActivate: [profileGuard],
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
  },
  { 
    path: 'workout', 
    canActivate: [profileGuard],
    loadComponent: () => import('./features/workout/workout').then(m => m.Workout)
  },
  { 
    path: 'nutrition', 
    canActivate: [profileGuard],
    loadComponent: () => import('./features/nutrition/nutrition').then(m => m.Nutrition)
  },
  { 
    path: 'checkin', 
    canActivate: [profileGuard],
    loadComponent: () => import('./features/checkin/checkin').then(m => m.Checkin)
  },
  { 
    path: 'membership', 
    canActivate: [profileGuard],
    loadComponent: () => import('./features/membership/membership').then(m => m.Membership)
  },
  { 
    path: '**', 
    redirectTo: 'dashboard' 
  }
];
