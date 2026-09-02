import { Component, inject } from '@angular/core';
import { CheckInService } from '../../core/services/checkin.service';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkin',
  imports: [CommonModule],
  templateUrl: './checkin.html',
  styleUrl: './checkin.scss',
})
export class Checkin {checkInService = inject(CheckInService);
  userService = inject(UserService);

  userProfile = this.userService.userProfile;
  qrDataUrl = this.checkInService.qrDataUrl;
  checkInHistory = this.checkInService.checkInHistory;

  async ngOnInit() {
    const profile = this.userProfile();
    const memberName = profile ? profile.name : 'Member';
    const memberId = 'BC-88942';

    await this.checkInService.generateQRCode(memberId, memberName);
  }

  async simulateScan() {
    const profile = this.userProfile();
    const memberName = profile ? profile.name : 'Member';
    await this.checkInService.logCheckIn('BC-88942', memberName);
  }
}