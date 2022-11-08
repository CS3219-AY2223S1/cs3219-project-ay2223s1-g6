import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';

export { PrivateRoute };

function PrivateRoute({ isAllowed, redirectPath = '/login', redirectReason, children }) {
  console.log('isAllowed: ' + isAllowed);

  if (!isAllowed) {
    toast.error(redirectReason);
    return <Navigate to={redirectPath} replace/>;
  }

  return children ? children : <Outlet/>;
}
