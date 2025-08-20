#!/bin/bash

# Script de déploiement pour Green Stream
# Usage: ./scripts/deploy.sh [platform]
# Platforms: netlify, vercel, apache, nginx, docker

set -e

PLATFORM=${1:-"apache"}
BUILD_DIR="dist"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo "🚀 Déploiement Green Stream - Platform: $PLATFORM"
echo "📅 Timestamp: $TIMESTAMP"

# Vérifications préalables
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé. Exécutez depuis la racine du projet."
    exit 1
fi

# Nettoyage et build
echo "🧹 Nettoyage des dossiers de build précédents..."
rm -rf $BUILD_DIR

echo "🔨 Build de l'application..."
npm run build

if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ Erreur: Le build a échoué."
    exit 1
fi

echo "✅ Build réussi!"

# Vérification des fichiers de configuration
echo "🔍 Vérification des fichiers de configuration..."

case $PLATFORM in
    "netlify")
        if [ ! -f "$BUILD_DIR/_redirects" ]; then
            echo "❌ Erreur: Fichier _redirects manquant pour Netlify"
            exit 1
        fi
        echo "✅ Configuration Netlify OK"
        ;;
    "apache")
        if [ ! -f "$BUILD_DIR/.htaccess" ]; then
            echo "❌ Erreur: Fichier .htaccess manquant pour Apache"
            exit 1
        fi
        echo "✅ Configuration Apache OK"
        ;;
    "vercel")
        if [ ! -f "vercel.json" ]; then
            echo "❌ Erreur: Fichier vercel.json manquant pour Vercel"
            exit 1
        fi
        echo "✅ Configuration Vercel OK"
        ;;
    "docker")
        if [ ! -f "Dockerfile" ]; then
            echo "❌ Erreur: Dockerfile manquant"
            exit 1
        fi
        if [ ! -f "nginx.conf" ]; then
            echo "❌ Erreur: nginx.conf manquant"
            exit 1
        fi
        echo "✅ Configuration Docker OK"
        ;;
    "nginx")
        if [ ! -f "nginx.conf" ]; then
            echo "❌ Erreur: nginx.conf manquant"
            exit 1
        fi
        echo "✅ Configuration Nginx OK"
        ;;
    *)
        echo "⚠️  Platform inconnue: $PLATFORM"
        echo "📝 Platforms supportées: netlify, vercel, apache, nginx, docker"
        ;;
esac

# Affichage des statistiques du build
echo ""
echo "📊 Statistiques du build:"
echo "📁 Dossier: $BUILD_DIR"
echo "📏 Taille totale: $(du -sh $BUILD_DIR | cut -f1)"
echo "📄 Nombre de fichiers: $(find $BUILD_DIR -type f | wc -l)"

echo ""
echo "📋 Fichiers principaux:"
ls -lh $BUILD_DIR/ | grep -E '\.(html|js|css)$' || true

echo ""
echo "🎉 Build prêt pour le déploiement!"
echo ""

# Instructions spécifiques par plateforme
case $PLATFORM in
    "netlify")
        echo "📝 Instructions Netlify:"
        echo "   1. Connectez-vous à Netlify"
        echo "   2. Glissez-déposez le dossier '$BUILD_DIR' dans Netlify"
        echo "   3. Ou utilisez: netlify deploy --prod --dir=$BUILD_DIR"
        ;;
    "vercel")
        echo "📝 Instructions Vercel:"
        echo "   1. Utilisez: vercel --prod"
        echo "   2. Ou utilisez l'interface web Vercel"
        ;;
    "apache")
        echo "📝 Instructions Apache:"
        echo "   1. Uploadez le contenu de '$BUILD_DIR/' sur votre serveur"
        echo "   2. Le fichier .htaccess sera automatiquement utilisé"
        echo "   3. Testez toutes les routes: /, /login, /register, /dashboard"
        ;;
    "docker")
        echo "📝 Instructions Docker:"
        echo "   1. Build: docker build -t green-stream ."
        echo "   2. Run: docker run -p 80:80 green-stream"
        echo "   3. Test: http://localhost"
        ;;
    "nginx")
        echo "📝 Instructions Nginx:"
        echo "   1. Copiez le contenu de '$BUILD_DIR/' vers /var/www/html/"
        echo "   2. Configurez Nginx avec le fichier nginx.conf fourni"
        echo "   3. Rechargez: sudo nginx -t && sudo systemctl reload nginx"
        ;;
esac

echo ""
echo "🧪 URLs à tester après déploiement:"
echo "   • https://votre-domaine.com/"
echo "   • https://votre-domaine.com/login"
echo "   • https://votre-domaine.com/register"
echo "   • https://votre-domaine.com/dashboard"
echo ""
echo "✨ Déploiement terminé!"