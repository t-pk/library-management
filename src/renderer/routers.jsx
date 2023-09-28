import PrivateLayout from './layouts/private-layout';
import PublicLayout from './layouts/public-layout';

import LoginPage from './pages/login';
import DocumentSeachPage from './pages/document/search';
import DocumentCreatePage from './pages/document/create';
import DocumentRequestPage from './pages/document/request';
import ReaderSeachPage from './pages/reader/search';
import ReaderCreatePage from './pages/reader/create';
import AuthorSeachPage from './pages/author/search';
import AuthorCreatePage from './pages/author/create';
import PublisherSeachPage from './pages/publisher/search';
import PublisherCreatePage from './pages/publisher/create';

import BorrowSeachPage from './pages/borrow/search';
import BorrowCreatePage from './pages/borrow/create';
import ReturnSeachPage from './pages/return/search';
import ReturnCreatePage from './pages/return/create';

import RemindSeachPage from './pages/remind/search';
import RemindCreatePage from './pages/remind/create';
import PenaltySeachPage from './pages/penalty/search';
import PenaltyCreatePage from './pages/penalty/create';

import NotFoundPage from './pages/not_found';

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
    layout: PrivateLayout,
    main: ReaderSeachPage,
    isPrivate: true,
  },
  {
    path: '/reader/create',
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
