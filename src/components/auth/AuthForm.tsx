import { Children } from 'react'
import logo from '../../assets/images/logo.png'
const AuthForm = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className='min-h-screen flex justify-center items-center font-mono bg-gradient-to-r from-cyan-500 from-10% via-indigo-500 to-sky-500 to-100%'>
      <div className='flex shadow-2xl'>
        <div className='flex flex-col items-center justify-center text-center p-20 gap-8 bg-white rounded-2xl xl:rounded-tr-none xl:rounded-br-none'>
          {Children.map(children, (child) => child)}
        </div>
        <div className='m-auto object-cover w-[450px] xl:rounded-tr-2xl rounded-br-2xl xl:block hidden'>
          <img className='' src={logo} alt='Green Stream' />
        </div>
      </div>
    </section>
  )
}

export default AuthForm
