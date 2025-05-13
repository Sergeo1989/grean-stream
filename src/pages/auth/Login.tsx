import AuthForm from '../../components/auth/AuthForm'
import FooterText from '../../components/auth/FooterText'
import HeaderTitle from '../../components/auth/HeaderTitle'
import LoginForm from '../../components/auth/LoginForm'

const Login = () => {
  return (
    <AuthForm>
      <HeaderTitle title='Connexion' />
      <LoginForm />
      <FooterText
        text='Pas encore inscrit?'
        link='/register'
        linkText='Créer un compte'
      />
    </AuthForm>
  )
}

export default Login
