import { Injectable, signal, inject } from '@angular/core';
import { BodycraftDatabase } from './db.service';
import { MembershipInfo } from '../models/gym.models';

@Injectable({
  providedIn: 'root'
})
export class MembershipService {
  private db = inject(BodycraftDatabase);

  currentMembership = signal<MembershipInfo>({
    tier: 'Pro',
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'active',
    autoRenew: true
  });

  constructor() {
    this.loadMembership();
  }

  async loadMembership() {
    const existing = await this.db.memberships.toCollection().first();
    if (existing) {
      this.currentMembership.set(existing);
    } else {
      const defaultMembership: MembershipInfo = {
        tier: 'Pro',
        startDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'active',
        autoRenew: true
      };
      await this.db.memberships.add(defaultMembership);
      this.currentMembership.set(defaultMembership);
    }
  }

  async upgradeTier(newTier: 'Basic' | 'Pro' | 'Elite') {
    const current = this.currentMembership();
    const updated: MembershipInfo = {
      ...current,
      tier: newTier,
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    await this.db.memberships.clear();
    await this.db.memberships.add(updated);
    this.currentMembership.set(updated);
  }
}