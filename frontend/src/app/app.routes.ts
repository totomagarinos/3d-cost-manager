import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth-guard';

export const appRoutes = {
  public: {
    root: 'public',
    login: 'login',
    register: 'register',
    notFound: 'not-found',
  },
  private: {
    root: '',
    calculator: 'calculator',
    materials: 'materials',
    sales: 'sales',
    settings: 'settings',
  },
};

export const routes: Routes = [
  { path: '', redirectTo: `${appRoutes.private.calculator}`, pathMatch: 'full' },

  {
    path: appRoutes.public.login,
    title: 'Iniciar sesión | 3D Manager',
    loadComponent: () => import('./auth/components/login/login').then((m) => m.Login),
  },
  {
    path: appRoutes.public.register,
    title: 'Crear cuenta | 3D Manager',
    loadComponent: () => import('./auth/components/register/register').then((m) => m.Register),
  },

  {
    path: appRoutes.private.root,
    canActivateChild: [authGuard],
    children: [
      {
        path: appRoutes.private.calculator,
        title: 'Calculadora | 3D Manager',
        loadComponent: () =>
          import('./calculator/components/calculator/calculator').then((m) => m.Calculator),
      },
      {
        path: appRoutes.private.materials,
        title: 'Materiales | 3D Manager',
        loadComponent: () =>
          import('./materials/components/material-list/material-list').then((m) => m.MaterialList),
      },
      {
        path: appRoutes.private.settings,
        title: 'Configuración | 3D Manager',
        loadComponent: () =>
          import('./settings/components/settings/settings').then((m) => m.Settings),
      },
      {
        path: appRoutes.private.sales,
        title: 'Ventas | 3D Manager',
        loadComponent: () =>
          import('./sales/components/sale-list/sale-list').then((m) => m.SaleList),
      },
    ],
  },

  {
    path: appRoutes.public.notFound,
    title: 'Página no encontrada | 3D Manager',
    loadComponent: () => import('./shared/components/not-found/not-found').then((m) => m.NotFound),
  },
  {
    path: '**',
    redirectTo: appRoutes.public.notFound,
  },
];
