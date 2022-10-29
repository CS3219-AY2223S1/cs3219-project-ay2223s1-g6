import { Navigate, Outlet } from 'react-router-dom';

export { RedirectRoute };

function RedirectRoute({ shouldRedirect, redirectPath = '/match', children }) {
  console.log('shouldRedirect: ' + shouldRedirect);

  if (shouldRedirect) {
    return <Navigate to={redirectPath} replace/>;
  }

  return children ? children : <Outlet/>;
}
