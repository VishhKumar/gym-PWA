import { Component, inject } from '@angular/core';
import { MembershipService } from '../../core/services/membership.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-membership',
  imports: [CommonModule],
  templateUrl: './membership.html',
  styleUrl: './membership.scss',
})
export class Membership {membershipService = inject(MembershipService);
  membership = this.membershipService.currentMembership;

  async selectPlan(tier: 'Basic' | 'Pro' | 'Elite') {
    await this.membershipService.upgradeTier(tier);
  }
}