import Image from 'next/image';
import Link from 'next/link';

export const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-8">
        <div className="flex justify-center">
          <div className="text-primary-foreground text-4xl font-bold">
            <Image
              src="/logo_login.png"
              width={412}
              height={238}
              alt="Monde Dév Logo"
            />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-foreground">Monde de Dév</h1>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3  border-1 border-black text-black rounded-lg hover:text-primary/90 hover:border-primary/90 transition-colors"
          >
            Se connecter
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-6 py-3  border-1 border-black text-black rounded-lg hover:text-primary/90 hover:border-primary/90 transition-colors"
          >
            S'inscrire
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
