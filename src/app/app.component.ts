import { Component, OnInit } from '@angular/core';

 

/* 0. Import Rxjs operators */
import {
  forkJoin, zip, combineLatest,
  BehaviorSubject, Subject
} from 'rxjs';
import { withLatestFrom, take, first } from 'rxjs/operators';

/* 1. Define shirt color and logo options */
type Color = 'white' | 'green' | 'red' | 'blue';
type Logo = 'fish' | 'dog' | 'bird' | 'cow';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  demo = {
    zip: [],
    combineLatest: [],
    withLatestFrom: [],
    forkJoin: []
  };

  get list() {
    return Object.keys(this.demo);
  }

  /* 2. Create the two persons - color and logo observables. */
  private color$ = new Subject<Color>();
  private logo$ = new Subject<Logo>();

  ngOnInit() {
    /* 3. We are ready to start printing shirt. 
    Need to subscribe to color and logo observables to produce shirts, we will write code here later */

    // 3.1 zip - love bird (you jump, i jump)
    zip(this.color$, this.logo$).subscribe(([color, logo]) => {
      this.demo.zip = [...this.demo.zip, { color, logo }];
      // console.log(`${color} shirt with ${logo}`);
    });

    // 3.2 combineLatest - go dutch (meet then wait for no man)
    combineLatest(this.color$, this.logo$).subscribe(([color, logo]) => {
      this.demo.combineLatest = [...this.demo.combineLatest, { color, logo }];
      // console.log(`${color} shirt with ${logo}`);
    });

    // 3.3 withLatestFrom - master slave (once get the slave, master take the lead)
    this.color$.pipe(
      withLatestFrom(this.logo$)
    ).subscribe(([color, logo]) => {
      this.demo.withLatestFrom = [...this.demo.withLatestFrom, { color, logo }];
      // console.log(`${color} shirt with ${logo}`);
    });

    // 3.4 forkJoin - final destination (be serious, complete!)
    forkJoin(this.color$, this.logo$).subscribe(([color, logo]) => {
      this.demo.forkJoin = [...this.demo.forkJoin, { color, logo }];
      // console.log(`${color} shirt with ${logo}`);
    });

    // 3.5 forkJoin - final destination (take only the first color and logo)
    // const firstColor$ = this.color$.pipe(take(1));
    // const firstLogo$ = this.logo$.pipe(first());
    // forkJoin(firstColor$, firstLogo$).subscribe(([color, logo]) => {
    //   this.demo.forkJoin = [...this.demo.forkJoin, { color, logo }];
    //   // console.log(`${color} shirt with ${logo}`);
    // });

    /* 4. The two persons(observables) are doing their job, picking color and logo */
    this.color$.next('white');
    this.logo$.next('fish');
    
    this.color$.next('green');
    this.logo$.next('dog');

    this.color$.next('red');
    this.logo$.next('bird');

    this.color$.next('blue');

    /* 5. When the two persons(observables) has no more info, they said bye bye */
    this.color$.complete();
    this.logo$.complete();
  }
}