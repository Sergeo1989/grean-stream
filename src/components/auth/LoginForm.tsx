import { useAuth } from '@/auth/AuthProvider';
import { useLogin } from '@/hooks/useLogin';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { showError, showSuccess } from '@/lib/alerts';

const LoginForm = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const login = useLogin();
  const [inputs, setInputs] = useState({
    email: '', // Changé de username à email pour correspondre à l'API
    password: '',
  });
  // Supprime le state error car on utilise SweetAlert2
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Plus besoin de reset error avec SweetAlert2
    setIsLoading(true);

    try {
      // Validation basique côté client
      if (!inputs.email || !inputs.password) {
        showError('Champs requis', 'Veuillez remplir tous les champs');
        return;
      }

      // Appel à l'API via le hook useLogin
      const response = await login.mutateAsync(inputs);
      console.log(response);

      // Mise à jour du contexte d'authentification
      if (response.user) {
        setUser(response.user);
        showSuccess('Connexion réussie', `Bienvenue ${response.user.name} !`);
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        throw new Error('Réponse invalide du serveur');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Échec de connexion. Veuillez réessayer.';
      showError('Erreur de connexion', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className='form'>
      <div className='mt-2 sm:mx-auto sm:w-full sm:max-w-sm'>
        {/* Messages d'erreur gérés par SweetAlert2 */}

        <div className='block w-full flex flex-col text-2xl text-left gap-1'>
          <label htmlFor='email' className='label text-xl'>
            Email
          </label>
          <input
            id='email'
            type='email'
            name='email'
            value={inputs.email}
            onChange={handleInputChange}
            disabled={isLoading}
            required
            autoComplete='email'
            className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600'
          />
        </div>

        <div className='block w-full flex flex-col text-2xl text-left gap-1 mt-4'>
          <label htmlFor='password' className='label text-xl'>
            Mot de passe
          </label>
          <input
            id='password'
            type='password'
            name='password'
            value={inputs.password}
            onChange={handleInputChange}
            disabled={isLoading}
            required
            autoComplete='current-password'
            className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600'
          />
          <div className='flex gap-1 items-center mt-1'>
            <input type='checkbox' id='remember' />
            <label htmlFor='remember' className='text-base'>
              Se souvenir de moi
            </label>
          </div>
        </div>

        <div className='mt-6 block w-full'>
          <button
            type='submit'
            disabled={isLoading}
            className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70 disabled:cursor-not-allowed'
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
