#!/usr/bin/env node

// Script de déploiement pour Green Stream - Version JavaScript/Node.js
// Usage: node scripts/deploy.js [platform]
// Platforms: netlify, vercel, apache, nginx, docker

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Se déplacer vers la racine du projet
const projectRoot = path.join(__dirname, '..');
process.chdir(projectRoot);

const PLATFORM = process.argv[2] || 'apache';
const BUILD_DIR = 'dist';
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

console.log(`🚀 Déploiement Green Stream - Platform: ${PLATFORM}`);
console.log(`📅 Timestamp: ${TIMESTAMP}`);

// Vérifications préalables
if (!fs.existsSync('package.json')) {
    console.error('❌ Erreur: package.json non trouvé. Exécutez depuis la racine du projet.');
    process.exit(1);
}

// Nettoyage et build
console.log('🧹 Nettoyage des dossiers de build précédents...');
if (fs.existsSync(BUILD_DIR)) {
    fs.rmSync(BUILD_DIR, { recursive: true, force: true });
}

console.log('🔨 Build de l\'application...');
try {
    execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
    console.error('❌ Erreur: Le build a échoué.');
    process.exit(1);
}

if (!fs.existsSync(BUILD_DIR)) {
    console.error('❌ Erreur: Le dossier de build n\'a pas été créé.');
    process.exit(1);
}

console.log('✅ Build réussi!');

// Vérification des fichiers de configuration
console.log('🔍 Vérification des fichiers de configuration...');

const configFiles = {
    netlify: path.join(BUILD_DIR, '_redirects'),
    apache: path.join(BUILD_DIR, '.htaccess'),
    vercel: 'vercel.json',
    docker: ['Dockerfile', 'nginx.conf'],
    nginx: 'nginx.conf'
};

switch (PLATFORM) {
    case 'netlify':
        if (!fs.existsSync(configFiles.netlify)) {
            console.error('❌ Erreur: Fichier _redirects manquant pour Netlify');
            process.exit(1);
        }
        console.log('✅ Configuration Netlify OK');
        break;
    case 'apache':
        if (!fs.existsSync(configFiles.apache)) {
            console.error('❌ Erreur: Fichier .htaccess manquant pour Apache');
            process.exit(1);
        }
        console.log('✅ Configuration Apache OK');
        break;
    case 'vercel':
        if (!fs.existsSync(configFiles.vercel)) {
            console.error('❌ Erreur: Fichier vercel.json manquant pour Vercel');
            process.exit(1);
        }
        console.log('✅ Configuration Vercel OK');
        break;
    case 'docker':
        const dockerFiles = configFiles.docker;
        for (const file of dockerFiles) {
            if (!fs.existsSync(file)) {
                console.error(`❌ Erreur: Fichier ${file} manquant pour Docker`);
                process.exit(1);
            }
        }
        console.log('✅ Configuration Docker OK');
        break;
    case 'nginx':
        if (!fs.existsSync(configFiles.nginx)) {
            console.error('❌ Erreur: nginx.conf manquant');
            process.exit(1);
        }
        console.log('✅ Configuration Nginx OK');
        break;
    default:
        console.log(`⚠️  Platform inconnue: ${PLATFORM}`);
        console.log('📝 Platforms supportées: netlify, vercel, apache, nginx, docker');
        break;
}

// Affichage des statistiques du build
function getDirectorySize(dirPath) {
    let totalSize = 0;
    function calculateSize(itemPath) {
        const stats = fs.statSync(itemPath);
        if (stats.isDirectory()) {
            fs.readdirSync(itemPath).forEach(item => {
                calculateSize(path.join(itemPath, item));
            });
        } else {
            totalSize += stats.size;
        }
    }
    calculateSize(dirPath);
    return totalSize;
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function countFiles(dirPath) {
    let fileCount = 0;
    function countInDirectory(itemPath) {
        const stats = fs.statSync(itemPath);
        if (stats.isDirectory()) {
            fs.readdirSync(itemPath).forEach(item => {
                countInDirectory(path.join(itemPath, item));
            });
        } else {
            fileCount++;
        }
    }
    countInDirectory(dirPath);
    return fileCount;
}

console.log('');
console.log('📊 Statistiques du build:');
console.log(`📁 Dossier: ${BUILD_DIR}`);
console.log(`📏 Taille totale: ${formatBytes(getDirectorySize(BUILD_DIR))}`);
console.log(`📄 Nombre de fichiers: ${countFiles(BUILD_DIR)}`);

console.log('');
console.log('📋 Fichiers principaux:');
const mainFiles = fs.readdirSync(BUILD_DIR).filter(file => 
    file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.css')
);
mainFiles.forEach(file => {
    const filePath = path.join(BUILD_DIR, file);
    const stats = fs.statSync(filePath);
    console.log(`   ${file} (${formatBytes(stats.size)})`);
});

console.log('');
console.log('🎉 Build prêt pour le déploiement!');
console.log('');

// Instructions spécifiques par plateforme
const instructions = {
    netlify: [
        '📝 Instructions Netlify:',
        '   1. Connectez-vous à Netlify',
        '   2. Glissez-déposez le dossier \'dist\' dans Netlify',
        '   3. Ou utilisez: netlify deploy --prod --dir=dist'
    ],
    vercel: [
        '📝 Instructions Vercel:',
        '   1. Utilisez: vercel --prod',
        '   2. Ou utilisez l\'interface web Vercel'
    ],
    apache: [
        '📝 Instructions Apache:',
        '   1. Uploadez le contenu de \'dist/\' sur votre serveur',
        '   2. Le fichier .htaccess sera automatiquement utilisé',
        '   3. Testez toutes les routes: /, /login, /register, /dashboard'
    ],
    docker: [
        '📝 Instructions Docker:',
        '   1. Build: docker build -t green-stream .',
        '   2. Run: docker run -p 80:80 green-stream',
        '   3. Test: http://localhost'
    ],
    nginx: [
        '📝 Instructions Nginx:',
        '   1. Copiez le contenu de \'dist/\' vers /var/www/html/',
        '   2. Configurez Nginx avec le fichier nginx.conf fourni',
        '   3. Rechargez: sudo nginx -t && sudo systemctl reload nginx'
    ]
};

if (instructions[PLATFORM]) {
    instructions[PLATFORM].forEach(line => console.log(line));
}

console.log('');
console.log('🧪 URLs à tester après déploiement:');
console.log('   • https://votre-domaine.com/');
console.log('   • https://votre-domaine.com/login');
console.log('   • https://votre-domaine.com/register');
console.log('   • https://votre-domaine.com/dashboard');
console.log('');
console.log('✨ Déploiement terminé!');