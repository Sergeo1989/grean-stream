import { Children } from 'react'
const Landing = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className='min-h-screen min-w-screen container mx-auto font-mono bg-gradient-to-r from-cyan-500 from-10% via-indigo-500 to-sky-500 to-100%'>
      {Children.map(children, (child) => child)}
    </section>
  )
}

export default Landing
