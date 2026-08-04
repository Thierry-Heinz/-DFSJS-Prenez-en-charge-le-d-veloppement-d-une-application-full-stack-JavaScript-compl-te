import Button from '@/components/Buttons/NavButton/NavButton';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accueil',
};

const Home = async () => {
  return (
    <main
      id="main-content"
      className="min-h-screen flex flex-col items-center justify-center bg-background"
    >
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
          <Button
            text="Se connecter"
            url="/login"
            className="bg-transparent border-1 border-black text-black hover:text-primary/90 hover:border-primary/90"
          />
          <Button
            text="S'inscrire"
            url="/register"
            className="bg-transparent border-1 border-black text-black hover:text-primary/90 hover:border-primary/90"
          />
        </div>
      </div>
    </main>
  );
};

export default Home;
