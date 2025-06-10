ng-messenger
ng-messenger est une application de messagerie instantanée développée avec Angular. Elle permet aux utilisateurs de s’inscrire, se connecter, gérer leurs contacts, discuter en temps réel et recevoir des notifications de nouveaux messages.

Fonctionnalités
Authentification : Inscription, connexion, gestion du token JWT.
Gestion des contacts : Ajout, affichage et sélection de contacts.
Messagerie :
Envoi et réception de messages.
Affichage des conversations.
Indicateur de messages non lus.
Rafraîchissement automatique des conversations.

UI Moderne : Interface responsive avec TailwindCSS et animations.
Sécurité : Accès protégé par token, gestion des erreurs.
Prérequis
Node.js (v18+ recommandé)
Angular CLI (v16+ recommandé)
Un backend compatible (API RESTful avec endpoints pour l’auth, les contacts et les messages)

1.Installation
Cloner le dépôt :
git clone https://github.com/laurelYama/ng-messenger.git
cd ng-messenger

2.Installer les dépendances :
npm install

3.Configurer l’environnement :

Modifier le fichier environment.ts pour pointer vers l’URL de votre API backend :
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api' // Adapter selon votre backend
};

4.Lancer l’application :
ng serve

L’application sera accessible sur http://localhost:4200.

Structure du projet

src/
 ├── app/
 │    ├── auth/           # Authentification (login, register)
 │    ├── chat/           # Composant de chat
 │    ├── contacts/       # Gestion des contacts
 │    ├── conversation/   # Affichage d'une conversation
 │    ├── core/           # Services partagés (auth, chat, contact)
 │    └── models/         # Modèles TypeScript
 ├── assets/
 └── environments/

 Personnalisation
Thème : L’UI utilise TailwindCSS, modifiable dans les fichiers CSS.
Services : Les appels API sont centralisés dans services.
Sécurité : Le token JWT est stocké dans le localStorage et envoyé dans les headers HTTP.
Bonnes pratiques
Utilisation de composants standalone Angular.
Injection de dépendances pour les services.
Rafraîchissement automatique des conversations.
Gestion centralisée des erreurs.

Licence
Ce projet est sous licence MIT.

Contact
Pour toute question, contactez ngwambilaj@gmail.com.
