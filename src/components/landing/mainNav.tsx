import { Link } from 'react-router-dom'
import { MENUS as mainNavItems } from './menuNavDatas'

export default function MainNav() {
  return (
    <div className='mr-4 hidden gap-2 md:flex'>
      <nav>
        {mainNavItems.map((item, index) => (
          <Link
            to={item.href}
            key={index}
            className='px-6 py-2 rounded hover:text-blue-600 font-medium'
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}
