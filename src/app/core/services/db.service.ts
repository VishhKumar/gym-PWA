import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { 
  UserProfile, 
  WorkoutSession, 
  DailyNutrition, 
  CheckInRecord, 
  MembershipInfo 
} from '../models/gym.models';

@Injectable({
  providedIn: 'root'
})
export class BodycraftDatabase extends Dexie {
  userProfiles!: Table<UserProfile, string>;
  workoutSessions!: Table<WorkoutSession, number>;
  dailyNutrition!: Table<DailyNutrition, string>; // Named 'dailyNutrition'
  checkIns!: Table<CheckInRecord, number>;        // Named 'checkIns'
  memberships!: Table<MembershipInfo, number>;

  constructor() {
    super('BodycraftDB');
    
    this.version(1).stores({
      userProfiles: '++id',
      workoutSessions: '++id, date',
      dailyNutrition: 'date',
      checkIns: '++id, timestamp',
      memberships: '++id, status'
    });
  }
}