import { Link } from 'react-router-dom'

export default function AuthActions() {
  return (
    <>
      <Link
        to='/register'
        className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 text-lg'
      >
        Sign up
      </Link>
      <Link
        to='/login'
        className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 text-lg'
      >
        Login
      </Link>
    </>
  )
}
