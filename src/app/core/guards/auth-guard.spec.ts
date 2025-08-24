import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
 import { AuthService } from '../services/auth';
import { AuthGuard } from './auth-guard';

// describe('AuthGuard', () => {
//   const executeGuard: CanActivateFn = (...guardParameters) =>
//       TestBed.runInInjectionContext(() => AuthGuard(...guardParameters));

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//   });

//   it('should be created', () => {
//     expect(executeGuard).toBeTruthy();
//   });
// });
describe('AuthGuard', () => {
   let guard: AuthGuard;
   let authService: jasmine.SpyObj<AuthService>;
   let router: jasmine.SpyObj<Router>;
   beforeEach(() => {
     const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
     const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
     TestBed.configureTestingModule({
       providers: [
         AuthGuard,
         { provide: AuthService, useValue: authSpy },
         { provide: Router, useValue: routerSpy }
       ]
     });
     guard = TestBed.inject(AuthGuard);
     authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
     router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
   });
   it('should be created', () => {
     expect(guard).toBeTruthy();
   });
   it('should allow activation when authenticated', () => {
     authService.isAuthenticated.and.returnValue(true);
     expect(guard.canActivate()).toBeTrue();
   });
   it('should not allow activation when not authenticated', () => {
     authService.isAuthenticated.and.returnValue(false);
     expect(guard.canActivate()).toBeFalse();
     expect(router.navigate).toHaveBeenCalledWith(['/login']);
   });
 });
