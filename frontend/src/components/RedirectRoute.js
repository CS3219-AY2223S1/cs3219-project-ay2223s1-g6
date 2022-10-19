import Cookies from 'js-cookie';
import { Navigate, Outlet } from 'react-router-dom';

export { RedirectRoute };

function isLoggedIn() {
  // TODO: These should be in a separate component
  // TODO: Ideally, user should be determined solely based on token
  const uname = Cookies.get('username');
  const token = Cookies.get('auth');
  console.log('logged in function called');
  return !!(uname && token);
}

function RedirectRoute({ redirectPath = '/match', children }) {
  const isAllowed = isLoggedIn();
  console.log('isAllowed: ' + isAllowed);

  if (isAllowed) {
    return <Navigate to={redirectPath} replace/>;
  }

  return children ? children : <Outlet/>;
}