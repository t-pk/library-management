const NotFoundPage = () => (
  <div id="notfound" style={{ textAlign: 'center', padding: 0 }}>
    <div className="notfound-container">
      <div className="notfound-404">
        <h1>404</h1>
      </div>
      <h2>Oops! Page Not Be Found</h2>
      <p>Sorry but the page you are looking for does not exist, have been removed. name changed or is temporarily unavailable</p>
      <Link to="/">Back to homepage</Link>
    </div>
  </div>
);

export default NotFoundPage;
