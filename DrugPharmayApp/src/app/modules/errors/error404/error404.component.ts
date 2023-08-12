import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.css']
})
export class Error404Component implements OnInit, OnDestroy {
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
