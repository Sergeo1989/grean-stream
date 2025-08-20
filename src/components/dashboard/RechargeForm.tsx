import React from 'react';
import FormField from '@/components/ui/FormField';
import LoadingButton from '@/components/ui/LoadingButton';
import { User } from '@/types/User';
import { PaymentMethod, PaymentMethodLabels } from '@/types/enums';

interface RechargeFormProps {
  user: User;
  rechargeForm: {
    meter: string;
    amount: string;
    payment_method: PaymentMethod;
    subscriberMsisdn: string;
  };
  onRechargeFormChange: (form: {
    meter: string;
    amount: string;
    payment_method: PaymentMethod;
    subscriberMsisdn: string;
  }) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading?: boolean;
}

const RechargeForm: React.FC<RechargeFormProps> = ({
  user,
  rechargeForm,
  onRechargeFormChange,
  onSubmit,
  isLoading = false,
}) => {
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

  const handleInputChange = (field: string, value: string | number) => {
    const updatedForm = {
      ...rechargeForm,
      [field]:
        field === 'payment_method'
          ? (value as PaymentMethod)
          : value.toString(),
    };
    onRechargeFormChange(updatedForm);
  };

  const meterOptions = getAvailableMeters().map((meter) => ({
    value: meter.number.toString(),
    label: `${meter.name} - N°${meter.number}`,
  }));

  const paymentMethodOptions = Object.entries(PaymentMethodLabels).map(
    ([value, label]) => ({
      value,
      label,
    })
  );

  const requiresPhone = [PaymentMethod.OM, PaymentMethod.MOMO].includes(
    rechargeForm.payment_method
  );


  return (
    <div className='bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200'>
      <h3 className='text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6'>
        Effectuer une recharge
      </h3>

      <form onSubmit={onSubmit} className='space-y-6'>
        {/* Ligne principale avec les 3 champs essentiels */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
          {/* Sélection du compteur */}
          <FormField
            id='meter'
            name='meter'
            type='select'
            label='Compteur à recharger'
            value={rechargeForm.meter}
            options={meterOptions}
            selectPlaceholder='Choisir un compteur'
            onChange={(value) => handleInputChange('meter', value)}
            required
            helperText={`${
              getAvailableMeters().length
            } compteur(s) disponible(s)`}
          />

          {/* Montant */}
          <FormField
            id='amount'
            name='amount'
            type='number'
            label='Montant (XAF)'
            value={rechargeForm.amount}
            placeholder='Entrez le montant'
            onChange={(value) => handleInputChange('amount', value)}
            required
            suffix='XAF'
            helperText='Montant minimum: 100 XAF'
          />

          {/* Méthode de paiement */}
          <FormField
            id='payment_method'
            name='payment_method'
            type='select'
            label='Méthode de paiement'
            value={rechargeForm.payment_method}
            options={paymentMethodOptions}
            onChange={(value) => handleInputChange('payment_method', value)}
            required
          />
        </div>

        {/* Champ conditionnel pour le numéro du payeur */}
        {requiresPhone && (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
            <FormField
              id='subscriberMsisdn'
              name='subscriberMsisdn'
              type='tel'
              label='Numéro du payeur'
              value={rechargeForm.subscriberMsisdn}
              placeholder='6XX XXX XXX'
              onChange={(value) => handleInputChange('subscriberMsisdn', value)}
              required
              prefix='📱'
              helperText='Numéro de téléphone du compte à débiter'
              className='lg:col-span-2'
            />
            {/* Colonne vide pour équilibrer la mise en page */}
            <div className='hidden lg:block'></div>
          </div>
        )}

        {/* Résumé de la recharge */}
        {rechargeForm.amount && rechargeForm.meter && (
          <div className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
            <h4 className='text-sm font-medium text-gray-900 mb-2'>
              Résumé de la recharge
            </h4>
            <div className='space-y-1 text-sm text-gray-600'>
              <p>
                <strong>Compteur:</strong>{' '}
                {meterOptions.find((m) => m.value === rechargeForm.meter)
                  ?.label || rechargeForm.meter}
              </p>
              <p>
                <strong>Montant:</strong> {rechargeForm.amount} XAF
              </p>
              <p>
                <strong>Méthode:</strong>{' '}
                {PaymentMethodLabels[rechargeForm.payment_method]}
              </p>
              {requiresPhone && rechargeForm.subscriberMsisdn && (
                <p>
                  <strong>Numéro payeur:</strong>{' '}
                  {rechargeForm.subscriberMsisdn}
                </p>
              )}
            </div>
          </div>
        )}

        <div className='flex justify-end pt-4'>
          <LoadingButton
            type='submit'
            className='px-6 py-2'
            isLoading={isLoading}
            loadingText='Traitement en cours...'
            disabled={
              !rechargeForm.meter ||
              !rechargeForm.amount ||
              (requiresPhone && !rechargeForm.subscriberMsisdn)
            }
          >
            Effectuer la recharge
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export default RechargeForm;
