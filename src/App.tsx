import { useState } from 'react'

import './App.css'
import { Route, Routes } from 'react-router'
import Home from './pages/Home.tsx'
import About from './pages/About.tsx'
import Login from './pages/auth/Login.tsx'
import Register from './pages/auth/Register.tsx'
import ProtectedRoutes from './services/ProtectedRoutes.tsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path='/' element={<Home />} />
        </Route>
        <Route path='/about' element={<About />} />
        {/* <Route element={<AuthLayout />}>
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
        </Route> */}
        <Route path='/login' element={<Login />} key='login' />
        <Route path='/register' element={<Register />} key='register' />
      </Routes>
    </>
  )
}

export default App
