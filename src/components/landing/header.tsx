import AuthActions from './AuthActions'
import Logo from './Logo'
import MainNav from './mainNav'
import MobileNav from './mobileNav'

const header = () => {
  return (
    <header className='flex h-20 w-full border-b border-gray-200 shrink-0 items-center px-4 md:px-6'>
      <div className='mr-4 hidden gap-2 md:flex'>
        <Logo />
      </div>
      <div className='mr-4 hidden gap-2 md:flex'>
        <MainNav />
      </div>
      <div className='mr-4 hidden gap-2 md:flex'>
        <AuthActions />
      </div>
      <MobileNav />
    </header>
  )
}

export default header
