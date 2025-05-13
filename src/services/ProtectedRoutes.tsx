import { Navigate, Outlet } from 'react-router'

const ProtectedRoutes = () => {
  const loggedInuser = sessionStorage.getItem('loggedInuser')
  return loggedInuser ? <Outlet /> : <Navigate to='/login' />
}

export default ProtectedRoutes
