# Green Stream - Application de Gestion d'Énergie

Application React moderne pour la gestion de recharges de compteurs électriques avec authentification et tableaux de bord.

## 🚀 Démarrage rapide

```bash
# Installation des dépendances
npm install

# Démarrage en développement
npm run dev

# Build pour la production
npm run build

# Aperçu de la version de production
npm run preview
```

## 🏗️ Architecture

- **Frontend**: React 19 + TypeScript
- **Routage**: React Router v7
- **UI**: Tailwind CSS v4 + Radix UI (shadcn/ui)
- **État**: TanStack Query + React Context
- **Build**: Vite avec code splitting optimisé
- **Tests**: Vitest + Cypress

## 📱 Fonctionnalités

- ✅ **Authentification complète** (Login/Register)
- ✅ **Dashboard responsive** avec statistiques
- ✅ **Recharge de compteurs** multi-méthodes de paiement
- ✅ **Historique paginé** des transactions
- ✅ **Gestion de profil** utilisateur
- ✅ **Validation robuste** des formulaires
- ✅ **Alertes utilisateur** avec SweetAlert2

## 🌐 Déploiement

### Problème de routage SPA

Les Single Page Applications nécessitent une configuration serveur spéciale pour que les URLs directes fonctionnent (ex: `/dashboard`).

### Solutions automatisées

```bash
# Déploiement Apache (hébergement partagé)
npm run deploy:apache

# Déploiement Netlify
npm run deploy:netlify

# Déploiement Vercel
npm run deploy:vercel

# Déploiement Docker
npm run deploy:docker
```

### Plateformes supportées

| Plateforme | Configuration | Statut |
|------------|---------------|--------|
| **Netlify** | `_redirects` | ✅ Auto |
| **Vercel** | `vercel.json` | ✅ Auto |
| **Apache** | `.htaccess` | ✅ Auto |
| **Nginx** | `nginx.conf` | ✅ Manuel |
| **Docker** | `Dockerfile` | ✅ Manuel |

## 🔧 Configuration

### Variables d'environnement

```bash
# API Base URL
VITE_API_BASE_URL=http://www.gs.montviewfarm.net/api/

# Environment
VITE_ENV=production
```

### Alias de chemins

```typescript
// Utilisation des alias @
import { Button } from '@/components/ui/button';
import { showSuccess } from '@/lib/alerts';
import { PaymentMethod } from '@/types/enums';
```

## 🎨 Composants

### Architecture modulaire

```
src/
├── components/
│   ├── ui/              # Composants UI génériques
│   ├── dashboard/       # Composants spécifiques au dashboard
│   └── auth/           # Composants d'authentification
├── hooks/              # Hooks personnalisés
├── lib/                # Utilitaires et API
├── types/              # Types TypeScript et enums
└── pages/              # Pages principales
```

### Composants principaux

- **FormField**: Composant de formulaire générique avec validation
- **StatCard**: Cartes de statistiques avec shadcn/ui
- **Pagination**: Pagination complète et accessible
- **Dashboard**: Composants modulaires (Header, Tabs, Profile, etc.)

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests avec couverture
npm run test:coverage

# Tests E2E interactifs
npm run cy:open

# Tests E2E en mode CI
npm run test:e2e
```

## 📦 Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run preview` | Aperçu du build |
| `npm run lint` | Vérification ESLint |
| `npm run deploy` | Déploiement Apache (JS, recommandé) |
| `npm run deploy:apache` | Déploiement Apache |
| `npm run deploy:netlify` | Déploiement Netlify |
| `npm run deploy:vercel` | Déploiement Vercel |
| `npm run deploy:docker` | Déploiement Docker |
| `npm run deploy:bash` | Scripts bash (si Node.js problème) |
| `npm run deploy:fix` | Corriger fins de ligne Windows |
| `npm run docker:build` | Build de l'image Docker |
| `npm run docker:run` | Lancement du conteneur |
| `npm run serve` | Build + Preview |

## 🐛 Dépannage

### Erreur 404 sur les routes

**Symptôme**: Accès direct à `/dashboard` retourne une erreur 404.

**Solution**: Vérifier la configuration serveur :

```bash
# Test local
npm run preview
# Testez http://localhost:4173/dashboard

# Vérification des fichiers de config
ls -la dist/  # Vérifiez .htaccess ou _redirects
```

### Cache Vite obsolète

**Symptôme**: Erreur "Outdated Optimize Dep"

**Solution**:
```bash
rm -rf node_modules/.vite
npm run dev
```

### Script de déploiement (Windows/WSL)

**Symptôme**: Erreurs `$'\r': command not found` ou `node: not found`

**Solutions**:
```bash
# Solution 1: Utiliser le script JavaScript (recommandé)
npm run deploy:apache

# Solution 2: Si vous préférez bash
npm run deploy:fix          # Corriger les fins de ligne
npm run deploy:bash:apache  # Utiliser bash
```

### Build qui échoue

**Solution**:
```bash
# Nettoyage complet
rm -rf node_modules dist
npm install
npm run build
```

## 📚 Documentation

- [Guide de déploiement complet](./DEPLOYMENT.md)
- [Configuration Vite](./vite.config.ts)
- [Types et enums](./src/types/)

## 🤝 Contribution

1. Fork du projet
2. Créer une branche feature
3. Commit des changements
4. Push vers la branche
5. Créer une Pull Request

## 📄 License

MIT License - voir le fichier LICENSE pour plus de détails.

## 🔗 Liens utiles

- [React Router v7](https://reactrouter.com/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query/)

---

**Green Stream** - Solution moderne de gestion d'énergie 🌱⚡