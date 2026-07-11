import RegisterForm from '@/components/Forms/RegisterForm/RegisterForm';

const Login = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-2xl">Inscription</h1>
      <RegisterForm />
    </div>
  );
};

export default Login;
