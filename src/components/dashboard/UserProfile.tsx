import React from 'react';
import FormField from '@/components/ui/FormField';
import LoadingButton from '@/components/ui/LoadingButton';
import { User } from '@/types/User';

interface UserProfileProps {
  user: User;
  profileData: {
    name: string;
    phone: string;
    address: string;
    email: string;
  };
  onProfileDataChange: (data: { name: string; phone: string; address: string; email: string }) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({
  user,
  profileData,
  onProfileDataChange,
  onSubmit,
  isLoading = false
}) => {
  const handleInputChange = (field: string, value: string | number) => {
    onProfileDataChange({
      ...profileData,
      [field]: value.toString()
    });
  };

  // Fonction pour obtenir les compteurs disponibles
  const getAvailableMeters = () => {
    if (user?.meters && user.meters.length > 0) {
      return user.meters;
    }
    // Fallback vers l'ancien système avec un seul compteur
    if (user?.meter) {
      return [user.meter];
    }
    return [];
  };

  return (
    <div className='space-y-6'>
      {/* Informations utilisateur */}
      <div className='bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-200'>
        <div className='flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6'>
          <div className='flex-shrink-0'>
            <div className='w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold'>
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
          <div className='flex-1 text-center sm:text-left'>
            <h2 className='text-xl sm:text-2xl font-bold text-gray-900 mb-2'>
              {user?.name}
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm'>
              <div className='space-y-1'>
                <p className='text-gray-600 break-words'>
                  <strong>ID Compte:</strong> {user?.accountId}
                </p>
                <p className='text-gray-600 break-all'>
                  <strong>Email:</strong> {user?.email}
                </p>
                <p className='text-gray-600'>
                  <strong>Téléphone:</strong> {user?.phone}
                </p>
              </div>
              <div className='space-y-1'>
                <p className='text-gray-600 break-words'>
                  <strong>Adresse:</strong> {user?.address}
                </p>
                <div>
                  <strong className='text-gray-600'>Compteurs:</strong>
                  {getAvailableMeters().length > 0 ? (
                    <ul className='ml-2 space-y-1'>
                      {getAvailableMeters().map((meter) => (
                        <li
                          key={meter.id}
                          className='text-xs sm:text-sm text-gray-600'
                        >
                          {meter.name} - N°: {meter.number}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className='text-xs sm:text-sm text-gray-500 ml-2'>
                      Aucun compteur
                    </span>
                  )}
                </div>
                {user?.company && (
                  <p className='text-gray-600 break-words'>
                    <strong>Distributeur:</strong>{' '}
                    {user.company.company_name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire de modification du profil */}
      <div className='bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200'>
        <h3 className='text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6'>
          Modifier mon profil
        </h3>
        <form onSubmit={onSubmit} className='space-y-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <FormField
              id='name'
              name='name'
              type='text'
              label='Nom complet'
              value={profileData.name}
              onChange={(value) => handleInputChange('name', value)}
              required
              className='w-full'
            />

            <FormField
              id='phone'
              name='phone'
              type='tel'
              label='Téléphone'
              value={profileData.phone}
              onChange={(value) => handleInputChange('phone', value)}
              required
              className='w-full'
            />

            <FormField
              id='email'
              name='email'
              type='email'
              label='Email'
              value={profileData.email}
              onChange={(value) => handleInputChange('email', value)}
              required
              className='w-full'
            />

            <FormField
              id='address'
              name='address'
              type='text'
              label='Adresse'
              value={profileData.address}
              onChange={(value) => handleInputChange('address', value)}
              required
              className='w-full'
            />
          </div>
          
          <div className='flex justify-end pt-4'>
            <LoadingButton 
              type='submit'
              className='px-6 py-2'
              isLoading={isLoading}
              loadingText='Mise à jour...'
            >
              Mettre à jour le profil
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;