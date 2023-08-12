import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.css']
})
export class ErrorsComponent implements OnInit, OnDestroy{
  constructor(private router: Router) {}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  routeToDashboard() {
    this.router.navigate(['dashboard']);
    setTimeout(() => {}, 200);
  }

}
