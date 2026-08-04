import RegisterForm from '@/components/Forms/RegisterForm/RegisterForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inscription',
};

const Register = () => {
  return (
    <div className="flex flex-col items-center py-8">
      <h1 className="text-2xl">Inscription</h1>
      <RegisterForm />
    </div>
  );
};

export default Register;
