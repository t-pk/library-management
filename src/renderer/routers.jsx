import React from 'react';

import PrivateLayout from './layouts/PrivateLayout';
import PublicLayout from './layouts/PublicLayout';

const LoginPage = React.lazy(() => import('./pages/login'));
const DocumentSeachPage = React.lazy(() => import('./pages/document/search'));
const DocumentCreatePage = React.lazy(() => import('./pages/document/create'));
const DocumentRequestPage = React.lazy(() =>
  import('./pages/document/request')
);
const ReaderSeachPage = React.lazy(() => import('./pages/reader/search'));
const ReaderCreatePage = React.lazy(() => import('./pages/reader/create'));
const AuthorSeachPage = React.lazy(() => import('./pages/author/search'));
const AuthorCreatePage = React.lazy(() => import('./pages/author/create'));
const PublisherSeachPage = React.lazy(() => import('./pages/publisher/search'));
const PublisherCreatePage = React.lazy(() =>
  import('./pages/publisher/create')
);

const BorrowSeachPage = React.lazy(() => import('./pages/borrow/search'));
const BorrowCreatePage = React.lazy(() => import('./pages/borrow/create'));
const ReturnSeachPage = React.lazy(() => import('./pages/return/search'));
const ReturnCreatePage = React.lazy(() => import('./pages/return/create'));

const RemindSeachPage = React.lazy(() => import('./pages/remind/search'));
const RemindCreatePage = React.lazy(() => import('./pages/remind/create'));
const PenaltySeachPage = React.lazy(() => import('./pages/penalty/search'));
const PenaltyCreatePage = React.lazy(() => import('./pages/penalty/create'));

const NotFoundPage = React.lazy(() => import('./pages/not-found'));

const routes = [
  {
    path: '/',
    exact: true,
    layout: PrivateLayout,
    main: DocumentSeachPage,
    isPrivate: true,
  },
  {
    path: '/document/search',
    exact: true,
    layout: PrivateLayout,
    main: DocumentSeachPage,
    isPrivate: true,
  },
  {
    path: '/document/create',
    exact: true,
    layout: PrivateLayout,
    main: DocumentCreatePage,
    isPrivate: true,
  },
  {
    path: '/document/request',
    exact: true,
    layout: PrivateLayout,
    main: DocumentRequestPage,
    isPrivate: true,
  },
  {
    path: '/reader/search',
    exact: true,
    layout: PrivateLayout,
    main: ReaderSeachPage,
    isPrivate: true,
  },
  {
    path: '/reader/create',
    exact: true,
    layout: PrivateLayout,
    main: ReaderCreatePage,
    isPrivate: true,
  },
  {
    path: '/author/search',
    exact: true,
    layout: PrivateLayout,
    main: AuthorSeachPage,
    isPrivate: true,
  },
  {
    path: '/author/create',
    exact: true,
    layout: PrivateLayout,
    main: AuthorCreatePage,
    isPrivate: true,
  },
  {
    path: '/publisher/search',
    exact: true,
    layout: PrivateLayout,
    main: PublisherSeachPage,
    isPrivate: true,
  },
  {
    path: '/publisher/create',
    exact: true,
    layout: PrivateLayout,
    main: PublisherCreatePage,
    isPrivate: true,
  },
  {
    path: '/borrow/search',
    exact: true,
    layout: PrivateLayout,
    main: BorrowSeachPage,
    isPrivate: true,
  },
  {
    path: '/borrow/create',
    layout: PrivateLayout,
    main: BorrowCreatePage,
    isPrivate: true,
  },
  {
    path: '/return/search',
    exact: true,
    layout: PrivateLayout,
    main: ReturnSeachPage,
    isPrivate: true,
  },
  {
    path: '/return/create',
    layout: PrivateLayout,
    main: ReturnCreatePage,
    isPrivate: true,
  },
  {
    path: '/remind/search',
    exact: true,
    layout: PrivateLayout,
    main: RemindSeachPage,
    isPrivate: true,
  },
  {
    path: '/remind/create',
    layout: PrivateLayout,
    main: RemindCreatePage,
    isPrivate: true,
  },
  {
    path: '/penalty/search',
    exact: true,
    layout: PrivateLayout,
    main: PenaltySeachPage,
    isPrivate: true,
  },
  {
    path: '/penalty/create',
    layout: PrivateLayout,
    main: PenaltyCreatePage,
    isPrivate: true,
  },
  {
    path: '/login',
    exact: true,
    layout: PublicLayout,
    main: LoginPage,
  },
  {
    path: '*',
    layout: PublicLayout,
    main: NotFoundPage,
  },
];

export default routes;
