# MDD - Monde de Dév

Réseau social pour développeurs

## Description

MDD (Monde de Dév) est une plateforme permettant aux développeurs de s'abonner à des sujets de programmation, publier des articles et échanger via des commentaires.

## Getting Started

### Prerequisites

- Node.js 22+
- npm ou yarn
- PostgreSQL

### Installation

```bash
git clone <repository-url>
cd P5-DFSJS
npm install
```

### Base de données (Docker)

Lancer les instances PostgreSQL en local avec Docker Compose :

```bash
docker compose up -d
```

Cela démarre deux conteneurs distincts :

- `mdd-postgres-dev` (port 5432, base `mdd_db`) : développement
- `mdd-postgres-e2e` (port 5433, base `mdd_e2e_db`) : tests e2e (voir plus bas)

Pour arrêter / relancer les conteneurs :

```bash
docker compose stop
docker compose start
```

### Configuration

1. Copier le fichier d'environnement :
```bash
cp .env.example .env
```

2. Les variables par défaut dans `.env` correspondent au conteneur Docker ci-dessus :
```env
DATABASE_URL="postgresql://user:password@localhost:5432/mdd_db?schema=public"
AUTH_SECRET="your-secret-key-here-change-in-production"
AUTH_URL="http://localhost:3000"
```

3. Initialiser la base de données :
```bash
npx prisma generate
npx prisma db push
```

### Lancement

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

## Tests

Tests unitaires et d'intégration (Jest + React Testing Library) :

```bash
npm run test
npm run test:coverage
```

Tests end-to-end (Playwright), contre la base dédiée `mdd_e2e_db` :

```bash
docker compose up -d   # si ce n'est pas déjà fait
npm run test:e2e       # navigateur headless
npm run test:e2e:ui    # mode UI interactif pour le debug
```

Chaque run réinitialise entièrement `mdd_e2e_db` et réinsère les données de
référence (`e2e/global-setup.ts` + `e2e/seed.ts`) avant d'exécuter la suite,
ce qui ne touche jamais la base de développement `mdd_db`.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Langage**: TypeScript 5
- **UI**: shadcn/ui + Tailwind CSS 4
- **Base de données**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod

## Features

- Authentification utilisateur (inscription/connexion)
- Gestion de profil
- Abonnement à des thèmes
- Publication d'articles
- Commentaires sur articles
- Fil d'actualité personnalisé

## Project Structure

```
P5-DFSJS/
├── app/               # App Router (Next.js 16)
│   ├── layout.tsx
│   └── page.tsx
├── components/        # Composants UI (shadcn/ui)
│   └── ui/
├── lib/               # Utilitaires
│   └── utils.ts
├── prisma/            # Database schema
│   └── schema.prisma
├── public/            # Static files
└── package.json
```

## Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## License

MIT License
