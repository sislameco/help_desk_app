import { layoutResolver } from '@core/layout/resolvers/layout.resolver';
import { PageLayout } from '@core/layout/enums/page-layout.enum';
import { Routes } from '@angular/router';
import { unAuthGuard } from '@core/auth/guards/un-auth-guard';
import { authGuard } from '@core/auth/guards/auth-guard';
import { authInitResolver } from '@core/auth/resolvers/auth-init.resolver';
import { Demos } from './demos/demos';

export const routes: Routes = [
  {
    path: '',
    resolve: { auth: authInitResolver }, // 👈 ensures store init first
    children: [
      { path: '', redirectTo: 'pages/home', pathMatch: 'full' },
      {
        path: 'auth',
        loadChildren: () => import('./core/auth/auth.route').then((m) => m.AuthRoute),
        resolve: {
          layout: layoutResolver(PageLayout.UnAuthorized),
        },
        canActivate: [unAuthGuard],
      },
      {
        path: 'pages',
        loadChildren: () => import('./features/pages.route').then((m) => m.PagesRoute),
        resolve: {
          layout: layoutResolver(PageLayout.Authorized),
        },
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: 'demo',
    component: Demos,
  },
];
