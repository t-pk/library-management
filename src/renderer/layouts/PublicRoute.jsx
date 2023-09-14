/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Route, Redirect, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const PublicRoute = ({
  element: Component,
}) =>
  <Component />

// PrivateRoute.propTypes = {
//   element: PropTypes.elementType.isRequired,
//   layout: PropTypes.elementType.isRequired,
//   exact: PropTypes.bool.isRequired,
//   path: PropTypes.string.isRequired,
// };

export default PublicRoute;
