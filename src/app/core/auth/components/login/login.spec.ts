import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '@core/auth/services/auth.service';
import { HTTP_INTERCEPTORS, HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Login } from './login';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginRequest, LoginResponse } from '@core/auth/models/user.model';
import { vi } from 'vitest';
import { fakeBackendInterceptor } from '@core/interceptors/fake-backend.interceptor';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call login API and return LoginResponse', () => {
    const mockResponse: LoginResponse = {
      token: 'fake-jwt',
      user: { email: 'test@example.com', name: 'Test User' },
    };
    const data: LoginRequest = {
      email: 'test@example.com',
      password: 'V7!xZr@9mQ#tLp2W',
    };

    service.login(data).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      email: 'test@example.com',
      password: 'V7!xZr@9mQ#tLp2W',
    });

    req.flush(mockResponse); // ✅ send fake response
  });
});

describe('Login Component', () => {
  let fixture: ComponentFixture<Login>;
  let component: Login;
  let authService: { login: ReturnType<typeof vi.fn> };
  let toastr: { success: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(() => {
    authService = { login: vi.fn() };
    toastr = { success: vi.fn(), error: vi.fn() };

    TestBed.configureTestingModule({
      imports: [Login], // ✅ use RouterTestingModule
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: ToastrService, useValue: toastr },
        { provide: ActivatedRoute, useValue: {} },
        { provide: HTTP_INTERCEPTORS, useValue: fakeBackendInterceptor, multi: true },
      ],
    });

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    // spy on router.navigate
    vi.spyOn(router, 'navigate');
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

  it.skip('should show success toast and navigate on successful login', async () => {
    component.form.setValue({ email: 'test@example.com', password: 'Password@123' });

    authService.login.mockReturnValue(
      of({ token: 'fake-token', user: { email: 'test@example.com', name: 'Test User' } }),
    );

    component.onSubmit();
    fixture.detectChanges();

    await fixture.whenStable();

    expect(toastr.success).toHaveBeenCalledWith('Login successful!');
    expect(router.navigate).toHaveBeenCalledWith(['/pages/home']);
  });

  it.skip('should show error toast on failed login', async () => {
    component.form.setValue({ email: 'test@example.com', password: 'WrongPass@123' });

    authService.login.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({ status: 401, error: { message: 'Invalid email or password!' } }),
      ),
    );

    component.onSubmit();
    fixture.detectChanges();

    await fixture.whenStable();

    expect(toastr.error).toHaveBeenCalledWith('Invalid email or password!');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should have invalid form when empty', () => {
    component.form.setValue({ email: '', password: '' });
    expect(component.form.invalid).toBe(true);
    expect(component.form.controls.email.errors?.required).toBe(true);
    expect(component.form.controls.password.errors?.required).toBe(true);
  });

  it('should validate email format', () => {
    component.form.setValue({ email: 'invalid', password: 'Password@123' });
    expect(component.form.controls.email.errors?.email).toBe(true);
  });

  it('should disable submit button when form is invalid', () => {
    component.form.setValue({ email: '', password: '' });
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBe(true);
  });

  it.skip('should call AuthService.login with form values', async () => {
    const loginData = { email: 'test@example.com', password: 'Password@123' };
    component.form.setValue(loginData);

    authService.login.mockReturnValue(
      of({ token: 'fake-token', user: { email: 'test@example.com', name: 'Test User' } }),
    );

    component.onSubmit();
    fixture.detectChanges();

    await fixture.whenStable();

    expect(authService.login).toHaveBeenCalledWith(loginData);
  });

  it('should show loading state when submitting', async () => {
    component.form.setValue({ email: 'test@example.com', password: 'Password@123' });

    authService.login.mockReturnValue(
      of({ token: 'fake-token', user: { email: 'test@example.com', name: 'Test User' } }),
    );

    component.loading.set(true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBe(true);

    component.loading.set(false);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(button.disabled).toBe(false);
  });

  it('should not submit if form is invalid', () => {
    component.form.setValue({ email: '', password: '' });
    component.onSubmit();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should show required error for empty email and password', () => {
    component.form.setValue({ email: '', password: '' });
    fixture.detectChanges();
    expect(component.form.controls.email.errors?.required).toBe(true);
    expect(component.form.controls.password.errors?.required).toBe(true);
  });

  it('should show email format error for invalid email', () => {
    component.form.setValue({ email: 'not-an-email', password: 'Password@123' });
    fixture.detectChanges();
    expect(component.form.controls.email.errors?.email).toBe(true);
  });

  it('should show minLength error for short password', () => {
    component.form.setValue({ email: 'test@example.com', password: 'short' });
    fixture.detectChanges();
    expect(component.form.controls.password.errors?.minlength).toBeTruthy();
  });

  it.skip('should trim email and password before submit and login successfully', async () => {
    const loginData = { email: ' test@example.com ', password: ' Password@123 ' };
    component.form.setValue(loginData);
    component.form.markAsDirty();

    component.onSubmit();
    fixture.detectChanges();

    await new Promise((r) => setTimeout(r, 600));

    expect(toastr.success).toHaveBeenCalledWith('Login successful!');
    expect(router.navigate).toHaveBeenCalledWith(['/pages/home']);
    expect(toastr.error).not.toHaveBeenCalled();
  });

  it.skip('should handle network/server error gracefully', async () => {
    component.form.setValue({ email: 'test@example.com', password: 'Password@123' });

    authService.login.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 500, error: { message: 'Server error' } })),
    );

    component.onSubmit();
    fixture.detectChanges();

    await fixture.whenStable();

    expect(toastr.error).toHaveBeenCalledWith('Server error');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should keep user on login page after failed login', async () => {
    component.form.setValue({ email: 'test@example.com', password: 'WrongPass@123' });

    authService.login.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({ status: 401, error: { message: 'Invalid email or password!' } }),
      ),
    );

    component.onSubmit();
    fixture.detectChanges();

    await fixture.whenStable();

    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should disable submit button while loading', async () => {
    component.form.setValue({ email: 'test@example.com', password: 'Password@123' });
    component.loading.set(true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBe(true);

    component.loading.set(false);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(button.disabled).toBe(false);
  });

  it.skip('should show error if backend returns unexpected error shape', async () => {
    component.form.setValue({ email: 'test@example.com', password: 'Password@123' });

    authService.login.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 400, error: 'Something went wrong' })),
    );

    component.onSubmit();
    fixture.detectChanges();

    await fixture.whenStable();

    expect(toastr.error).toHaveBeenCalledWith('Something went wrong');
  });

  it('should not call login if form is pristine', () => {
    expect(component.form.pristine).toBe(true);
    component.onSubmit();
    expect(authService.login).not.toHaveBeenCalled();
  });
});
