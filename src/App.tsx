import './App.css';
import { Route, Routes } from 'react-router';
import Home from './pages/landing/Home.tsx';
import About from './pages/landing/About.tsx';
import Login from './pages/auth/Login.tsx';
import Register from './pages/auth/Register.tsx';
import ProtectedRoutes from './services/ProtectedRoutes.tsx';
import Dashboard from './pages/Dashboard.tsx';

function App() {
  return (
    <div>
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/login' element={<Login />} key='login' />
        <Route path='/register' element={<Register />} key='register' />
      </Routes>
    </div>
  );
}

export default App;
