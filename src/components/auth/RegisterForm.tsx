import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useRegister } from '@/hooks/useRegister';
import { registerSchema } from '@/lib/validators';
import { showError, showSuccess, showWarning } from '@/lib/alerts';

const RegisterForm = () => {
  const navigate = useNavigate();
  const register = useRegister();
  const [inputs, setInputs] = useState({
    email: '',
    firstName: '',
    lastName: '',
    code: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    meter_type: 1,
  });
  // Utilise SweetAlert2 pour les erreurs au lieu du state local
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    try {
      // Remove confirmPassword before validation with Zod schema
      const dataToValidate = {
        email: inputs.email,
        firstName: inputs.firstName,
        lastName: inputs.lastName,
        code: inputs.code,
        password: inputs.password,
        phone: inputs.phone,
        address: inputs.address,
        meter_type: inputs.meter_type,
      };

      // Additional password match validation
      if (inputs.password !== inputs.confirmPassword) {
        showWarning('Mots de passe différents', 'Les mots de passe ne correspondent pas');
        return false;
      }

      registerSchema.parse(dataToValidate);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        showError('Données invalides', firstError.message);
      } else if (error instanceof Error) {
        showError('Erreur de validation', error.message);
      }
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));

    // Plus besoin de clear errors avec SweetAlert2
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }

      // Prepare data for API - remove confirmPassword
      const registrationData = {
        email: inputs.email,
        firstName: inputs.firstName,
        lastName: inputs.lastName,
        code: inputs.code,
        password: inputs.password,
        phone: inputs.phone,
        address: inputs.address,
        meter_type: inputs.meter_type,
      };

      await register.mutateAsync(registrationData);
      showSuccess('Inscription réussie', 'Votre compte a été créé avec succès !');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : "Échec d'inscription. Veuillez réessayer.";
      showError('Erreur d\'inscription', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='form'>
      <div className='mt-2 sm:mx-auto sm:w-full sm:max-w-sm'>
        {/* Messages d'erreur gérés par SweetAlert2 */}

        <div className='block w-full flex flex-col text-2xl text-left gap-1 mb-4'>
          <label htmlFor='firstName' className='label text-xl'>
            Prénom
          </label>
          <input
            id='firstName'
            type='text'
            name='firstName'
            value={inputs.firstName}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600'
          />
          {/* Erreurs gérées par SweetAlert2 */}
        </div>

        <div className='block w-full flex flex-col text-2xl text-left gap-1 mb-4'>
          <label htmlFor='lastName' className='label text-xl'>
            Nom
          </label>
          <input
            id='lastName'
            type='text'
            name='lastName'
            value={inputs.lastName}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600'
          />
          {/* Erreurs gérées par SweetAlert2 */}
        </div>

        <div className='block w-full flex flex-col text-2xl text-left gap-1 mb-4'>
          <label htmlFor='email' className='label text-xl'>
            Email
          </label>
          <input
            id='email'
            type='email'
            name='email'
            value={inputs.email}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600'
          />
          {/* Erreurs gérées par SweetAlert2 */}
        </div>

        <div className='block w-full flex flex-col text-2xl text-left gap-1 mb-4'>
          <label htmlFor='code' className='label text-xl'>
            Code distributeur
          </label>
          <input
            id='code'
            type='text'
            name='code'
            value={inputs.code}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600'
          />
          {/* Erreurs gérées par SweetAlert2 */}
        </div>

        <div className='block w-full flex flex-col text-2xl text-left gap-1 mb-4'>
          <label htmlFor='password' className='label text-xl'>
            Mot de passe
          </label>
          <input
            id='password'
            type='password'
            name='password'
            value={inputs.password}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600'
          />
          {/* Erreurs gérées par SweetAlert2 */}
        </div>

        <div className='block w-full flex flex-col text-2xl text-left gap-1 mb-6'>
          <label htmlFor='confirmPassword' className='label text-xl'>
            Confirmer le mot de passe
          </label>
          <input
            id='confirmPassword'
            type='password'
            name='confirmPassword'
            value={inputs.confirmPassword}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600'
          />
          {/* Erreurs gérées par SweetAlert2 */}
        </div>

        <div className='mt-6'>
          <button
            type='submit'
            disabled={isSubmitting}
            className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400'
          >
            {isSubmitting ? 'Inscription en cours...' : "S'inscrire"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;
