import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { VerificationCode } from './components/verification-code/verification-code';
import { SetPassword } from './components/set-password/set-password';

export const AuthRoute: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'forgot-password',
    component: ForgotPassword,
  },
  {
    path: 'verification-code',
    component: VerificationCode,
  },
  {
    path: 'set-password',
    component: SetPassword,
  },
];
