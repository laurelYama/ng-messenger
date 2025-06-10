# ng-messenger

![Angular](https://img.shields.io/badge/Angular-16%2B-red)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-%5E3.x-blue)
![MIT License](https://img.shields.io/badge/license-MIT-green)

**ng-messenger** est une application de messagerie instantanée développée avec Angular. Elle permet aux utilisateurs de s’inscrire, se connecter, gérer leurs contacts, discuter en temps réel et recevoir des notifications de nouveaux messages.

## 🚀 Fonctionnalités

* **Authentification** : Inscription, connexion, gestion du token JWT
* **Contacts** : Ajout, suppression, affichage, sélection
* **Messagerie** :

  * Envoi et réception de messages
  * Affichage des conversations
  * Indicateur de messages non lus
  * Rafraîchissement automatique des conversations
* **UI Moderne** : Responsive avec TailwindCSS et animations
* **Sécurité** : Token JWT, gestion des erreurs

## 📦 Prérequis

* Node.js (v18+)
* Angular CLI (v16+)
* Un backend RESTful (Spring Boot, Express...)

## ⚙️ Installation

```bash
git clone https://github.com/laurelYama/ng-messenger.git
cd ng-messenger
npm install
```

Modifie `environment.ts` :

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api' // Modifier selon ton backend
};
```

Lance le serveur Angular :

```bash
ng serve
```

> Accès à l'application sur `http://localhost:4200`

## 🧱 Structure du projet

```
src/
 ├── app/
 │    ├── auth/           # Authentification
 │    ├── chat/           # Composant de chat
 │    ├── contacts/       # Liste et gestion de contacts
 │    ├── conversation/   # Affichage des conversations
 │    ├── core/           # Services partagés
 │    └── models/         # Interfaces TypeScript
 ├── assets/
 └── environments/
```

## 🎨 Personnalisation

* **Thème** : Géré avec TailwindCSS
* **Services API** : Centralisés dans `core/services`
* **Sécurité** : Le token JWT est stocké dans `localStorage`

## 💡 Bonnes pratiques

* Composants standalone Angular
* Injection de dépendances
* Centralisation des erreurs
* UX fluide avec rafraîchissement automatique

## 🙌 Contribution

Les contributions sont bienvenues !

```bash
git checkout -b feature/ma-fonctionnalité
git commit -m "Ajout de ma fonctionnalité"
git push origin feature/ma-fonctionnalité
```

Puis ouvre une **Pull Request**.

## 📃 Licence

Ce projet est sous licence MIT.

## 📩 Contact

Pour toute question ou suggestion : **[ngwambilaj@gmail.com](mailto:ngwambilaj@gmail.com)**
