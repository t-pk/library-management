import React from 'react';

import PrivateRoute from './layouts/PrivateRoute';
import PublicRoute from './layouts/PublicRoute';

const LoginPage = React.lazy(() => import('./pages/login'));
const DocumentSeachPage = React.lazy(() => import('./pages/document/search'));
const DocumentCreatePage = React.lazy(() => import('./pages/document/create'));
const DocumentRequestPage = React.lazy(() => import('./pages/document/request'));
const ReaderSeachPage = React.lazy(() => import('./pages/reader/search'));
const ReaderCreatePage = React.lazy(() => import('./pages/reader/create'));
const AuthorSeachPage = React.lazy(() => import('./pages/author/search'));
const AuthorCreatePage = React.lazy(() => import('./pages/author/create'));
const PublisherSeachPage = React.lazy(() => import('./pages/publisher/search'));
const PublisherCreatePage = React.lazy(() => import('./pages/publisher/create'));

const BorrowerSeachPage = React.lazy(() => import('./pages/borrower/search'));
const BorrowerCreatePage = React.lazy(() => import('./pages/borrower/create'));
const ReturnSeachPage = React.lazy(() => import('./pages/return/search'));
const ReturnCreatePage = React.lazy(() => import('./pages/return/create'));

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
    path: '/author/search',
    exact: true,
    layout: PrivateRoute,
    main: AuthorSeachPage,
    isPrivate: true,
  },
  {
    path: '/author/create',
    exact: true,
    layout: PrivateRoute,
    main: AuthorCreatePage,
    isPrivate: true,
  },
  {
    path: '/publisher/search',
    exact: true,
    layout: PrivateRoute,
    main: PublisherSeachPage,
    isPrivate: true,
  },
  {
    path: '/publisher/create',
    exact: true,
    layout: PrivateRoute,
    main: PublisherCreatePage,
    isPrivate: true,
  },
  {
    path: '/borrower/search',
    exact: true,
    layout: PrivateRoute,
    main: BorrowerSeachPage,
    isPrivate: true,
  },
  {
    path: '/borrower/create',
    layout: PrivateRoute,
    main: BorrowerCreatePage,
    isPrivate: true,
  },
  {
    path: '/return/search',
    exact: true,
    layout: PrivateRoute,
    main: ReturnSeachPage,
    isPrivate: true,
  },
  {
    path: '/return/create',
    layout: PrivateRoute,
    main: ReturnCreatePage,
    isPrivate: true,
  },
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
