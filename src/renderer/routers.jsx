import React from 'react';

import PrivateRoute from './layouts/PrivateRoute';
import PublicRoute from './layouts/PublicRoute';

const LoginPage = React.lazy(() => import('./pages/login'));
const DocumentSeachPage = React.lazy(() => import('./pages/document/search'));
const DocumentCreatePage = React.lazy(() => import('./pages/document/create'));
const DocumentRequestPage = React.lazy(() => import('./pages/document/request'));
const ReaderSeachPage = React.lazy(() => import('./pages/reader/search'));
const ReaderCreatePage = React.lazy(() => import('./pages/reader/create'));
const ReaderRequestPage = React.lazy(() => import('./pages/reader/request'));
const NotFoundPage = React.lazy(() => import('./pages/not-found'));

const routes = [
  {
    path: '/',
    exact: true,
    layout: PrivateRoute,
    main: DocumentSeachPage,
    isPrivate: true,
  },
  {
    path: '/document/search',
    exact: true,
    layout: PrivateRoute,
    main: DocumentSeachPage,
    isPrivate: true,
  },
  {
    path: '/document/create',
    exact: true,
    layout: PrivateRoute,
    main: DocumentCreatePage,
    isPrivate: true,
  },
  {
    path: '/document/request',
    exact: true,
    layout: PrivateRoute,
    main: DocumentRequestPage,
    isPrivate: true,
  },
  {
    path: '/reader/search',
    exact: true,
    layout: PrivateRoute,
    main: ReaderSeachPage,
    isPrivate: true,
  },
  {
    path: '/reader/create',
    exact: true,
    layout: PrivateRoute,
    main: ReaderCreatePage,
    isPrivate: true,
  },
  {
    path: '/reader/request',
    exact: true,
    layout: PrivateRoute,
    main: ReaderRequestPage,
    isPrivate: true,
  },
  // {
  //   path: '/reader',
  //   exact: true,
  //   layout: PrivateRoute,
  //   main: AccountPage,
  //   isPrivate: true,
  // },
  {
    path: '/login',
    exact: true,
    layout: PublicRoute,
    main: LoginPage,
  },
  {
    path: '*',
    layout: PublicRoute,
    main: NotFoundPage,
  },
];

export default routes;
