# 📱 ContactBook — TP N°7 : Consommation d’une API avec React & Axios

Une application React moderne, réactive et élégante permettant d'afficher et de gérer un répertoire de contacts professionnels en consommant l'API REST [JSONPlaceholder](https://jsonplaceholder.typicode.com/users).

---

## 🎯 Objectifs pédagogiques atteints

- [x] Installer et utiliser **Axios** dans une application React.
- [x] Récupérer des données distantes depuis une API REST (`https://jsonplaceholder.typicode.com/users`).
- [x] Utiliser **`useEffect()`** pour exécuter la requête HTTP au montage initial du composant.
- [x] Utiliser **`useState()`** pour gérer l'état des données (`users`), l'état de chargement (`loading`) et les erreurs (`error`).
- [x] Parcourir et afficher dynamiquement une liste avec **`map()`**.
- [x] Structurer l'application en composants modulaires et réutilisables (`UserList`, `UserCard`, etc.).
- [x] Transmettre des données et des callbacks via les **`props`**.
- [x] Filtrer dynamiquement la liste via un champ de recherche réactif.
- [x] Afficher les compteurs et statistiques du répertoire.

---

## 🗂️ Structure du projet

```
ContactBook/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx                 # Point d'entrée React
    ├── App.jsx                  # Composant racine
    ├── styles/
    │   └── index.css            # Design System (Variables CSS, Dark Mode, Glassmorphism)
    └── components/
        ├── UserList.jsx         # Composant conteneur principal (Questions 3, 4, 5, 6, 7, 9, 10, 11, 12)
        ├── UserCard.jsx         # Carte individuelle de contact (Question 8 + props)
        ├── ContactModal.jsx     # [Bonus] Modal fiche détaillée du contact
        └── Header.jsx           # [Bonus] En-tête avec bascule Thème Clair / Sombre
```

---

## 🚀 Démarrage rapide

### 1. Prérequis
- [Node.js](https://nodejs.org/) (version 18+ recommandée)
- npm ou yarn

### 2. Installation des dépendances
```bash
npm install
```

### 3. Lancement du serveur de développement
```bash
npm run dev
```
Ouvrez ensuite l'URL indiquée dans votre terminal (généralement `http://localhost:5173`).

### 4. Build de production
```bash
npm run build
```

---

## 📝 Correspondance avec les questions du TP

| N° | Question du TP | Emplacement du code | Description de l'implémentation |
|---|---|---|---|
| **1** | Créer une application React | Racine du projet | Projet initialisé avec Vite + React 18 |
| **2** | Installer Axios (`npm install axios`) | `package.json` | Bibliothèque `axios` installée et configurée |
| **3** | Créer un composant `UserList.jsx` | `src/components/UserList.jsx` | Composant conteneur qui orchestre l'affichage |
| **4** | Déclarer `const [users, setUsers] = useState([])` | `UserList.jsx` | Initialisation de l'état `users` à un tableau vide |
| **5** | Utiliser `useEffect()` pour envoyer une requête GET au montage | `UserList.jsx` | `useEffect(() => { fetchUsers(); }, [])` |
| **6** | Utiliser Axios et stocker dans `users` via `response.data` | `UserList.jsx` | `const response = await axios.get(...)`<br>`setUsers(response.data)` |
| **7** | Utiliser `map()` pour afficher chaque utilisateur | `UserList.jsx` | `{filteredUsers.map(user => <UserCard key={user.id} user={user} />)}` |
| **8** | Créer `UserCard.jsx` et passer les données via `props` | `src/components/UserCard.jsx` | Affiche `name`, `email`, `phone`, `address.city`, `company.name` |
| **9** | Gérer l'état de chargement (« Chargement des contacts… ») | `UserList.jsx` | `const [loading, setLoading] = useState(true)` + message exact + skeleton cards |
| **10** | Gérer les erreurs de requête | `UserList.jsx` | `const [error, setError] = useState(null)` + bloc d'alerte et bouton « Réessayer » |
| **11** | Champ de recherche filtrant par nom | `UserList.jsx` | Input contrôlé filtrant `users` via `.toLowerCase().includes(...)` |
| **12** | Afficher le nombre total de contacts récupérés | `UserList.jsx` | Carte statistique affichant `users.length` |

---

## ✨ Fonctionnalités & Bonus modernes ajoutés

1. 🌓 **Dark Mode / Light Mode automatique & persistant** :
   - Bascule fluide entre thème clair et sombre enregistrée dans le `localStorage`.
2. ⭐ **Système de Favoris (Bookmarking)** :
   - Ajoutez des contacts en favoris d'un simple clic avec sauvegarde persistante.
   - Filtre rapide "Favoris uniquement" avec badge compteur.
3. 🔎 **Recherche et filtres avancés** :
   - Filtre déroulant par **Ville** (déduites dynamiquement depuis les données API).
   - Tri alphabétique (Nom A-Z, Nom Z-A, Entreprise A-Z).
   - Bouton de réinitialisation rapide des filtres.
4. 📋 **Copie rapide au presse-papier** :
   - Bouton avec notification Toast pour copier instantanément les coordonnées d'un contact.
5. 🗂️ **Fiche détaillée modale (ContactModal)** :
   - Affichage complet des données : nom d'utilisateur, adresse complète, coordonnées GPS avec lien direct vers Google Maps, slogan et tags de l'entreprise.
6. 📥 **Export des contacts en CSV** :
   - Téléchargement en un clic de la liste (ou des résultats filtrés) sous forme de fichier `.csv`.
7. 🧪 **Bouton de simulation d'erreur (Test Q10)** :
   - Un bouton dédié permet d'activer une URL invalide afin de tester immédiatement l'état d'erreur et le mécanisme de réessai sans couper sa connexion Internet !
8. 🎨 **Design System haut de gamme** :
   - Cartes avec effet Glassmorphism, bordures dégradées personnalisées par contact, avatars colorés avec initiales, et squelettes de chargement animés (*skeleton loading*).
