import { useState } from 'react'
import { useNavigate } from 'react-router'

const RegisterForm = () => {
  const navigate = useNavigate()
  const [inputs, setInputs] = useState({
    username: '',
    firstname: '',
    lastname: '',
    password: '',
  })
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (
      inputs.username &&
      inputs.firstname &&
      inputs.lastname &&
      inputs.password
    ) {
      sessionStorage.setItem('user', JSON.stringify(inputs))
      navigate('/login')
    } else {
      alert('Veuillez remplir tous les champs')
    }
  }
  return (
    <form onSubmit={handleSubmit} className='form'>
      <div className='mt-2 sm:mx-auto sm:w-full sm:max-w-sm'>
        <div className='block w-full flex flex-col text-2xl text-left gap-1'>
          <span className='label text-xl'>Prénom</span>
          <input
            type='text'
            name='firstname'
            value={inputs.firstname}
            onChange={(e) =>
              setInputs({ ...inputs, firstname: e.target.value })
            }
            className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600'
          />
        </div>
        <div className='block w-full flex flex-col text-2xl text-left gap-1'>
          <span className='label text-xl'>Nom</span>
          <input
            type='text'
            name='lastname'
            value={inputs.lastname}
            onChange={(e) => setInputs({ ...inputs, lastname: e.target.value })}
            className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600'
          />
        </div>
        <div className='block w-full flex flex-col text-2xl text-left gap-1'>
          <span className='label text-xl'>Nom d'utilisateur</span>
          <input
            type='text'
            name='username'
            value={inputs.username}
            onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
            className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600'
          />
        </div>
        <div className='block w-full flex flex-col text-2xl text-left gap-1'>
          <span className='label text-xl'>Mot de passe</span>
          <input
            type='password'
            name='password'
            value={inputs.password}
            onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
            className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600'
          />
          <div className='flex gap-1 items-center'>
            <input type='checkbox' name='remember' />
            <span className='text-base'>Remember me</span>
          </div>
        </div>
        <div className='mt-2 block w-full'>
          <button
            type='submit'
            className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          >
            Sign in
          </button>
        </div>
      </div>
    </form>
  )
}

export default RegisterForm
