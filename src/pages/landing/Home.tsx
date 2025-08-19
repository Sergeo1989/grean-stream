import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import Landing from '../layout/Landing'
import Header from '../../components/landing/header'
import Footer from '@/components/landing/Footer'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const loggedInuser = sessionStorage.getItem('loggedInuser')
  if (loggedInuser !== null) {
    navigate('/dashboard')
  }
  return (
    <Landing>
      <Header />
      {/* Hero Section */}
      <section className='text-center py-20 px-4 bg-gradient-to-b from-blue-50 to-white'>
        <h2 className='text-4xl font-bold text-gray-800 mb-4'>
          Suivez, Analysez et Maîtrisez votre Consommation Électrique
        </h2>
        <p className='max-w-2xl mx-auto text-lg text-gray-600 mb-6'>
          Green Stream vous aide à comprendre votre consommation d'énergie,
          identifier les pics, et économiser durablement. Idéal pour les foyers
          et entreprises responsables.
        </p>
        <div className='space-x-4'>
          <Link
            to='/register'
            className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 text-lg'
          >
            Commencer maintenant
          </Link>
          <Link to='/login' className='text-blue-600 hover:underline text-lg'>
            Déjà inscrit ?
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className='max-w-6xl mx-auto py-16 px-4 grid md:grid-cols-3 gap-8'>
        <div className='bg-white shadow rounded p-6'>
          <h3 className='text-xl font-semibold text-blue-600 mb-2'>
            Suivi en temps réel
          </h3>
          <p className='text-gray-600'>
            Surveillez votre consommation jour par jour, appareil par appareil.
          </p>
        </div>
        <div className='bg-white shadow rounded p-6'>
          <h3 className='text-xl font-semibold text-blue-600 mb-2'>
            Alertes intelligentes
          </h3>
          <p className='text-gray-600'>
            Recevez des alertes personnalisées en cas de surconsommation ou
            anomalies.
          </p>
        </div>
        <div className='bg-white shadow rounded p-6'>
          <h3 className='text-xl font-semibold text-blue-600 mb-2'>
            Rapports mensuels
          </h3>
          <p className='text-gray-600'>
            Accédez à des rapports détaillés pour mieux anticiper et économiser.
          </p>
        </div>
      </section>
      <Footer />
    </Landing>
  )
}

export default Home
