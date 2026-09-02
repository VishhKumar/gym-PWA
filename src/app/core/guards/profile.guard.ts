import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { BodycraftDatabase } from '../services/db.service';

export const profileGuard: CanActivateFn = async () => {
  const db = inject(BodycraftDatabase);
  const router = inject(Router);

  // Use plural 'userProfiles' to match db.service.ts
  const profiles = await db.userProfiles.toArray();

  if (profiles.length > 0) {
    return true;
  }

  router.navigate(['/onboarding']);
  return false;
};