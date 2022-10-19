import Cookies from 'js-cookie';
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';

export { PrivateRoute };

function isLoggedIn() {
  // TODO: These should be in a separate component
  // TODO: Ideally, user should be determined solely based on token
  const uname = Cookies.get('username');
  const token = Cookies.get('auth');
  console.log('logged in function called');
  return !!(uname && token);
}

function isRoomActive() {
  return !!Cookies.get('room_id');
}

function PrivateRoute({ redirectPath = '/login', redirectReason, children }) {
  const isAllowed = redirectPath === '/match' ? isRoomActive() : isLoggedIn();
  console.log('isAllowed: ' + isAllowed);

  if (!isAllowed) {
    toast.error(redirectReason);
    return <Navigate to={redirectPath} replace/>;
  }

  return children ? children : <Outlet/>;
}