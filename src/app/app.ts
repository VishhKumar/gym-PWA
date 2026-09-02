import { Component, OnInit, inject, signal } from '@angular/core';
import { BodycraftDatabase } from './core/services/db.service';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private db = inject(BodycraftDatabase);

  // Mobile menu open/close toggle
  isMobileMenuOpen = signal<boolean>(false);

  async ngOnInit() {
    const count = await this.db.workoutSessions.count();
    console.log('Bodycraft Fitness Club DB Initialized. Current logged workouts:', count);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(prev => !prev);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }
}