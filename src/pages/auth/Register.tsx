import AuthForm from '../../components/auth/AuthForm'
import FooterText from '../../components/auth/FooterText'
import HeaderTitle from '../../components/auth/HeaderTitle'
import RegisterForm from '../../components/auth/RegisterForm'

const Register = () => {
  return (
    <AuthForm>
      <HeaderTitle title='Créer un compte' />
      <RegisterForm />
      <FooterText text='Déja inscrit?' link='/login' linkText='Connexion' />
    </AuthForm>
  )
}

export default Register
