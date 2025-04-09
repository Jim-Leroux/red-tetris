
---

```markdown
# Red Tetris 🎮  
**Tetris Network with Red Pelicans Sauce**  

Un Tetris multijoueur en ligne développé en Full Stack JavaScript, utilisant React, Redux, et Node.js avec Socket.io pour les communications temps réel.  

---

## 📌 Fonctionnalités  
- **Multijoueur en ligne** : Affrontez d'autres joueurs dans une même partie.  
- **Mode solo** : Jouez en local contre vous-même.  
- **Spectres adverses** : Visualisez l'état des terrains adverses.  
- **Pièces synchronisées** : Tous les joueurs reçoivent les mêmes pièces dans le même ordre.  
- **Pénalités** : Complétez des lignes pour envoyer des lignes indestructibles à vos adversaires.  

---

## 🛠 Installation  

### Prérequis  
- Node.js (v18+)  
- npm ou yarn  

### Étapes  
1. **Cloner le dépôt** :  
   ```bash  
   git clone https://github.com/redpelicans/red_tetris_boilerplate  
   cd red-tetris  
   ```  

2. **Installer les dépendances** :  
   ```bash  
   npm install  # ou yarn install  
   ```  

3. **Configurer l'environnement** :  
   - Créer un fichier `.env` à la racine (voir `.env.example` pour les variables nécessaires).  

4. **Lancer le serveur** :  
   ```bash  
   npm run server  # Démarre le serveur Node.js  
   ```  

5. **Lancer le client** (dans un autre terminal) :  
   ```bash  
   npm run client  # Démarre l'application React  
   ```  

6. **Accéder au jeu** :  
   Ouvrez `http://localhost:3000` dans votre navigateur.  

---

## ✅ Liste des Étapes du Projet  

### 1. Préparation et Configuration Initiale  
- [ ] Cloner le boilerplate et configurer l'environnement.  
- [ ] Installer les dépendances.  
- [ ] Configurer `.env` et `.gitignore`.  

### 2. Développement du Serveur (Node.js)  
- [ ] Créer les classes `Player`, `Piece`, `Game`.  
- [ ] Gérer les connexions via URL (`/<room>/<player_name>`).  
- [ ] Implémenter Socket.io pour les événements de jeu.  
- [ ] Synchroniser les pièces et spectres entre joueurs.  

### 3. Développement du Client (React/Redux)  
- [ ] Configurer React et Redux.  
- [ ] Afficher le terrain (10x20) avec CSS Grid/Flexbox.  
- [ ] Gérer les mouvements (flèches, espace).  
- [ ] Afficher les spectres adverses.  

### 4. Communication Client-Serveur  
- [ ] Établir la communication via Socket.io.  
- [ ] Définir un protocole réseau pour les événements.  

### 5. Fonctionnalités Obligatoires  
- [ ] Mode multijoueur avec pénalités.  
- [ ] Mode solo.  
- [ ] Gestion de plusieurs parties simultanées.  

### 6. Tests et Couverture  
- [ ] Tests unitaires (70% lignes, 50% branches).  

### 7. Bonus (Optionnel)  
- [ ] Système de scores avec persistance.  
- [ ] Modes de jeu alternatifs (invisible, gravité).  

---

## 🚀 Technologies Utilisées  
- **Frontend** : React, Redux, Socket.io-client.  
- **Backend** : Node.js, Express, Socket.io.  
- **Styling** : CSS Grid/Flexbox (pas de `<table>`).  
- **Tests** : Jest, Istanbul (couverture de code).  

---

## ⚠️ Contraintes Techniques  
- ❌ Pas de jQuery, Canvas, ou SVG.  
- ❌ Pas de manipulation directe du DOM.  
- ✅ Code client fonctionnel (sans `this`, sauf pour les erreurs).  
- ✅ Code serveur orienté objet (prototypes).  

---

## 📦 Structure des Fichiers  
```  
red-tetris/  
├── client/          # Code frontend (React/Redux)  
├── server/          # Code backend (Node.js)  
├── tests/           # Tests unitaires  
├── .env             # Variables d'environnement  
└── README.md  
```  

---

```

# 📄 Red Tetris – API Socket.IO (Backend)

> Cette documentation décrit les **événements Socket.IO** disponibles côté frontend pour interagir avec le serveur.

---

## 🔌 Connexion

```js
const socket = io("http://<IP_DU_BACKEND>:3000");
```

- Si le frontend est sur la même machine que le backend (Docker en local) : `localhost:3000`
- Sinon, utiliser l’**IP locale ou publique** du backend

---

## 📥 Événements émis **par le client**

| Événement        | Payload                              | Description                           |
|------------------|---------------------------------------|---------------------------------------|
| `joinRoom`       | `{ username: string, room: string }` | Rejoindre une salle de jeu            |
| `startGame`      | `{ room: string }`                   | Démarrer la partie (côté leader)      |
| `moveLeft`       | `{ room: string }`                   | Déplacer la pièce vers la gauche      |
| `moveRight`      | `{ room: string }`                   | Déplacer la pièce vers la droite      |
| `rotate`         | `{ room: string }`                   | Faire pivoter la pièce                |
| `softDrop`       | `{ room: string }`                   | Faire descendre la pièce d’un cran    |
| `hardDrop`       | `{ room: string }`                   | Laisser tomber la pièce immédiatement |

---

## 📤 Événements reçus **par le client**

| Événement         | Payload                              | Description                             |
|-------------------|---------------------------------------|-----------------------------------------|
| `updatePlayers`   | `[ { username: string, socketId } ]` | Liste mise à jour des joueurs dans room |
| `gameStarted`     | _none_                               | Déclenchement du début de partie        |
| `gameOver`        | _none_                               | Fin de la partie pour la room           |
| `gameState`       | `GameState` (voir ci-dessous)        | Mise à jour régulière de l’état de jeu  |

---

## 🎮 Structure du `gameState`

```ts
interface GameState {
  grid: number[][]; // grille de 20x10 (0 = vide, 1 = rempli)
  currentPiece: {
    type: string;         // ex: 'T', 'O', etc.
    rotationIndex: number;
    shape: number[][];    // forme actuelle (0/1)
  };
  position: {
    x: number;
    y: number;
  };
}
```

---

## ✅ Exemple : se connecter et rejoindre une partie

```js
const socket = io("http://localhost:3000");

socket.emit("joinRoom", {
  username: "Alice",
  room: "room42"
});

socket.on("updatePlayers", (players) => {
  console.log("Players:", players);
});

socket.on("gameStarted", () => {
  console.log("Game started!");
});

socket.on("gameState", (state) => {
  console.log("Game state:", state);
});
```

---
