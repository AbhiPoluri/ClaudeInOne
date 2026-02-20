# Angular

## Overview
Angular is a full-featured TypeScript framework with dependency injection, RxJS reactivity, and a strong opinionated structure.

## Setup

```bash
npm install -g @angular/cli
ng new my-app --standalone --routing --style=css
cd my-app
ng serve
```

## Standalone Component

```typescript
// src/app/users/user-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { UserService } from './user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <ul>
      @for (user of users$ | async; track user.id) {
        <li>{{ user.name }}</li>
      }
    </ul>
  `
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  users$ = this.userService.getAll();

  ngOnInit() { this.users$.subscribe(); }
}
```

## Service with HttpClient

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface User { id: string; name: string; email: string; }

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private API = '/api/users';

  getAll(): Observable<User[]> { return this.http.get<User[]>(this.API); }
  getById(id: string): Observable<User> { return this.http.get<User>(`${this.API}/${id}`); }
  create(data: Omit<User, 'id'>): Observable<User> { return this.http.post<User>(this.API, data); }
  update(id: string, data: Partial<User>): Observable<User> { return this.http.patch<User>(`${this.API}/${id}`, data); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.API}/${id}`); }
}
```

## Reactive Forms

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="email" type="email" />
      @if (form.get('email')?.errors?.['required']) {
        <span>Email is required</span>
      }
      <button type="submit" [disabled]="form.invalid">Submit</button>
    </form>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  onSubmit() {
    if (this.form.valid) console.log(this.form.value);
  }
}
```

## Best Practices
- Use standalone components (Angular 17+) instead of NgModules
- Use `inject()` instead of constructor injection for cleaner code
- Use signals for local state, RxJS for async streams
- Lazy load routes: `loadComponent: () => import('./component')`

## Resources
- [Angular docs](https://angular.dev)
