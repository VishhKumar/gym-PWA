import { Injectable, signal, inject } from '@angular/core';
import { BodycraftDatabase } from './db.service';
import { CheckInRecord } from '../models/gym.models';
import QRCode from 'qrcode';

@Injectable({
  providedIn: 'root'
})
export class CheckInService {
  private db = inject(BodycraftDatabase);

  checkInHistory = signal<CheckInRecord[]>([]);
  qrDataUrl = signal<string>('');

  constructor() {
    this.loadHistory();
  }

  async loadHistory() {
    const records = await this.db.checkIns.reverse().toArray();
    this.checkInHistory.set(records);
  }

  async generateQRCode(memberId: string, memberName: string): Promise<string> {
    const payload = JSON.stringify({
      memberId,
      memberName,
      timestamp: new Date().toISOString()
    });
    
    const url = await QRCode.toDataURL(payload, { width: 250, margin: 2 });
    this.qrDataUrl.set(url);
    return url;
  }

  async logCheckIn(memberId: string, memberName: string) {
    const record: CheckInRecord = {
      timestamp: new Date().toISOString(),
      memberId,
      memberName,
      status: 'approved'
    };

    await this.db.checkIns.add(record);
    await this.loadHistory();
  }
}