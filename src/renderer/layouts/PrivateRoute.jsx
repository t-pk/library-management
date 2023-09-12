/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Route, Redirect, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoute = ({
  element: Component,
  layout: Layout,
  exact,
  path,
}) => {
  return (
    <Route
      {...{ exact, path }}
      render={(props) => {
        return localStorage.getItem('TOKEN_KEY') ? (
          <Layout>
            <Component {...props} />
          </Layout>
        ) : (
          <Navigate
            to={'/login'}
          />
        );
      }}
    />
  );
};

PrivateRoute.propTypes = {
  element: PropTypes.elementType.isRequired,
  layout: PropTypes.elementType.isRequired,
  exact: PropTypes.bool.isRequired,
  path: PropTypes.string.isRequired,
};

export default PrivateRoute;
