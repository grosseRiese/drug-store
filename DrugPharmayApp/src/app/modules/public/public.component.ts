import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.css']
})
export class PublicComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];


  constructor(private router: Router,
    private activatedRoute: ActivatedRoute) {}
  ngOnInit():void {
    // Add initialization code here
  }

  ngOnDestroy() {
    // Add cleanup code here
    
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
