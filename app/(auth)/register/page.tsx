import RegisterForm from '@/components/Forms/RegisterForm/RegisterForm';

const Register = () => {
  return (
    <div className="flex flex-col items-center py-8">
      <h1 className="text-2xl">Inscription</h1>
      <RegisterForm />
    </div>
  );
};

export default Register;
