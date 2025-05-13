import { useNavigate } from 'react-router'

const Home = () => {
  const navigate = useNavigate()
  const loggedInuser = sessionStorage.getItem('loggedInuser')
  if (loggedInuser == null) {
    navigate('/login')
  }
  return <h1>Bonjour Home</h1>
}

export default Home
