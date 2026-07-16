import LoginForm from '@/components/Forms/LoginForm/LoginForm';

const Login = () => {
  return (
    <div className="flex flex-col justify-center items-center py-8">
      <h1 className="text-2xl">Se connecter</h1>
      <LoginForm />
    </div>
  );
};

export default Login;
