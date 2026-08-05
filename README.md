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
git clone [<repository-url>](https://github.com/Thierry-Heinz/-DFSJS-Prenez-en-charge-le-d-veloppement-d-une-application-full-stack-JavaScript-compl-te.git)
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
BETTER_AUTH_SECRET="your-secret-key-here-change-in-production"
BETTER_AUTH_URL="http://localhost:3000"
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

Les specs Playwright sont organisées en 4 projets Chromium : `setup` (login,
génère une session réutilisable), `no-auth` (pages publiques, guards),
`authenticated` (parcours connecté) et `mobile` (navigation responsive sur
viewport Pixel 5). La suite inclut aussi des tests d'accessibilité
(`@axe-core/playwright`) sur les pages publiques et authentifiées.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Langage**: TypeScript 5
- **UI**: shadcn/ui (Radix UI) + Tailwind CSS 4
- **Authentification**: better-auth (email/password, plugins `username` + `nextCookies`)
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
├── app/                        # App Router (Next.js 16)
│   ├── (app)/                  # Route group : shell authentifié
│   │   ├── dashboard/
│   │   ├── post/                # détail, création
│   │   ├── profile/
│   │   └── topics/
│   ├── (auth)/                  # Route group : login / register
│   └── api/auth/[...all]/       # Handler catch-all better-auth
├── features/                    # Logique métier, feature-sliced
│   └── <domaine>/                # auth, post, comment, subscription, topic, profile
│       ├── *.action.ts           # Server Actions ("use server")
│       ├── *.service.ts          # Règles métier (server-only)
│       ├── *.repository.ts       # Accès Prisma (server-only)
│       └── dto/*.schema.ts       # Schémas de validation Zod
├── components/                  # Composants UI (partagés + shadcn/ui)
│   └── ui/
├── lib/
│   ├── auth/                    # Config better-auth, HOF withAuth
│   ├── errors/                  # AppError, ValidationError, gestion centralisée
│   ├── prisma.ts                # Client Prisma (singleton)
│   └── utils.ts
├── types/                       # Types et interfaces partagés par domaine
├── e2e/                         # Tests Playwright (specs, seed, fixtures)
├── prisma/                      # Schéma et migrations
│   └── schema.prisma
├── docs/api/                    # Documentation générée (TypeDoc)
├── public/                      # Fichiers statiques
└── package.json
```

### Architecture

Chaque fonctionnalité suit le même pipeline : une **Server Action** valide
l'entrée (Zod) et vérifie la session (`withAuth`), délègue à un **Service**
qui porte les règles métier, qui lui-même appelle un **Repository** pour
l'accès aux données via Prisma. Les erreurs sont normalisées de bout en bout
par `lib/errors/withActionErrorHandling`. L'authentification repose sur
better-auth (email/password) avec adaptateur Prisma, exposée via l'unique
route `app/api/auth/[...all]/route.ts`.

## Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [better-auth Documentation](https://www.better-auth.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- Documentation technique générée (TSDoc → TypeDoc) :
  ```bash
  npm run docs
  ```
  Génère un site statique dans `docs/api/` à partir des commentaires TSDoc de
  `features/`, `lib/`, `types/` et `components/`.

## License

MIT License
