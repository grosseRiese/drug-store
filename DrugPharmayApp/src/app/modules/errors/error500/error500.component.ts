import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-error500',
  templateUrl: './error500.component.html',
  styleUrls: ['./error500.component.css']
})
export class Error500Component implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];
  constructor(private router: Router) {}

  ngOnInit(): void {
  }

  routeToDashboard() {
    this.router.navigate(['/']);

    setTimeout(() => {
    }, 200);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    document.body.style.backgroundImage = 'none';
  }
}
