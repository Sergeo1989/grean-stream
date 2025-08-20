# Guide de Déploiement - Green Stream

Ce guide explique comment déployer l'application React Green Stream sur différentes plateformes en gérant correctement le routage côté client.

## Problème à résoudre

Les Single Page Applications (SPA) utilisent le routage côté client. Quand un utilisateur accède directement à une URL comme `/dashboard`, le serveur doit servir `index.html` au lieu de chercher un fichier `/dashboard`.

## Solutions par plateforme

### 1. 🌐 Netlify

**Fichier de configuration** : `public/_redirects` (déjà créé)

**Déploiement** :
```bash
# Build de l'application
npm run build

# Le dossier dist/ contient les fichiers à déployer
# Netlify détecte automatiquement le fichier _redirects
```

**URL de test** : Après déploiement, testez directement `/dashboard`

### 2. ▲ Vercel

**Fichier de configuration** : `vercel.json` (déjà créé)

**Déploiement** :
```bash
# Installation de Vercel CLI
npm i -g vercel

# Déploiement
vercel --prod
```

### 3. 🔶 AWS S3 + CloudFront

**Configuration** :
1. **S3** : Uploader le contenu de `dist/` 
2. **CloudFront** : Configurer les "Error Pages"
   - Error Code: `403` → Return Code: `200` → Error Caching TTL: `0` → Custom Error Response: `/index.html`
   - Error Code: `404` → Return Code: `200` → Error Caching TTL: `0` → Custom Error Response: `/index.html`

### 4. 🐳 Docker + Nginx

**Fichiers** : `Dockerfile` et `nginx.conf` (déjà créés)

**Déploiement** :
```bash
# Build de l'image Docker
docker build -t green-stream .

# Lancement du conteneur
docker run -p 80:80 green-stream
```

### 5. 🔴 Apache (Hébergement partagé)

**Fichier de configuration** : `public/.htaccess` (déjà créé)

**Déploiement** :
```bash
# Build de l'application
npm run build

# Uploader le contenu de dist/ sur le serveur
# Le fichier .htaccess sera automatiquement utilisé
```

### 6. 🟢 Nginx (Serveur dédié)

**Configuration** : Utiliser le fichier `nginx.conf` fourni

**Déploiement** :
```bash
# Build de l'application
npm run build

# Copier les fichiers
sudo cp -r dist/* /var/www/html/

# Configurer Nginx
sudo cp nginx.conf /etc/nginx/sites-available/green-stream
sudo ln -s /etc/nginx/sites-available/green-stream /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 7. 📱 GitHub Pages

**Configuration** : Ajouter au `package.json` :
```json
{
  "homepage": "https://username.github.io/repository-name"
}
```

**Déploiement** :
```bash
# Installation de gh-pages
npm install --save-dev gh-pages

# Ajouter au package.json scripts:
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Déploiement
npm run deploy
```

## 🧪 Tests de validation

Après déploiement, testez ces URLs directement :

- ✅ `https://votre-domaine.com/` (page d'accueil)
- ✅ `https://votre-domaine.com/login` (page de connexion)
- ✅ `https://votre-domaine.com/register` (page d'inscription)
- ✅ `https://votre-domaine.com/dashboard` (tableau de bord)

**Résultat attendu** : Toutes les URLs doivent charger correctement sans erreur 404.

## 🔧 Optimisations

### Mise en cache
- **Assets statiques** : Cache longue durée (1 an)
- **index.html** : Pas de cache pour permettre les mises à jour

### Sécurité
- Headers de sécurité configurés
- Protection XSS
- Content-Type protection

### Performance
- Compression gzip activée
- Code splitting (vendor, router, ui)
- Lazy loading des composants

## 🐛 Dépannage

### Erreur de script sur Windows/WSL
**Symptômes** : 
- `$'\r': command not found` (fins de ligne Windows)
- `node: not found` (Node.js non trouvé dans WSL)

**Solutions** :
```bash
# Solution 1: Script JavaScript (recommandé)
npm run deploy:apache

# Solution 2: Corriger bash
npm run deploy:fix           # Corriger fins de ligne
npm run deploy:bash:apache   # Utiliser bash

# Solution 3: Vérifier Node.js dans WSL
which node                   # Vérifier si Node.js est disponible
npm --version               # Vérifier npm
```

### Erreur 404 sur les routes
- ✅ Vérifier que le fichier de configuration est présent
- ✅ Vérifier que le serveur supporte la réécriture d'URL
- ✅ Tester avec l'URL racine d'abord

### Assets non chargés
- ✅ Vérifier le `base` dans `vite.config.ts`
- ✅ Vérifier les chemins relatifs/absolus
- ✅ Vérifier la configuration du cache

### Build qui échoue
- ✅ Exécuter `npm run build` localement
- ✅ Vérifier les variables d'environnement
- ✅ Vérifier la version de Node.js (>= 18)

## 📞 Support

En cas de problème, vérifiez :
1. Les logs du serveur web
2. La console du navigateur
3. Les outils de développement réseau
4. La configuration DNS/CDN